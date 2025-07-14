import { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Check, X, TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ColorPicker } from "@/components/folder-page/color-picker";
import { TagSelector } from "@/components/folder-page/tag-selector";
import type { File, Tag } from "@/lib/supabase/supabase.types";
import {
  useApplyTagsToFileMutation,
  useGetTagsByFileQuery,
  useGetTagsQuery,
  useRemoveTagsFromFileMutation,
} from "@/redux/services/tagsApi";
import { toast } from "sonner";

interface TagManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files: File[];
  selectedFiles: string | null;
  onCreateTag: (name: string, color: string) => Promise<Tag>;
  onUpdateTag: (tagId: string, updates: Partial<Tag>) => void;
  onDeleteTag: (tagId: string) => void;
  onApplyTags: (
    fileIds: string[],
    tagsToAdd: Tag[],
    tagsToRemove: Tag[]
  ) => void;
}

export function TagManagementDialog({
  open,
  onOpenChange,
  files,
  selectedFiles,

  onCreateTag,
  onUpdateTag,
  onDeleteTag,
}: TagManagementDialogProps) {
  const [activeTab, setActiveTab] = useState("apply");
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3b82f6");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [selectedTagsToAdd, setSelectedTagsToAdd] = useState<Tag[]>([]);
  const [selectedTagsToRemove, setSelectedTagsToRemove] = useState<Tag[]>([]);
  // Get common tags across selected files
  const { data: availableTags } = useGetTagsQuery({});
  const targetFile = useMemo(() => {
    return files.find((f) => f.id === selectedFiles);
  }, [files, selectedFiles]);
  const { data: selectedTags } = useGetTagsByFileQuery(targetFile?.id || "");
  const selectedFileTags = useMemo(() => {
    return (
      availableTags?.filter((tag) =>
        selectedTags?.some((fileTag) => fileTag.tagId === tag.id)
      ) || []
    );
  }, [availableTags, selectedTags]);

  const availableTagsToAdd = useMemo(() => {
    return (
      availableTags?.filter(
        (tag) => !selectedTags?.some((fileTag) => fileTag.tagId === tag.id)
      ) || []
    );
  }, [availableTags, selectedTags]);
  const handleCreateNewTag = async () => {
    if (newTagName.trim()) {
      const newTag = await onCreateTag(newTagName.trim(), newTagColor);
      setNewTagName("");
      setNewTagColor("#3b82f6");
      return newTag;
    }
  };

  const handleUpdateTag = () => {
    if (editingTag) {
      onUpdateTag(editingTag.id, {
        name: editingTag.name,
        color: editingTag.color,
      });
      setEditingTag(null);
    }
  };
  const [applyTagsToFile] = useApplyTagsToFileMutation();
  const [removeAssignedTagsToFile] = useRemoveTagsFromFileMutation();
  const handleApplyTags = () => {
    if (selectedFiles === null || !targetFile) {
      toast.error("Please select a file to apply tags");
      return;
    }
    if (selectedTagsToAdd.length === 0 && selectedTagsToRemove.length === 0) {
      toast.error("No tags selected for changes");
      return;
    }
    if (selectedTagsToAdd.length) {
      applyTagsToFile({
        fileId: targetFile.id,
        tags: selectedTagsToAdd,
      });
    }
    if (selectedTagsToRemove.length) {
      removeAssignedTagsToFile({
        fileId: targetFile.id,
        tags: selectedTagsToRemove.map((tag) => tag.id),
      });
    }
    setSelectedTagsToAdd([]);
    setSelectedTagsToRemove([]);
    onOpenChange(false);
    toast.success("Tags applied successfully");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TagIcon className="h-5 w-5" />
            Tag Management
          </DialogTitle>
          <DialogDescription>
            Manage tags for your files and organize your content effectively.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="apply">Apply Tags</TabsTrigger>
            <TabsTrigger value="create">Create Tags</TabsTrigger>
            <TabsTrigger value="manage">Manage Tags</TabsTrigger>
          </TabsList>

          <TabsContent value="apply" className="space-y-4">
            {selectedFiles === null || !targetFile ? (
              <div className="text-center py-8 text-gray-500">
                <TagIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select files to apply tags</p>
                <p className="text-sm">
                  Choose one or more files from the folder to manage their tags.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Selected File</h4>
                  <div className="text-sm text-gray-600 max-h-20 overflow-y-auto">
                    <div
                      key={targetFile.id}
                      className="flex items-center gap-2 py-1"
                    >
                      <span>{targetFile.iconId}</span>
                      <span>{targetFile.title}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Assigned Tags</h4>
                  {selectedFileTags && selectedFileTags?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedFileTags?.map((tag) => (
                        <Badge
                          key={tag.id}
                          className={`border !bg-[${tag.color}+20] !text-[${tag.color}] !border-[${tag.color}]`}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No tags assign to selected file
                    </p>
                  )}
                </div>

                <Separator />

                <TagSelector
                  type="add"
                  availableTags={availableTagsToAdd}
                  selectedTags={selectedTagsToAdd}
                  onSelectionChange={setSelectedTagsToAdd}
                  title="Add Tags"
                  placeholder="Select tags to add..."
                />

                <TagSelector
                  type="remove"
                  availableTags={selectedFileTags}
                  selectedTags={selectedTagsToRemove}
                  onSelectionChange={setSelectedTagsToRemove}
                  title="Remove Tags"
                  placeholder="Select tags to remove..."
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedTagsToAdd([]);
                      setSelectedTagsToRemove([]);
                      onOpenChange(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApplyTags}
                    disabled={
                      selectedTagsToAdd.length === 0 &&
                      selectedTagsToRemove.length === 0
                    }
                  >
                    Apply Changes
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="tagName">Tag Name</Label>
                <Input
                  id="tagName"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Enter tag name..."
                  className="mt-1"
                />
              </div>

              <div className="">
                <p>Tag Color</p>
                <ColorPicker
                  color={newTagColor}
                  onChange={setNewTagColor}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Preview:</span>
                <Badge
                  style={{
                    backgroundColor: newTagColor + "20",
                    color: newTagColor,
                    borderColor: newTagColor,
                  }}
                  className="border"
                >
                  {newTagName || "Tag Name"}
                </Badge>
              </div>

              <Button
                onClick={handleCreateNewTag}
                disabled={!newTagName.trim()}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Tag
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {!availableTags || availableTags?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <TagIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No tags created yet</p>
                    <p className="text-sm">
                      Create your first tag to get started.
                    </p>
                  </div>
                ) : (
                  availableTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      {editingTag?.id === tag.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={editingTag.name}
                            onChange={(e) =>
                              setEditingTag({
                                ...editingTag,
                                name: e.target.value,
                              })
                            }
                            className="flex-1"
                          />
                          <ColorPicker
                            color={editingTag.color ?? "#3b82f6"}
                            onChange={(color) =>
                              setEditingTag({ ...editingTag, color })
                            }
                          />
                          <Button size="sm" onClick={handleUpdateTag}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingTag(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <Badge
                              className={`border !bg-[${tag.color}+20] !text-[${tag.color}] !border-[${tag.color}]`}
                            >
                              {tag.name}
                            </Badge>
                            {/* <span className="text-sm text-gray-500">
                              Used in {tagUsageCount(tag.id)} files
                            </span> */}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingTag(tag)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onDeleteTag(tag.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

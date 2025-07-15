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
  selectedFiles: string[];
  onCreateTag: (name: string, color: string) => Promise<Tag | null>;
  onUpdateTag: (tagId: string, updates: Partial<Tag>) => Promise<void>;
  onDeleteTag: (tagId: string) => Promise<void>;
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

  const { data: availableTags } = useGetTagsQuery({});
  const [applyTagsToFile] = useApplyTagsToFileMutation();
  const [removeAssignedTagsToFile] = useRemoveTagsFromFileMutation();

  // Get selected files data
  const targetFiles = useMemo(() => {
    return files.filter((f) => selectedFiles.includes(f.id));
  }, [files, selectedFiles]);

  // Get tags for all selected files
  const fileTagsQueries = useGetTagsByFileQuery(selectedFiles[0] || "", {
    skip: selectedFiles.length === 0,
  });

  // For multiple files, we need to handle common tags differently
  const commonTags = useMemo(() => {
    if (selectedFiles.length === 0 || !availableTags) return [];

    // For single file selection, return all tags for that file
    if (selectedFiles.length === 1) {
      const fileTags = fileTagsQueries.data || [];
      return availableTags.filter((tag) =>
        fileTags.some((fileTag) => fileTag.tagId === tag.id)
      );
    }

    // For multiple files, this would require more complex logic
    // For now, return empty array to avoid confusion
    return [];
  }, [availableTags, fileTagsQueries.data, selectedFiles.length]);

  const availableTagsToAdd = useMemo(() => {
    if (!availableTags) return [];

    if (selectedFiles.length === 1) {
      const fileTags = fileTagsQueries.data || [];
      return availableTags.filter(
        (tag) => !fileTags.some((fileTag) => fileTag.tagId === tag.id)
      );
    }

    // For multiple files, return all tags
    return availableTags;
  }, [availableTags, fileTagsQueries.data, selectedFiles.length]);

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

  const handleApplyTags = async () => {
    if (selectedFiles.length === 0 || targetFiles.length === 0) {
      toast.error("Please select files to apply tags");
      return;
    }

    if (selectedTagsToAdd.length === 0 && selectedTagsToRemove.length === 0) {
      toast.error("No tags selected for changes");
      return;
    }

    try {
      // Apply changes to all selected files
      for (const file of targetFiles) {
        if (selectedTagsToAdd.length > 0) {
          await applyTagsToFile({
            fileId: file.id,
            tags: selectedTagsToAdd,
            folderId: file.folderId,
          }).unwrap();
        }

        if (selectedTagsToRemove.length > 0) {
          await removeAssignedTagsToFile({
            fileId: file.id,
            tags: selectedTagsToRemove.map((tag) => tag.id),
          }).unwrap();
        }
      }

      setSelectedTagsToAdd([]);
      setSelectedTagsToRemove([]);
      onOpenChange(false);
      toast.success(
        `Tags applied to ${targetFiles.length} file(s) successfully`
      );
    } catch (error) {
      toast.error("Failed to apply tags to some files");
    }
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
            {selectedFiles.length === 0 || targetFiles.length === 0 ? (
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
                  <h4 className="font-medium mb-2">
                    Selected Files ({targetFiles.length})
                  </h4>
                  <div className="text-sm text-gray-600 max-h-20 overflow-y-auto">
                    {targetFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-2 py-1"
                      >
                        <span>{file.iconId}</span>
                        <span>{file.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {selectedFiles.length === 1 && (
                  <>
                    <div>
                      <h4 className="font-medium mb-2">Current Tags</h4>
                      {commonTags && commonTags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {commonTags.map((tag) => (
                            <Badge
                              key={tag.id}
                              style={{
                                backgroundColor: `${tag.color}20`,
                                color: tag.color ?? undefined,
                                borderColor: tag.color ?? undefined,
                              }}
                              className="border"
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No tags assigned to selected file
                        </p>
                      )}
                    </div>
                    <Separator />
                  </>
                )}

                {selectedFiles.length > 1 && (
                  <>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> You have selected{" "}
                        {selectedFiles.length} files. Tags will be applied to
                        all selected files.
                      </p>
                    </div>
                    <Separator />
                  </>
                )}

                <TagSelector
                  type="add"
                  availableTags={availableTagsToAdd}
                  selectedTags={selectedTagsToAdd}
                  onSelectionChange={setSelectedTagsToAdd}
                  title="Add Tags"
                  placeholder="Select tags to add..."
                />

                {selectedFiles.length === 1 && (
                  <TagSelector
                    type="remove"
                    availableTags={commonTags}
                    selectedTags={selectedTagsToRemove}
                    onSelectionChange={setSelectedTagsToRemove}
                    title="Remove Tags"
                    placeholder="Select tags to remove..."
                  />
                )}

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
                    Apply to {targetFiles.length} File(s)
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
                              style={{
                                backgroundColor: tag.color + "20",
                                color: tag.color ?? undefined,
                                borderColor: tag.color ?? undefined,
                              }}
                              className="border"
                            >
                              {tag.name}
                            </Badge>
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

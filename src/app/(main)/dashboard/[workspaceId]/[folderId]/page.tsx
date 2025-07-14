"use client";
import { FileItem } from "@/components/folder-page/fileItem";
import { TagManagementDialog } from "@/components/folder-page/tag-management-dialog";
import { Tag } from "@/lib/supabase/supabase.types";
import { useGetFilesQuery } from "@/redux/services/fileApi";
import { useCreateTagMutation } from "@/redux/services/tagsApi";
import { Tag as TagIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const FolderPage = () => {
  const { folderId }: { folderId: string } = useParams();
  const [showTagManagement, setShowTagManagement] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  // get the files of the folder and show them in the UI (optional add sorting and filtering according to created modified date and tags)
  // create new files in the folder
  const { data: files, isLoading } = useGetFilesQuery(folderId);
  const [createTag] = useCreateTagMutation();
  const viewMode = "list"; // or "grid", depending on your UI state
  // console.log("Files in folder:", data);
  const handleSelectFile = (fileId: string, selected: boolean) => {
    if (selected) {
      setSelectedFile(fileId);
    } else {
      setSelectedFile(null);
    }
  };
  const handleToggleStar = (fileId: string) => {
    // Logic to toggle star status of the file
  };
  const handleCreateTag = async (name: string, color: string): Promise<Tag> => {
    const { data } = await createTag({ name, color });
    if (!data) {
      toast("Failed to create tag");
      throw new Error("Failed to create tag");
    }
    return data;
  };
  const handleUpdateTag = (tagId: string, updates: Partial<Tag>) => {};
  const handleDeleteTag = (tagId: string) => {};
  const handleApplyTags = (
    fileIds: string[],
    tagsToAdd: Tag[],
    tagsToRemove: Tag[]
  ) => {};

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center overflow-hidden">
        Loading...
      </div>
    );
  }
  if (!files || files.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center overflow-hidden">
        No files found in this folder.
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col">
      <div>
        <div>
          <Button
            variant="outline"
            onClick={() => setShowTagManagement(true)}
            className="flex items-center gap-2"
          >
            <TagIcon className="h-4 w-4" />
            Manage Tags
          </Button>
        </div>
        {files.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            viewMode={viewMode}
            selected={selectedFile === file.id}
            onSelect={(selected) => handleSelectFile(file.id, selected)}
          />
        ))}
      </div>
      <TagManagementDialog
        open={showTagManagement}
        onOpenChange={setShowTagManagement}
        files={files}
        selectedFiles={selectedFile}
        onApplyTags={handleApplyTags}
        onCreateTag={handleCreateTag}
        onUpdateTag={handleUpdateTag}
        onDeleteTag={handleDeleteTag}
      />
    </div>
  );
};

export default FolderPage;

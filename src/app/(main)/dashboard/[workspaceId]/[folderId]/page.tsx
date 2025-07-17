"use client";
import { FileItem } from "@/components/folder-page/fileItem";
import { TagManagementDialog } from "@/components/folder-page/tag-management-dialog";
import { Tag } from "@/lib/supabase/supabase.types";
import {
  useCreateFileMutation,
  useGetFilesQuery,
} from "@/redux/services/fileApi";
import {
  useCreateTagMutation,
  useDeleteTagMutation,
  useUpdateTagMutation,
} from "@/redux/services/tagsApi";
import { FilePlus, Plus, Tag as TagIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileListHeader from "@/components/folder-page/fileitem-header";
import { useGetFolderDetailsQuery } from "@/redux/services/folderApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import EmojiPicker from "@/components/global/emojiPicker";
import { v4 } from "uuid";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setSelectedFolder,
  setSelectedFolderId,
} from "@/redux/features/selectedSlice";

const FolderPage = () => {
  const dispatch = useAppDispatch();
  const { selectedWorkspace } = useAppSelector(
    (state) => state.selectedEntities
  );
  const { folderId }: { folderId: string } = useParams();
  const { data: folder, isLoading: folderLoading } =
    useGetFolderDetailsQuery(folderId);
  const [showTagManagement, setShowTagManagement] = useState(false);
  const [isCreateNewFileDialogOpen, setCreateNewFileDialogOpen] =
    useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [newFileEmoji, setNewFileEmoji] = useState("📄");
  const { data: files, isLoading } = useGetFilesQuery(folderId);
  const [createTag] = useCreateTagMutation();
  const [updateTag] = useUpdateTagMutation();
  const [deleteTag] = useDeleteTagMutation();

  const viewMode = "list"; // or "grid", depending on your UI state

  // create new file
  const [createNewFile] = useCreateFileMutation();
  const [newFileTitle, setNewFileTitle] = useState<string | undefined>();
  const handleCreateNewFile = async () => {
    if (!newFileTitle || !folder) {
      return;
    }
    try {
      await createNewFile({
        folderId: folderId,
        data: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        inTrash: null,
        title: newFileTitle ?? "Untitled",
        iconId: newFileEmoji,
        id: v4(),
        workspaceId: folder?.workspaceId,
        bannerUrl: "",
      });
      setCreateNewFileDialogOpen(false);
      toast("New File created successfully");
    } catch (error) {
      toast("Failed to create new file");
    }
  };

  // Sort files based on current sort settings
  const sortedFiles = useMemo(() => {
    if (!files) return [];

    return [...files].sort((a, b) => {
      let aValue, bValue;

      switch (sortColumn) {
        case "name":
          aValue = a.title?.toLowerCase() || "";
          bValue = b.title?.toLowerCase() || "";
          break;
        case "date":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "size":
          aValue = 0; // You can add file size logic here if available
          bValue = 0;
          break;
        default:
          return 0;
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [files, sortColumn, sortDirection]);

  const handleSelectFile = (fileId: string, selected: boolean) => {
    setSelectedFiles((prev) => {
      if (selected) {
        return [...prev, fileId];
      } else {
        return prev.filter((id) => id !== fileId);
      }
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedFiles(sortedFiles.map((file) => file.id));
    } else {
      setSelectedFiles([]);
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleCreateTag = async (
    name: string,
    color: string
  ): Promise<Tag | null> => {
    try {
      const { data } = await createTag({ name, color });
      if (!data) {
        throw new Error("Failed to create tag");
      }
      return data;
    } catch (error) {
      toast("Failed to create tag");
      return null;
    }
  };

  const handleUpdateTag = async (
    tagId: string,
    updates: Partial<Tag>
  ): Promise<void> => {
    try {
      const { data } = await updateTag({ id: tagId, ...updates });
      if (!data) {
        toast("Failed to update tag");
      }
    } catch (error) {
      toast("Failed to update tag");
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    try {
      const { data } = await deleteTag(tagId);
      if (!data) {
        throw new Error("Failed to delete tag");
      }
    } catch (error) {
      toast("Failed to delete tag");
    }
  };
  useEffect(() => {
    dispatch(setSelectedFolderId(folderId));
    if (folder) {
      dispatch(setSelectedFolder(folder));
    }
  }, [folderId, folder, dispatch]);
  if (isLoading || folderLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center overflow-hidden">
        Loading...
      </div>
    );
  }

  if (!folder) {
    return (
      <div>
        <p>Not found</p>
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

  const allSelected =
    selectedFiles.length === sortedFiles.length && sortedFiles.length > 0;

  return (
    <div className="w-full h-full flex flex-col px-6">
      <Breadcrumb className="my-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/dashbaord/${
                selectedWorkspace?.title ?? folder.workspaceId
              }`}
            >
              {selectedWorkspace?.title ?? "Workspace"}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {folder.title} {folder.iconId}
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full h-full py-8">
        {/* actions */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl">
            {folder?.title || "Folder"} {folder.iconId}
          </h1>
          <div className="gap-2 flex items-center">
            <Button
              variant="default"
              onClick={() => setCreateNewFileDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New File
            </Button>
            <Button
              variant="btn-secondary"
              onClick={() => setShowTagManagement(true)}
              className="flex items-center gap-2"
            >
              <TagIcon className="h-4 w-4" />
              Manage Tags
            </Button>
          </div>
        </div>
        <div>
          <FileListHeader
            selectedCount={selectedFiles.length}
            totalCount={sortedFiles.length}
            onSelectAll={handleSelectAll}
            allSelected={allSelected}
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          />
          {sortedFiles.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              viewMode={viewMode}
              selected={selectedFiles.includes(file.id)}
              onSelect={(selected) => handleSelectFile(file.id, selected)}
            />
          ))}
        </div>
      </div>
      <TagManagementDialog
        open={showTagManagement}
        onOpenChange={setShowTagManagement}
        files={files}
        selectedFiles={selectedFiles}
        onCreateTag={handleCreateTag}
        onUpdateTag={handleUpdateTag}
        onDeleteTag={handleDeleteTag}
      />
      <Dialog
        open={isCreateNewFileDialogOpen}
        onOpenChange={setCreateNewFileDialogOpen}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FilePlus className="h-5 w-5" />
              Create New File for your folder
            </DialogTitle>
            <DialogDescription>
              File are collaborative between you and your workspace
              collaborators
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between">
            <Input
              className="w-10/12"
              onChange={(e) => {
                setNewFileTitle(e.target.value);
              }}
              placeholder="Enter File Name"
            />
            <EmojiPicker getValue={setNewFileEmoji}>
              <Button variant={"outline"} className="w-full">
                {newFileEmoji}
              </Button>
            </EmojiPicker>
          </div>
          <Button
            disabled={!newFileTitle}
            variant={"default"}
            onClick={handleCreateNewFile}
          >
            <Plus /> Create New File
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FolderPage;

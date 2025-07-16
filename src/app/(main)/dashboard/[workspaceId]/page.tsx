"use client";
import { Spinner } from "@/components/editor/ui/Spinner";
import { useAppSelector } from "@/redux/hooks";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import WorkspaceCover from "../../../../../public/default_workspace-bg.jpg";
import { FolderCard } from "@/components/workspace-page/folder-card";
import { Grid3X3, List, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import {
  useCreateFolderMutation,
  useDeleteFolderMutation,
  useGetFoldersQuery,
  useLazySearchQueryFoldersQuery,
  useSearchQueryFoldersQuery,
  useUpdateFolderMutation,
} from "@/redux/services/folderApi";
import { Folder } from "@/lib/supabase/supabase.types";
import { toast } from "sonner";
import CreateFolderDialog from "@/components/workspace-page/create-folder-dialog";
import FolderManagementDialog from "@/components/workspace-page/folder-management-dialog";
import { useGetCollaboratorOfWorkspaceQuery } from "@/redux/services/workspaceApi";
import { Skeleton } from "@/components/ui/skeleton";
import { CollaboratorsCard } from "@/components/workspace-page/collaborators-card";
import { Separator } from "@/components/ui/separator";
const WorkspacePage = () => {
  const { workspaceId }: { workspaceId: string } = useParams();
  const { selectedWorkspace } = useAppSelector(
    (state) => state.selectedEntities
  );

  const { data: folders } = useGetFoldersQuery(workspaceId);
  const [createNewFolder] = useCreateFolderMutation();
  const [updateFolder] = useUpdateFolderMutation();
  const [deleteFolder] = useDeleteFolderMutation();
  const [searchFolders] = useLazySearchQueryFoldersQuery();
  //viewMode
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  //search folders
  const [searchQuery, setSearchQuery] = useState<string>("");
  const handleSearchFolders = async () => {
    const { data, isLoading: isSearching } = await searchFolders({
      searchQuery,
      workspaceId,
    });
  };
  //create folder
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const handleCreateFolder = async (folder: Folder) => {
    try {
      const filecreate = await createNewFolder({
        ...folder,
        workspaceId,
      });
      if (filecreate?.error) {
        throw new Error("failed to create new folder");
      }
      toast("Successfully created the folder");
    } catch (error) {
      toast("Failed to create new folder");
    }
  };
  //update folder
  const handleUpdateFolder = async (updateFolderData: Partial<Folder>) => {
    try {
      if (!managingFolder) return;
      const update = await updateFolder({
        folderId: managingFolder?.id,
        updatedData: {
          ...updateFolderData,
          workspaceId,
        },
      });
      if (update?.error) {
        throw new Error("Failed to update folder");
      }
      toast("Successfully updated the folder");
    } catch (error) {
      toast("Failed to update folder");
    }
  };
  //delete folder
  const handleDeleteFolder = async () => {
    try {
      if (!managingFolder) return;
      const deleteReq = await deleteFolder(managingFolder.id);
      if (deleteReq?.error) {
        throw new Error("Failed to delete folder");
      }
      toast("Successfully deleted the folder");
    } catch (error) {
      toast("Failed to delete folder");
    }
  };
  //filter folders
  const filteredFolders = useMemo(() => {
    if (!folders) return [];
    if (searchQuery.length === 0) {
      return folders;
    }
    return folders.filter((folder) =>
      folder.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, folders]);

  //get collaborators
  const { data: collaborators, isLoading: loadingCollaborators } =
    useGetCollaboratorOfWorkspaceQuery({ workspaceId });

  //manage folder
  const [managingFolder, setManagingFolder] = useState<Folder | null>(null);
  if (!selectedWorkspace) return <Spinner />;
  return (
    <div className={"w-full h-full"}>
      <div className="h-[35vh] relative flex items-center justify-center">
        <h1 className="text-3xl lg:text-6xl md:text-4xl font-bold absolute z-10 !text-white/80">
          {selectedWorkspace.title}
        </h1>

        <Image
          alt="workspace-cover"
          fill
          className="w-full h-full"
          src={WorkspaceCover}
        />
      </div>
      <div className="p-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
          Welcome back!
        </h2>
        <Separator className="my-4" />
        <div className="flex justify-between gap-4">
          {/* Folders Section */}
          <div className="w-full">
            <div className="flex items-center justify-between  mb-6">
              <h3 className="text-xl font-semibold">Folders</h3>
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                  <Input
                    placeholder="Search folders..."
                    value={searchQuery}
                    type="search"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-1 border rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Create Folder */}
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Folder
                </Button>
              </div>
            </div>

            {/* Folders Grid/List */}
            {filteredFolders.length === 0 ? (
              <div className="text-center py-12 rounded-lg border">
                <Grid3X3 className="h-12 w-12 mx-auto mb-4" />
                <h4 className="text-lg font-medium mb-2">
                  {searchQuery ? "No folders found" : "No folders yet"}
                </h4>
                <p className="mb-4">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Create your first folder to get started"}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Folder
                  </Button>
                )}
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-2"
                }
              >
                {filteredFolders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    viewMode={viewMode}
                    onManage={() => setManagingFolder(folder)}
                  />
                ))}
              </div>
            )}
          </div>
          {/* collaborators of workspace */}
          <div className="">
            {loadingCollaborators || !collaborators ? (
              <Skeleton />
            ) : (
              <CollaboratorsCard collaborators={collaborators} />
            )}
          </div>
        </div>
      </div>
      {/* Dialogs */}
      <CreateFolderDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateFolder={handleCreateFolder}
      />

      {managingFolder && (
        <FolderManagementDialog
          folder={managingFolder}
          open={!!managingFolder}
          onOpenChange={(open: boolean) => !open && setManagingFolder(null)}
          onUpdateFolder={handleUpdateFolder}
          onDeleteFolder={handleDeleteFolder}
        />
      )}
    </div>
  );
};

export default WorkspacePage;

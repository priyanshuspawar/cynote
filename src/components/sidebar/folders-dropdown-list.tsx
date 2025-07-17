"use client";
import { Folder } from "@/lib/supabase/supabase.types";
import React, { useState } from "react";
import TooltipComponent from "../global/tooltip-component";
import { PlusIcon } from "lucide-react";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { v4 } from "uuid";
import { useToast } from "../ui/use-toast";
import { Accordion } from "../ui/accordion";
import DropDown from "./DropDown";
import { useAppSelector } from "@/redux/hooks";
import {
  useCreateFolderMutation,
  useGetFoldersQuery,
} from "@/redux/services/folderApi";

type FoldersDropDownListProps = {
  workspaceId: string;
};

const FoldersDropdownList = ({ workspaceId }: FoldersDropDownListProps) => {
  //   local state folders
  //   set real time updates
  const { folderId } = useAppSelector((state) => state.selectedEntities);
  const [createFolder, { error: createFolderError }] =
    useCreateFolderMutation();
  const { toast } = useToast();
  const { data: workspaceFolderData, error: FoldersError } =
    useGetFoldersQuery(workspaceId);
  const { subscription } = useSupabaseUser();
  // effect set initial state server app state
  // add folder
  const addFolderHandler = async () => {
    // if(folders.length >=3 && !subscription){

    // }
    const newFolder: Folder = {
      data: null,
      id: v4(),
      title: "Untitled",
      iconId: "📄",
      inTrash: null,
      workspaceId,
      bannerUrl: "",
      createdAt: new Date().toISOString(),
    };
    await createFolder(newFolder);
    if (createFolderError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error creating folder",
      });
    } else {
      toast({
        title: "success",
        description: "Folder created successfully",
      });
    }
  };

  if (FoldersError) {
    return <div></div>;
  }
  return (
    <>
      <div className="flex sticky z-20 top-0 bg-background w-full h-10 group/title justify-between items-center pr-4 text-Neutrals/neutrals-8">
        <span
          className="text-Neutrals/neutrals-8
            font-bold text-xs
            "
        >
          FOLDERS
        </span>
        <TooltipComponent message="Create Folder">
          <PlusIcon
            onClick={addFolderHandler}
            size={16}
            className="group-hover/title:inline-block
            hidden 
            cursor-pointer
            hover:dark:text-white
          "
          />
        </TooltipComponent>
      </div>
      <Accordion
        type="multiple"
        defaultValue={[folderId || ""]}
        className="pb-20"
      >
        {workspaceFolderData &&
          workspaceFolderData
            .filter((folder) => !folder.inTrash)
            .map((folder) => (
              <DropDown
                key={folder.id}
                title={folder.title}
                listType="folder"
                id={folder.id}
                iconId={folder.iconId}
              />
            ))}
      </Accordion>
    </>
  );
};

export default FoldersDropdownList;

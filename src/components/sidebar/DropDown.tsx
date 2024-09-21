"use client";
import { useRouter } from "next/navigation";
import React, { useMemo, useState, useCallback } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import clsx from "clsx";
import EmojiPicker from "../global/emojiPicker";
import TooltipComponent from "../global/tooltip-component";
import { PlusIcon, Trash } from "lucide-react";
import { useUpdateFolderMutation } from "@/redux/services/folderApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setSelectedFileId,
  setSelectedFolderId,
} from "@/redux/features/selectedSlice";
import {
  useGetFilesQuery,
  useUpdateFileMutation,
  useCreateFileMutation,
} from "@/redux/services/fileApi";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { File } from "@/lib/supabase/supabase.types";
import { v4 } from "uuid";
import debounce from "lodash/debounce"; // Import debounce
import { useToast } from "../ui/use-toast";

type Props = {
  title: string;
  id: string;
  listType: "folder" | "file";
  iconId: string;
  children?: React.ReactNode;
  disabled?: boolean;
  customIcon?: React.ReactNode;
};

const DropDown = ({ id, title, listType, iconId }: Props) => {
  const isFolder = listType === "folder";
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { user } = useSupabaseUser();
  const [createFile, { error: createFileError }] = useCreateFileMutation();
  const [updateFolder, { error: updateFolderError }] =
    useUpdateFolderMutation();
  const [updateFile, { error: updateFileError }] = useUpdateFileMutation();
  const { workspaceId, folderId } = useAppSelector(
    (state) => state.selectedEntities
  );

  // api get reqs
  const folderNFile = id.split("folder");
  const { data: filesData, error } = useGetFilesQuery(folderNFile[0]);
  // states
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  //double click edit the file
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  //handle blur on save
  const handleBlur = async () => {
    setIsEditing(false);
    const fid = id.split("folder");
    if (fid.length === 1) {
    }
  };

  //onclick
  const addNewFile = async () => {
    if (!workspaceId) return;
    const newFile: File = {
      folderId: id,
      data: null,
      createdAt: new Date().toISOString(),
      inTrash: null,
      title: "Untitled",
      iconId: "📄",
      id: v4(),
      workspaceId,
      bannerUrl: "",
    };
    await createFile(newFile);
    if (createFileError) {
      toast({ title: "File creation error", variant: "destructive" });
    }
  };

  //on changes
  const onChangeEmoji = async (selectedEmoji: string, id: string) => {
    if (!workspaceId) return;
    if (listType === "folder") {
      await updateFolder({
        folderId: id,
        updatedData: { workspaceId, iconId: selectedEmoji },
      });
    }
    if (listType === "file") {
      const pathId = id.split("folder");
      await updateFile({
        fileId: pathId[1],
        updatedData: { folderId: pathId[0], iconId: selectedEmoji },
      });
      if (updateFileError) {
        toast({
          title: "File emoji update error",
          variant: "destructive",
        });
      }
    }
  };

  // Debounce the folder title change
  const debouncedFolderTitleChange = useCallback(
    debounce(async (title: string) => {
      if (!workspaceId) return;
      const fid = id.split("folder");
      if (fid.length === 1) {
        await updateFolder({
          folderId: fid[0],
          updatedData: { workspaceId, title },
        });
      }
    }, 1000), // 500ms debounce time
    [workspaceId, id, updateFolder]
  );

  const debouncedFileTitleChange = useCallback(
    debounce(async (title: string) => {
      if (!workspaceId || !folderId) return;
      const fid = id.split("folder");
      if (fid.length === 2 && fid[1]) {
        await updateFile({
          fileId: fid[1],
          updatedData: { title, folderId: fid[0] },
        });
      }
    }, 1000),
    [workspaceId, folderId, id, updateFile]
  );

  const folderTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.target.value);
    debouncedFolderTitleChange(e.target.value); // Call debounced function
  };

  const fileTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.target.value);
    debouncedFileTitleChange(e.target.value); // Call debounced function
  };

  // move to trash
  const moveToTrash = async () => {
    if (!user?.email || !workspaceId) return;
    const pathId = id.split("folder");
    if (listType === "folder") {
      await updateFolder({
        folderId: pathId[0],
        updatedData: { inTrash: `Deleted by ${user.email}`, workspaceId },
      });
      if (updateFolderError) {
        toast({
          title: "Error moving folder to trash",
          variant: "destructive",
        });
      }
    }
    if (listType === "file") {
      await updateFile({
        fileId: pathId[1],
        updatedData: {
          inTrash: `Deleted by ${user.email}`,
          folderId: pathId[0],
        },
      });
      if (updateFileError) {
        toast({ title: "Error moving file to trash", variant: "destructive" });
      }
    }
  };

  //navigate the user to different page
  const navigatePage = (accordionId: string, type: string) => {
    if (type === "folder") {
      dispatch(setSelectedFolderId(accordionId));
      router.push(`/dashboard/${workspaceId}/${accordionId}`);
    }
    if (type === "file") {
      dispatch(setSelectedFileId(accordionId));
      router.push(`/dashboard/${workspaceId}/${folderId}/${accordionId}`);
    }
  };

  // styles
  const groupIdentifies = clsx(
    "dark:text-white whitespace-nowrap flex justify-between items-center w-full relative",
    {
      "group/folder": isFolder,
      "group/file": !isFolder,
    }
  );

  const listStyles = useMemo(
    () =>
      clsx("relative", {
        "border-none text-md": isFolder,
        "border-none ml-6 text-[16px] py-1": !isFolder,
      }),
    [isFolder]
  );
  const hoverStyles = useMemo(
    () =>
      clsx(
        "h-full hidden rounded-sm absolute right-0 items-center justify-center",
        {
          "group-hover/file:block": listType === "file",
          "group-hover/folder:block": listType === "folder",
        }
      ),
    [isFolder]
  );

  return (
    <AccordionItem
      value={id}
      className={listStyles}
      onClick={(e) => {
        e.stopPropagation();
        navigatePage(id, listType);
      }}
    >
      <AccordionTrigger
        id={listType}
        className="hover:no-underline p-2 dark:text-muted-foreground text-sm"
        disabled={listType === "file"}
      >
        <div className={groupIdentifies}>
          <div className="flex gap-4 items-center justify-center overflow-hidden">
            <div className="relative">
              <EmojiPicker
                getValue={(e) => {
                  onChangeEmoji(e, id);
                }}
              >
                {iconId}
              </EmojiPicker>
            </div>
            <input
              type="text"
              value={localTitle}
              readOnly={!isEditing}
              onBlur={handleBlur}
              onDoubleClick={handleDoubleClick}
              onChange={
                listType === "folder" ? folderTitleChange : fileTitleChange
              }
              className={clsx(
                "outline-none overflow-hidden w-[140px] text-Neutrals/neutrals-7",
                {
                  "bg-muted cursor-text": isEditing,
                  "bg-transparent cursor-pointer": !isEditing,
                }
              )}
            />
          </div>
          <div className={hoverStyles}>
            <TooltipComponent message="Delete Folder">
              <Trash
                onClick={moveToTrash}
                size={15}
                className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
              />
            </TooltipComponent>
            {listType === "folder" && !isEditing && (
              <TooltipComponent message="Add File">
                <PlusIcon
                  onClick={addNewFile}
                  size={15}
                  className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
                />
              </TooltipComponent>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {filesData &&
          filesData?.map((file) => {
            if (file.inTrash) {
              return;
            }
            const customField = `${id}folder${file.id}`;
            return (
              <DropDown
                key={file.id}
                title={file.title}
                listType="file"
                id={customField}
                iconId={file.iconId}
              />
            );
          })}
      </AccordionContent>
    </AccordionItem>
  );
};

export default DropDown;

"use client";
import { useAppState } from "@/lib/providers/state-provider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import React, { use, useMemo, useState } from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import clsx from "clsx";
import EmojiPicker from "../global/emojiPicker";
import { createFile, updateFile, updateFolder } from "@/lib/supabase/queries";
import { useToast } from "../ui/use-toast";
import TooltipComponent from "../global/tooltip-component";
import { PlusIcon, Trash } from "lucide-react";
import { v4 } from "uuid";
import { File } from "@/lib/supabase/supabase.types";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
interface DropDownProps {
  title: string;
  id: string;
  listType: "folder" | "file";
  iconId: string;
  children?: React.ReactNode;
  disabled?: boolean;
  customIcon?: React.ReactNode;
}
const DropDown = ({
  title,
  id,
  listType,
  iconId,
  children,
  disabled,
  customIcon,
}: DropDownProps) => {
  console.log('id@',id)
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const {user} = useSupabaseUser()
  const { state, dispatch, workspaceId, folderId } = useAppState();
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // folder title synched with server data and local data
  const folderTitle: string | undefined = useMemo(() => {
    if (listType === "folder") {
      const stateTitle = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === id)?.title;
      if (title === stateTitle || !stateTitle) return title;
      return stateTitle;
    }
  }, [state, listType, workspaceId, id, title]);

  // file title
  const fileTitle: string | undefined = useMemo(() => {
    if (listType === "file") {
      const fileAndFolderId = id.split("folder");
      const stateTitle = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === fileAndFolderId[1])?.title;
      if (title === stateTitle || !stateTitle) return title;
      return stateTitle;
    }
  }, [state, listType, workspaceId, id, title]);
  // navigate the user to different page
  const navigatePage = (accordionId: string, type: string) => {
    if (type === "folder") {
      router.push(`/dashboard/${workspaceId}/${accordionId}`);
    }
    if (type === "file") {
      router.push(`/dashboard/${workspaceId}/${folderId}/${accordionId}`);
    }
  };
  // add a file
  const addNewFile = async()=>{
    if(!workspaceId)return;
    const newFile:File = {
      folderId:id,
      data:null,
      createdAt:new Date().toISOString(),
      inTrash:null,
      title:"Untitled",
      iconId:"📄",
      id:v4(),
      workspaceId,
      bannerUrl: "",
    }
    dispatch({
      type:'ADD_FILE',
      payload:{
        file:newFile,folderId:id,workspaceId
      }
    })
    const { data, error } = await createFile(newFile)
    if(error){
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Couldn not create a new file',
      });
    }
    else{
      toast({
        title: 'Success',
        description: 'Successfully created a new file',
      });
    }
  }
  // double click edit the file
  const handleDoubleClick = () => {
    setIsEditing(true);
  };
  // blur on save
  const handleBlur = async () => {
    setIsEditing(false);
    const fid = id.split("folder");
    if (fid.length === 1) {
      if (!folderTitle) return;
      const {error:FolderTitleChangeError} = await updateFolder(
        {
          title,
        },
        fid[0]
      );
      if(FolderTitleChangeError){
        toast({
          variant: "destructive",
          title: "Error",
          description: "Couldn't update the folder title",
        });
      }
    }
    if (fid.length === 2 && fid[1]) {
      if (!fileTitle) return;
      const {error:FileTitleChangeError} = await updateFile({
        title:fileTitle,
      },fid[1])
      if(FileTitleChangeError){
        toast({
          variant: "destructive",
          title: "Error",
          description: "Couldn't update the file title",
        });
      }
    }
  };
  // onchanges
  const onChangeEmoji = async (selectedEmoji: string) => {
    if (!workspaceId) return;
    if (listType === "folder") {
      dispatch({
        type: "UPDATE_FOLDER",
        payload: {
          workspaceId,
          folderId: id,
          folder: { iconId: selectedEmoji },
        },
      });
      const { data, error } = await updateFolder(
        {
          iconId: selectedEmoji,
        },
        id
      );
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Couldn't update the emoji for this folder",
        });
      } else {
        toast({
          title: "Success",
          description: "Successfully updated the emoji for this folder",
        });
      }
    }
  };
  const folderTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId) return;
    const fid = id.split("folder");
    if (fid.length === 1) {
      dispatch({
        type: "UPDATE_FOLDER",
        payload: {
          folder: { title:e.target.value },
          folderId: fid[0],
          workspaceId,
        },
      });
    }
  };
  const fileTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId || !folderId) return;
    const fid = id.split("folder");
    if (fid.length === 2 && fid[1]) {
      dispatch({type:'UPDATE_FILE',payload:{
        file:{title:e.target.value},
        folderId:folderId,
        fileId:fid[1],
        workspaceId}})
    }
  };

  // move to trash
  const moveToTrash = async ()=>{
    if(!user?.email || !workspaceId)return;
    const pathId = id.split('folder');
    if(listType === 'folder'){
      dispatch({
        type:'UPDATE_FOLDER',
        payload:{
          folder:{inTrash:`Deleted by ${user.email}`},
          folderId:pathId[0],
          workspaceId
        }
      })
      const {data,error} = await updateFolder(
        {inTrash:`Deleted by ${user.email}`},
        pathId[0]
      );
      if(error){
        toast({
          variant: "destructive",
          title: "Error",
          description: "Couldn't move the folder to trash",
        });
      }
      else{
        toast({
          title: "Success",
          description: "Successfully moved the folder to trash",
        });
      }
    }
    if(listType === 'file'){
      dispatch({
        type:"UPDATE_FILE",
        payload:{
          file:{inTrash:`Deleted by ${user.email}`},
          folderId:pathId[0],
          workspaceId,
          fileId:pathId[1]
        }
      })
      const { data, error } = await updateFile(
        { inTrash: `Deleted by ${user?.email}` },
        pathId[1]
      );
      if (error) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: 'Could not move the folder to trash',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Moved folder to trash',
        });
      }

    }
  }

  const isFolder = listType === 'folder';
  const groupIdentifies = clsx(
    'dark:text-white whitespace-nowrap flex justify-between items-center w-full relative',
    {
      'group/folder': isFolder,
      'group/file': !isFolder,
    }
  );

  const listStyles = useMemo(
    () =>
      clsx('relative', {
        'border-none text-md': isFolder,
        'border-none ml-6 text-[16px] py-1': !isFolder,
      }),
    [isFolder]
  );

  const hoverStyles = useMemo(
    () =>
      clsx(
        'h-full hidden rounded-sm absolute right-0 items-center justify-center',
        {
          'group-hover/file:block': listType === 'file',
          'group-hover/folder:block': listType === 'folder',
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
              <EmojiPicker getValue={onChangeEmoji}>{iconId}</EmojiPicker>
            </div>
            <input
              type="text"
              value={listType === "folder" ? folderTitle : fileTitle}
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
          <div
            className={hoverStyles}
          >
            <TooltipComponent message="Delete Folder">
              <Trash
                onClick={moveToTrash}
                size={15}
                className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
              />
            </TooltipComponent>
            {listType === 'folder' && !isEditing && (
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
        {state.workspaces
        .find(workspace => workspace.id === workspaceId)?.folders.find(
          folder => folder.id === id
        )?.files.filter(file=>!file.inTrash)
        .map(file=>{
          const customField = `${id}folder${file.id}`
          return(
            <DropDown
            key={file.id}
            title={file.title}
            listType="file"
            id={customField}
            iconId={file.iconId}
            />
          )
        })}
      </AccordionContent>
    </AccordionItem>
  );
};

export default DropDown;
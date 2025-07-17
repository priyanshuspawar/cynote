"use client";
import Header from "@/components/editor/components/Header";
import Editor from "@/components/liveblock-editor/editor";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import {
  setSelectedFileId,
  setSelectedFolderId,
} from "@/redux/features/selectedSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fileApi,
  useGetFileDetailsQuery,
  useUpdateFileMutation,
} from "@/redux/services/fileApi";
import { useGetFolderDetailsQuery } from "@/redux/services/folderApi";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/helpers/client";
import { useUser, useOthers } from "@liveblocks/react/suspense";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { stringToColor } from "@/lib/utils";
import Loader from "@/components/global/Loader";
// Dynamically load the collaborative editor (outside component to avoid hook issues)

const FilePage = () => {
  const others = useOthers();
  const { fileId }: { fileId: string } = useParams();
  const path = useMemo(() => fileId.split("folder"), [fileId]);
  const state = useAppSelector((state) => state.selectedEntities);
  const supabase = createClient();

  // Fetch file details
  const {
    data,
    isLoading: loadingFile,
    error,
  } = useGetFileDetailsQuery(path[1]);
  const { data: folder, isLoading: loadingFolder } = useGetFolderDetailsQuery(
    path[0]
  );
  const [updateFile] = useUpdateFileMutation();
  // Dispatch hooks
  const dispatch = useAppDispatch();
  const { user } = useSupabaseUser();
  //list to realtime postgres changes

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-file-update:${path[1]}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "files",
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            console.log(payload);
            fileApi.util.updateQueryData(
              "getFileDetails",
              path[1],
              (draftFile) => {
                return { ...draftFile };
              }
            );
          }
          if (payload.eventType === "DELETE") {
            console.log("deleted");
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path[1]]);
  // Dispatch selected file and folder IDs when data is available
  useEffect(() => {
    if (data?.folderId && data?.id) {
      dispatch(setSelectedFolderId(data.folderId));
      dispatch(setSelectedFileId(data.id));
    }
  }, [data?.folderId, data?.id, dispatch]);
  const isLoading = loadingFile || loadingFolder;
  const isOwner = useMemo(() => {
    if (!user?.id || !state.selectedWorkspace) {
      return false;
    }
    return user.id === state.selectedWorkspace.workspaceOwner;
  }, [state.selectedWorkspace, user]);
  // Handle loading and error states
  if (isLoading) {
    return <Loader />;
  }

  if (error || !data || !folder || !user) {
    return (
      <div className="h-full overflow-hidden w-full flex items-center justify-center">
        Error fetching file details.
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col min-h-screen overflow-x-hidden overflow-y-auto">
      {data.inTrash && (
        <div className="bg-red-500 flex p-1 justify-center w-full gap-0.5 items-center">
          <p className="text-white text-sm font-semibold">
            This file is deleted.
          </p>
          {isOwner ? (
            <button
              className="text-sm hover:border-white text-white/80 hover:text-white transition-colors duration-300 ease-in-out font-semibold border py-0.5 border-white/80 rounded-md px-2"
              onClick={async () => {
                await updateFile({
                  fileId: path[1],
                  updatedData: {
                    inTrash: null,
                  },
                });
              }}
            >
              Recover it
            </button>
          ) : (
            <p className="text-white text-sm">
              Please contact workspace owner to recover it
            </p>
          )}
        </div>
      )}
      <div className="w-full bg-brand-dark px-6 py-2 flex justify-between">
        <Breadcrumb className="my-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/dashbaord/${state.workspaceId}`}>
                {state.selectedWorkspace?.title ?? "Workspace"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {/* folder */}
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/dashbaord/${state.workspaceId}/${path[0]}`}
              >
                {folder?.iconId && folder.iconId}{" "}
                {folder?.title ? folder.title : "folder"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {/* file */}
            <BreadcrumbItem>
              <BreadcrumbPage>
                {data.iconId} {data.title ?? "File"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale items-center">
          {others.slice(0, 5).map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Avatar className="w-7 h-7 cursor-pointer">
                  <AvatarImage
                    src={
                      item.info.avatar === "null" ? item.info.avatar : undefined
                    }
                    alt={item.info.email}
                  />
                  <AvatarFallback
                    style={{
                      backgroundColor: `${stringToColor(item.info.email!)}`,
                      color: "#fff",
                    }}
                  >
                    {item.info.email.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <span>{item.info.email}</span>
              </TooltipContent>
            </Tooltip>
          ))}
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className={`w-7 h-7 cursor-pointer`}>
                <AvatarImage alt={user.email} />
                <AvatarFallback
                  className="opacity-100 text-white"
                  style={{
                    backgroundColor: `${stringToColor(user.email!)}`,
                  }}
                >
                  {(user.email ?? "User").slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <span>{user.email}</span>
            </TooltipContent>
          </Tooltip>
          {others.length > 4 && (
            <Avatar>
              <AvatarFallback>+{others.length - 4}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
      <Header id={path[1]} />

      <Editor />
    </div>
  );
  ``;
};

export default FilePage;

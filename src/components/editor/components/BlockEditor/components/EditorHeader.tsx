import { EditorInfo } from "./EditorInfo";
import { EditorUser } from "../types";
import { WebSocketStatus } from "@hocuspocus/provider";
import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import deepEqual from "fast-deep-equal";
import { useEffect, useMemo, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  getFilesDetails,
  getFolderDetails,
  getWorkspaceDetails,
} from "@/lib/supabase/queries";
import { File, Folder, workspace } from "@/lib/supabase/supabase.types";
import HeaderOption from "@/components/editor/HeaderOptions";

export type EditorHeaderProps = {
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
  editor: Editor;
  collabState: WebSocketStatus;
  users: EditorUser[];
  path: string;
};

export const EditorHeader = ({
  path,
  editor,
  collabState,
  users,
  isSidebarOpen,
  toggleSidebar,
}: EditorHeaderProps) => {
  const breadcrumbsString = useMemo(() => path, [path]);

  // useEffect(() => {
  //   const paths = breadcrumbsString.split("/");
  //   const fetchData = async () => {
  //     try {
  //       const { data: WorkspaceData } = await getWorkspaceDetails(paths[0]);
  //       const { data: FolderData } = await getFolderDetails(paths[1]);
  //       const { data: FilesData } = await getFilesDetails(paths[2]);

  //       setWorkspaceDetails(WorkspaceData?.[0] ?? null);
  //       setFolderDetails(FolderData?.[0] ?? null);
  //       setFileDetails(FilesData?.[0] ?? null);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   fetchData();
  // }, [breadcrumbsString]);

  return (
    <>
      <div className="flex flex-row items-center justify-between flex-none py-2 pl-6 pr-3 border-b">
        {/* {workspaceDetails && folderDetails && fileDetails && (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/${workspaceDetails.id}`}>
                  {workspaceDetails?.iconId ?? "💼"} {workspaceDetails?.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>{"/"}</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/${workspaceDetails.id}/${folderDetails.id}`}>
                  {folderDetails?.iconId ?? "📁"} {folderDetails?.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>{"/"}</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {fileDetails?.iconId ?? "📄"} {fileDetails?.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )} */}
        <EditorInfo collabState={collabState} users={[users[0]]} />
      </div>
    </>
  );
};

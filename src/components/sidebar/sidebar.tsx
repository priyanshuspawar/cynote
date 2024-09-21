"use client";
import React, { useCallback, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import WorkspaceDropdown from "./workspaceDropdown";
import PlanUsage from "./plan-usage";
import NativeNavigation from "./native-navigation";
import { ScrollArea } from "../ui/scroll-area";
import FoldersDropdownList from "./folders-dropdown-list";
import {
  useGetCollaboratingWorkspacesQuery,
  useGetPrivateWorkspacesQuery,
  useGetSharedWorkspacesQuery,
} from "@/redux/services/workspaceApi";
import { Spinner } from "@/components/editor/ui/Spinner";
import { setSelectedWorkspaceId } from "@/redux/features/selectedSlice";
import { useAppDispatch } from "@/redux/hooks";

type SideBarProps = {
  params: { workspaceId: string };
  className?: string;
};

const SideBar = ({ params, className }: SideBarProps) => {
  const dispatch = useAppDispatch();
  const selectedWorkspaceSetter = useCallback(() => {
    dispatch(setSelectedWorkspaceId(params.workspaceId));
  }, [params]);

  useEffect(() => {
    selectedWorkspaceSetter();
  }, []);
  // folders

  // error
  // TODO: handle subscription logic

  const { data: privateWorkspaces, isLoading: privateWorkspacesLoading } =
    useGetPrivateWorkspacesQuery(null);
  const {
    data: collaboratingWorkspaces,
    isLoading: collaboratingWorkspacesLoading,
  } = useGetCollaboratingWorkspacesQuery(null);
  const { data: sharedWorkspaces, isLoading: sharedWorkspacesLoading } =
    useGetSharedWorkspacesQuery(null);
  if (
    privateWorkspacesLoading ||
    collaboratingWorkspacesLoading ||
    sharedWorkspacesLoading
  ) {
    return <></>;
  }
  if (!privateWorkspaces || !sharedWorkspaces || !collaboratingWorkspaces) {
    return <div>Error fetching data</div>;
  }
  return (
    <aside
      className={twMerge(
        "hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between",
        className
      )}
    >
      <div>
        <WorkspaceDropdown
          privateWorkspaces={privateWorkspaces || []}
          sharedWorkspaces={collaboratingWorkspaces || []}
          colaboratingWorkspaces={sharedWorkspaces || []}
          defaultValue={[
            ...privateWorkspaces,
            ...collaboratingWorkspaces,
            ...sharedWorkspaces,
          ].find((workspace) => workspace.id == params.workspaceId)}
        />
        {/* <PlanUsage
          foldersLength={workspaceFolderData?.length || 0}
          subscription={subscriptionData}
        /> */}
        <NativeNavigation myWorkspaceId={params.workspaceId} />
        <ScrollArea
          className="overflow-y-scroll relative
          h-[450px]
        "
        >
          <div
            className="pointer-events-none 
          w-full 
          absolute 
          bottom-0 
          h-20 
          bg-gradient-to-t 
          from-background 
          to-transparent 
          z-40"
          />
          <FoldersDropdownList workspaceId={params.workspaceId} />
        </ScrollArea>
      </div>
    </aside>
  );
};

export default SideBar;

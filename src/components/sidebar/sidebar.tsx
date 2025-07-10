"use client";
import React, { useEffect, useMemo } from "react";
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
import {
  setSelectedWorkspace,
  setSelectedWorkspaceId,
} from "@/redux/features/selectedSlice";
import { useAppDispatch } from "@/redux/hooks";

type SideBarProps = {
  params: { workspaceId: string };
  className?: string;
};

const SideBar = ({ params, className }: SideBarProps) => {
  const dispatch = useAppDispatch();

  // Set the workspaceId once when the component mounts
  useEffect(() => {
    dispatch(setSelectedWorkspaceId(params.workspaceId));
  }, [params.workspaceId, dispatch]);

  // Fetch workspaces
  const { data: privateWorkspaces, isLoading: privateWorkspacesLoading } =
    useGetPrivateWorkspacesQuery(null);
  const {
    data: collaboratingWorkspaces,
    isLoading: collaboratingWorkspacesLoading,
  } = useGetCollaboratingWorkspacesQuery(null);
  const { data: sharedWorkspaces, isLoading: sharedWorkspacesLoading } =
    useGetSharedWorkspacesQuery(null);

  // Memoize the combined workspaces to avoid re-calculation
  const allWorkspaces = useMemo(() => {
    return [
      ...(privateWorkspaces || []),
      ...(collaboratingWorkspaces || []),
      ...(sharedWorkspaces || []),
    ];
  }, [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces]);

  // Find the selected workspace based on params.workspaceId
  const selectedWorkspace = useMemo(() => {
    return allWorkspaces.find(
      (workspace) => workspace.id === params.workspaceId
    );
  }, [allWorkspaces, params.workspaceId]);

  // Dispatch the selectedWorkspace only if it changes
  useEffect(() => {
    if (selectedWorkspace) {
      dispatch(setSelectedWorkspace(selectedWorkspace));
    }
  }, [selectedWorkspace, dispatch]);

  if (
    privateWorkspacesLoading ||
    collaboratingWorkspacesLoading ||
    sharedWorkspacesLoading
  ) {
    return <Spinner />;
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
          defaultValue={selectedWorkspace}
        />
        <NativeNavigation myWorkspaceId={params.workspaceId} />
        <ScrollArea className="overflow-y-hidden relative h-[450px]">
          <div className="pointer-events-none w-full absolute bottom-0 h-20 bg-gradient-to-t from-background to-transparent z-40" />
          <FoldersDropdownList workspaceId={params.workspaceId} />
        </ScrollArea>
      </div>
    </aside>
  );
};

export default SideBar;

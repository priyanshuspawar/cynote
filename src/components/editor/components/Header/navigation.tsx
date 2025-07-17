"use client";
import { useAppSelector } from "@/redux/hooks";
import { useGetFoldersQuery } from "@/redux/services/folderApi";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";

const Navigation = () => {
  const { workspaceId, selectedWorkspace } = useAppSelector(
    (state) => state.selectedEntities
  );
  const { fileId: folderAndfileId }: { fileId: string } = useParams();
  const { data: folders } = useGetFoldersQuery(workspaceId!);
  const breadCrumbs = useMemo(() => {
    const [folderId, fileId] = folderAndfileId.split("folder");
    if (!folderId || !fileId || !selectedWorkspace) return null;

    return [
      {
        title: selectedWorkspace.title,
        href: `/dashboard/${selectedWorkspace.id}`,
      },
      {
        title: "",
      },
    ];
  }, [folderAndfileId, workspaceId]);

  return <div>Navigation</div>;
};

export default Navigation;

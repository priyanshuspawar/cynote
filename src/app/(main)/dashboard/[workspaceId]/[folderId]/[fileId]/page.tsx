"use client";
import Navigation from "@/components/editor/components/Header/navigation";
import { Spinner } from "@/components/editor/ui/Spinner";
import {
  setSelectedFileId,
  setSelectedFolderId,
  setSelectedFile,
} from "@/redux/features/selectedSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useGetFilesDetailsQuery } from "@/redux/services/fileApi";
import dynamic from "next/dynamic";
import { redirect, useParams } from "next/navigation";
import React, { useEffect } from "react";

// Dynamically load the collaborative editor (outside component to avoid hook issues)
const CollaborativeEditor = dynamic(() => import("@/components/editor/index"), {
  ssr: false,
});

const FilePage = () => {
  const { fileId }: { fileId: string } = useParams();
  const path = fileId.split("folder");

  // Fetch file details
  const { data, isLoading, error } = useGetFilesDetailsQuery(path[1]);

  // Dispatch hooks
  const dispatch = useAppDispatch();

  // Dispatch selected file and folder IDs when data is available
  useEffect(() => {
    if (data?.folderId && data?.id) {
      dispatch(setSelectedFolderId(data.folderId));
      dispatch(setSelectedFileId(data.id));
    }
  }, [data?.folderId, data?.id, dispatch]);

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center overflow-hidden">
        <Spinner />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-full overflow-hidden w-full flex items-center justify-center">
        Error fetching file details.
      </div>
    );
  }

  // Redirect if file is in trash
  if (data?.inTrash) {
    redirect(`/dashboard/${data.workspaceId}/${data.folderId}`);
  }

  return (
    <>
      <Navigation />
      {/* Always render CollaborativeEditor but only pass data when available */}
      {/* {data && <CollaborativeEditor room={data.id} folderId={data.folderId!} />} */}
    </>
  );
};

export default FilePage;

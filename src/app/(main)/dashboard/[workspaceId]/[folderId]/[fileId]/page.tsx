// "use client";
// import { useAppSelector } from "@/redux/hooks";
// import { useLazyGetFilesDetailsQuery } from "@/redux/services/fileApi";
// import dynamic from "next/dynamic";
// import { usePathname } from "next/navigation";
// import React, { useEffect } from "react";

// const FilePage = () => {
//   const path = usePathname().split("folder");
//   const { workspaceId, folderId } = useAppSelector(
//     (state) => state.selectedEntities
//   );
//   const [
//     getFileDetails,
//     { data: fileDetails, error: fileDetailsFetchingError },
//   ] = useLazyGetFilesDetailsQuery();
//   useEffect(() => {
//     if (!workspaceId || !folderId) return;
//     const fetchData = async () => {
//       getFileDetails(path[1]);
//     };
//     fetchData();
//   }, [workspaceId]);
//   const CollaborativeEditor = dynamic(
//     () => import("@/components/editor/index"),
//     { ssr: false }
//   );
//   if (path.length != 2) return;
//   return (
//     <>
//       {/* <HeaderOption /> */}
//       <CollaborativeEditor room={path[1] ?? "testroom"} folderId={path[0]} />
//     </>
//   );
// };

// export default FilePage;
"use client";
import { Spinner } from "@/components/editor/ui/Spinner";
import { useGetFilesDetailsQuery } from "@/redux/services/fileApi";
import { usePathname } from "next/navigation";
import React from "react";

const FilePage = () => {
  const path = usePathname().split("folder");
  const { data, isLoading, error } = useGetFilesDetailsQuery(path[1]);
  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center overflow-hidden">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        Error fetching file details.
      </div>
    );
  }
  return <div>FilePage</div>;
};

export default FilePage;

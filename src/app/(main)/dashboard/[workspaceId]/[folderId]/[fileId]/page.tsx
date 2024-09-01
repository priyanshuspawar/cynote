"use client"
import HeaderOption from "@/components/editor/HeaderOptions";
import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import React from "react";

const FilePage = () => {
  const path = usePathname().split('folder')
  const CollaborativeEditor = dynamic(
    () => import("@/components/editor/index"),
    { ssr: false }
  );
  if(path.length !=2)return;
  return <div>
    <HeaderOption/>
    <div className="w-full flex justify-center">
    <Separator className="w-4/6 mt-4"/>
    </div>
    <CollaborativeEditor room={path[1]??"testroom"} folderId={path[0]}/>
  </div>;
};

export default FilePage;

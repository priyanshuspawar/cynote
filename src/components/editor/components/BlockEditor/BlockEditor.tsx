"use client";
import { EditorContent } from "@tiptap/react";
import React, { useEffect, useRef } from "react";

import { LinkMenu } from "@/components/editor/components/menus";

import { useBlockEditor } from "@/hooks/useBlockEditor";

import "@/styles/index.css";

import ImageBlockMenu from "@/components/editor/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/components/editor/extensions/MultiColumn/menus";
import {
  TableColumnMenu,
  TableRowMenu,
} from "@/components/editor/extensions/Table/menus";
import { TextMenu } from "../menus/TextMenu";
import { ContentItemMenu } from "../menus/ContentItemMenu";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useUser } from "@/lib/providers/colab-user-provider";

export const BlockEditor = ({
  path,
  ydoc,
  provider,
}: {
  path: string;
  hasCollab: boolean;
  ydoc: Y.Doc;
  provider?: HocuspocusProvider | null | undefined;
}) => {
  const menuContainerRef = useRef(null);
  const { editor, users, collabState } = useBlockEditor({ ydoc, provider });

  if (!editor || !users) {
    return null;
  }
  const { dispatch } = useUser();

  useEffect(() => {
    dispatch({ type: "UPDATE_USER", payload: users });
  }, []);
  console.log("re render");
  return (
    <div className="flex flex-col overflow-y-scroll" ref={menuContainerRef}>
      <div className="w-full bg-black h-24">
        <p>cgeck</p>
      </div>
      <div className="relative flex flex-col flex-1 h-full">
        <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
        <ContentItemMenu editor={editor} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </div>
  );
};

interface HeaderProps {
  fileName: string;
  bannerUrl?: string;
}

const Header: React.FC<HeaderProps> = ({ fileName, bannerUrl }) => {
  return (
    <div className="bg-white shadow-md">
      {bannerUrl && (
        <div
          className="h-32 bg-contain bg-center"
          style={{ backgroundImage: `url(${bannerUrl})` }}
        />
      )}
      <div className="px-4 py-2">
        <h1 className="text-2xl font-bold">{fileName}</h1>
      </div>
    </div>
  );
};

export default BlockEditor;

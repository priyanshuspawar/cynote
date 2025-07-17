"use client";
import { EditorContent } from "@tiptap/react";
import React, { useEffect, useRef, useState } from "react";

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
import Header from "../Header";

export const BlockEditor = ({
  ydoc,
  provider,
  room,
}: {
  hasCollab: boolean;
  ydoc: Y.Doc;
  room: string;
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
  return (
    <div className="flex flex-col overflow-y-scroll" ref={menuContainerRef}>
      <Header id={room} />
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

export default BlockEditor;

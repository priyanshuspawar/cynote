import React from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";

export default () => {
  return (
    <NodeViewWrapper className="relative w-full bg-slate-300t">
      <span className="label" contentEditable={false}>
        React Component
      </span>

      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};

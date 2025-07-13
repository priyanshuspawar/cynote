"use client";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import { stringToColor } from "@/lib/utils";
import "@blocknote/shadcn/style.css";

function BlockNote({
  doc,
  provider,
  darkMode,
}: {
  doc: Y.Doc;
  provider: LiveblocksYjsProvider;
  darkMode: boolean;
}) {
  const userInfo = useSelf((me) => me.info);
  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userInfo?.email || "Anonymous",
        color: stringToColor(userInfo?.email ?? "Anonymous"),
      },
    },
  });
  return (
    <div className="relative w-full mx-auto max-w-6xl h-full">
      <BlockNoteView editor={editor} theme={"dark"} className="h-full" />
    </div>
  );
}

const Editor = () => {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  useEffect(() => {
    const yDoc = new Y.Doc();
    const liveblocksProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(liveblocksProvider);

    return () => {
      yDoc?.destroy();
      liveblocksProvider?.destroy();
    };
  }, [room]);
  if (!doc || !provider) {
    return null;
  }
  return (
    <div className="max-w-6xl w-full h-full mx-auto flex flex-col flex-grow">
      {/* <div className="flex items-center gap-2 justify-end mb-10"> */}
      {/*wip translate document AI */}
      {/*wip chat to document AI */}
      {/* </div> */}
      {/* blocknote notion */}
      <BlockNote doc={doc} provider={provider} darkMode={true} />
    </div>
  );
};

export default Editor;

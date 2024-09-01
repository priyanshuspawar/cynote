"use client";

import { HocuspocusProvider, TiptapCollabProvider } from "@hocuspocus/provider";
import "iframe-resizer/js/iframeResizer.contentWindow";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

import * as Y from "yjs";
import { BlockEditor } from "./components/BlockEditor";
import { usePathname } from "next/navigation";

export default function CollaborativeEditor({ room,folderId }: { room: string,folderId: string}) {
  const [provider, setProvider] = useState<HocuspocusProvider | null>();
  const [collabToken, setCollabToken] = useState<string | null | undefined>();
  const path = usePathname()
  
  // fetching info from db


  useEffect(() => {
    const dataFetch = async () => {
      try {
        const response = await fetch("/api/auth/tiptap-jwt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("No collaboration token provided");
        }
        const data = await response.json();

        const { token } = data;

        // set state when the data received
        setCollabToken(token);
      } catch (e) {
        if (e instanceof Error) {
          console.error(e.message);
        }
        setCollabToken(null);
        return;
      }
    };
    dataFetch();
  }, []);
  const ydoc = useMemo(() => new Y.Doc(), []);
  useEffect(() => {
    if (collabToken) {
      setProvider(
        // new TiptapCollabProvider({
        //   name: `${process.env.NEXT_PUBLIC_COLLAB_DOC_PREFIX}${room}`,
        //   appId: process.env.NEXT_PUBLIC_TIPTAP_COLLAB_APP_ID ?? "",
        //   token: collabToken,
        //   document: ydoc,
        // })
        new HocuspocusProvider({
          url: 'ws://127.0.0.1:8080',
          name: `doc-${room}`,
          token: collabToken,
          document: ydoc,
        })
      );
    }
  }, [setProvider, collabToken, ydoc, room]);
  if ((!provider) || collabToken === undefined) return
  return (
    <>
      <BlockEditor hasCollab ydoc={ydoc} provider={provider} path={path}/>
    </>
  );
}

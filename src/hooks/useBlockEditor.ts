import { useEffect, useState } from "react";
import { useEditor, useEditorState } from "@tiptap/react";
import deepEqual from "fast-deep-equal";
import type { AnyExtension, Editor } from "@tiptap/core";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { HocuspocusProvider, WebSocketStatus } from "@hocuspocus/provider";
import type { Doc as YDoc } from "yjs";
import "../styles/partials/collab.css";
import { ExtensionKit } from "@/components/editor/extensions/extension-kit";
import type { EditorUser } from "../components/editor/components/BlockEditor/types";
import { initialContent } from "@/lib/constants";
import { stringToColor } from "@/lib/utils";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";

declare global {
  interface Window {
    editor: Editor | null;
  }
}

export const useBlockEditor = ({
  ydoc,
  provider,
}: {
  aiToken?: string;
  ydoc: YDoc;
  provider?: HocuspocusProvider | null | undefined;
  userId?: string;
  userName?: string;
}) => {
  const [collabState, setCollabState] = useState<WebSocketStatus>(
    provider ? WebSocketStatus.Connecting : WebSocketStatus.Disconnected
  );
  const { user } = useSupabaseUser();
  const editor = useEditor(
    {
      immediatelyRender: true,
      shouldRerenderOnTransaction: false,
      autofocus: true,
      onCreate: (ctx) => {
        if (provider && !provider.isSynced) {
          provider.on("synced", () => {
            setTimeout(() => {
              if (ctx.editor.isEmpty) {
                ctx.editor.commands.setContent(initialContent);
              }
            }, 0);
          });
        } else if (ctx.editor.isEmpty) {
          ctx.editor.commands.setContent(initialContent);
          ctx.editor.commands.focus("start", { scrollIntoView: true });
        }
      },
      extensions: [
        ...ExtensionKit({
          provider,
        }),
        provider
          ? Collaboration.configure({
              document: ydoc,
            })
          : undefined,
        provider
          ? CollaborationCursor.configure({
              provider,
              user: {
                name: user?.email,
                color: stringToColor(user?.email ?? "default"),
              },
              render(user) {
                // Create cursor span
                const cursor = document.createElement("span");
                cursor.classList.add("collaboration-cursor__caret");
                cursor.style.height = "20px"; // Fixed height for the cursor
                cursor.style.position = "relative"; // Position the cursor relative to the label

                // Create label for user name
                const label = document.createElement("div");
                label.classList.add("collaboration-cursor__label");
                label.style.backgroundColor = user.color;
                label.style.fontSize = "10px"; // Keep font size small
                label.style.padding = "2px 4px"; // Compact padding for label
                label.style.borderRadius = "4px"; // Rounded corners for label
                label.style.whiteSpace = "nowrap"; // Prevent text wrapping
                label.textContent = user.name;
                label.style.color = "black";
                label.style.width = "fit-content"; // Fit content width
                label.style.position = "absolute";
                label.style.top = "-1.5em"; // Position above the cursor (adjust as needed)
                label.style.left = "0"; // Align label with the cursor
                label.style.lineHeight = "normal"; // Consistent line height
                label.style.fontWeight = "400";
                // Insert label inside cursor span
                cursor.appendChild(label);

                return cursor;
              },
            })
          : undefined,
        ,
      ].filter((e): e is AnyExtension => e !== undefined),
      editorProps: {
        attributes: {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          class: "min-h-full",
        },
      },
    },
    [ydoc, provider]
  );
  const users = useEditorState({
    editor,
    selector: (ctx): (EditorUser & { initials: string })[] => {
      if (!ctx.editor?.storage.collaborationCursor?.users) {
        return [];
      }

      return ctx.editor.storage.collaborationCursor.users.map(
        (user: EditorUser) => {
          const names = user.name?.split(" ");
          const firstName = names?.[0];
          const lastName = names?.[names.length - 1];
          const initials = `${firstName?.[0] || "?"}${lastName?.[0] || "?"}`;

          return { ...user, initials: initials.length ? initials : "?" };
        }
      );
    },
    equalityFn: deepEqual,
  });

  useEffect(() => {
    provider?.on("status", (event: { status: WebSocketStatus }) => {
      setCollabState(event.status);
    });
  }, [provider]);
  window.editor = editor;

  return { editor, users, collabState };
};

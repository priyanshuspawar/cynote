"use client";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { createOpenAI } from "@ai-sdk/openai";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";

import {
  useCreateBlockNote,
  FormattingToolbar,
  FormattingToolbarController,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  getFormattingToolbarItems,
} from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import { stringToColor } from "@/lib/utils";
import "@blocknote/shadcn/style.css";
import { debounce } from "lodash";
import { useUpdateFileMutation } from "@/redux/services/fileApi";
import { toast } from "sonner";
import TranslateDocument from "./translate-document";

// ai imports
import { en } from "@blocknote/core/locales";
import { en as aiEn } from "@blocknote/xl-ai/locales";
import {
  AIMenu,
  AIMenuController,
  AIToolbarButton,
  createAIExtension,
  createBlockNoteAIClient,
  getAISlashMenuItems,
  getDefaultAIMenuItems,
} from "@blocknote/xl-ai";
import "@blocknote/xl-ai/style.css";
import { addRelatedTopics, makeInformal } from "./custom-ai-menu-item";

const client = createBlockNoteAIClient({
  baseURL: `${process.env.NEXT_PUBLIC_EDITOR_GPT_URL}/cynote-editor-ai`,
  apiKey: "placeholder-api-key",
});

const model = createOpenAI({
  ...client.getProviderSettings("openai"),
})("gpt-4o");

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
    dictionary: {
      ...en,
      ai: aiEn, // add default translations for the AI extension
    },
    extensions: [
      createAIExtension({
        model,
      }),
    ],
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
      <BlockNoteView editor={editor} theme={"dark"} className="h-full">
        {/* Creates a new AIMenu with the default items, 
        as well as our custom ones. */}
        <AIMenuController aiMenu={CustomAIMenu} />

        {/* We disabled the default formatting toolbar with `formattingToolbar=false` 
        and replace it for one with an "AI button" (defined below). 
        (See "Formatting Toolbar" in docs)
        */}
        <FormattingToolbarWithAI />

        {/* We disabled the default SlashMenu with `slashMenu=false` 
        and replace it for one with an AI option (defined below). 
        (See "Suggestion Menus" in docs)
        */}
        <SuggestionMenuWithAI editor={editor} />
      </BlockNoteView>
    </div>
  );
}

const Editor = () => {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [updateFile] = useUpdateFileMutation();

  useEffect(() => {
    const onDocChange = async () => {
      try {
        await updateFile({
          fileId: room.id,
          updatedData: {
            updatedAt: new Date().toISOString(),
          },
        });
      } catch (error) {
        toast.error(
          "An unexpected error occurred. Your changes may not have been saved."
        );
      }
    };
    const debouncedUpdateModifiedAt = debounce(() => {
      onDocChange();
    }, 1000 * 30); // Update every 30 seconds max
    const yDoc = new Y.Doc();
    const liveblocksProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(liveblocksProvider);
    yDoc.on("update", debouncedUpdateModifiedAt);
    return () => {
      yDoc?.off("update", debouncedUpdateModifiedAt);
      yDoc?.destroy();
      liveblocksProvider?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);
  if (!doc || !provider) {
    return null;
  }
  return (
    <div className="max-w-6xl w-full h-full mx-auto flex flex-col flex-grow">
      {/* <div className="flex items-center gap-2 justify-end mb-10"> */}
      {/*wip translate document AI */}
      {/* <div className="mx-auto w-full px-[12vw] mt-2">
        <TranslateDocument doc={doc} />
      </div> */}
      {/*wip chat to document AI */}
      {/* </div> */}
      {/* blocknote notion */}
      <BlockNote doc={doc} provider={provider} darkMode={true} />
    </div>
  );
};

export default Editor;

function CustomAIMenu() {
  return (
    <AIMenu
      items={(
        editor: BlockNoteEditor<any, any, any>,
        aiResponseStatus:
          | "user-input"
          | "thinking"
          | "ai-writing"
          | "error"
          | "user-reviewing"
          | "closed"
      ) => {
        if (aiResponseStatus === "user-input") {
          // Returns different items based on whether the AI Menu was
          // opened via the Formatting Toolbar or the Slash Menu.
          if (editor.getSelection()) {
            return [
              // Gets the default AI Menu items
              ...getDefaultAIMenuItems(editor, aiResponseStatus),
              // Adds our custom item to make the text more casual.
              // Only appears when the AI Menu is opened via the
              // Formatting Toolbar.
              makeInformal(editor),
            ];
          } else {
            return [
              // Gets the default AI Menu items
              ...getDefaultAIMenuItems(editor, aiResponseStatus),
              // Adds our custom item to find related topics. Only
              // appears when the AI Menu is opened via the Slash
              // Menu.
              addRelatedTopics(editor),
            ];
          }
        }
        // for other states, return the default items
        return getDefaultAIMenuItems(editor, aiResponseStatus);
      }}
    />
  );
}

// Formatting toolbar with the `AIToolbarButton` added
function FormattingToolbarWithAI() {
  return (
    <FormattingToolbarController
      formattingToolbar={() => (
        <FormattingToolbar>
          {...getFormattingToolbarItems()}
          <AIToolbarButton />
        </FormattingToolbar>
      )}
    />
  );
}

// Slash menu with the AI option added
function SuggestionMenuWithAI(props: {
  editor: BlockNoteEditor<any, any, any>;
}) {
  return (
    <SuggestionMenuController
      triggerCharacter="/"
      getItems={async (query) => {
        return filterSuggestionItems(
          [
            ...getDefaultReactSlashMenuItems(props.editor),
            ...getAISlashMenuItems(props.editor),
          ],
          query
        );
      }}
    />
  );
}

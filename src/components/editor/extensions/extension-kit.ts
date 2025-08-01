"use client";

import { HocuspocusProvider } from "@hocuspocus/provider";

import {
  BlockquoteFigure,
  CharacterCount,
  CodeBlock,
  Color,
  Details,
  DetailsContent,
  DetailsSummary,
  Document,
  Dropcursor,
  Emoji,
  Figcaption,
  FileHandler,
  Focus,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalRule,
  ImageBlock,
  Link,
  Placeholder,
  Selection,
  SlashCommand,
  StarterKit,
  Subscript,
  Superscript,
  Table,
  TableOfContents,
  TableCell,
  TableHeader,
  TableRow,
  TextAlign,
  TextStyle,
  TrailingNode,
  Typography,
  Underline,
  emojiSuggestion,
  Columns,
  Column,
  TaskItem,
  TaskList,
  UniqueID,
} from ".";

import { ImageUpload } from "./ImageUpload";
import { TableOfContentsNode } from "./TableOfContentsNode";
import { isChangeOrigin } from "@tiptap/extension-collaboration";

interface ExtensionKitProps {
  provider?: HocuspocusProvider | null;
}

//TODO: fix image upload in file handler extension

export const ExtensionKit = ({ provider }: ExtensionKitProps) => [
  Document,
  Columns,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Column,
  Selection,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  HorizontalRule,
  UniqueID.configure({
    types: ["paragraph", "heading", "blockquote", "codeBlock", "table"],
    filterTransaction: (transaction) => !isChangeOrigin(transaction),
  }),
  StarterKit.configure({
    document: false,
    dropcursor: false,
    heading: false,
    horizontalRule: false,
    blockquote: false,
    history: false,
    codeBlock: false,
  }),
  Details.configure({
    persist: true,
    HTMLAttributes: {
      class: "details",
    },
  }),
  DetailsContent,
  DetailsSummary,
  CodeBlock,
  TextStyle,
  FontSize,
  FontFamily,
  Color,
  TrailingNode,
  Link.configure({
    openOnClick: false,
  }),
  Highlight.configure({ multicolor: true }),
  Underline,
  CharacterCount.configure({ limit: 50000 }),
  TableOfContents,
  TableOfContentsNode,
  ImageUpload.configure({
    clientId: provider?.document?.clientID,
  }),
  ImageBlock,
  FileHandler.configure({
    allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
    // onDrop: (currentEditor, files, pos) => {
    //   files.forEach(async (file) => {
    //     try {
    //       const { data, error: uploadError } = await supabase.storage
    //         .from("document-attachments")
    //         .upload(`document-${v4()}`, file, {
    //           cacheControl: "3600",
    //           upsert: true,
    //         });
    //       if (!data?.path) {
    //         throw new Error("Failed to upload image");
    //       }
    //       const { data: publicUrl } = await supabase.storage
    //         .from("document-attachments")
    //         .getPublicUrl(data.path);
    //       if (uploadError || !publicUrl) {
    //         throw new Error("Failed to fetch public URL");
    //       }
    //       currentEditor
    //         .chain()
    //         .setImageBlockAt({ pos, src: publicUrl.publicUrl })
    //         .focus()
    //         .run();
    //     } catch (errPayload: any) {
    //       const error =
    //         errPayload?.response?.data?.error || "Something went wrong";
    //       toast.error(error);
    //     }
    //   });
    // },
    // onPaste: (currentEditor, files) => {
    //   files.forEach(async (file) => {
    //     try {
    //       const { data, error: uploadError } = await supabase.storage
    //         .from("document-attachments")
    //         .upload(`document-${v4()}`, file, {
    //           cacheControl: "3600",
    //           upsert: true,
    //         });
    //       if (!data?.path) {
    //         throw new Error("Failed to upload image");
    //       }
    //       const { data: publicUrl } = await supabase.storage
    //         .from("document-attachments")
    //         .getPublicUrl(data.path);
    //       if (uploadError || !publicUrl.publicUrl) {
    //         throw new Error("Failed to fetch public URL");
    //       }
    //       return currentEditor
    //         .chain()
    //         .setImageBlockAt({
    //           pos: currentEditor.state.selection.anchor,
    //           src: publicUrl.publicUrl,
    //         })
    //         .focus()
    //         .run();
    //     } catch (errPayload: any) {
    //       const error =
    //         errPayload?.response?.data?.error || "Something went wrong";
    //       toast.error(error);
    //     }
    //   });
    // },
  }),
  Emoji.configure({
    enableEmoticons: true,
    suggestion: emojiSuggestion,
  }),
  TextAlign.extend({
    addKeyboardShortcuts() {
      return {};
    },
  }).configure({
    types: ["heading", "paragraph"],
  }),
  Subscript,
  Superscript,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Typography,
  Placeholder.configure({
    includeChildren: true,
    showOnlyCurrent: false,
    placeholder: () => "",
  }),
  SlashCommand,
  Focus,
  Figcaption,
  BlockquoteFigure,
  Dropcursor.configure({
    width: 2,
    class: "ProseMirror-dropcursor border-black",
  }),
];

export default ExtensionKit;

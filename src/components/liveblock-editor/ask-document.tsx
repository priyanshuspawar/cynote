"use client";
import React, { useEffect, useRef, useState } from "react";
import type { BlockNoteEditor } from "@blocknote/core";
import Markdown from "react-markdown";
import { Loader2, SendHorizontal, Sparkles } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Turn = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Summarize this document",
  "What are the action items?",
  "Suggest a better title",
];

// Chat about the open document. The worker answers from the document's
// Markdown only, and the same daily AI budget applies.
export default function AskDocument({ editor }: { editor: BlockNoteEditor<any, any, any> }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [question, setQuestion] = useState("");
  const [pending, setPending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, pending]);

  const ask = async (q: string) => {
    const text = q.trim();
    if (!text || pending) return;
    setQuestion("");
    const history = turns;
    setTurns([...history, { role: "user", content: text }]);
    setPending(true);
    let answer: string;
    try {
      const documentData = await editor.blocksToMarkdownLossy(editor.document);
      const res = await fetch(`${process.env.NEXT_PUBLIC_EDITOR_GPT_URL}/chatToDocument`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentData, question: text, history }),
      });
      const body = await res.json().catch(() => null);
      answer = res.ok
        ? body?.message || "I couldn't find an answer in this document."
        : body?.error?.message || "The AI could not answer right now. Please try again.";
    } catch {
      answer = "Couldn't reach the AI. Check your connection and try again.";
    }
    setTurns((t) => [...t, { role: "assistant", content: answer }]);
    setPending(false);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-6 right-6 z-40 gap-2 rounded-full shadow-lg"
        >
          <Sparkles size={16} /> Ask this document
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles size={18} /> Ask this document
          </SheetTitle>
          <SheetDescription>
            Answers come from this document only.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto flex flex-col gap-3 py-4">
          {turns.length === 0 && (
            <div className="flex flex-col gap-2">
              {SUGGESTIONS.map((s) => (
                <Button
                  key={s}
                  variant="secondary"
                  size="sm"
                  className="justify-start"
                  onClick={() => ask(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          )}
          {turns.map((t, i) =>
            t.role === "user" ? (
              <p key={i} className="self-end max-w-[85%] rounded-lg bg-primary/20 px-3 py-2 text-sm">
                {t.content}
              </p>
            ) : (
              <div
                key={i}
                className="max-w-[95%] rounded-lg bg-muted px-3 py-2 text-sm prose prose-sm dark:prose-invert"
              >
                {/* the model sometimes echoes "- [ ] task"; render those as plain bullets */}
                <Markdown>{t.content.replace(/^(\s*[-*]\s+)\[[ xX]\]\s*/gm, "$1")}</Markdown>
              </div>
            )
          )}
          {pending && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 size={14} className="animate-spin" /> Reading the document…
            </p>
          )}
          <div ref={bottomRef} />
        </div>

        <form
          className="flex gap-2 pt-2 border-t"
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
        >
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about this document…"
            disabled={pending}
          />
          <Button type="submit" size="icon" disabled={pending || !question.trim()}>
            <SendHorizontal size={16} />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

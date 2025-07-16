"use client";
import * as Y from "yjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import React, { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { LanguagesIcon } from "lucide-react";
import { toast } from "sonner";
import MarkDown from "react-markdown";

type Language =
  | "english"
  | "spanish"
  | "portuguese"
  | "german"
  | "hindi"
  | "japanese";

const Languages: Language[] = [
  "english",
  "spanish",
  "portuguese",
  "german",
  "hindi",
  "japanese",
];

const TranslateDocument = ({ doc }: { doc: Y.Doc }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<string>("");
  const [Summary, setSummary] = useState("");
  const [isPending, startTransition] = useTransition();
  const [question, setQuestion] = useState("");

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const documentData = doc.get("document-store").toJSON();
      const res = await fetch(
        `https://notion-clone-cloudflare-workers.priyanshusingh306.workers.dev/translateDocument`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentData,
            targetLang: language,
          }),
        }
      );

      if (res.ok) {
        const { translated_text } = await res.json();
        setSummary(translated_text);
        toast("Translated Summary");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <LanguagesIcon />
          Translate
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Document Translation</DialogTitle>
          <DialogDescription>Get Your document translated</DialogDescription>
          {question && <p className="mt-5 text-gray">Q:{question}</p>}
        </DialogHeader>

        {Summary && (
          <div className="flex flex-col items-start max-h-96 overflow-y-auto gap-2 p-5">
            <div className="flex">
              <span className="font-bold">AI</span>
              <p className="ml-2">
                {isPending ? "Translating..." : <MarkDown>{Summary}</MarkDown>}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {Languages.map((language) => (
                <SelectItem key={language} value={language}>
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={!language || isPending}>
            {isPending ? "Translating..." : "Translate"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TranslateDocument;

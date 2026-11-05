"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Folder, Home, Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { getWorkspaceIndex } from "@/lib/supabase/queries";

type Index = NonNullable<Awaited<ReturnType<typeof getWorkspaceIndex>>["data"]>;

// ⌘K / Ctrl+K: jump to any folder or file in the current workspace.
export default function CommandPalette({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<Index | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Prefetch on mount so the first ⌘K is instant, then refresh on every open so
  // new or renamed items show up; each open starts with an empty search.
  useEffect(() => {
    if (open) setQuery("");
    getWorkspaceIndex(workspaceId).then(({ data }) => data && setIndex(data));
  }, [open, workspaceId]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  const folderTitle = (id: string) =>
    index?.folders.find((f) => f.id === id)?.title ?? "";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-md border border-border/60 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Search size={16} />
        <span className="flex-1 text-left">Search</span>
        <kbd className="rounded bg-muted px-1.5 text-[10px] font-medium">Ctrl K</kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search folders and files…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>{index ? "No matching folders or files." : "Loading…"}</CommandEmpty>
          <CommandGroup heading="Go to">
            <CommandItem value="workspace-home" keywords={["home", "workspace", "dashboard"]} onSelect={() => go(`/dashboard/${workspaceId}`)}>
              <Home className="mr-2" /> Workspace home
            </CommandItem>
          </CommandGroup>
          {!!index?.folders.length && (
            <CommandGroup heading="Folders">
              {index.folders.map((f) => (
                <CommandItem
                  key={f.id}
                  value={`folder-${f.id}`}
                  keywords={[f.title]}
                  onSelect={() => go(`/dashboard/${workspaceId}/${f.id}`)}
                >
                  <Folder className="mr-2" /> {f.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {!!index?.files.length && (
            <CommandGroup heading="Files">
              {index.files.map((f) => (
                <CommandItem
                  key={f.id}
                  value={`file-${f.id}`}
                  keywords={[f.title, folderTitle(f.folderId)]}
                  onSelect={() =>
                    go(`/dashboard/${workspaceId}/${f.folderId}/${f.folderId}folder${f.id}`)
                  }
                >
                  <FileText className="mr-2" /> {f.title}
                  <CommandShortcut>{folderTitle(f.folderId)}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

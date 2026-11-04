"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import CustomDialogTrigger from "../global/customDialogTrigger";
import { Button } from "../ui/button";
import { getTrashedItems } from "@/lib/supabase/queries";
import { useAppSelector } from "@/redux/hooks";
import {
  useDeleteFolderMutation,
  useUpdateFolderMutation,
} from "@/redux/services/folderApi";
import {
  useDeleteFileMutation,
  useUpdateFileMutation,
} from "@/redux/services/fileApi";

type TrashData = NonNullable<
  Awaited<ReturnType<typeof getTrashedItems>>["data"]
>;

const TrashContent = () => {
  const { workspaceId } = useAppSelector((s) => s.selectedEntities);
  const [trash, setTrash] = useState<TrashData | null>(null);
  const [updateFolder] = useUpdateFolderMutation();
  const [deleteFolder] = useDeleteFolderMutation();
  const [updateFile] = useUpdateFileMutation();
  const [deleteFile] = useDeleteFileMutation();

  const load = useCallback(async () => {
    if (!workspaceId) return;
    const { data, error } = await getTrashedItems(workspaceId);
    if (error) toast.error(error);
    setTrash(data);
  }, [workspaceId]);

  useEffect(() => {
    load();
  }, [load]);

  // the RTK mutations keep the sidebar and open pages in sync
  const run = async (action: Promise<unknown>, message: string) => {
    const result = (await action) as { error?: unknown };
    if (result?.error) toast.error("Something went wrong, please try again.");
    else toast.success(message);
    load();
  };
  const confirmDelete = (title: string) =>
    window.confirm(`Delete "${title}" forever? This can't be undone.`);

  if (!trash) return <p className="text-muted-foreground text-sm">Loading…</p>;
  if (!trash.folders.length && !trash.files.length)
    return <p className="text-muted-foreground text-sm">Trash is empty.</p>;

  const row = (
    key: string,
    icon: string,
    title: string,
    href: string,
    onRestore: () => void,
    onDelete: () => void
  ) => (
    <li key={key} className="flex items-center gap-2 py-1">
      <Link href={href} className="flex-1 truncate hover:underline">
        {icon} {title}
      </Link>
      <Button size="sm" variant="ghost" onClick={onRestore} title="Restore">
        <RotateCcw size={16} />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="text-red-500"
        onClick={onDelete}
        title="Delete forever"
      >
        <Trash2 size={16} />
      </Button>
    </li>
  );

  return (
    <div className="flex flex-col gap-4">
      {!!trash.folders.length && (
        <section>
          <h3 className="text-sm text-muted-foreground mb-1">Folders</h3>
          <ul>
            {trash.folders.map((f) =>
              row(
                f.id,
                f.iconId,
                f.title,
                `/dashboard/${workspaceId}/${f.id}`,
                () =>
                  run(
                    updateFolder({
                      folderId: f.id,
                      updatedData: { inTrash: null, workspaceId: workspaceId! },
                    }),
                    "Folder restored"
                  ),
                () =>
                  confirmDelete(f.title) &&
                  run(deleteFolder(f.id), "Folder deleted forever")
              )
            )}
          </ul>
        </section>
      )}
      {!!trash.files.length && (
        <section>
          <h3 className="text-sm text-muted-foreground mb-1">Files</h3>
          <ul>
            {trash.files.map((f) =>
              row(
                f.id,
                f.iconId,
                f.title,
                `/dashboard/${workspaceId}/${f.folderId}/${f.folderId}folder${f.id}`,
                () =>
                  run(
                    updateFile({
                      fileId: f.id,
                      updatedData: { inTrash: null, folderId: f.folderId },
                    }),
                    "File restored"
                  ),
                () =>
                  confirmDelete(f.title) &&
                  run(deleteFile(f.id), "File deleted forever")
              )
            )}
          </ul>
        </section>
      )}
    </div>
  );
};

const Trash = ({ children }: { children: React.ReactNode }) => (
  <CustomDialogTrigger
    header="Trash"
    description="Restore items or delete them forever."
    content={<TrashContent />}
  >
    {children}
  </CustomDialogTrigger>
);

export default Trash;

import { Folder } from "@/lib/supabase/supabase.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Edit, Share2, Trash2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { getFolderColor } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { Separator } from "../ui/separator";
import EmojiPicker from "../global/emojiPicker";
import { AlertDialogHeader, AlertDialogFooter } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useState } from "react";

type Props = {
  folder: Folder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateFolder: (updates: Partial<Folder>) => void;
  onDeleteFolder: () => void;
};

const FolderManagementDialog = ({
  folder,
  open,
  onOpenChange,
  onUpdateFolder,
  onDeleteFolder,
}: Props) => {
  const [folderName, setFolderName] = useState(folder.title);
  const [selectedIcon, setSelectedIcon] = useState(folder.iconId);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  const handleSave = () => {
    onUpdateFolder({
      title: folderName,
      iconId: selectedIcon,
    });
  };

  const handleDelete = () => {
    onDeleteFolder();
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Manage Folder
          </DialogTitle>
          <DialogDescription>
            Update folder settings, sharing permissions, or delete the folder.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Folder Info */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name..."
              />
            </div>

            <div className="grid gap-2">
              <Label>Folder Icon</Label>
              <div className="grid grid-cols-10 gap-2">
                <EmojiPicker getValue={setSelectedIcon}>
                  <Button>{selectedIcon}</Button>
                </EmojiPicker>
              </div>
              s
            </div>

            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <span className="text-sm">Preview:</span>
              <div
                className="w-8 h-8 rounded flex items-center justify-center font-semibold"
                style={{ backgroundColor: getFolderColor(selectedIcon) }}
              >
                {selectedIcon}
              </div>
              <span className="font-medium">{folderName || "Folder Name"}</span>
            </div>
          </div>

          <Separator />

          {/* Sharing Settings */}
          {/* <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Folder Sharing
                </Label>
                <p className="text-sm text-gray-500">
                  Allow others to access this folder
                </p>
              </div>
              <Switch checked={isShared} onCheckedChange={setIsShared} />
            </div>
          </div> */}

          <Separator />

          {/* Folder Stats */}
          <div className="space-y-2">
            <Label>Folder Statistics</Label>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {/* <div className="flex justify-between">
                <span className="text-gray-600">Files:</span>
                <span className="font-medium">{folder.fileCount}</span>
              </div> */}
              <div className="flex justify-between">
                <span className="">Created:</span>
                <span className="font-medium">
                  {formatDate(folder.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="">Modified:</span>
                <span className="font-medium">
                  {formatDate(folder.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Folder
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Folder</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{folder.title}&quot;?
                  This action cannot be undone and will permanently delete all
                  files in this folder.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Folder
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={!folderName.trim()}>
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FolderManagementDialog;

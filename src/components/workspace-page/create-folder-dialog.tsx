import { useState } from "react";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogFooter,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Folder } from "@/lib/supabase/supabase.types";
import { v4 } from "uuid";
import EmojiPicker from "../global/emojiPicker";
import { getFolderColor } from "@/lib/utils";
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateFolder: (folder: Folder) => void;
};
const CreateFolderDialog = ({ onOpenChange, open, onCreateFolder }: Props) => {
  const [folderName, setFolderName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onCreateFolder({
        bannerUrl: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: null,
        iconId: selectedIcon,
        id: v4(),
        inTrash: null,
        title: folderName,
        workspaceId: "spoof",
      });
      setFolderName("");
      setSelectedIcon("📁");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Create a new folder to organize your files. Choose a name, icon, and
            color.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name..."
                autoFocus
              />
            </div>

            <div className="grid gap-2">
              <Label>Folder Icon</Label>
              <div className="grid grid-cols-10 gap-2">
                <EmojiPicker getValue={setSelectedIcon}>
                  <Button>{selectedIcon}</Button>
                </EmojiPicker>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Preview:</span>
              <div
                className="w-8 h-8 rounded flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: getFolderColor(selectedIcon) }}
              >
                {selectedIcon}
              </div>
              <span className="font-medium">{folderName || "Folder Name"}</span>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!folderName.trim()}>
              Create Folder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderDialog;

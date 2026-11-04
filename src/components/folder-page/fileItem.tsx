import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2, CirclePlus, ExternalLink, RotateCcw } from "lucide-react";
import { useUpdateFileMutation } from "@/redux/services/fileApi";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { File, Tag } from "@/lib/supabase/supabase.types"; // Adjust the import based on your file structure

interface FileItemProps {
  file: File & {
    tags: Tag[];
  };
  viewMode: "list" | "grid";
  selected: boolean;
  onSelect: (selected: boolean) => void;
  onAddTags: () => void;
}

export function FileItem({
  file,
  viewMode,
  selected,
  onSelect,
  onAddTags,
}: FileItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { user } = useSupabaseUser();
  const [updateFile] = useUpdateFileMutation();
  const href = `/dashboard/${file.workspaceId}/${file.folderId}/${file.folderId}folder${file.id}`;
  const toggleTrash = () =>
    updateFile({
      fileId: file.id,
      updatedData: {
        inTrash: file.inTrash ? null : `Deleted by ${user?.email}`,
        folderId: file.folderId,
      },
    });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // List view
  return (
    <div
      className={`group flex items-center w-full p-3 rounded-lg transition-colors cursor-pointer ${
        selected ? "bg-popover" : ""
      }`}
      onClick={() => router.push(href)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Checkbox
        checked={selected}
        onCheckedChange={onSelect}
        onClick={(e) => e.stopPropagation()}
        className="mr-4"
      />

      <div className="flex-1 flex items-center min-w-0">
        {/* Name & Tags */}
        <div className="flex items-center gap-3 min-w-0 w-4/6">
          <span className="text-xl">{file.iconId}</span>
          <div className="min-w-0">
            <div className="font-medium truncate">
              {file.title}
              {file.inTrash && (
                <Badge variant="outline" className="ml-2 text-red-500 border-red-500">
                  In trash
                </Badge>
              )}
            </div>
            {file.tags.length > 0 && (
              <div className="flex gap-1 mt-1">
                {file.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="border cursor-pointer"
                    style={{
                      backgroundColor: `${tag.color}20`,
                      color: tag.color ?? undefined,
                      borderColor: tag.color ?? undefined,
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
                {file.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{file.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* createdAt */}
        <div className="text-sm text-gray-500 ml-6 whitespace-nowrap">
          {formatDate(new Date(file.createdAt))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center ml-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => router.push(href)}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onAddTags}>
              <CirclePlus className="h-4 w-4 mr-2" />
              Add Tags
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {file.inTrash ? (
              <DropdownMenuItem onClick={toggleTrash}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Restore
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="text-red-600" onClick={toggleTrash}>
                <Trash2 className="h-4 w-4 mr-2" />
                Move to Trash
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

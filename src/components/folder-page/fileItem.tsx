import { useState } from "react";
import {
  Star,
  MoreHorizontal,
  Download,
  Trash2,
  Edit,
  Copy,
  CirclePlus,
} from "lucide-react";
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
}

export function FileItem({
  file,
  viewMode,
  selected,
  onSelect,
}: FileItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (viewMode === "grid") {
    return (
      <div
        className={`relative group border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
          selected
            ? "ring-2 ring-blue-500 bg-blue-50"
            : "bg-white hover:bg-gray-50"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Selection Checkbox */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Checkbox
            checked={selected}
            onCheckedChange={onSelect}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Star Button */}
        {/* <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar();
            }}
            className={`h-8 w-8 p-0 ${
              file.starred
                ? "text-yellow-500"
                : "text-gray-400 opacity-0 group-hover:opacity-100"
            } transition-opacity`}
          >
            <Star className={`h-4 w-4 ${file.starred ? "fill-current" : ""}`} />
          </Button>
        </div> */}

        {/* File Icon */}
        <div className="text-center mb-3">
          <div className="text-4xl mb-2">{file.iconId}</div>
          <div className="text-sm font-medium truncate">{file.title}</div>
        </div>

        {/* File Info */}
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Created At</span>
            <span>{formatDate(new Date(file.createdAt))}</span>
          </div>
        </div>

        {/* Tags */}
        {/* {file.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {file.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {file.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{file.tags.length - 2}
              </Badge>
            )}
          </div>
        )} */}

        {/* Actions Menu */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }
  console.log(file.tags);
  // List view
  return (
    <div
      className={`group flex items-center gap-4 p-3 rounded-lg transition-colors cursor-pointer ${
        selected ? "bg-popover" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Checkbox
        checked={selected}
        onCheckedChange={onSelect}
        onClick={(e) => e.stopPropagation()}
      />

      <div className="flex-1 grid grid-cols-12 gap-4 items-center">
        {/* Name */}
        <div className="col-span-5 flex items-center gap-3">
          <span className="text-xl">{file.iconId}</span>
          <div className="min-w-0">
            <div className="font-medium truncate">{file.title}</div>
            {file.tags.length > 0 && (
              <div className="flex gap-1 mt-1">
                {file.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className={`text-xs border !bg-[${tag.color}+20] !text-[${tag.color}] !border-[${tag.color}]`}
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
        <div className="col-span-2 text-sm">
          {formatDate(new Date(file.createdAt))}
        </div>

        {/* Actions */}
        <div className="col-span-1 flex items-center gap-1">
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar();
            }}
            className={`h-8 w-8 p-0 ${
              file.starred
                ? "text-yellow-500"
                : "text-gray-400 opacity-0 group-hover:opacity-100"
            } transition-opacity`}
          >
            <Star className={`h-4 w-4 ${file.starred ? "fill-current" : ""}`} />
          </Button> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {}}>
                <CirclePlus className="h-4 w-4 mr-2" />
                Add Tags
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

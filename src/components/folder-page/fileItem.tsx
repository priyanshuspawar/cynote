import { useState } from "react";
import {
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
            <div className="font-medium truncate">{file.title}</div>
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
  );
}

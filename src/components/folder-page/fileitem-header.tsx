import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { ArrowUpDown } from "lucide-react";

interface FileListHeaderProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: (selected: boolean) => void;
  allSelected: boolean;
  onSort: (column: string) => void;
  sortColumn: string;
  sortDirection: "asc" | "desc";
}

function FileListHeader({
  selectedCount,
  totalCount,
  onSelectAll,
  allSelected,
  onSort,
  sortColumn,
  sortDirection,
}: FileListHeaderProps) {
  return (
    <div className="sticky top-0 border-b z-10">
      <div className="flex items-center px-3 py-2 text-sm font-medium ">
        <div className="flex items-center mr-4">
          <Checkbox
            checked={allSelected}
            onCheckedChange={onSelectAll}
            className="mr-2"
          />
          <span className="text-xs">
            {selectedCount > 0
              ? `${selectedCount} selected`
              : `${totalCount} files`}
          </span>
        </div>

        {/* Header columns - responsive */}
        <div className="flex-1 flex items-center">
          {/* Name column */}
          <div className="flex items-center gap-1 min-w-0 w-full md:w-4/6">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 font-medium"
              onClick={() => onSort("name")}
            >
              Name
              <ArrowUpDown className="h-3 w-3 ml-1" />
            </Button>
          </div>

          {/* Date column - hidden on mobile */}
          <div className="hidden md:flex items-center gap-1 min-w-0 w-1/6">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 font-medium"
              onClick={() => onSort("date")}
            >
              Date
              <ArrowUpDown className="h-3 w-3 ml-1" />
            </Button>
          </div>

          {/* Actions column */}
          <div className="flex items-center justify-end w-16">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 font-medium"
            >
              Actions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileListHeader;

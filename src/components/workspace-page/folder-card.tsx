import { useState } from "react";
import {
  MoreHorizontal,
  Users,
  Clock,
  FolderOpen,
  Settings,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Folder } from "@/lib/supabase/supabase.types";
import { useAppSelector } from "@/redux/hooks";
import { getFolderColor } from "@/lib/utils";
import { formatTimeAgo } from "@/lib/utils";
interface FolderCardProps {
  folder: Folder;
  viewMode: "grid" | "list";
  onManage: () => void;
}

export function FolderCard({ folder, viewMode, onManage }: FolderCardProps) {
  const { selectedWorkspace } = useAppSelector(
    (state) => state.selectedEntities
  );
  const [isHovered, setIsHovered] = useState(false);

  // Generate a color based on iconId if no color is provided

  if (!selectedWorkspace) return null;
  if (viewMode === "list") {
    return (
      <Card
        className="hover:shadow-md transition-all cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/dashboard/${selectedWorkspace.id}/${folder.id}`}
              className="flex items-center gap-4 flex-1"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-semibold"
                style={{ backgroundColor: getFolderColor(folder.iconId) }}
              >
                {folder.iconId}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{folder.title}</h4>
                  {selectedWorkspace?.isShared && (
                    <Badge variant="secondary" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      Shared
                    </Badge>
                  )}
                </div>
              </div>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  } transition-opacity`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/${selectedWorkspace.id}/${folder.id}`}
                  >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Open Folder
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onManage}>
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card
      className="hover:shadow-md transition-all cursor-pointer group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6">
        <Link href={`/dashboard/${selectedWorkspace.id}/${folder.id}`}>
          <div className="text-center mb-4">
            <div
              className="w-16 h-16 rounded-xl mx-auto mb-3 flex items-center justify-center text-2xl font-semibold"
              style={{ backgroundColor: getFolderColor(folder.iconId) }}
            >
              {folder.iconId}
            </div>
            <h4 className="font-medium  truncate mb-1">{folder.title}</h4>
            <div className="flex items-center justify-center gap-2 mb-2">
              {selectedWorkspace.isShared && (
                <Badge variant="secondary" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  Shared
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Created</span>
              <span>{formatTimeAgo(new Date(folder.createdAt))}</span>
            </div>
            <div className="flex justify-between">
              <span>Modified</span>
              <span>{formatTimeAgo(new Date(folder.updatedAt))}</span>
            </div>
          </div>
        </Link>

        <div
          className={`absolute top-2 right-2 ${
            isHovered ? "opacity-100" : "opacity-0"
          } transition-opacity`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${selectedWorkspace.id}/${folder.id}`}>
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Open Folder
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onManage}>
                <Settings className="h-4 w-4 mr-2" />
                Manage
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

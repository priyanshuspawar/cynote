"use client";

import {
  Users,
  Crown,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  UserPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatTimeAgo } from "@/lib/utils";
import type { CollabUser } from "@/redux/services/workspaceApi";
import { useAppSelector } from "@/redux/hooks";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { useMemo } from "react";

interface CollaboratorsCardProps {
  collaborators: CollabUser[];
  onInviteCollaborator?: () => void;
}

export function CollaboratorsCard({ collaborators }: CollaboratorsCardProps) {
  const { selectedWorkspace } = useAppSelector(
    (state) => state.selectedEntities
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Owner":
        return <Crown className="h-3 w-3" />;
      case "Editor":
        return <Edit className="h-3 w-3" />;
      case "Viewer":
        return <Eye className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  const { user } = useSupabaseUser();
  //   const onlineCollaborators = collaborators.filter((c) => c.isOnline);
  //   const offlineCollaborators = collaborators.filter((c) => !c.isOnline);
  const isOwner = useMemo(() => {
    if (user?.id === selectedWorkspace?.workspaceOwner) {
      return true;
    }
    return false;
  }, [user, selectedWorkspace]);
  if (!user || !selectedWorkspace) return;
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Collaborators
            <Badge variant="secondary" className="text-xs">
              {collaborators.length}
            </Badge>
          </CardTitle>
          {/* <Button
            size="sm"
            variant="outline"
            onClick={onInviteCollaborator}
            className="h-8 bg-transparent"
          >
            <UserPlus className="h-3 w-3 mr-1" />
            Invite
          </Button> */}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {collaborators.length === 0 ? (
          <div className="text-center py-6 ">
            <Users className="h-8 w-8 mx-auto mb-2 " />
            <p className="text-sm mb-2">
              No collaborators yet add peoples throught workspace setting
            </p>
          </div>
        ) : (
          <>
            {/* Online Collaborators */}
            {collaborators.length > 0 && (
              <div className="space-y-3">
                {/* <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Online ({onlineCollaborators.length})
                  </span>
                </div> */}
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center gap-3 p-2 rounded-lg group"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={collaborator.avatarUrl || "/placeholder.svg"}
                          alt={
                            collaborator.fullName ??
                            collaborator.email ??
                            "user"
                          }
                        />
                        <AvatarFallback className="text-xs">
                          {getInitials(
                            collaborator.fullName ?? collaborator.email ?? "CY"
                          )}
                        </AvatarFallback>
                      </Avatar>
                      {/* <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div> */}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium  truncate">
                          {collaborator.fullName || collaborator.email}
                        </span>
                        {collaborator.id ===
                          selectedWorkspace.workspaceOwner && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge
                                  variant="outline"
                                  className={`text-xs border flex items-center gap-1 !bg-yellow-100 !text-yellow-800 !border-yellow-200`}
                                >
                                  {getRoleIcon("Owner")}
                                  {"Owner"}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{collaborator.email}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <p className="text-xs truncate">
                        Added {formatTimeAgo(new Date(collaborator.joinedAt))}
                      </p>
                    </div>
                    {isOwner && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="text-red-600">
                            Remove Access
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

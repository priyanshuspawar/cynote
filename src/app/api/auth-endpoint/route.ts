import liveblocks from "@/lib/liveblocks";
import db from "@/lib/supabase/db";
import { createClient } from "@/lib/supabase/helpers/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  console.log("Liveblocks auth endpoint hit");
  // Get authenticated user
  const { data, error: authError } = await supabase.auth.getUser();
  const user = data.user;
  if (authError || !user?.id) {
    return new Response(null, { status: 401 });
  }

  const { room } = await req.json();

  const session = liveblocks.prepareSession(user.email!, {
    userInfo: {
      email: user.email!,
      avatar:
        user.user_metadata?.avatar_url ||
        "https://www.gravatar.com/avatar/?d=mp",
    },
  });

  // Find the file (document/block)
  const file = await db.query.files.findFirst({
    where: (table, { eq }) => eq(table.id, room),
  });

  if (!file) return new Response(null, { status: 404 });

  // Check if user owns the workspace
  const workspace = await db.query.workspaces.findFirst({
    where: (fields, { eq }) => eq(fields.id, file.workspaceId),
  });

  if (!workspace) return new Response(null, { status: 404 });

  // Workspace owner? Full access.
  if (workspace.workspaceOwner === user.id) {
    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();
    return new Response(body, { status });
  }

  // Collaborator? Full access.
  const isUserCollaborator = await db.query.collaborators.findFirst({
    where: (table, { eq, and }) =>
      and(eq(table.userId, user.id), eq(table.workspaceId, file.workspaceId)),
  });

  if (!isUserCollaborator) return new Response(null, { status: 403 });

  session.allow(room, session.FULL_ACCESS);
  const { body, status } = await session.authorize();
  return new Response(body, { status });
}

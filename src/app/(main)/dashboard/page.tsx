import DashboardSetup from "@/components/dashboard/DashboardSetup";
import db from "@/lib/supabase/db";
import { createClient } from "@/lib/supabase/helpers/server";
import { redirect } from "next/navigation";
import React from "react";
import { BETA_PRO_SUBSCRIPTION } from "@/lib/constants";

const DashboardPage = async () => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const { user } = data;
  if (!user) return;
  const workspace =
    (await db.query.workspaces.findFirst({
      where: (table, { eq }) => eq(table.workspaceOwner, user.id),
    })) ??
    // invited users with no workspace of their own land in the one they were added to
    (await db.query.collaborators.findFirst({
      where: (table, { eq }) => eq(table.userId, user.id),
      columns: { workspaceId: true },
    }).then((c) => (c ? { id: c.workspaceId } : undefined)));

  if (!workspace) {
    return (
      <div className="bg-background h-screen w-screen flex justify-center items-center">
        <DashboardSetup user={user} subscription={BETA_PRO_SUBSCRIPTION} />
      </div>
    );
  }
  redirect(`/dashboard/${workspace.id}`);
};

// const DashboardPage = () => {
//   return (
//     <div>
//       page
//       {/* <DashboardSetup user={user} subscription={subscription}/> */}
//     </div>
//   );
// };

export default DashboardPage;

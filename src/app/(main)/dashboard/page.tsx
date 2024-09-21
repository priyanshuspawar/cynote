import DashboardSetup from "@/components/dashboard/DashboardSetup";
import db from "@/lib/supabase/db";
import { createClient } from "@/lib/supabase/helpers/server";
import { redirect } from "next/navigation";
import React from "react";

const DashboardPage = async () => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const { user } = data;
  if (!user) return;
  const workspace = await db.query.workspaces.findFirst({
    where: (table, { eq }) => eq(table.workspaceOwner, user.id),
  });

  // TODO: check web progies git  subscription logic
  if (!workspace) {
    return (
      <div className="bg-background h-screen w-screen flex justify-center items-center">
        <DashboardSetup user={user} subscription={null} />
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

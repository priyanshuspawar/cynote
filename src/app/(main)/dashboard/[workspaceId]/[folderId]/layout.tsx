import LiveBlockProvider from "@/lib/providers/live-blocks-provider";
import { getFolderDetails } from "@/lib/supabase/queries";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LiveBlockProvider>{children}</LiveBlockProvider>;
}

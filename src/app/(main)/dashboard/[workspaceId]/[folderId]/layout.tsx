import LiveBlockProvider from "@/lib/providers/live-blocks-provider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LiveBlockProvider>{children}</LiveBlockProvider>;
}

import LiveBlockProvider from "@/lib/providers/live-blocks-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LiveBlockProvider>{children}</LiveBlockProvider>;
}

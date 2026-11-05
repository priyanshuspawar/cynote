"use client";
import { LiveblocksProvider } from "@liveblocks/react/suspense";

function LiveBlockProvider({ children }: { children: React.ReactNode }) {
  // Auth goes through /api/auth-endpoint (LIVEBLOCKS_PRIVATE_KEY, server-side),
  // so no public key is needed here. The old check crashed every folder and
  // file page in the browser when NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY was unset.
  return (
    <LiveblocksProvider authEndpoint={"/api/auth-endpoint"} throttle={16}>
      {children}
    </LiveblocksProvider>
  );
}

export default LiveBlockProvider;

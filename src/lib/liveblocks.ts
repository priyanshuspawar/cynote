import { Liveblocks } from "@liveblocks/node";

// Created on first request, not at import: `next build` loads route modules
// while collecting page data, and the secret only needs to exist at runtime.
let client: Liveblocks | undefined;

export const getLiveblocks = () => {
  const secret = process.env.LIVEBLOCKS_PRIVATE_KEY;
  if (!secret) throw new Error("LIVEBLOCKS_PRIVATE_KEY is not set");
  return (client ??= new Liveblocks({ secret }));
};

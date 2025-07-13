"use client";

import FollowPointer from "@/components/follow-pointer";
import { useMyPresence, useOthers } from "@liveblocks/react/suspense";
import { PointerEvent } from "react";

function LiveCursorRenderer({ children }: { children: React.ReactNode }) {
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const cursor = { x: Math.floor(e.pageX), y: Math.floor(e.pageY) };
    updateMyPresence({ cursor });
  };

  const handlePointerLeave = () => {
    //@ts-ignore
    updateMyPresence({ cursor: null });
  };

  return (
    <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      {others
        .filter((other) => !!other.presence.cursor)
        .map(({ connectionId, presence, info }) => (
          <FollowPointer
            key={connectionId}
            x={presence.cursor.x}
            y={presence.cursor.y}
            info={info}
          />
        ))}
      {children}
    </div>
  );
}

export default LiveCursorRenderer;

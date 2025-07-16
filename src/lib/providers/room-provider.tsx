"use client";
import {
  ClientSideSuspense,
  RoomProvider as RoomProviderWrapper,
} from "@liveblocks/react/suspense";
import LiveCursorRenderer from "./live-cursor-provider";
import Loader from "@/components/global/Loader";

function RoomProvider({
  roomId,
  children,
}: {
  roomId: string;
  children: React.ReactNode;
}) {
  return (
    <RoomProviderWrapper
      id={roomId}
      initialPresence={{
        // @ts-ignore
        cursor: null,
      }}
    >
      <ClientSideSuspense
        fallback={
          <div className="w-full h-full items-center justify-center">
            <Loader />
          </div>
        }
      >
        <LiveCursorRenderer>{children}</LiveCursorRenderer>
      </ClientSideSuspense>
    </RoomProviderWrapper>
  );
}

export default RoomProvider;

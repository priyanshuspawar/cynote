import { TooltipProvider } from "@/components/ui/tooltip";
import RoomProvider from "@/lib/providers/room-provider";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { fileId: string };
}) {
  const fileId = params.fileId.split("folder")[1];
  return (
    <RoomProvider roomId={fileId}>
      <TooltipProvider>{children}</TooltipProvider>
    </RoomProvider>
  );
}

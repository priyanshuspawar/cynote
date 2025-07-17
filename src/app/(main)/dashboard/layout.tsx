import React from "react";
import { UserProvider } from "@/lib/providers/colab-user-provider";
type LayoutProps = {
  children: React.ReactNode;
  params: any;
};

const MainLayout = ({ children, params }: LayoutProps) => {
  return (
    <main className="flex h-screen">
      <UserProvider>{children}</UserProvider>
    </main>
  );
};

export default MainLayout;

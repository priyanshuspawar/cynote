"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

interface LogoutButtonProps {
  children: React.ReactNode;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ children }) => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const logout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    //wip
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      className="p-0"
      onClick={logout}
      title="Logout"
    >
      {children}
    </Button>
  );
};

export default LogoutButton;

"use client";

import { AuthUser } from "@supabase/supabase-js";
import { Subscription } from "../supabase/supabase.types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getUserSubscriptionStatus } from "../supabase/queries";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "../supabase/helpers/client";
import { BETA_PRO_SUBSCRIPTION } from "../constants";

type SupabaseUserContextType = {
  user: AuthUser | null;
  subscription: Subscription | null;
};

const SupabaseUserContext = createContext<SupabaseUserContextType>({
  user: null,
  subscription: null,
});

export const useSupabaseUser = () => {
  return useContext(SupabaseUserContext);
};

interface SupabaseUserProviderProps {
  children: React.ReactNode;
}

const SupbaseUserProvider: React.FC<SupabaseUserProviderProps> = ({
  children,
}) => {
  const supabase = createClient();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const pathname = usePathname();
  // This provider lives in the root layout, so it isn't remounted when login,
  // sign-up or the demo navigate client-side. Re-read the session (a local cookie
  // read) on every navigation and reload the details only when the user changes;
  // otherwise pages saw a stale "no user" until a full refresh.
  useEffect(() => {
    let cancelled = false;
    const sync = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const next = session?.user ?? null;
      if (cancelled || next?.id === user?.id) return;
      setUser(next);
      if (!next) {
        setSubscription(null);
        return;
      }
      const { data, error } = await getUserSubscriptionStatus(next.id);
      if (cancelled) return;
      setSubscription(data ?? BETA_PRO_SUBSCRIPTION);
      if (error) {
        toast({
          title: "Unexpected error",
          description: "Oops! An unexpected error occurred, please try again",
        });
      }
    };
    sync();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  return (
    <SupabaseUserContext.Provider value={{ user, subscription }}>
      {children}
    </SupabaseUserContext.Provider>
  );
};
export default SupbaseUserProvider;

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { actionStartDemo } from "@/lib/server-actions/demoActions";

// One click into a private, pre-filled demo workspace; no sign-up form.
export default function DemoButton({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const start = async () => {
    setLoading(true);
    const { error, href } = await actionStartDemo().catch(() => ({
      error: "The demo is unavailable right now. Please sign up instead.",
      href: undefined,
    }));
    if (error || !href) {
      toast.error(error ?? "Something went wrong.");
      setLoading(false);
      return;
    }
    router.push(href);
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={start}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="mr-2 animate-spin" /> Setting up your demo…
        </>
      ) : (
        <>
          <Sparkles size={16} className="mr-2" /> Try the live demo
        </>
      )}
    </Button>
  );
}

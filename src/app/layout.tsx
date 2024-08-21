import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
// import db from "@/lib/supabase/db";
import { ThemeProvider } from "@/lib/providers/next-theme-provider";
import { twMerge } from "tailwind-merge";
import AppStateProvider from "@/lib/providers/state-provider";
import { Toaster } from "@/components/ui/toaster";
import SupabaseUserProvider from '@/lib/providers/supabase-user-provider' 
const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cynote",
  description: "Colaborative realtime workflow management app",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // console.log(db);
  return (
    <html lang="en">
      <body className={twMerge(dmSans.className,"bg-background")}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AppStateProvider>
          <SupabaseUserProvider>
          {children}
          <Toaster />
          </SupabaseUserProvider>
          </AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
// import "./prosemirror.css";
// import db from "@/lib/supabase/db";
import "cal-sans";
import { Providers as ReduxProvider } from "@/redux/provider";
import "@fontsource/inter/100.css";
import "@fontsource/inter/200.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import { ThemeProvider } from "@/lib/providers/next-theme-provider";
import { twMerge } from "tailwind-merge";
import { Toaster } from "@/components/ui/toaster";
import SupabaseUserProvider from "@/lib/providers/supabase-user-provider";
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
      <body className={twMerge(dmSans.className, "bg-background")}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ReduxProvider>
            <SupabaseUserProvider>{children}</SupabaseUserProvider>
          </ReduxProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

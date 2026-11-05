import { createClient } from "@/lib/supabase/helpers/server";
import { NextRequest, NextResponse } from "next/server";

// exchanges a one-time auth code per request; must never be prerendered
export const dynamic = "force-dynamic";

const INVALID_LINK =
  "This confirmation link is invalid or has already been used. Please log in, or sign up again.";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const toLogin = (params: Record<string, string>) =>
    NextResponse.redirect(`${origin}/login?${new URLSearchParams(params)}`);

  // Supabase reports link errors here; on older flows they arrive only in the
  // #fragment (invisible to the server), which the login page reads instead.
  if (searchParams.get("error")) {
    return toLogin({ error: searchParams.get("error_description") || INVALID_LINK });
  }

  const code = searchParams.get("code");
  if (!code) return toLogin({ error: INVALID_LINK });

  const { error } = await createClient().auth.exchangeCodeForSession(code);
  if (error) {
    // Supabase only issues a code after verifying the email, so the address is
    // confirmed. This fails when the link is opened in a different browser
    // (no PKCE verifier cookie): the user just needs to log in.
    return toLogin({ message: "Your email is confirmed. Please log in to continue." });
  }
  return NextResponse.redirect(`${origin}/dashboard`);
}

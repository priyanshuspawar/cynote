"use server";

import { z } from "zod";
import { LoginFormSchema as FormSchema } from "../types";
import { createClient } from "../supabase/helpers/server";

export async function actionLoginUser({
  email,
  password,
}: z.infer<typeof FormSchema>) {
  const supabase = createClient();
  const { data: response, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { error: error ? { message: error.message } : null };
  }
  return { data: response };
  // revalidatePath("/", "layout");
  // redirect("/");
}

export async function actionSignUpUser({
  email,
  password,
}: z.infer<typeof FormSchema>) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // works whether NEXT_PUBLIC_SITE_URL has a trailing slash or not
      emailRedirectTo: new URL("/api/auth/callback", process.env.NEXT_PUBLIC_SITE_URL).toString(),
    },
  });
  // Return only serializable data. With "Confirm email" off, Supabase signs the
  // user in right away (a session exists); with it on, they must confirm first.
  return {
    error: error ? { message: error.message } : null,
    signedIn: !!data.session,
  };
}

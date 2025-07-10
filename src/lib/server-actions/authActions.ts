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
  console.log(email, password);
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}api/auth/callback`,
    },
  });
  // Return only serializable data
  return {
    error: error ? { message: error.message } : null,
  };
}

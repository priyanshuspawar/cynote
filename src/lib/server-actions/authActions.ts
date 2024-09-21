"use server";

import { z } from "zod";
import { LoginFormSchema as FormSchema } from "../types";
import { cookies } from "next/headers";
import { createClient } from "../supabase/helpers/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
    return { error: error };
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
  const response = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}api/auth/callback`,
    },
  });
  return response;
}

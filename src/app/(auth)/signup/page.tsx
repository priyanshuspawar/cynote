"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Logo from "../../../../public/cypresslogo.svg";
import Loader from "@/components/global/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MailCheck } from "lucide-react";
import { actionSignUpUser } from "@/lib/server-actions/authActions";

const SignUpFormSchema = z
  .object({
    email: z.string().describe("Email").email({ message: "Invalid Email" }),
    password: z
      .string()
      .describe("Password")
      .min(6, "Password must be minimum 6 characters"),
    confirmPassword: z
      .string()
      .describe("Confirm Password")
      .min(6, "Password must be minimum 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof SignUpFormSchema>;

const Signup = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState("");
  const [confirmation, setConfirmation] = useState(false);

  const codeExchangeError = useMemo(() => {
    if (!searchParams) return "";
    return searchParams.get("error_description");
  }, [searchParams]);

  const confirmationAndErrorStyles = useMemo(
    () =>
      clsx("bg-primary", {
        "bg-red-500/10": codeExchangeError,
        "border-red-500/50": codeExchangeError,
        "text-red-700": codeExchangeError,
      }),
    [codeExchangeError]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: SignUpFormData) => {
    console.log("Form data:", data); // This should now work

    try {
      const { error } = await actionSignUpUser({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setSubmitError(error.message);
        return;
      }

      setConfirmation(true);
    } catch (err) {
      console.error("Signup error:", err);
      setSubmitError("An unexpected error occurred");
    }
  };

  return (
    <div className="w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col">
      <Link href="/" className="w-full flex justify-left items-center">
        <Image src={Logo} alt="cypress Logo" width={50} height={50} />
        <span className="font-semibold dark:text-white text-4xl first-letter:ml-2">
          cypress.
        </span>
      </Link>

      <p className="text-foreground/60">
        An all-In-One Collaboration and Productivity Platform
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={() => {
          if (submitError) setSubmitError("");
        }}
        className="space-y-6"
      >
        {!confirmation && !codeExchangeError && (
          <>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                {...register("password")}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full p-6"
              disabled={isSubmitting}
            >
              {!isSubmitting ? "Create Account" : <Loader />}
            </Button>
          </>
        )}

        {submitError && <p className="text-sm text-red-500">{submitError}</p>}
      </form>

      <span className="self-container text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-primary">
          Login
        </Link>
      </span>

      {(confirmation || codeExchangeError) && (
        <Alert className={confirmationAndErrorStyles}>
          {!codeExchangeError && <MailCheck className="h-4 w-4" />}
          <AlertTitle>
            {codeExchangeError ? "Invalid Link" : "Check your email."}
          </AlertTitle>
          <AlertDescription>
            {codeExchangeError || "An email confirmation has been sent."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default Signup;

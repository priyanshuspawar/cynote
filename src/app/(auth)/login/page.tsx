"use client";
import { LoginFormSchema } from "@/lib/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../../public/cypresslogo.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/global/Loader";
import { actionLoginUser } from "@/lib/server-actions/authActions";

type LoginFormData = z.infer<typeof LoginFormSchema>;

const LoginPage = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (formData) => {
    console.log("Login form data:", formData); // This should now work

    try {
      const { error } = await actionLoginUser(formData);
      if (error) {
        reset();
        setSubmitError(error.message);
        return;
      }
      router.replace("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
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
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {submitError && <p className="text-sm text-red-500">{submitError}</p>}

        <Button
          type="submit"
          className="w-full p-6"
          size="lg"
          disabled={isSubmitting}
        >
          {!isSubmitting ? "Login" : <Loader />}
        </Button>
      </form>

      <span className="self-container text-center">
        Don&#39;t have an account?{" "}
        <Link href="/signup" className="text-primary">
          Sign Up
        </Link>
      </span>
    </div>
  );
};

export default LoginPage;

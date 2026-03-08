"use server";

import { signIn, signOut } from "@/server/auth";
import { createUser } from "@/server/auth/signup";

export async function signInCredentialsAction(
  email: string,
  password: string,
  callbackUrl?: string
) {
  await signIn("credentials", {
    email: email.trim().toLowerCase(),
    password,
    redirectTo: callbackUrl ?? "/dashboard",
    redirect: true,
  });
}

export async function createUserAction({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name?: string;
}) {
  if (!email?.trim() || !password) {
    throw new Error("Email and password are required.");
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }
  await createUser({
    email: email.trim(),
    password,
    name: name?.trim() || undefined,
  });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/", redirect: true });
}

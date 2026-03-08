/**
 * Auth.js - Main config and exports.
 * Used by app/api/auth/[...nextauth]/route.ts and middleware.
 */

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "./auth.config";
import { db } from "@/server/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});

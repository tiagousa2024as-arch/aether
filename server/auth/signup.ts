/**
 * Sign up - Create user with email/password and optional name.
 */

import { hash } from "bcryptjs";
import { db } from "@/server/db";

const isDbConnectionError = (err: unknown): boolean => {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("Can't reach database") ||
    msg.includes("connection refused") ||
    msg.includes("ECONNREFUSED") ||
    (typeof err === "object" && err !== null && "code" in err && (err as { code: string }).code === "P1001")
  );
};

export async function createUser({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name?: string;
}) {
  try {
    const normalized = email.toLowerCase().trim();
    const existing = await db.user.findUnique({
      where: { email: normalized },
    });
    if (existing) {
      throw new Error("An account with this email already exists.");
    }
    const hashed = await hash(password, 12);
    const user = await db.user.create({
      data: {
        email: normalized,
        password: hashed,
        name: name?.trim() || null,
      },
    });
    return { id: user.id, email: user.email, name: user.name };
  } catch (err) {
    if (isDbConnectionError(err)) {
      throw new Error(
        "Database is not available. Make sure PostgreSQL is running and DATABASE_URL in .env.local is correct."
      );
    }
    throw err;
  }
}

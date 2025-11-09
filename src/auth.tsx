import * as bcrypt from "bcrypt";
import crypto from "crypto";
import { db } from "./db";
import { users, sessions, SelectUser, SelectSession } from "./db/schema";
import { eq, and, gt, lt } from "drizzle-orm";
import { useRoute, MiddlewareFunction , Response, useSetContext} from "react-serve-js";
import { Request, NextFunction } from "express";
// Constants
const SALT_ROUNDS = 10;
const DEFAULT_SESSION_EXPIRY_DAYS = 7;
const SESSION_COOKIE_NAME = "session_token";

// Types
export type User = SelectUser;
export type Session = SelectSession;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(
  userId: number,
  expiresInDays: number = DEFAULT_SESSION_EXPIRY_DAYS
): Promise<Session> {
  const token = generateSessionToken();
  const expiresAt = Date.now() + expiresInDays * 24 * 60 * 60 * 1000;

  const [session] = await db
    .insert(sessions)
    .values({
      userId,
      token,
      expiresAt,
    })
    .returning();

  return session;
}

export async function validateSession(token: string): Promise<User | null> {
  if (!token) return null;

  const now = Date.now();

  const session = await db.query.sessions.findFirst({
    where: and(eq(sessions.token, token), gt(sessions.expiresAt, now)),
  });

  if (!session) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  });

  return user || null;
}

export async function deleteSession(token: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.token, token));
}

export async function cleanupExpiredSessions(): Promise<void> {
  const now = Date.now();
  await db.delete(sessions).where(lt(sessions.expiresAt, now));
}

export async function getCurrentUser(): Promise<User | null> {
  const { req } = useRoute();
  const token =
    req.cookies?.[SESSION_COOKIE_NAME] ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) return null;

  return validateSession(token);
}

export async function authMiddleware(req: Request, next: NextFunction) {
      const token =
        req.cookies?.[SESSION_COOKIE_NAME] ||
        req.headers.authorization?.replace("Bearer ", "");
      console.log(`[authMiddleware] token "${token}"`);
      if (!token) {
        return <Response status={401} json={{ error: "Unauthorized" }} />;
      }
      const user = await validateSession(token);
      if (!user) {
        return <Response status={401} json={{ error: "Unauthorized" }} />;
      }
      useSetContext("user", user)
      useSetContext("session_token", token)
      return  next();
}
export async function register(
  email: string,
  password: string
): Promise<{ user: User; session: Session }> {
  // Check if user already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const [user] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
    })
    .returning();

  // Create session
  const session = await createSession(user.id);

  return { user, session };
}

export async function login(
  email: string,
  password: string
): Promise<{ user: User; session: Session }> {
  // Find user
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Verify password
  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  // Create new session
  const session = await createSession(user.id);

  return { user, session };
}

export async function logout(token: string): Promise<void> {
  await deleteSession(token);
}

export function setSessionCookie(
  res: any,
  token: string,
  expiresInDays: number = DEFAULT_SESSION_EXPIRY_DAYS
): void {
  const maxAge = expiresInDays * 24 * 60 * 60 * 1000;
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
  });
}

export function clearSessionCookie(res: any): void {
  res.clearCookie(SESSION_COOKIE_NAME);
}

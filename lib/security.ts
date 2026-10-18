import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "harborbank_session";
const SESSION_HOURS = 8;
export function hashSecret(value: string) { return createHash("sha256").update(value).digest("hex"); }
export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  await prisma.session.create({ data: { tokenHash: hashSecret(token), userId, expiresAt } });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: expiresAt });
}
export async function currentUser() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({ where: { tokenHash: hashSecret(token) }, include: { user: true } });
  if (!session || session.expiresAt <= new Date() || !session.user.isActive) {
    if (session) await prisma.session.delete({ where: { id: session.id } }).catch(() => undefined);
    jar.delete(SESSION_COOKIE);
    return null;
  }
  return { id: session.user.id, email: session.user.email, name: session.user.name, role: session.user.role };
}
export async function requireUser() {
  const user = await currentUser();
  if (!user) throw new AuthError(401, "Sign in is required.");
  return user;
}
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new AuthError(403, "Administrator access is required.");
  return user;
}
export class AuthError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function apiError(error: unknown) {
  if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
  console.error("API request failed", error instanceof Error ? error.message : "unknown error");
  return NextResponse.json({ error: "The request could not be completed." }, { status: 500 });
}
export async function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";
  const host = (await headers()).get("x-forwarded-host") ?? (await headers()).get("host");
  const forwardedProto = (await headers()).get("x-forwarded-proto");
  const expected = host ? `${forwardedProto || new URL(request.url).protocol.replace(":", "")}://${host}` : new URL(request.url).origin;
  return new URL(origin).origin === expected;
}
export async function enforceRateLimit(key: string, limit: number, windowSeconds: number) {
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowSeconds * 1000);
  const bucket = await prisma.rateLimitBucket.upsert({ where: { key }, create: { key, count: 1, resetAt }, update: { count: { increment: 1 } } });
  if (bucket.resetAt <= now) {
    await prisma.rateLimitBucket.update({ where: { key }, data: { count: 1, resetAt } });
    return true;
  }
  return bucket.count <= limit;
}
export function requestIpHash(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  return hashSecret(`${process.env.IP_HASH_SALT || "local-development-only"}:${ip}`);
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { apiError, assertSameOrigin, SESSION_COOKIE, hashSecret, currentUser } from "@/lib/security";
export async function POST(request: Request) { try { if (!(await assertSameOrigin(request))) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 }); const jar = await cookies(); const token = jar.get(SESSION_COOKIE)?.value; const user = await currentUser(); if (token) await prisma.session.deleteMany({ where: { tokenHash: hashSecret(token) } }); if (user) await prisma.auditLog.create({ data: { actorId: user.id, action: "LOGOUT", targetType: "User", targetId: user.id } }); jar.delete(SESSION_COOKIE); return NextResponse.json({ ok: true }); } catch (error) { return apiError(error); } }

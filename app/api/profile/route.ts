import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError, assertSameOrigin, requireUser } from "@/lib/security";
const schema = z.object({ name: z.string().trim().min(2).max(80) });
export async function GET() { try { const user = await requireUser(); const profile = await prisma.user.findUnique({ where: { id: user.id }, select: { id: true, name: true, email: true, role: true, createdAt: true } }); return NextResponse.json({ profile }); } catch (error) { return apiError(error); } }
export async function PATCH(request: Request) { try { if (!(await assertSameOrigin(request))) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 }); const user = await requireUser(); const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Enter a name between 2 and 80 characters." }, { status: 400 }); const profile = await prisma.$transaction(async tx => { const updated = await tx.user.update({ where: { id: user.id }, data: { name: parsed.data.name }, select: { id: true, name: true, email: true, role: true } }); await tx.auditLog.create({ data: { actorId: user.id, action: "PROFILE_UPDATED", targetType: "User", targetId: user.id } }); return updated; }); return NextResponse.json({ profile }); } catch (error) { return apiError(error); } }

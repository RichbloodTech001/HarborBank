import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, requireAdmin } from "@/lib/security";
export async function GET() { try { await requireAdmin(); const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { actor: { select: { name: true, email: true } } } }); return NextResponse.json({ logs }); } catch (error) { return apiError(error); } }

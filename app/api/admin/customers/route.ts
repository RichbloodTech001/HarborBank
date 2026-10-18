import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, requireAdmin } from "@/lib/security";
export async function GET(request: Request) { try { await requireAdmin(); const url = new URL(request.url); const q = (url.searchParams.get("q") || "").trim().slice(0, 100); const customers = await prisma.user.findMany({ where: q ? { OR: [{ email: { contains: q, mode: "insensitive" } }, { name: { contains: q, mode: "insensitive" } }] } : {}, orderBy: { createdAt: "desc" }, take: 100, select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, _count: { select: { accounts: true, requests: true } } } }); return NextResponse.json({ customers }); } catch (error) { return apiError(error); } }

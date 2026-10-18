import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, requireUser } from "@/lib/security";
export async function GET() { try { const user = await requireUser(); const accounts = await prisma.bankAccount.findMany({ where: { userId: user.id }, orderBy: { createdAt: "asc" }, select: { id: true, accountNumber: true, label: true, currency: true, status: true, createdAt: true } }); return NextResponse.json({ accounts }); } catch (error) { return apiError(error); } }

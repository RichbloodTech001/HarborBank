import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, requireAdmin } from "@/lib/security";
export async function GET() { try { await requireAdmin(); const requests = await prisma.transactionRequest.findMany({ where: { status: { in: ["PENDING", "UNDER_REVIEW"] } }, orderBy: { createdAt: "asc" }, take: 100, include: { user: { select: { id: true, name: true, email: true } }, account: { select: { accountNumber: true, currency: true, label: true } } } }); return NextResponse.json({ requests: requests.map(r => ({ ...r, amount: r.amount.toFixed(2) })) }); } catch (error) { return apiError(error); } }

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError, requireAdmin } from "@/lib/security";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  status: z.enum(["OPEN", "ALL", "APPROVED", "REJECTED", "CANCELLED"]).default("OPEN"),
  type: z.enum(["ALL", "DEPOSIT", "WITHDRAWAL"]).default("ALL"),
  q: z.string().trim().max(120).default(""),
});

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const parsed = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
    if (!parsed.success) return NextResponse.json({ error: "Invalid queue filters." }, { status: 400 });
    const { page, limit, status, type, q } = parsed.data;
    const where = {
      ...(status === "OPEN" ? { status: { in: ["PENDING", "UNDER_REVIEW"] as const } } : status !== "ALL" ? { status } : {}),
      ...(type !== "ALL" ? { type } : {}),
      ...(q ? { OR: [
        { reference: { contains: q, mode: "insensitive" as const } },
        { user: { name: { contains: q, mode: "insensitive" as const } } },
        { user: { email: { contains: q, mode: "insensitive" as const } } },
      ] } : {}),
    };
    const [rows, total] = await Promise.all([
      prisma.transactionRequest.findMany({
        where, orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (page - 1) * limit, take: limit,
        include: { user: { select: { id: true, name: true, email: true } }, account: { select: { accountNumber: true, currency: true, label: true } } },
      }),
      prisma.transactionRequest.count({ where }),
    ]);
    return NextResponse.json({
      requests: rows.map(r => ({ ...r, amount: r.amount.toFixed(2) })),
      page, limit, total, pages: Math.max(1, Math.ceil(total / limit)), status, type, q,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return apiError(error); }
}

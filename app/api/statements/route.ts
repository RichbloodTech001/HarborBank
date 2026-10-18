import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, requireUser } from "@/lib/security";

function csvCell(value: string) {
  return '"' + value.replace(/"/g, '""') + '"';
}

export async function GET() {
  try {
    const user = await requireUser();
    const rows = await prisma.transactionRequest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 1000,
      select: { reference: true, type: true, status: true, amount: true, currency: true, createdAt: true },
    });
    const lines = [
      ["Reference", "Request type", "Status", "Amount", "Currency", "Created at", "Record type"].map(csvCell).join(","),
      ...rows.map((row) => [
        row.reference, row.type, row.status, row.amount.toFixed(2), row.currency,
        row.createdAt.toISOString(), "Request record — not a bank statement",
      ].map((value) => csvCell(String(value))).join(",")),
    ];
    return new NextResponse("\uFEFF" + lines.join("\r\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="harborbank-request-records.csv"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return apiError(error);
  }
}

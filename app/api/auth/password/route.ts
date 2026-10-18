import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { apiError, assertSameOrigin, enforceRateLimit, hashSecret, requireUser, requestIpHash, SESSION_COOKIE } from "@/lib/security";

const schema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(12).max(128),
}).refine((value) => value.currentPassword !== value.newPassword, {
  path: ["newPassword"],
  message: "Choose a new password different from your current password.",
});

export async function POST(request: Request) {
  try {
    if (!(await assertSameOrigin(request))) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
    const user = await requireUser();
    const ip = requestIpHash(request);
    if (!(await enforceRateLimit(`password-change:${user.id}`, 5, 900)) ||
        !(await enforceRateLimit(`password-change-ip:${ip}`, 15, 900))) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
    }
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check the password fields." }, { status: 400 });
    }
    const record = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true, isActive: true },
    });
    if (!record || !record.isActive || !(await bcrypt.compare(parsed.data.currentPassword, record.passwordHash))) {
      await prisma.auditLog.create({
        data: { actorId: user.id, action: "LOGIN_FAILURE", targetType: "User", targetId: user.id, ipHash: ip,
          metadata: { reason: "PASSWORD_CHANGE_REJECTED" } },
      }).catch(() => undefined);
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    const jar = await cookies();
    const token = jar.get(SESSION_COOKIE)?.value;
    if (!token) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
    const currentTokenHash = hashSecret(token);
    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: user.id }, data: { passwordHash } });
      await tx.session.deleteMany({ where: { userId: user.id, tokenHash: { not: currentTokenHash } } });
      await tx.auditLog.create({
        data: { actorId: user.id, action: "PASSWORD_CHANGED", targetType: "User", targetId: user.id, ipHash: ip },
      });
    });
    return NextResponse.json({ ok: true, message: "Password updated. Other active sessions have been signed out." });
  } catch (error) {
    return apiError(error);
  }
}

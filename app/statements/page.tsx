import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/security";
import { PortalShell } from "@/components/portal-shell";

export default async function StatementsPage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const [count, latest] = await Promise.all([
    prisma.transactionRequest.count({ where: { userId: user.id } }),
    prisma.transactionRequest.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
  ]);
  return <PortalShell name={user.name} role={user.role}>
    <h1 className="portal-title">Request records export</h1>
    <p className="portal-subtitle">Download your own HarborBank request records for personal review. This is not an official bank statement, transaction receipt, or proof of funds.</p>
    <div className="portal-grid">
      <article className="portal-card"><span className="portal-stat-label">Records available</span><div className="portal-stat-value">{count}</div><p className="portal-muted">Your submitted deposit and withdrawal requests.</p></article>
      <article className="portal-card"><span className="portal-stat-label">Most recent request</span><div className="portal-stat-value" style={{ fontSize: 22 }}>{latest ? latest.createdAt.toLocaleDateString() : "—"}</div><p className="portal-muted">Latest saved request timestamp.</p></article>
    </div>
    <div className="portal-card" style={{ marginTop: 22 }}>
      <h2>Export CSV</h2><p className="portal-muted">Includes up to 1,000 most recent request records, their statuses, amounts and timestamps. No balance or actual money movement is represented.</p>
      <div className="portal-actions"><a className="button button-primary" href="/api/statements">Download request records ↓</a><Link className="button button-outline" href="/transactions">View request history</Link></div>
    </div>
  </PortalShell>;
}

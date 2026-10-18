import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/security";
import { PortalShell } from "@/components/portal-shell";

export default async function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) redirect("/login");
  const { id } = await params;
  const account = await prisma.bankAccount.findFirst({ where: { id, userId: user.id } });
  if (!account) notFound();
  const requests = await prisma.transactionRequest.findMany({
    where: { accountId: account.id, userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: { id: true, reference: true, type: true, status: true, amount: true, currency: true, createdAt: true },
  });
  return <PortalShell name={user.name} role={user.role}>
    <div className="eyebrow"><span className="eyebrow-line"/> ACCOUNT DETAILS</div>
    <h1 className="portal-title" style={{ marginTop: 12 }}>{account.label}</h1>
    <p className="portal-subtitle">A profile-linked account record. This page does not represent a verified bank account or a real available balance.</p>
    <div className="portal-card">
      <span className="portal-stat-label">Account reference</span>
      <h2 style={{ margin: "10px 0" }}>{account.accountNumber.slice(0, 2)}••••{account.accountNumber.slice(-4)}</h2>
      <p className="portal-muted">Currency setting: {account.currency} · Status label: {account.status} · Created {account.createdAt.toLocaleDateString()}</p>
      <p className="portal-muted">Balance: unavailable — no ledger or payment provider is connected.</p>
      <div className="portal-actions"><Link className="button button-primary" href={`/requests/new?accountId=${account.id}`}>Create request →</Link><Link className="button button-outline" href="/accounts">Back to accounts</Link></div>
    </div>
    <section className="portal-section"><div className="portal-section-head"><h2>Requests for this account</h2><Link className="portal-link" href="/transactions">All request history →</Link></div>
      <div className="portal-table-wrap">{requests.length ? <table className="portal-table"><thead><tr><th>Reference</th><th>Type</th><th>Amount</th><th>Status</th><th>Created</th></tr></thead><tbody>{requests.map((r) => <tr key={r.id}><td><Link className="portal-link" href={`/transactions/${r.id}`}>{r.reference}</Link></td><td>{r.type}</td><td>{r.currency} {r.amount.toFixed(2)}</td><td><span className={`status-pill ${r.status}`}>{r.status.replace("_", " ")}</span></td><td>{r.createdAt.toLocaleDateString()}</td></tr>)}</tbody></table> : <div className="portal-empty">No requests are linked to this account.</div>}</div>
    </section>
  </PortalShell>;
}

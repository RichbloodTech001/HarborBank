import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/security";
import { PortalShell } from "@/components/portal-shell";

const questions = [
  { q: "Are deposits and withdrawals processed?", a: "No. This HarborBank prototype saves requests for review only. It does not connect to a bank, hold deposits, send transfers or credit balances." },
  { q: "Why is my account balance unavailable?", a: "The application has no ledger-backed balance service or verified payment integration. We do not display invented balances as real funds." },
  { q: "What do the request statuses mean?", a: "Pending means submitted; Under review means an administrator is reviewing it; Approved or Rejected records a review decision. Approval is not proof that money moved." },
  { q: "How do I secure my profile?", a: "Use Profile & security to update your display name or change your password. Use a unique password with at least 12 characters." },
  { q: "Can I download my request history?", a: "Yes. Request records export lets you download a CSV. It is not an official bank statement or proof of funds." },
];

export default async function HelpPage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  return <PortalShell name={user.name} role={user.role}>
    <h1 className="portal-title">Help centre</h1>
    <p className="portal-subtitle">Guidance for using the HarborBank prototype and understanding what its records mean.</p>
    <div className="portal-card" style={{ marginBottom: 20 }}><strong>Prototype notice</strong><p className="portal-muted">HarborBank is not a licensed bank. Do not submit card details, banking passwords, identity documents or sensitive financial information here. No real banking services are provided.</p></div>
    <div className="portal-section">{questions.map((item, index) => <article key={item.q} className="portal-card" style={{ marginBottom: 12 }}><h2 style={{ fontSize: 17 }}>{index + 1}. {item.q}</h2><p className="portal-muted">{item.a}</p></article>)}</div>
    <div className="portal-actions"><Link className="button button-primary" href="/requests/new">Create a request →</Link><Link className="button button-outline" href="/profile">Profile & security</Link></div>
  </PortalShell>;
}

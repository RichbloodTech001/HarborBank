import Link from "next/link";
export default function PrivacyPage() {
  return <main className="section" style={{ maxWidth: 900, margin: "0 auto", minHeight: "70vh" }}>
    <Link className="portal-link" href="/">← HarborBank home</Link>
    <div className="eyebrow" style={{ marginTop: 28 }}>LEGAL & PRIVACY</div>
    <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", margin: "14px 0" }}>Privacy notice</h1>
    <p className="portal-subtitle">Prototype disclosure · Review and replace this notice before any public launch.</p>
    <div className="portal-card" style={{ marginTop: 24 }}>
      <h2>What this prototype does</h2>
      <p>HarborBank stores information needed for demonstration workflows, which may include your name, email address, password hash, session records, account-record metadata, request details, and security audit events.</p>
      <h2>How information is used</h2>
      <p>Information is used to authenticate users, show records belonging to the signed-in account, manage request workflows, and support administrative security review. Passwords are intended to be stored as hashes rather than readable text.</p>
      <h2>External services and transfers</h2>
      <p>This repository does not currently provide connected banking rails, payment processing, or email verification. Hosting, database, logging, and any future providers may process data once an operator configures them. Review those providers and publish accurate disclosures before launch.</p>
      <h2>Retention and your choices</h2>
      <p>Retention depends on the configured database and hosting environment. Do not enter real financial account credentials, card details, identity documents, or other sensitive information into this prototype. Contact the site operator for questions about test data and its deletion.</p>
      <h2>Before production</h2>
      <p>This is a starter disclosure, not legal advice or a substitute for a jurisdiction-specific privacy assessment. The operator must identify the responsible entity, lawful basis, applicable rights, retention schedule, contact details, and any required regulator disclosures.</p>
    </div>
    <p style={{ marginTop: 20 }}><Link className="portal-link" href="/terms">Read prototype terms →</Link></p>
  </main>;
}

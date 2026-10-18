import Link from "next/link";
export default function TermsPage() {
  return <main className="section" style={{ maxWidth: 900, margin: "0 auto", minHeight: "70vh" }}>
    <Link className="portal-link" href="/">← HarborBank home</Link>
    <div className="eyebrow" style={{ marginTop: 28 }}>LEGAL & TERMS</div>
    <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", margin: "14px 0" }}>Prototype terms</h1>
    <p className="portal-subtitle">Demo application only · Not an offer of banking or financial services.</p>
    <div className="portal-card" style={{ marginTop: 24 }}>
      <h2>Purpose and scope</h2>
      <p>HarborBank is a software prototype for demonstrating account-record screens, user profiles, authentication, and deposit or withdrawal request workflows. It is not a bank, does not represent a licensed financial institution, and does not open or maintain real bank accounts.</p>
      <h2>No financial transactions</h2>
      <p>Displayed sample values are illustrative. Submitting, approving, or rejecting a request does not deposit, withdraw, transfer, settle, or guarantee funds. Do not rely on this application for payment, financial, legal, or tax decisions.</p>
      <h2>Acceptable use</h2>
      <p>Use only authorized test data and accounts. Do not submit real credentials, card data, identity documents, or information belonging to another person. Do not attempt to access another user's records or bypass security controls.</p>
      <h2>Availability and responsibility</h2>
      <p>The prototype may change or become unavailable and is provided for evaluation. No service-level commitment is made. Before a real public launch, the operator must obtain legal review, establish a responsible entity, and publish terms appropriate to the actual service and applicable laws.</p>
    </div>
    <p style={{ marginTop: 20 }}><Link className="portal-link" href="/privacy">Read privacy notice →</Link></p>
  </main>;
}

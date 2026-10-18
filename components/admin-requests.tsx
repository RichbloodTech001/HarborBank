"use client";
import { useCallback, useEffect, useState } from "react";

type RequestRow = {
  id: string; reference: string; type: string; status: string; amount: string; currency: string;
  note: string | null; createdAt: string; user: { name: string; email: string };
  account: { accountNumber: string; currency: string; label: string };
};
type StatusFilter = "OPEN" | "ALL" | "APPROVED" | "REJECTED" | "CANCELLED";
type TypeFilter = "ALL" | "DEPOSIT" | "WITHDRAWAL";

export function AdminRequests() {
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<StatusFilter>("OPEN");
  const [type, setType] = useState<TypeFilter>("ALL");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setError("");
    try {
      const params = new URLSearchParams({ status, type, page: String(page), limit: "20", q: query });
      const r = await fetch("/api/admin/transaction-requests?" + params.toString(), { cache: "no-store" });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Unable to load review queue.");
      setRows(d.requests); setPages(d.pages); setTotal(d.total);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load review queue."); }
  }, [status, type, page, query]);

  useEffect(() => { void load(); }, [load]);

  async function decide(row: RequestRow, decision: "APPROVED" | "REJECTED") {
    setBusy(row.id); setError(""); setMessage("");
    try {
      const r = await fetch("/api/admin/transaction-requests/" + row.id, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, note: notes[row.id] || "" }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Unable to update request.");
      setMessage(row.reference + " status updated to " + decision + ". No funds were moved.");
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to update request."); }
    finally { setBusy(""); }
  }

  function applySearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setPage(1); setQuery(search.trim());
  }

  return <>
    {message && <div className="portal-alert" role="status">{message}</div>}
    {error && <div className="portal-alert error" role="alert">{error}</div>}
    <div className="portal-alert">Reviewing a request changes its workflow status only. This admin action never credits, debits, or transfers funds.</div>
    <form onSubmit={applySearch} className="portal-filter-row" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "end", margin: "16px 0" }}>
      <label>Request status<select className="portal-select" value={status} onChange={e => { setStatus(e.target.value as StatusFilter); setPage(1); }}><option value="OPEN">Pending review</option><option value="ALL">All statuses</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option><option value="CANCELLED">Cancelled</option></select></label>
      <label>Request type<select className="portal-select" value={type} onChange={e => { setType(e.target.value as TypeFilter); setPage(1); }}><option value="ALL">All types</option><option value="DEPOSIT">Deposit</option><option value="WITHDRAWAL">Withdrawal</option></select></label>
      <label style={{ flex: "1 1 220px" }}>Search reference or customer<input className="portal-select" maxLength={120} value={search} onChange={e => setSearch(e.target.value)} placeholder="Reference, name, or email"/></label>
      <button className="button button-primary" type="submit">Search</button>
      <span className="portal-muted">{total} result{total === 1 ? "" : "s"}</span>
    </form>
    <div className="portal-table-wrap">{rows.length ? <table className="portal-table"><thead><tr><th>Request / customer</th><th>Type / amount</th><th>Status / submitted</th><th>Reviewer note</th><th>Decision</th></tr></thead><tbody>
      {rows.map(row => <tr key={row.id}>
        <td><strong>{row.reference}</strong><br/><span className="portal-muted">{row.user.name} · {row.user.email}</span><br/><span className="portal-muted">{row.account.label} · •••• {row.account.accountNumber.slice(-4)}</span></td>
        <td>{row.type}<br/><strong>{row.currency} {row.amount}</strong></td>
        <td><strong>{row.status.replaceAll("_", " ")}</strong><br/><span className="portal-muted">{new Date(row.createdAt).toLocaleString()}</span></td>
        <td>{row.status === "PENDING" || row.status === "UNDER_REVIEW" ? <input aria-label={"Reviewer note for " + row.reference} className="portal-select" maxLength={500} value={notes[row.id] || ""} onChange={e => setNotes(v => ({ ...v, [row.id]: e.target.value }))} placeholder="Optional note"/> : <span>{(row as RequestRow & { reviewNote?: string | null }).reviewNote || "—"}</span>}</td>
        <td>{row.status === "PENDING" || row.status === "UNDER_REVIEW" ? <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}><button className="button button-small button-primary" disabled={busy === row.id} onClick={() => void decide(row, "APPROVED")}>Approve</button><button className="button button-small button-outline" disabled={busy === row.id} onClick={() => void decide(row, "REJECTED")}>Reject</button></div> : "—"}</td>
      </tr>)}
    </tbody></table> : <div className="portal-empty">No requests match these filters.</div>}</div>
    <div style={{ display: "flex", gap: 12, justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
      <span className="portal-muted">Page {page} of {pages}</span>
      <div style={{ display: "flex", gap: 8 }}><button className="button button-outline" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button><button className="button button-outline" disabled={page >= pages} onClick={() => setPage(p => Math.min(pages, p + 1))}>Next</button></div>
    </div>
  </>;
}

"use client";

import { useState } from "react";

export function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    if (newPassword !== confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }
    if (currentPassword === newPassword) {
      setError("Choose a password different from your current password.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to change password.");
      setMessage(data.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to change password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="portal-form" onSubmit={submit}>
      <h2 className="section-title">Change password</h2>
      <p className="portal-muted">Use at least 12 characters. Changing your password signs out other active sessions.</p>
      <label className="form-label" htmlFor="current-password">Current password</label>
      <input className="form-input" id="current-password" type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} maxLength={128} required />
      <label className="form-label" htmlFor="new-password">New password</label>
      <input className="form-input" id="new-password" type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={12} maxLength={128} required />
      <label className="form-label" htmlFor="confirm-password">Confirm new password</label>
      <input className="form-input" id="confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={12} maxLength={128} required />
      {message && <div className="portal-alert" role="status">{message}</div>}
      {error && <div className="portal-alert error" role="alert">{error}</div>}
      <button className="button button-primary" disabled={busy}>{busy ? "Updating…" : "Update password →"}</button>
    </form>
  );
}

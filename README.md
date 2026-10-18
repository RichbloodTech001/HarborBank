# HarborBank

HarborBank is a responsive banking-style web application prototype built with Next.js, TypeScript, PostgreSQL, and Prisma. It provides customer profile management and audited deposit/withdrawal **request workflows**. It is not a licensed bank and is not currently able to move real money.

## Implemented in this repository

- Responsive public homepage and customer/admin portal layouts
- Customer registration and sign-in with bcrypt password hashing
- Random opaque session tokens stored as SHA-256 hashes in the database; HTTP-only, SameSite cookies; server-side session revocation on sign-out
- Customer profile edit and account-record listing, scoped to the authenticated customer
- Request creation with decimal validation, per-customer idempotency key, unique reference, and ownership checks
- Request detail and pending-request cancellation
- Admin-only customer search, customer access suspension/restoration, request review queue, and read-only audit log viewer
- Audit events for registration, login attempts, profile changes, request creation/cancellation/review, and customer access changes
- PostgreSQL Prisma schema and initial migration
- Health endpoint at `/api/health`
- GitHub Actions workflow for Prisma validation, type-checking, lint, and production build

## Run locally

Requirements: Node.js 20+, npm, and PostgreSQL 16+.

1. Copy `.env.example` to `.env` and set `DATABASE_URL` to your local PostgreSQL connection string.
2. Install dependencies and generate the Prisma client.
3. Apply the checked-in database migration.
4. Start the development server.

```bash
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

Open the local URL shown in the terminal. For production, configure environment variables in your hosting provider's secret manager; never commit real secrets.

## Initial administrator provisioning

Public registration **always creates a CUSTOMER** role. It must never accept a role from the browser or grant admin privileges based on a public email allowlist.

After creating and verifying an operator account, an authorized database operator may provision the first admin role using a controlled database session:

```sql
UPDATE "User"
SET "role" = 'ADMIN'
WHERE lower("email") = lower('verified-operator@example.com');
```

Replace the example email with the exact operator account you verified. Run this only with authorized database access, record the change under your operational controls, and keep the account protected with a unique strong password. Never expose a public admin-bootstrap endpoint.

## Important financial and security limits

- This is a software prototype, not a regulated banking service.
- Account records are not proof of real bank accounts. No authoritative account balance is displayed.
- Deposit and withdrawal requests are workflow records only. An admin decision changes request status and **does not credit, debit, or transfer funds**.
- There is no ledger, payment-provider integration, verified webhook flow, payout rail, settlement, reconciliation, or live-money support.
- Email verification, password reset, MFA, monitoring/alerting, production rate-limit hardening, and an independent security review remain required before a public production launch.
- The current database-backed rate-limit and audit patterns are a foundation, not a substitute for a dedicated distributed rate limiter, immutable external audit storage, abuse monitoring, and operational controls.
- Configure a strong `IP_HASH_SALT` and use HTTPS in deployment. The application enables secure cookies in production and rejects state-changing requests without a valid same-origin Origin header.
- Do not enter real bank credentials, card details, or financial information into an unreviewed deployment.

## Production-readiness checklist

Before calling this production-ready, run the GitHub Actions checks and verify their results; apply migrations against a staging database; test registration/login/logout, account ownership, role enforcement, idempotency, cancellation races, concurrent review decisions, rate limiting, session expiry, CSRF defenses, backups and restore, monitoring, and dependency/security scans. Add email verification and recovery, MFA for admins, a proper production rate limiter, privacy/retention policies, incident response, and independent penetration testing. Real-money features also require provider approval, applicable licensing/compliance, signed webhook verification, a balanced ledger, reconciliation, and explicit financial controls.

## Main routes

- `/` — public homepage
- `/register`, `/login` — customer authentication
- `/dashboard`, `/accounts`, `/profile` — customer portal
- `/requests/new`, `/transactions` — request workflows and history
- `/admin`, `/admin/customers`, `/admin/requests`, `/admin/audit-logs` — administrator portal
- `/api/health` — readiness endpoint

Repository: https://github.com/RichbloodTech001/HarborBank

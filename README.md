# HarborBank

A responsive banking-style concept website with safe, fictional demo interactions. This is an original HarborBank interface, not a copy of another bank's proprietary website or branding.

## Current implementation

- Responsive landing page and mobile navigation
- Personal banking, business banking, digital banking, learning, and security sections
- Interactive demo sign-in modal that does not authenticate or transmit credentials
- Sample dashboard balance visibility toggle
- Accessible dialog close behavior, status messages, and reduced-motion support
- Static preview that can run without API keys or financial provider credentials

## Run locally

Requires Node.js 18 or newer.

```bash
npm run check
npm run dev
```

Open the local URL printed by the static server. You can also open `index.html` directly in a browser, though using the local server is recommended.

## Important limitations

This repository currently contains a **front-end demo only**. It is not a bank, is not licensed to provide financial services, and does not connect to real accounts, payment processors, or banking rails. All displayed balances and activity are fictional. The sign-in form is deliberately non-functional and should never be used to collect real credentials.

## Planned build sequence

1. Establish a tested application framework, shared design tokens, route layout, linting, and automated checks.
2. Implement real authentication with secure server-side sessions, password hashing, verification, recovery, rate limiting, and authorization tests.
3. Add a relational database schema and migrations for users, accounts, requests, ledger entries, notifications, and audit events.
4. Implement account-scoped customer pages, transaction request workflows, and server-enforced ownership.
5. Build admin customer management, review queues, reporting, and immutable audit trails with least-privilege access.
6. Add exact decimal/minor-unit money handling, idempotency, concurrency-safe ledger operations, and reconciliation.
7. Integrate a payment provider only after server secrets, signed webhook verification, replay protection, and reconciliation are configured.
8. Add accessibility, responsive, security, API, integration, and end-to-end tests; document backups, monitoring, and deployment.

Real-money activity must remain disabled until security reviews, legal/regulatory obligations, payment-provider approval, and financial controls are independently verified. Do not store payment card data or expose secrets in client-side code.

## Repository

https://github.com/RichbloodTech001/HarborBank

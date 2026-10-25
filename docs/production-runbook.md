# Production implementation runbook

1. Provision isolated Supabase development, staging, and production projects, a KMS-backed deployment secret manager, Redis, transactional email, and monitoring in separate accounts.
2. Apply `supabase/migrations/20260913000000_cultx_auth_and_realtime.sql` through a reviewed migration pipeline. Verify RLS is enabled, test cross-user access is denied, and test point-in-time recovery before importing customer data.
3. Configure `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `GEMINI_API_KEY`, allowed browser origins, redirect URLs, trusted proxy CIDRs, and regional data-residency controls only through the deployment secret manager.
4. Privileged roles must be assigned only by a verified, audited server-side administrative workflow. Never accept a role from signup metadata or browser input.
5. Require a normalized, RLS-protected resource membership grant before enabling farm or organization API routes for non-administrators. Audit every sensitive decision.
6. Enable Redis-backed account/IP rate limits, WAF rules, structured redacted logs, SIEM export, alerting, dependency scanning, SAST/DAST, and an independent penetration test.
7. Complete email verification, password reset delivery, MFA recovery codes, server-verified WebAuthn for privileged users, session/device management, and incident-response runbooks before launch.

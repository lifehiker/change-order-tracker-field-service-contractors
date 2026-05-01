# Features.md

Source of truth for all project features. Last updated: 2026-05-01.

---

## Authentication

- **Description**: Credential-based login/registration with bcrypt password hashing. Users register with name, email, password, and company name. A workspace and 14-day trial subscription are auto-created on registration.
- **Status**: Completed
- **Implementation**: NextAuth v5 with JWT strategy + Credentials provider. `bcryptjs` for hashing. `src/auth.ts`, `src/auth.config.ts`, `src/app/register/page.tsx`, `src/app/login/page.tsx`, `/api/auth/register`

---

## Workspace Setup

- **Description**: Multi-tenant workspace per company. Auto-created on user registration with a unique slug derived from company name.
- **Status**: Completed
- **Implementation**: `Workspace` + `Membership` models in Prisma schema. `/api/workspace` GET/PUT routes. `src/lib/workspace.ts`

---

## Workspace Settings

- **Description**: Edit company name, logo URL, tax rate, currency, and default approval terms shown on all approval pages.
- **Status**: Completed
- **Implementation**: `src/app/(app)/settings/page.tsx` with `PUT /api/workspace`

---

## Jobs CRUD

- **Description**: Create and list jobs with customer name, email, site address, and original scope. Each job can have multiple change orders.
- **Status**: Completed
- **Implementation**: `src/app/(app)/jobs/` pages, `/api/jobs`, `/api/jobs/[jobId]`

---

## Change Orders CRUD

- **Description**: Create, view, and manage change orders per job. Fields: title, description, labor/material/other cost impact, urgency (NORMAL/HIGH/SAME_DAY), auto-calculated total.
- **Status**: Completed
- **Implementation**: `src/app/(app)/change-orders/` pages, `/api/change-orders`, `/api/change-orders/[id]`

---

## Status Tracking

- **Description**: Change orders progress through DRAFT → SENT → VIEWED → APPROVED → REJECTED → INVOICED with timestamps for key transitions.
- **Status**: Completed
- **Implementation**: Status field in `ChangeOrder` model. Badge display in all list/detail views. `/api/change-orders/[id]/status` for manual status updates.

---

## Approval Link Generation

- **Description**: Generate a tokenized, shareable approval link for any change order. Optional: send via Resend email with branded subject line.
- **Status**: Completed
- **Implementation**: `ApprovalRequest` model with unique CUID token. `SendApprovalForm` client component. `/api/change-orders/[id]/send`

---

## Client Approval Flow

- **Description**: Public page at `/approve/[token]` shows scope, pricing, photos, and terms. Client types their name, selects Approve or Reject, and submits. IP address logged. Status updates propagate immediately.
- **Status**: Completed
- **Implementation**: `src/app/approve/[token]/page.tsx`, `LiveApprovalScreen` component, `/api/approve/[token]`

---

## File Attachments

- **Description**: Upload images and PDFs to change orders. Stored as base64 data URLs in SQLite. Image thumbnails shown on detail page and approval page.
- **Status**: Completed
- **Implementation**: `ChangeOrderAttachment` model. `/api/change-orders/[id]/attachments`. Image preview via `next/image` with `unoptimized`.

---

## Activity Log

- **Description**: Timestamped log of all change order events: created, sent, viewed, approved, rejected, invoiced.
- **Status**: Completed
- **Implementation**: `ApprovalEvent` model. Events written on all status transitions. Displayed on change order detail page.

---

## PDF Export

- **Description**: Generate a printable PDF per change order including workspace name, job info, scope, cost breakdown, attachments list, approval status, and signer name.
- **Status**: Completed
- **Implementation**: `pdf-lib` in `/api/change-orders/[id]/pdf`

---

## CSV Export

- **Description**: Export all change orders for the workspace as a CSV file with timestamps and cost data.
- **Status**: Completed
- **Implementation**: `/api/change-orders/export`

---

## Dashboard

- **Description**: KPI cards for awaiting approval, approved-not-invoiced, rejected this month, and change orders this month. Recent 10 change orders list. Empty state with onboarding prompt.
- **Status**: Completed
- **Implementation**: `src/app/(app)/dashboard/page.tsx`

---

## App Navigation

- **Description**: Sidebar navigation with links to Dashboard, Jobs, Change Orders, and Settings. Auth guard redirects unauthenticated users to login.
- **Status**: Completed
- **Implementation**: `AppNav` component, `(app)/layout.tsx`

---

## Subscription / Trial Billing

- **Description**: 14-day trial auto-created on registration. Stripe webhook handles subscription activated/cancelled events. App is functional without Stripe credentials (billing inert but not crashing).
- **Status**: Completed
- **Implementation**: `Subscription` model. `/api/webhooks/stripe`. HUMAN_INPUT_NEEDED.md documents required Stripe keys.

---

## Marketing Homepage

- **Description**: Hero section with value prop, feature cards, workflow steps, testimonials, and links to SEO landing pages. Built-in reveal animations.
- **Status**: Completed
- **Implementation**: `src/app/page.tsx` + `HomePage` component + `SiteShell`/`SiteHeader`/`SiteFooter`

---

## Pricing Page

- **Description**: Three-tier pricing page (Solo $39/mo, Small Team $79/mo, Office $149/mo) with feature lists and trial CTAs. Links to /register.
- **Status**: Completed
- **Implementation**: `src/app/pricing/page.tsx`

---

## SEO Landing Pages

- **Description**: 9 pre-rendered trade/use-case/comparison pages targeting long-tail keywords. Each page has unique copy, a comparison table (where relevant), and matching accent theme.
- **Status**: Completed
- **Routes**: /plumbers/change-order-software, /av-installers/change-order-software, /field-service/change-order-template, /client-approval/extra-work, /compare/jobber-vs-change-order-tracker, /compare/housecall-pro-vs-change-order-tracker, /compare/buildertrend-vs-change-order-tracker, /use-cases/invoice-ready-job-documentation, /use-cases/onsite-scope-change-approval
- **Implementation**: `[...slug]/page.tsx` with `generateStaticParams`. `src/lib/site-data.ts`

---

## Live Workflow Studio

- **Description**: Full interactive public demo at /studio. Walks through creating a change order, viewing the client approval screen, and generating a document — without requiring a login. Uses localStorage to preserve state.
- **Status**: Completed
- **Implementation**: `src/app/studio/page.tsx` + `ChangeOrderStudio` component

---

## Demo Approval Page

- **Description**: Public static demo of the client approval screen at /approve/demo. Used for marketing and screenshots.
- **Status**: Completed
- **Implementation**: `src/app/approve/demo/page.tsx`

---

## Demo Document Page

- **Description**: Public static demo of the invoice documentation view at /docs/demo.
- **Status**: Completed
- **Implementation**: `src/app/docs/demo/page.tsx`

---

## Sitemap & Robots

- **Description**: Auto-generated sitemap.xml and robots.txt for SEO indexing.
- **Status**: Completed
- **Implementation**: Next.js route handlers for sitemap and robots

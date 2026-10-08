# LeadFlow

LeadFlow is a multi-tenant mortgage lead and document management platform built for brokerages.

It allows brokerages to receive leads from external sources, manage them through a sales pipeline, assign advisors, convert leads into clients, collect client documents, run background document checks, and automate emails and advisor tasks.

## Live Application

**Frontend:** https://lead-flow-sandy-seven.vercel.app/

**Backend:** https://leadflow-backend-21494027775.asia-south1.run.app/

Role-based login credentials are provided separately with the assignment submission and are not stored in this repository.

## Features

### Lead Management
- Create and manage leads.
- Pipeline: NEW → CONTACTED → QUALIFIED → APPLICATION → WON / LOST.
- Assign leads to advisors.
- Convert leads into clients.
- Optimistic concurrency protection for lead updates.
- Brokerage-scoped access.

### External Lead Ingestion
LeadFlow receives leads automatically from Tally through a webhook.

The integration includes webhook signature verification, explicit form-to-brokerage mapping, event idempotency, duplicate detection, automatic lead creation, and pipeline/email/task triggers.

Unknown or unconfigured Tally forms are rejected.

### Duplicate Detection
Email and phone numbers are normalized before comparison. A duplicate is detected when the same brokerage already has the same normalized email or phone.

Duplicate detection is brokerage-scoped, so the same person can exist independently in different brokerages.

### Real-Time Updates
Socket.IO provides real-time pipeline and document status updates to connected users without requiring a page refresh.

### Client Conversion
A brokerage admin can convert a lead into a client. The client account is created with a temporary password supplied during conversion, and a client onboarding email is sent using the existing email transport.

Email delivery failure does not fail the client conversion. The temporary password is not stored in plaintext, returned by the API, or written to logs.

### Client Portal
Clients can log in, view their case and assigned advisor, view pipeline progress, upload documents, view processing status, and access their authorized documents.

### Document Management
Client documents are stored privately in Cloudflare R2 while MongoDB stores metadata.

Supported types:
- PDF
- JPG
- JPEG
- PNG

Maximum size: 10 MB.

Processing flow:

`UPLOADED → PROCESSING → APPROVED / FAILED`

Processing is simulated for the assignment and status changes are emitted in real time. Document access uses short-lived signed URLs.

### Email Automation
Brokerage admins can manage stage-based email templates.

Email triggers are supported for:
- NEW
- CONTACTED
- QUALIFIED
- APPLICATION
- WON
- LOST

Client onboarding emails are also sent after successful conversion.

### Task Automation
Pipeline stages can create tasks for assigned advisors. Tasks include the lead, advisor, title, due date, and status. Overdue tasks are highlighted.

### Dashboard
The brokerage dashboard provides pipeline counts. Platform admins have a separate aggregate dashboard across brokerages.

## Roles

**Platform Admin** — platform-level administration and permitted cross-brokerage operations.

**Brokerage Admin** — manages the brokerage's leads, advisors, clients, email templates, tasks, pipeline, and dashboard.

**Advisor** — works with assigned leads/clients and assigned tasks.

**Client** — accesses their own case and documents.

## Multi-Tenant Architecture

A single deployment serves multiple brokerages. Tenant-owned resources contain a `brokerageId`.

For authenticated tenant users, brokerage context is derived from the authenticated user rather than trusted from the client request. Tenant-owned queries are scoped to that brokerage.

Platform admins can intentionally operate across brokerage boundaries only where the API permits it.

## Authentication & Authorization

Authentication uses JWTs stored in HTTP-only cookies.

Authorization uses role-based middleware, brokerage context validation, and brokerage-scoped query filters.

Passwords are hashed before storage.

## Architecture

The backend follows:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Model / Database
```

## Technology Stack

### Frontend
- React
- Vite
- React Router
- Zustand
- TanStack Query
- Tailwind CSS
- Axios
- Socket.IO Client

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- HTTP-only cookies
- Socket.IO
- Nodemailer

### Infrastructure / Services
- Vercel — frontend
- Google Cloud Run — backend
- MongoDB Atlas — database
- Cloudflare R2 — private document storage
- Tally — external lead source
- Gmail SMTP — email delivery

## Local Development

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Configure the backend using `server/.env`.

The expected variables are documented in `server/.env.example`.

Do not commit the actual `.env` file.

## Environment Variables

### Backend

The backend environment variables are documented in:

`server/.env.example` documents configuration for:
- MongoDB
- JWT
- Frontend origin
- Cookie configuration
- Tally webhook verification
- Cloudflare R2
- SMTP/email delivery


### Frontend

`The frontend uses the following environment variables:
 - VITE_API_BASE_URL -- specifies the backend API base URL.
 - COOKIE_SECURE -- controls whether secure cookies are used.

Actual credentials and secrets are intentionally excluded from the repository.

## Production URLs

**Frontend:** https://lead-flow-sandy-seven.vercel.app/

**Backend:** https://leadflow-backend-21494027775.asia-south1.run.app/

**Tally Webhook:**
`https://leadflow-backend-21494027775.asia-south1.run.app/api/webhooks/tally`

## Security

The application includes:
- HTTP-only authentication cookies.
- Password hashing.
- Role-based authorization.
- Brokerage-level tenant isolation.
- Tally webhook signature verification.
- Webhook idempotency.
- Tenant-scoped duplicate detection.
- Private R2 document storage.
- Short-lived signed document URLs.
- File type and size validation.
- Optimistic concurrency for lead updates.

## Key Trade-offs and Limitations

This project was implemented within the assignment's 5–7 day window, so some production-scale features were intentionally kept lightweight.

### In-process document worker
Document processing uses an in-process worker rather than a durable queue. A process restart can lose an in-memory job. A production implementation would use a durable queue and separate workers.

### Duplicate creation race
Duplicate detection performs a scoped lookup before insertion. Two simultaneous requests could theoretically pass the lookup before either insert completes. A production implementation could use stronger database constraints or transactional/locking strategies.

### High-volume lead ingestion
The application has not been load-tested at 500 leads/minute and does not implement a distributed ingestion queue or advanced rate limiting. A production version would use durable queues, worker pools, rate limiting, and horizontal scaling.

### Email delivery
Email delivery is asynchronous and failure does not fail the business operation. A production implementation would add durable email queues, retries, backoff, and delivery monitoring.

### Tenant resource flooding
The MVP does not implement advanced per-tenant quotas or queue isolation. Production infrastructure could add tenant-level rate limits and resource isolation.

### Advisor connectivity
Socket.IO reconnects when connectivity is restored, while normal API/query synchronization keeps server state authoritative. A production implementation could add an offline mutation queue if required.

## AI-Assisted Development

AI coding tools were used during development.

All development prompts are recorded in `PROMPTS.md` in chronological order as required by the assignment.

`AGENTS.md` contains project-level development instructions used during AI-assisted implementation.

## Assignment Summary

LeadFlow is a multi-tenant mortgage lead and document management platform designed to help brokerages receive, manage, and convert leads while keeping brokerage data isolated. The system accepts leads from an external Tally form through a verified webhook, detects duplicate contacts within the brokerage, and places new leads into a real-time pipeline. Brokerage admins can assign advisors, manage email templates, and convert leads into client accounts. Clients receive onboarding credentials, log in to their own portal, view their case and assigned advisor, and upload documents. Documents are stored privately in Cloudflare R2 and processed asynchronously with live status updates. Pipeline changes can trigger emails and advisor tasks, while Socket.IO provides real-time updates to connected users and the dashboard provides brokerage pipeline counts.

The backend uses Node.js, Express, MongoDB/Mongoose, JWT HTTP-only cookies, Socket.IO, Cloudflare R2, Tally, and SMTP email delivery, while the frontend uses React/Vite, React Router, Zustand, TanStack Query, Tailwind CSS, Axios, and Socket.IO Client. Tenant isolation is enforced by deriving brokerage context from the authenticated user and scoping tenant-owned database queries. The implementation intentionally uses lightweight MVP trade-offs appropriate for the assignment timeframe, including an in-process document worker, asynchronous email delivery without durable retries, and no distributed ingestion queue or advanced tenant quotas. These areas are documented as production follow-up work rather than hidden limitations.

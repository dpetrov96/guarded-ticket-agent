# Guarded Ticket Agent

Multi-tenant chat agent with tenant-scoped tools and human approval for ticket mutations. Built for the Quickbase craft exercise.

## Setup

```bash
cp .env.example .env
# Set GOOGLE_GENERATIVE_AI_API_KEY (free key: https://ai.google.dev/gemini-api/docs/quickstart)

npm install
npm run dev
```

- **Client:** http://localhost:5174
- **Server:** http://localhost:4001

## Environment variables

| Variable | Required | Notes |
|----------|----------|-------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | yes | Gemini API key |
| `GEMINI_MODEL` | no | Defaults to `gemini-flash-lite-latest` (best free-tier quota) |
| `PORT` | no | Server port, default `4001` |
| `ALLOWED_ORIGINS` | prod only | Comma-separated CORS origins |

## Screenshots

<!-- Add demo screenshots here -->

## Architecture

**Stack:** React + Vite (client), Express + Vercel AI SDK (server), Gemini.

```
Client (chat UI, tool trace, approval modal)
  → POST /api/chat  [header: X-Tenant-ID]
  → Gemini + 2 tools
       search_tickets(query)   — read-only, auto-runs
       mutate_ticket(id, action, fields?) — needsApproval, blocks until UI approve
  → In-memory TicketStore (seeded tickets, some with injection payloads)
```

Tenant is selected in the UI and sent on every request via `X-Tenant-ID` (fake auth stand-in).

## Security & authorization

Enforced in **code**, not prompts alone:

1. **Tenant isolation** — `tenantId` comes only from `X-Tenant-ID`, validated server-side, and is closed over when tools are built per request. `search_tickets` never queries outside the caller's tenant; the model never sees another tenant's data.
2. **Approval gate** — `mutate_ticket` has `needsApproval: true` (AI SDK). Execution pauses until the user approves or denies in a blocking modal.
3. **Re-validation on execute** — `TicketStore` resolves tickets within the caller's tenant only (by id or display id like `MER-101`). Updates cannot change `id`, `displayId`, or `tenantId`.
4. **Spotlighting (soft)** — attacker-controlled descriptions are wrapped in `<<<UNTRUSTED_TICKET_CONTENT>>>` markers so the model treats them as data, not instructions. Hard guarantees above hold even if it ignores this.

## Tests

```bash
npm test
```

| Category | What it checks |
|----------|----------------|
| Tenant isolation (read) | No cross-tenant data in search results |
| Cross-tenant mutation | Cannot update/delete another tenant's ticket |
| Approval gate | `mutate_ticket` requires approval; `search_tickets` does not |
| Identity tampering | Update cannot change id, displayId, tenantId |
| Spotlighting | Untrusted descriptions are delimited in tool output |

## With more time

- Replace in-memory store with DynamoDB (needed for multi-instance deploy)
- Real auth (Cognito/JWT) instead of `X-Tenant-ID`
- Signed tool approvals (`experimental_toolApprovalSecret`)
- Persistent chat sessions

Optional AWS deploy notes: [`deploy/aws/README.md`](deploy/aws/README.md)

## AI tools usage

Built with Cursor for scaffolding and iteration. Design decisions (tenant scoping, approval gates, tests) were reviewed and can be walked through live.

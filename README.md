# Guarded Ticket Agent

Multi-tenant chat agent: `search_tickets` (read-only) + `mutate_ticket` (update/delete with UI approval).

<img width="1470" height="837" alt="image" src="https://github.com/user-attachments/assets/ce2cb888-5ef8-4281-a4da-315f009ddf63" />


## Run

```bash
cp .env.example .env   # set GOOGLE_GENERATIVE_AI_API_KEY
npm install
npm run dev
```

Client: http://localhost:5174 · Server: http://localhost:4001

## Architecture

React chat UI → `POST /api/chat` (`X-Tenant-ID` header) → Gemini → 2 tools → in-memory `TicketStore`.

- **search_tickets** — auto-runs, tenant-scoped at tool level
- **mutate_ticket** — `needsApproval: true`, blocking modal before execute

## Security

- Tenant from `X-Tenant-ID` only, baked into tools via closure — model cannot widen scope
- Mutations require explicit UI approval (not prompt-only)
- Store re-validates tenant on execute; updates cannot change `id` / `displayId` / `tenantId`
- Injection payloads in ticket descriptions are spotlighted, not trusted as instructions

## Tests

```bash
npm test
```

Covers tenant isolation, cross-tenant mutation, approval gate, identity tampering, spotlighting.

## With more time

DynamoDB, real auth (JWT/Cognito), signed approvals, persistent sessions.

Built with Cursor; design decisions can be walked through live.

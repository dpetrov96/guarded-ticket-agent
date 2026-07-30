# Guarded Ticket Agent

Multi-tenant chat agent with **tenant-scoped tools** and **human-in-the-loop approval** for destructive ticket mutations. Built for the Quickbase craft exercise.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite, TypeScript, Tailwind, shadcn/ui, assistant-ui |
| Backend | Express 5, TypeScript, Vercel AI SDK, Gemini |
| Auth stand-in | `X-Tenant-ID` header |

## Quick start

```bash
cp .env.example .env
# Add GOOGLE_GENERATIVE_AI_API_KEY when chat is implemented

npm install
npm run dev
```

- **Client**: http://localhost:5174
- **Server**: http://localhost:4001

## Project structure

```
client/          React UI (Vite)
server/          Express API + agent tools
  src/lib/       tenant context, ticket store, tools
  tests/         adversarial security tests
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start client + server concurrently |
| `npm run build` | Build both workspaces |
| `npm test` | Run server tests (Vitest) |

## Status

- [x] Monorepo scaffold (React + Express)
- [x] Tenant header validation on server
- [x] shadcn/ui components (Button, Dialog, Select)
- [ ] Ticket store + seed data with injection payloads
- [ ] Streaming `/api/chat` with tools
- [ ] Chat UI + approval modal
- [ ] Adversarial tests
- [ ] Full README (architecture, security model)

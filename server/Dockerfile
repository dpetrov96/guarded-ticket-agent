# --- Build stage ---
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY server/package.json ./server/

RUN npm ci -w server

COPY server/tsconfig.json ./server/
COPY server/src ./server/src

RUN npm run build -w server

# --- Production stage ---
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY server/package.json ./server/

RUN npm ci -w server --omit=dev && npm cache clean --force

COPY --from=builder /app/server/dist ./server/dist

EXPOSE 4001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4001/health || exit 1

USER node

CMD ["node", "server/dist/index.js"]

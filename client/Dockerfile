# --- Build stage ---
FROM node:22-alpine AS builder

WORKDIR /app

ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
COPY client/package.json ./client/

RUN npm ci -w client

COPY client/index.html client/vite.config.ts client/tsconfig.json client/postcss.config.mjs ./client/
COPY client/components.json ./client/
COPY client/public ./client/public
COPY client/src ./client/src

RUN npm run build -w client

# --- Production stage ---
FROM nginx:1.27-alpine AS runner

COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/client/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

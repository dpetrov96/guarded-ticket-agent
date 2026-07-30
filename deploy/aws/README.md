# AWS Deployment Guide

Target architecture for **guarded-ticket-agent** on AWS.

## Recommended layout

```
                    ┌─────────────────┐
                    │   CloudFront    │
                    └────────┬────────┘
              ┌──────────────┼──────────────┐
              │              │              │
         S3 (React)    /api/* → ALB    /health → ALB
                              │
                         ECS Fargate
                         (Express server)
                              │
                    Secrets Manager (Gemini key)
                    DynamoDB (future — tickets)
```

## Components

| Component | AWS service | Artifact |
|-----------|-------------|----------|
| React UI | S3 + CloudFront | `client/dist/` or `client/Dockerfile` |
| Express API | ECS Fargate + ALB | `server/Dockerfile` |
| LLM API key | Secrets Manager / SSM | `GOOGLE_GENERATIVE_AI_API_KEY` |
| Health checks | ALB target group | `GET /health` |

## Environment variables

### Server (ECS task)

| Variable | Required | Example |
|----------|----------|---------|
| `NODE_ENV` | yes | `production` |
| `PORT` | yes | `4001` |
| `ALLOWED_ORIGINS` | yes | `https://app.example.com` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | yes (via Secrets Manager) | — |

### Client (build-time, CI/CD)

| Variable | Required | Example |
|----------|----------|---------|
| `VITE_API_URL` | depends | see below |

**`VITE_API_URL` options:**

- **CloudFront same-origin** (recommended): leave empty. Route `/api/*` and `/health` to ALB in CloudFront. Client uses relative URLs.
- **Split domains**: set to `https://api.example.com`. Update `ALLOWED_ORIGINS` on server to match the frontend origin.

## Deploy server to ECS

```bash
# Build & push to ECR
aws ecr get-login-password --region REGION | docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com

docker build -f server/Dockerfile -t guarded-ticket-agent-server .
docker tag guarded-ticket-agent-server:latest ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/guarded-ticket-agent-server:latest
docker push ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/guarded-ticket-agent-server:latest
```

Use [`ecs-task-definition.example.json`](./ecs-task-definition.example.json) as a starting point.

### ALB settings for streaming chat

When `/api/chat` is implemented (SSE streaming):

- Set idle timeout ≥ **120 seconds**
- Disable response buffering on the target group if using a reverse proxy
- Prefer ECS over Lambda for long-lived streams

## Deploy client to S3 + CloudFront

```bash
# Same-origin (CloudFront routes /api to ALB)
npm run build -w client

# Or split API domain
VITE_API_URL=https://api.example.com npm run build -w client

aws s3 sync client/dist/ s3://your-bucket-name/ --delete
aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID --paths "/*"
```

## Local production smoke test

```bash
cp .env.example .env
# set GOOGLE_GENERATIVE_AI_API_KEY

docker compose up --build
# Client: http://localhost:8080
# Server: http://localhost:4001/health
```

## Production checklist

- [ ] `ALLOWED_ORIGINS` set to real frontend URL(s)
- [ ] Gemini key in Secrets Manager, not plain env in task definition
- [ ] ALB health check → `/health`
- [ ] CloudFront `/api/*` behavior → ALB origin
- [ ] In-memory ticket store → DynamoDB before scaling ECS tasks > 1
- [ ] Replace `X-Tenant-ID` with real auth (Cognito + JWT claims) for production

import "./load-env.js";
import cors from "cors";
import express from "express";

import { config } from "./lib/config.js";
import { chatRouter } from "./routes/chat.js";
import { tenantsRouter } from "./routes/tenants.js";
import { ticketsRouter } from "./routes/tickets.js";

const app = express();

// Required behind ALB / CloudFront so req.ip and secure cookies work correctly.
app.set("trust proxy", 1);

app.use(
  cors({
    origin: config.allowedOrigins,
    allowedHeaders: ["Content-Type", "X-Tenant-ID"],
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    env: config.nodeEnv,
    chatConfigured: Boolean(config.geminiApiKey),
  });
});

app.use("/api", chatRouter);
app.use("/api", tenantsRouter);
app.use("/api", ticketsRouter);

app.listen(config.port, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${config.port}`);
});

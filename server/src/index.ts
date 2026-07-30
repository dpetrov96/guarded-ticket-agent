import "dotenv/config";
import cors from "cors";
import express from "express";

import { chatRouter } from "./routes/chat.js";

const app = express();
const port = Number(process.env.PORT ?? 4001);

app.use(
  cors({
    origin: ["http://localhost:5174", "http://127.0.0.1:5174"],
    allowedHeaders: ["Content-Type", "X-Tenant-ID"],
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", chatRouter);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

import rateLimit from "express-rate-limit";

import { config } from "../config.js";

type ChatRateLimitOptions = {
  max?: number;
  windowMs?: number;
};

export function createChatRateLimiter(options: ChatRateLimitOptions = {}) {
  return rateLimit({
    windowMs: options.windowMs ?? config.chatRateLimitWindowMs,
    max: options.max ?? config.chatRateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      const tenant = String(req.headers["x-tenant-id"] ?? "unknown");
      return `${req.ip ?? "unknown"}:${tenant}`;
    },
    message: {
      error: "Too many chat requests. Please try again later.",
    },
  });
}

export const chatRateLimiter = createChatRateLimiter();

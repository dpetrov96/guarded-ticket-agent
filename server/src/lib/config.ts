function parseAllowedOrigins(raw: string | undefined): string[] {
  if (!raw?.trim()) {
    return ["http://localhost:5174", "http://127.0.0.1:5174"];
  }

  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function parsePositiveInt(raw: string | undefined, fallback: number): number {
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4001),
  allowedOrigins: parseAllowedOrigins(process.env.ALLOWED_ORIGINS),
  geminiApiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  // flash-lite has the most generous free-tier quota and supports tool calling;
  // each chat turn costs 2+ requests (tool loop), so quota matters for the demo.
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-flash-lite-latest",
  isProduction: (process.env.NODE_ENV ?? "development") === "production",
  chatRateLimitMax: parsePositiveInt(process.env.CHAT_RATE_LIMIT_MAX, 30),
  chatRateLimitWindowMs: parsePositiveInt(
    process.env.CHAT_RATE_LIMIT_WINDOW_MS,
    15 * 60 * 1000,
  ),
} as const;

export function requireGeminiApiKey(): string {
  const key = config.geminiApiKey;
  if (!key) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not configured");
  }
  return key;
}

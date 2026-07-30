import { describe, expect, it, vi } from "vitest";

describe("config allowed origins", () => {
  it("defaults to local dev origins when ALLOWED_ORIGINS is unset", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", "");
    vi.resetModules();
    const { config } = await import("../src/lib/config.js");
    expect(config.allowedOrigins).toContain("http://localhost:5174");
  });

  it("parses comma-separated production origins", async () => {
    vi.stubEnv(
      "ALLOWED_ORIGINS",
      "https://app.example.com,https://www.example.com",
    );
    vi.resetModules();
    const { config } = await import("../src/lib/config.js");
    expect(config.allowedOrigins).toEqual([
      "https://app.example.com",
      "https://www.example.com",
    ]);
  });
});

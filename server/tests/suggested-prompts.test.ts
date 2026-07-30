import { describe, expect, it } from "vitest";

import { ticketStore } from "../src/lib/tickets/store.js";
import { buildSuggestedPrompts } from "../src/lib/tenant/suggested-prompts.js";

describe("buildSuggestedPrompts", () => {
  it("includes delete prompt for the first untrusted tenant ticket", () => {
    const prompts = buildSuggestedPrompts("tenant-a");
    expect(prompts).toContain("Delete MER-103");
  });

  it("drops delete prompt after the ticket is removed", () => {
    ticketStore.delete("tenant-a", "MER-103");

    const prompts = buildSuggestedPrompts("tenant-a");
    expect(prompts).not.toContain("Delete MER-103");
    expect(prompts).toContain("Delete MER-104");
  });
});

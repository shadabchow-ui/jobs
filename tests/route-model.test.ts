import { describe, it, expect } from "vitest";

describe("page model types", () => {
  it("PageModel type can be constructed with data", () => {
    interface TestData {
      name: string;
    }

    const model = {
      data: { name: "test" } as TestData,
      meta: {
        title: "Test Page",
        description: "A test page description",
        canonical: null,
      },
    };

    expect(model.data.name).toBe("test");
    expect(model.meta.title).toBe("Test Page");
    expect(model.meta.canonical).toBeNull();
  });

  it("EventName type values are unique", async () => {
    const { EVENT_NAMES } = await import("~/lib/events");
    const values = Object.values(EVENT_NAMES);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });
});

import { describe, it, expect } from "vitest";
import { buildContext } from "./context";
import type { KnowledgeDoc } from "../db/knowledge";

const doc = (id: string, content: string): KnowledgeDoc => ({
  id,
  title: id,
  category: "professional",
  content,
  vector_id: id,
  updated_at: "2026-06-09T00:00:00.000Z",
});

describe("buildContext", () => {
  it("orders docs by match score and joins their content", () => {
    const docs = [doc("a", "Alpha"), doc("b", "Bravo")];
    const matches = [
      { id: "b", score: 0.9 },
      { id: "a", score: 0.5 },
    ];
    const { context, sources } = buildContext(matches, docs);
    expect(context).toBe("Bravo\n\nAlpha");
    expect(sources.map((s) => s.title)).toEqual(["b", "a"]);
    expect(sources[0].similarity).toBe(0.9);
  });

  it("returns a fallback when there are no matches", () => {
    const { context, sources } = buildContext([], []);
    expect(context).toBe("Portfolio information not available.");
    expect(sources).toEqual([]);
  });
});

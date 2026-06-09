import type { KnowledgeDoc } from "../db/knowledge";

export interface Source {
  title: string;
  filePath: string;
  similarity: number;
}

/** Given scored matches and the fetched docs, assemble the prompt context
 *  and source list in match order. */
export function buildContext(
  matches: Array<{ id: string; score: number }>,
  docs: KnowledgeDoc[]
): { context: string; sources: Source[] } {
  if (matches.length === 0) {
    return { context: "Portfolio information not available.", sources: [] };
  }
  const byId = new Map(docs.map((d) => [d.id, d]));
  const ordered = matches
    .map((m) => ({ match: m, doc: byId.get(m.id) }))
    .filter((x): x is { match: typeof x.match; doc: KnowledgeDoc } => !!x.doc);

  const context = ordered.map((x) => x.doc.content).join("\n\n");
  const sources = ordered.map((x) => ({
    title: x.doc.title,
    filePath: x.doc.id,
    similarity: x.match.score,
  }));
  return { context, sources };
}

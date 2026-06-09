"use client";

import { useEffect, useState } from "react";

interface Row {
  id: string;
  slug: string;
  data: Record<string, unknown>;
  featured: boolean;
  sort_order: number;
}

export default function ProjectsTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  async function load() {
    const res = await fetch("/api/admin/projects");
    if (res.ok) setRows(await res.json());
  }
  useEffect(() => {
    load();
  }, []);

  function edit(r: Row) {
    setEditing(r);
    setText(JSON.stringify(r.data, null, 2));
  }

  async function save() {
    if (!editing) return;
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(text);
    } catch {
      setStatus("Invalid JSON.");
      return;
    }
    setStatus("Saving…");
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing.id,
        slug: editing.slug,
        data,
        featured: editing.featured,
        sort_order: editing.sort_order,
      }),
    });
    setStatus(res.ok ? "Saved." : `Error ${res.status}`);
    if (res.ok) {
      setEditing(null);
      load();
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/projects?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setStatus(res.ok ? "Deleted." : `Error ${res.status}`);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-brand-text">Projects</h2>
        <button
          className="px-3 py-1.5 rounded-lg bg-brand-primary text-white text-sm"
          onClick={() => {
            const blank: Row = {
              id: "",
              slug: "",
              data: {},
              featured: false,
              sort_order: rows.length,
            };
            setEditing(blank);
            setText("{}");
          }}
        >
          + New project
        </button>
      </div>

      {editing ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              placeholder="id"
              value={editing.id}
              onChange={(e) => setEditing({ ...editing, id: e.target.value })}
            />
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              placeholder="slug"
              value={editing.slug}
              onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
            />
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={editing.featured}
                onChange={(e) =>
                  setEditing({ ...editing, featured: e.target.checked })
                }
              />
              featured
            </label>
          </div>
          <textarea
            className="w-full border rounded-lg px-3 py-2 text-xs font-mono h-96"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex gap-2 items-center">
            <button
              className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm"
              onClick={save}
            >
              Save
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 text-sm"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
            <span className="text-sm text-brand-text/70">{status}</span>
          </div>
        </div>
      ) : (
        <ul className="divide-y">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-brand-text">
                  {String((r.data as { title?: string }).title ?? r.slug)}
                </p>
                <p className="text-xs text-brand-text/60">
                  {r.slug} {r.featured ? "· featured" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-sm text-brand-primary"
                  onClick={() => edit(r)}
                >
                  Edit
                </button>
                <button className="text-sm text-red-600" onClick={() => remove(r.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!editing && status && <p className="text-sm text-brand-text/70">{status}</p>}
    </div>
  );
}

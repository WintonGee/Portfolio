"use client";

import { useEffect, useState } from "react";

interface Doc {
  id: string;
  title: string;
  category: string;
  content: string;
}

export default function KnowledgeTab() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [editing, setEditing] = useState<Doc | null>(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const res = await fetch("/api/admin/knowledge");
      if (res.ok) setDocs(await res.json());
      else setStatus(`Error ${res.status}`);
    } catch {
      setStatus("Network error — failed to load.");
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing || saving) return;
    setSaving(true);
    setStatus("Saving…");
    try {
      const res = await fetch("/api/admin/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      setStatus(res.ok ? "Saved + re-embedded." : `Error ${res.status}`);
      if (res.ok) {
        setEditing(null);
        load();
      }
    } catch {
      setStatus("Network error — try again.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    setStatus("Deleting…");
    try {
      const res = await fetch(`/api/admin/knowledge?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      setStatus(res.ok ? "Deleted." : `Error ${res.status}`);
    } catch {
      setStatus("Network error — try again.");
    }
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-brand-text">Chatbot Knowledge</h2>
        <button
          className="px-3 py-1.5 rounded-lg bg-brand-primary text-white text-sm"
          onClick={() =>
            setEditing({ id: "", title: "", category: "professional", content: "" })
          }
        >
          + New doc
        </button>
      </div>

      {editing ? (
        <div className="space-y-3">
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="id (e.g. professional/summary)"
            value={editing.id}
            onChange={(e) => setEditing({ ...editing, id: e.target.value })}
          />
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              placeholder="title"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            />
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              placeholder="category"
              value={editing.category}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
            />
          </div>
          <textarea
            className="w-full border rounded-lg px-3 py-2 text-sm font-mono h-64"
            placeholder="# Markdown content"
            value={editing.content}
            onChange={(e) => setEditing({ ...editing, content: e.target.value })}
          />
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm disabled:opacity-50"
              onClick={save}
              disabled={saving}
            >
              Save
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 text-sm"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
            <span className="text-sm text-brand-text/70 self-center">{status}</span>
          </div>
        </div>
      ) : (
        <ul className="divide-y">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-brand-text">{d.title}</p>
                <p className="text-xs text-brand-text/60">{d.id}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-sm text-brand-primary"
                  onClick={() => setEditing(d)}
                >
                  Edit
                </button>
                <button className="text-sm text-red-600" onClick={() => remove(d.id)}>
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

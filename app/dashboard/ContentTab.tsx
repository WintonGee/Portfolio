"use client";

import { useEffect, useState } from "react";

const KEYS = ["about", "skills", "timeline"] as const;
type Key = (typeof KEYS)[number];

export default function ContentTab() {
  const [key, setKey] = useState<Key>("about");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus("Loading…");
      const res = await fetch(`/api/admin/content/${key}`);
      if (cancelled) return;
      if (res.ok) {
        setText(JSON.stringify(await res.json(), null, 2));
        setStatus("");
      } else {
        setStatus(`Error ${res.status}`);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [key]);

  async function save() {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      setStatus("Invalid JSON — fix before saving.");
      return;
    }
    setStatus("Saving…");
    const res = await fetch(`/api/admin/content/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    });
    setStatus(res.ok ? "Saved." : `Error ${res.status}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {KEYS.map((k) => (
          <button
            key={k}
            onClick={() => setKey(k)}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              key === k ? "bg-brand-primary text-white" : "bg-white/60"
            }`}
          >
            {k}
          </button>
        ))}
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
        <span className="text-sm text-brand-text/70">{status}</span>
      </div>
    </div>
  );
}

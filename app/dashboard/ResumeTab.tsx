"use client";

import { useEffect, useState } from "react";

interface Meta {
  filename: string;
  size: number | null;
  updated_at: string;
}

export default function ResumeTab() {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [status, setStatus] = useState("");

  async function load() {
    const res = await fetch("/api/admin/resume");
    if (res.ok) setMeta(await res.json());
  }
  useEffect(() => {
    load();
  }, []);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("Uploading…");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/resume", { method: "POST", body: form });
    setStatus(res.ok ? "Uploaded." : `Error ${res.status}`);
    load();
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-brand-text">Resume</h2>
      {meta && (
        <p className="text-sm text-brand-text/70">
          Current: {meta.filename} ({meta.size ?? "?"} bytes) — updated {meta.updated_at}
        </p>
      )}
      {/* No <iframe>: next.config.mjs sets a global `frame-ancestors 'none'` CSP +
          X-Frame-Options: DENY, which blocks framing /resume even same-origin.
          Link out instead. */}
      <a
        href="/resume"
        target="_blank"
        rel="noreferrer"
        className="inline-block px-4 py-2 rounded-lg bg-white/60 text-brand-text text-sm hover:bg-white"
      >
        Open current resume ↗
      </a>
      <br />
      <label className="inline-block">
        <span className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm cursor-pointer">
          Upload new PDF
        </span>
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={upload}
        />
      </label>
      <span className="text-sm text-brand-text/70 ml-3">{status}</span>
    </div>
  );
}

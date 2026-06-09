"use client";

import { useState } from "react";
import KnowledgeTab from "./KnowledgeTab";
import ContentTab from "./ContentTab";
import ProjectsTab from "./ProjectsTab";
import ResumeTab from "./ResumeTab";

const TABS = ["Knowledge", "Resume", "Site Content", "Projects"] as const;
type Tab = (typeof TABS)[number];

export default function DashboardClient({ email }: { email: string }) {
  const [tab, setTab] = useState<Tab>("Knowledge");
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-beige to-brand-beige-light p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-brand-text">Dashboard</h1>
          <span className="text-sm text-brand-text/70">{email}</span>
        </header>
        <nav className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                tab === t
                  ? "bg-brand-primary text-white"
                  : "bg-white/60 text-brand-text hover:bg-white"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
        <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-organic-lg">
          {tab === "Knowledge" && <KnowledgeTab />}
          {tab === "Resume" && <ResumeTab />}
          {tab === "Site Content" && <ContentTab />}
          {tab === "Projects" && <ProjectsTab />}
        </section>
      </div>
    </main>
  );
}

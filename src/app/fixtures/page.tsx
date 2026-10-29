"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import MatchCard from "@/components/MatchCard";
import { DEMO_MATCHES, MatchEvent } from "@/lib/data";

const CATEGORIES = ["All Events", "Track Sprints", "Relays", "Field Events"];

export default function FixturesPage() {
  const [selectedFilter, setSelectedFilter] = useState("All Events");

  const filteredMatches = DEMO_MATCHES.filter((m) => {
    if (selectedFilter === "All Events") return true;
    if (selectedFilter === "Track Sprints") return m.eventName.toLowerCase().includes("sprint") || m.eventName.toLowerCase().includes("100m") || m.eventName.toLowerCase().includes("200m") || m.eventName.toLowerCase().includes("400m");
    if (selectedFilter === "Relays") return m.eventName.toLowerCase().includes("relay");
    if (selectedFilter === "Field Events") return m.category === "field";
    return true;
  });

  const live = filteredMatches.filter((m) => m.status === "live");
  const upcoming = filteredMatches.filter((m) => m.status === "upcoming");
  const finished = filteredMatches.filter((m) => m.status === "finished");

  const Section = ({ title, matches, accent }: { title: string; matches: MatchEvent[]; accent: string }) =>
    matches.length === 0 ? null : (
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 4, height: 22, borderRadius: 2, background: accent }} />
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#f1f5f9" }}>{title}</h2>
          <span style={{ background: "rgba(255,255,255,0.06)", borderRadius: 999, padding: "2px 10px", fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>
            {matches.length}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
          {matches.map((m) => <MatchCard key={m.id} match={m} showVenue />)}
        </div>
      </div>
    );

  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px 80px" }}>
        <div className="fade-up" style={{ marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 999, padding: "5px 14px", marginBottom: 12 }}>
            <span style={{ fontSize: "0.85rem" }}>🏃</span>
            <span style={{ fontSize: "0.78rem", color: "#818cf8", fontWeight: 700, letterSpacing: "0.08em" }}>
              ATHLETICS SCHEDULE
            </span>
          </div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "2.2rem", color: "#f1f5f9", marginBottom: 8 }}>
            Heats &amp; Results
          </h1>
          <p style={{ color: "#64748b" }}>Season 2026 · Official track &amp; field schedule, live heats, and finalized results</p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 36, flexWrap: "wrap" }}>
          {CATEGORIES.map((f) => {
            const active = selectedFilter === f;
            return (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                style={{
                  padding: "7px 16px",
                  borderRadius: 8,
                  border: active ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.08)",
                  background: active ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
                  color: active ? "#818cf8" : "#94a3b8",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>

        <Section title="🔴 Live Heats Now" matches={live} accent="#ef4444" />
        <Section title="📅 Upcoming Track & Field Finals" matches={upcoming} accent="#6366f1" />
        <Section title="✅ Concluded Results & Points" matches={finished} accent="#4ade80" />
      </div>
    </main>
  );
}

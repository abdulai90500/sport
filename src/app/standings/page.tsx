import Navbar from "@/components/Navbar";
import StandingsTable from "@/components/StandingsTable";
import HallCard from "@/components/HallCard";
import { DEMO_STANDINGS, getHall } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Athletics Championship Leaderboard | Inter-Hall",
  description: "Official points table, medal tallies and hall rankings for the Inter-Hall Athletics Championship.",
};

export default function StandingsPage() {
  const sorted = [...DEMO_STANDINGS].sort((a, b) => b.pts - a.pts);
  const leader = sorted[0];
  const leaderHall = getHall(leader.hall);

  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 24px 80px" }}>

        <div className="fade-up" style={{ marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 999, padding: "5px 14px", marginBottom: 12 }}>
            <span style={{ fontSize: "0.85rem" }}>🏆</span>
            <span style={{ fontSize: "0.78rem", color: "#818cf8", fontWeight: 700, letterSpacing: "0.08em" }}>
              OFFICIAL CHAMPIONSHIP LEADERBOARD
            </span>
          </div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "2.4rem", color: "#f1f5f9", marginBottom: 8 }}>
            Hall Standings &amp; Points Table
          </h1>
          <p style={{ color: "#64748b" }}>Season 2026 Inter-Hall Athletics Points Table · Live verification by track officials</p>
        </div>

        {/* Leader banner */}
        <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(13,13,31,0.97))", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, padding: "28px 32px", marginBottom: 40, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", boxShadow: "0 0 32px rgba(99,102,241,0.2)" }}>
          <div style={{ fontSize: "3rem" }}>🏆</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.75rem", color: "#818cf8", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
              {leader.pts > 0 ? `Championship Leader: ${leaderHall.name}` : "Championship Opening · All Halls at 0 Points"}
            </div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.8rem", color: leader.pts > 0 ? leaderHall.color : "#f1f5f9" }}>
              {leader.pts > 0 ? leaderHall.name : "Season 2026 Starting Leaderboard"}
            </div>
            <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              {leader.pts > 0
                ? `🥇 ${leader.gold} Golds · 🥈 ${leader.silver} Silvers · 🥉 ${leader.bronze} Bronzes`
                : "All four Halls (Blue, Black, Gold, Purple) are tied at 0 points awaiting verified event results."}
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="score-num" style={{ fontSize: "3.5rem", color: "#f1f5f9" }}>{leader.pts}</div>
            <div style={{ fontSize: "0.8rem", color: "#64748b" }}>championship points</div>
          </div>
        </div>

        {/* Full Leaderboard Table (Football-style league table for Athletics) */}
        <div className="glass-card" style={{ padding: "8px 0", marginBottom: 48, border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ padding: "20px 24px 8px" }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#f1f5f9" }}>
              Official Points &amp; Medal Standing Table
            </h2>
          </div>
          <StandingsTable />
        </div>

        {/* Hall cards */}
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#f1f5f9", marginBottom: 24 }}>Hall Profiles</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          {sorted.map((row) => (
            <HallCard key={row.hall} hall={row.hall} score={row.pts} size="md" showScore />
          ))}
        </div>

        {/* Scoring rules */}
        <div className="glass-card" style={{ padding: "24px", marginTop: 48 }}>
          <h3 style={{ fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>📋 Athletics Points Scoring System</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { label: "1st Place (Gold)", pts: "+10 pts (+15 Relay)", color: "#fbbf24" },
              { label: "2nd Place (Silver)", pts: "+8 pts (+10 Relay)", color: "#cbd5e1" },
              { label: "3rd Place (Bronze)", pts: "+6 pts (+6 Relay)", color: "#d97706" },
              { label: "4th Place", pts: "+4 pts", color: "#94a3b8" },
            ].map((r) => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(255,255,255,0.04)", borderRadius: 10 }}>
                <span style={{ color: "#94a3b8", fontWeight: 500 }}>{r.label}</span>
                <span style={{ color: r.color, fontWeight: 700 }}>{r.pts}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

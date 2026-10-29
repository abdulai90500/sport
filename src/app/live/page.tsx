import Navbar from "@/components/Navbar";
import MatchCard from "@/components/MatchCard";
import LiveTicker from "@/components/LiveTicker";
import BreakingLiveBanner from "@/components/BreakingLiveBanner";
import { DEMO_MATCHES, DEMO_STANDINGS, getHall } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Athletics Scores & Heats | Inter-Hall",
  description: "Real-time track and field live event marks, heat scores, and updates for the Inter-Hall Athletics Championship.",
};

export default function LivePage() {
  const live = DEMO_MATCHES.filter((m) => m.status === "live");

  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ paddingTop: 64 }}>
        <BreakingLiveBanner />
        <LiveTicker />
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 40, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 999, padding: "6px 16px", marginBottom: 16 }}>
            <span className="live-dot" />
            <span style={{ fontSize: "0.8rem", color: "#f87171", fontWeight: 700, letterSpacing: "0.1em" }}>
              TRACK &amp; FIELD BROADCAST
            </span>
          </div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "2.5rem", color: "#f1f5f9", marginBottom: 8 }}>
            Live Athletics Events
          </h1>
          <p style={{ color: "#64748b" }}>Live track marks and field attempts update in real time — no refresh needed</p>
        </div>

        {/* Live matches / heats */}
        {live.length > 0 ? (
          <div style={{ marginBottom: 60 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
              {live.map((m) => (
                <div key={m.id} style={{ position: "relative" }}>
                  <div style={{ position: "absolute", top: -8, left: 16, zIndex: 10 }}>
                    <span style={{ background: "#ef4444", color: "white", fontSize: "0.7rem", fontWeight: 800, padding: "3px 10px", borderRadius: 999, letterSpacing: "0.08em" }}>
                      🔴 LIVE HEAT
                    </span>
                  </div>
                  <MatchCard match={m} showVenue />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-card" style={{ padding: 60, textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🏃</div>
            <h2 style={{ fontWeight: 700, color: "#94a3b8", fontSize: "1.2rem", marginBottom: 8 }}>
              No Heats Currently in Progress
            </h2>
            <p style={{ color: "#475569" }}>Check the fixtures page for the upcoming track and field schedule.</p>
          </div>
        )}

        {/* Hall Score Summary */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#f1f5f9", marginBottom: 20 }}>
            Championship Live Hall Standings
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {DEMO_STANDINGS.sort((a, b) => b.pts - a.pts).map((row, i) => {
              const h = getHall(row.hall);
              return (
                <div key={row.hall} className="glass-card" style={{ padding: "20px", textAlign: "center", border: `1px solid ${h.color}44`, boxShadow: i === 0 ? `0 0 24px ${h.glow}` : undefined }}>
                  {i === 0 && <div style={{ fontSize: "0.7rem", color: h.color, fontWeight: 700, marginBottom: 6, letterSpacing: "0.08em" }}>🏆 CURRENT LEADER</div>}
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: h.color, margin: "0 auto 10px", boxShadow: `0 0 12px ${h.glow}` }} />
                  <div style={{ fontWeight: 800, color: h.color, fontSize: "0.9rem", textTransform: "uppercase", marginBottom: 4 }}>{h.name}</div>
                  <div className="score-num" style={{ fontSize: "2rem", color: "#f1f5f9" }}>{row.pts}</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>points</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time note */}
        <div style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "1.2rem" }}>⚡</span>
          <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
            This page streams instantaneous race results, lap times, and jump marks entered by verified track officials at the stadium.
          </p>
        </div>
      </div>
    </main>
  );
}

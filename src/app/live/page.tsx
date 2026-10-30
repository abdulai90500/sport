"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import LiveTicker from "@/components/LiveTicker";
import BreakingLiveBanner from "@/components/BreakingLiveBanner";
import StandingsTable from "@/components/StandingsTable";
import { HALLS, HallId, getHall, HallStanding, DEMO_STANDINGS } from "@/lib/data";
import { RaceEvent, getStoredRaces, calculateLiveStandings } from "@/lib/raceStore";
import Link from "next/link";

export default function LivePage() {
  const [races, setRaces] = useState<RaceEvent[]>([]);
  const [standings, setStandings] = useState<HallStanding[]>(DEMO_STANDINGS);
  const [activeTab, setActiveTab] = useState<"all" | "completed" | "scheduled">("all");

  useEffect(() => {
    const load = () => {
      try {
        const storedRaces = getStoredRaces();
        setRaces(storedRaces);
        const liveStandings = calculateLiveStandings(storedRaces);
        setStandings(liveStandings);
      } catch {
        setStandings(DEMO_STANDINGS);
      }
    };

    load();

    // Listen for real-time events across tabs & windows
    window.addEventListener("championship-races-changed", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("championship-races-changed", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const sortedStandings = [...standings].sort((a, b) => b.pts - a.pts);
  const leader = sortedStandings[0];
  const leaderHall = leader ? getHall(leader.hall) : getHall("blue");

  const completedRaces = races.filter((r) => r.status === "completed" && r.results);
  const scheduledRaces = races.filter((r) => r.status !== "completed");

  const displayedRaces =
    activeTab === "completed"
      ? completedRaces
      : activeTab === "scheduled"
      ? scheduledRaces
      : races;

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <Navbar />

      <div style={{ paddingTop: 64 }}>
        <BreakingLiveBanner />
        <LiveTicker />
      </div>

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 24px 80px" }}>
        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 36, textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 999,
              padding: "6px 16px",
              marginBottom: 14,
            }}
          >
            <span className="live-dot" />
            <span style={{ fontSize: "0.8rem", color: "#f87171", fontWeight: 800, letterSpacing: "0.1em" }}>
              TRACK &amp; FIELD OFFICIAL LIVE BROADCAST
            </span>
          </div>

          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "2.4rem", color: "#f1f5f9", marginBottom: 8 }}>
            Live Athletics Championship Stream
          </h1>
          <p style={{ color: "#94a3b8", maxWidth: 640, margin: "0 auto", fontSize: "0.92rem" }}>
            Real-time track marks, verified 1st–4th place scores, and dynamic hall points update instantaneously as judges submit and correct scores.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 16 }}>
            <Link
              href="/admin/judge"
              style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "#38bdf8",
                background: "rgba(56,189,248,0.1)",
                border: "1px solid rgba(56,189,248,0.3)",
                padding: "6px 14px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              ⚖️ Judge Scoring Desk →
            </Link>
            <Link
              href="/admin/races"
              style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "#818cf8",
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.3)",
                padding: "6px 14px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              🏁 Race Registrar →
            </Link>
          </div>
        </div>

        {/* ─── LIVE HALL SCORE SUMMARY CARDS ─── */}
        <div style={{ marginBottom: 44 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#f1f5f9" }}>
                Championship Live Hall Standings
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.82rem" }}>
                Points calculated strictly from verified 1st, 2nd, 3rd, and 4th place race awards
              </p>
            </div>
            {leader && leader.pts > 0 && (
              <span style={{ fontSize: "0.8rem", color: leaderHall.color, fontWeight: 800, background: "rgba(255,255,255,0.05)", padding: "4px 12px", borderRadius: 999, border: `1px solid ${leaderHall.color}44` }}>
                🏆 Current Leader: {leaderHall.name} ({leader.pts} pts)
              </span>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {sortedStandings.map((row, i) => {
              const h = getHall(row.hall);
              const isLeader = i === 0 && row.pts > 0;
              return (
                <div
                  key={row.hall}
                  className="glass-card"
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    border: `1px solid ${h.color}55`,
                    borderTop: `4px solid ${h.color}`,
                    boxShadow: isLeader ? `0 0 24px ${h.glow}` : undefined,
                    position: "relative",
                  }}
                >
                  {isLeader && (
                    <div style={{ fontSize: "0.7rem", color: h.color, fontWeight: 900, marginBottom: 6, letterSpacing: "0.08em" }}>
                      🏆 CURRENT LEADER
                    </div>
                  )}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: h.color,
                      margin: "0 auto 10px",
                      boxShadow: `0 0 14px ${h.glow}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontWeight: 900,
                      fontSize: "1.1rem",
                    }}
                  >
                    {h.emoji}
                  </div>
                  <div style={{ fontWeight: 800, color: h.color, fontSize: "0.95rem", textTransform: "uppercase", marginBottom: 4 }}>
                    {h.name}
                  </div>
                  <div className="score-num" style={{ fontSize: "2.4rem", color: "#f1f5f9", lineHeight: 1.1 }}>
                    {row.pts}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: 10 }}>championship points</div>

                  <div style={{ display: "flex", justifyContent: "center", gap: 10, borderTop: "1px solid var(--border-color)", paddingTop: 8, fontSize: "0.75rem" }}>
                    <span style={{ color: "#fbbf24" }}>🥇 {row.gold || 0}</span>
                    <span style={{ color: "#cbd5e1" }}>🥈 {row.silver || 0}</span>
                    <span style={{ color: "#d97706" }}>🥉 {row.bronze || 0}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── LIVE HEATS & RESULTS STREAM ─── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#f1f5f9" }}>
                Championship Races &amp; Live Heats ({races.length})
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.82rem" }}>
                Official 4-athlete heats registered by the registrar and scored by the judge desk
              </p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { id: "all", label: `All Races (${races.length})` },
                { id: "completed", label: `✓ Concluded (${completedRaces.length})` },
                { id: "scheduled", label: `⏰ Upcoming (${scheduledRaces.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 6,
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: activeTab === tab.id ? "1px solid #818cf8" : "1px solid var(--border-color)",
                    background: activeTab === tab.id ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)",
                    color: activeTab === tab.id ? "#ffffff" : "#94a3b8",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {displayedRaces.length === 0 ? (
            <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🏃</div>
              <h3 style={{ color: "#94a3b8", fontSize: "1.1rem", fontWeight: 700, marginBottom: 6 }}>
                No Races in this view
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                Switch filters or register new races in the race registrar portal.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20 }}>
              {displayedRaces.map((r) => {
                const isConcluded = r.status === "completed" && r.results;
                return (
                  <div
                    key={r.id}
                    className="glass-card"
                    style={{
                      padding: "20px",
                      border: isConcluded ? "1px solid rgba(16,185,129,0.3)" : "1px solid var(--border-color)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: 16,
                    }}
                  >
                    <div>
                      {/* Race top meta */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <span
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 800,
                              padding: "2px 8px",
                              borderRadius: 999,
                              background: isConcluded ? "rgba(34,197,94,0.15)" : "rgba(99,102,241,0.15)",
                              color: isConcluded ? "#4ade80" : "#818cf8",
                            }}
                          >
                            {isConcluded ? "✓ CONCLUDED" : "⏰ SCHEDULED"}
                          </span>
                          <span
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              color: r.raceType === "group" ? "#fbbf24" : "#38bdf8",
                            }}
                          >
                            {r.raceType === "group" ? "👥 Group / Relay" : "🏃 Individual"}
                          </span>
                        </div>

                        <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontFamily: "monospace", fontWeight: 700 }}>
                          ⏰ {r.time}
                        </span>
                      </div>

                      <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.15rem", color: "#f1f5f9", marginBottom: 4 }}>
                        {r.name}
                      </h3>
                      <div style={{ fontSize: "0.78rem", color: "#64748b", marginBottom: 14 }}>
                        📍 {r.venue} · 👥 {r.athletes.length} Competitors
                      </div>

                      {/* Display either Verified Podiums (if concluded) or 4 Registered Athletes (if scheduled) */}
                      {isConcluded ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <div style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 800, textTransform: "uppercase", marginBottom: 2 }}>
                            Official Podium Results
                          </div>
                          {r.results?.positions.map((p) => {
                            const hall = getHall(p.hallId);
                            const medal = p.position === 1 ? "🥇 1st" : p.position === 2 ? "🥈 2nd" : p.position === 3 ? "🥉 3rd" : "🎖️ 4th";
                            return (
                              <div
                                key={p.position}
                                style={{
                                  background: "rgba(255,255,255,0.03)",
                                  borderLeft: `4px solid ${hall.color}`,
                                  borderRadius: 6,
                                  padding: "6px 10px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: p.position === 1 ? "#fbbf24" : "#94a3b8" }}>
                                    {medal}
                                  </span>
                                  <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#ffffff" }}>
                                    {p.athleteName}
                                  </span>
                                  <span style={{ fontSize: "0.72rem", color: hall.color, fontWeight: 600 }}>
                                    ({hall.name})
                                  </span>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                  <span style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "#38bdf8", fontWeight: 700 }}>
                                    {p.markOrTime}
                                  </span>
                                  <span style={{ fontSize: "0.72rem", color: "#4ade80", marginLeft: 6, fontWeight: 700 }}>
                                    +{p.points}pts
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <div style={{ fontSize: "0.72rem", color: "#818cf8", fontWeight: 800, textTransform: "uppercase", marginBottom: 2 }}>
                            Registered 4 Competitors
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                            {r.athletes.map((ath, idx) => {
                              const hall = getHall(ath.hallId);
                              return (
                                <div
                                  key={ath.id}
                                  style={{
                                    background: "rgba(255,255,255,0.02)",
                                    border: `1px solid ${hall.color}33`,
                                    borderLeft: `3px solid ${hall.color}`,
                                    borderRadius: 6,
                                    padding: "6px 8px",
                                  }}
                                >
                                  <div style={{ fontSize: "0.68rem", color: hall.color, fontWeight: 800 }}>
                                    LANE {ath.lane || idx + 1} · {hall.name.split(" ")[0]}
                                  </div>
                                  <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {ath.name}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer link to Judge */}
                    <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                        {isConcluded ? `Verified by ${r.results?.recordedBy}` : "Awaiting judge verification"}
                      </span>
                      <Link
                        href={`/admin/judge?eventId=${r.id}`}
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: isConcluded ? "#38bdf8" : "#818cf8",
                          textDecoration: "none",
                        }}
                      >
                        {isConcluded ? "✏️ Edit / Score in Desk →" : "⚖️ Score this Race →"}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── FULL STANDINGS TABLE ─── */}
        <div className="glass-card" style={{ padding: "8px 0", marginBottom: 40 }}>
          <div style={{ padding: "20px 24px 8px" }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#f1f5f9" }}>
              Comprehensive Medal &amp; Points Table
            </h2>
          </div>
          <StandingsTable />
        </div>
      </div>
    </main>
  );
}

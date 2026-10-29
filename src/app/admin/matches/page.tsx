"use client";
import { useState } from "react";
import { DEMO_MATCHES, HALLS, getHall, MatchEvent } from "@/lib/data";

const DISCIPLINES_LIST = [
  "Men's 100m Sprint",
  "Women's 100m Sprint",
  "Men's 200m Sprint",
  "Women's 200m Sprint",
  "Women's 400m Sprint",
  "Men's 800m Run",
  "Men's 4x100m Relay",
  "Women's 4x100m Relay",
  "Men's High Jump",
  "Women's Long Jump",
  "Men's Shot Put",
];

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<MatchEvent[]>(DEMO_MATCHES.map((m) => ({ ...m })));
  const [showCreate, setShowCreate] = useState(false);
  const [newMatch, setNewMatch] = useState({
    eventName: "Men's 100m Sprint",
    homeHall: "blue",
    awayHall: "gold",
    date: "",
    time: "",
    venue: "Main Stadium Track",
  });

  const updateScore = (id: string, team: "home" | "away", delta: number) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        return {
          ...m,
          homeScore: team === "home" ? Math.max(0, m.homeScore + delta) : m.homeScore,
          awayScore: team === "away" ? Math.max(0, m.awayScore + delta) : m.awayScore,
        };
      })
    );
  };

  const setStatus = (id: string, status: "live" | "upcoming" | "finished") => {
    setMatches((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const createMatch = () => {
    if (!newMatch.date || !newMatch.time) return;
    const id = `m${matches.length + 1}`;
    const category: "track" | "field" = newMatch.eventName.includes("Jump") || newMatch.eventName.includes("Shot") ? "field" : "track";

    setMatches((prev) => [
      ...prev,
      {
        id,
        sport: "Athletics",
        eventName: `${newMatch.eventName} — Heat Final`,
        category,
        homeHall: newMatch.homeHall,
        awayHall: newMatch.awayHall,
        homeScore: 0,
        awayScore: 0,
        status: "upcoming" as const,
        date: newMatch.date,
        time: newMatch.time,
        venue: newMatch.venue,
      },
    ]);
    setNewMatch({ eventName: "Men's 100m Sprint", homeHall: "blue", awayHall: "gold", date: "", time: "", venue: "Main Stadium Track" });
    setShowCreate(false);
  };

  const statusColor = { live: "#ef4444", upcoming: "#818cf8", finished: "#4ade80" };

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1400 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 999, padding: "3px 12px", marginBottom: 8 }}>
            <span style={{ fontSize: "0.8rem" }}>🏃</span>
            <span style={{ fontSize: "0.75rem", color: "#818cf8", fontWeight: 700 }}>ATHLETICS EVENTS &amp; HEATS</span>
          </div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.8rem", color: "#f1f5f9" }}>
            Track &amp; Field Heats &amp; Scoring
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
            {matches.length} athletics heats · Live point allocation and heat status control
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>+ Schedule Heat</button>
      </div>

      {/* Match cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {matches.map((m) => {
          const home = getHall(m.homeHall);
          const away = getHall(m.awayHall);

          return (
            <div key={m.id} className="glass-card" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                {/* Discipline + status */}
                <div style={{ minWidth: 200 }}>
                  <div style={{ fontSize: "0.92rem", color: "#f1f5f9", fontWeight: 800, marginBottom: 4 }}>
                    {m.eventName}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: 8 }}>
                    🏃 {m.category === "track" ? "Track Sprint/Relay" : "Field Event"} · {m.venue}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {(["upcoming", "live", "finished"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(m.id, s)}
                        style={{
                          padding: "3px 10px",
                          borderRadius: 999,
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          border: "1px solid",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          background: m.status === s ? `${statusColor[s]}22` : "transparent",
                          color: m.status === s ? statusColor[s] : "#475569",
                          borderColor: m.status === s ? `${statusColor[s]}55` : "rgba(255,255,255,0.08)",
                        }}
                      >
                        {s === "live" && m.status === "live" && <span className="live-dot" style={{ width: 5, height: 5, marginRight: 4 }} />}
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Halls + score points */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
                  <div style={{ textAlign: "right", minWidth: 120 }}>
                    <div style={{ fontWeight: 800, color: home.color, fontSize: "0.95rem" }}>{home.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{m.homeAthlete || "Athlete 1"}</div>
                  </div>

                  {/* Score controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {m.status === "live" && (
                      <button
                        onClick={() => updateScore(m.id, "home", -1)}
                        style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", cursor: "pointer", fontSize: "0.9rem", fontWeight: 700 }}
                      >
                        −
                      </button>
                    )}
                    <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 10, padding: "6px 16px", textAlign: "center", minWidth: 90 }}>
                      {m.status === "upcoming" ? (
                        <div>
                          <div style={{ color: "#818cf8", fontSize: "0.82rem", fontWeight: 700 }}>{m.time}</div>
                          <div style={{ color: "#64748b", fontSize: "0.7rem" }}>{m.date}</div>
                        </div>
                      ) : (
                        <div>
                          <span className="score-num" style={{ fontSize: "1.6rem", color: "#f1f5f9" }}>
                            {m.homeScore} – {m.awayScore}
                          </span>
                          <div style={{ fontSize: "0.62rem", color: "#4ade80", fontWeight: 700, textTransform: "uppercase" }}>pts</div>
                        </div>
                      )}
                    </div>
                    {m.status === "live" && (
                      <button
                        onClick={() => updateScore(m.id, "home", 1)}
                        style={{ width: 28, height: 28, borderRadius: "50%", background: `${home.color}33`, border: `1px solid ${home.color}55`, color: home.color, cursor: "pointer", fontSize: "0.9rem", fontWeight: 700 }}
                      >
                        +
                      </button>
                    )}
                  </div>

                  <div style={{ textAlign: "left", minWidth: 120 }}>
                    <div style={{ fontWeight: 800, color: away.color, fontSize: "0.95rem" }}>{away.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{m.awayAthlete || "Athlete 2"}</div>
                  </div>

                  {m.status === "live" && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => updateScore(m.id, "away", -1)}
                        style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", cursor: "pointer", fontSize: "0.9rem", fontWeight: 700 }}
                      >
                        −
                      </button>
                      <button
                        onClick={() => updateScore(m.id, "away", 1)}
                        style={{ width: 28, height: 28, borderRadius: "50%", background: `${away.color}33`, border: `1px solid ${away.color}55`, color: away.color, cursor: "pointer", fontSize: "0.9rem", fontWeight: 700 }}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  {m.status === "upcoming" && (
                    <button onClick={() => setStatus(m.id, "live")} style={{ padding: "7px 14px", borderRadius: 8, fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
                      🔴 Start Heat
                    </button>
                  )}
                  {m.status === "live" && (
                    <button onClick={() => setStatus(m.id, "finished")} style={{ padding: "7px 14px", borderRadius: 8, fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80" }}>
                      ✅ Conclude Heat
                    </button>
                  )}
                  {m.status === "finished" && (
                    <button style={{ padding: "7px 14px", borderRadius: 8, fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8" }}>
                      ✔ Verified
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24 }}>
          <div className="glass-card" style={{ padding: "32px", width: "100%", maxWidth: 480 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#f1f5f9", marginBottom: 20 }}>
              Schedule Athletics Heat
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>Discipline Event</label>
                <select className="input-field" value={newMatch.eventName} onChange={(e) => setNewMatch({ ...newMatch, eventName: e.target.value })}>
                  {DISCIPLINES_LIST.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>Hall 1</label>
                  <select className="input-field" value={newMatch.homeHall} onChange={(e) => setNewMatch({ ...newMatch, homeHall: e.target.value })}>
                    {HALLS.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>Hall 2</label>
                  <select className="input-field" value={newMatch.awayHall} onChange={(e) => setNewMatch({ ...newMatch, awayHall: e.target.value })}>
                    {HALLS.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>Date</label>
                  <input className="input-field" type="date" value={newMatch.date} onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>Time</label>
                  <input className="input-field" type="time" value={newMatch.time} onChange={(e) => setNewMatch({ ...newMatch, time: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>Venue Track / Field</label>
                <input className="input-field" placeholder="e.g. Main Stadium Olympic Track" value={newMatch.venue} onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={createMatch}>Schedule Heat</button>
                <button className="btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

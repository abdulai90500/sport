"use client";
import { useState } from "react";
import { DEMO_MATCHES, getHall, MatchEvent } from "@/lib/data";

interface Props {
  events?: MatchEvent[];
}

export default function EventsTable({ events = DEMO_MATCHES }: Props) {
  const [filter, setFilter] = useState<"all" | "sprint" | "relay" | "field">("all");

  const filtered = events.filter((e) => {
    if (filter === "all") return true;
    if (filter === "sprint") return e.eventName.toLowerCase().includes("sprint");
    if (filter === "relay") return e.eventName.toLowerCase().includes("relay");
    if (filter === "field") return e.category === "field";
    return true;
  });

  return (
    <div className="glass-card" style={{ padding: 0, overflow: "hidden", border: "1px solid var(--border-color)" }}>
      {/* Table Header Controls */}
      <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "1.2rem" }}>🏃</span>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.15rem", color: "var(--text-primary)" }}>
              Athletics Events, Names &amp; Scores Table
            </h3>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: 2 }}>
            Official championship disciplines, athlete names, marks, and hall points
          </p>
        </div>

        {/* Category Filter Buttons (No Live, No Fixture) */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[
            { id: "all", label: "All Disciplines" },
            { id: "sprint", label: "⚡ Track Sprints" },
            { id: "relay", label: "🔥 Relays" },
            { id: "field", label: "🎯 Field Events" },
          ].map((btn) => {
            const active = filter === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id as any)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: active ? "1px solid rgba(99,102,241,0.5)" : "1px solid var(--border-color)",
                  background: active ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)",
                  color: active ? "#818cf8" : "var(--text-secondary)",
                  transition: "all 0.15s ease",
                }}
              >
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)", background: "rgba(255,255,255,0.02)" }}>
              <th style={{ padding: "12px 20px", fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Event / Discipline
              </th>
              <th style={{ padding: "12px 20px", fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Competitor 1 (Hall)
              </th>
              <th style={{ padding: "12px 20px", fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Competitor 2 (Hall)
              </th>
              <th style={{ padding: "12px 20px", fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center" }}>
                Mark / Time
              </th>
              <th style={{ padding: "12px 20px", fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center" }}>
                Points Awarded
              </th>
              <th style={{ padding: "12px 20px", fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center" }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ev, idx) => {
              const home = getHall(ev.homeHall);
              const away = getHall(ev.awayHall);

              return (
                <tr
                  key={ev.id}
                  style={{
                    borderBottom: "1px solid var(--border-color)",
                    background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.012)",
                    transition: "background 0.15s ease",
                  }}
                >
                  {/* Event Name */}
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "0.92rem", lineHeight: 1.2 }}>
                      {ev.eventName}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 3 }}>
                      📍 {ev.venue}
                    </div>
                  </td>

                  {/* Competitor 1 */}
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: home.color,
                          boxShadow: `0 0 6px ${home.glow}`,
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: home.color, fontSize: "0.88rem" }}>
                          {home.name}
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)" }}>
                          {ev.homeAthlete || "Qualified Athlete"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Competitor 2 */}
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: away.color,
                          boxShadow: `0 0 6px ${away.glow}`,
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: away.color, fontSize: "0.88rem" }}>
                          {away.name}
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)" }}>
                          {ev.awayAthlete || "Qualified Athlete"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Mark / Time */}
                  <td style={{ padding: "14px 20px", textAlign: "center", whiteSpace: "nowrap" }}>
                    {ev.leaderMark ? (
                      <span style={{ fontFamily: "monospace", fontSize: "0.92rem", fontWeight: 800, color: "#f59e0b", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", padding: "3px 8px", borderRadius: 6 }}>
                        ⏱ {ev.leaderMark}
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>—</span>
                    )}
                  </td>

                  {/* Score / Points */}
                  <td style={{ padding: "14px 20px", textAlign: "center", whiteSpace: "nowrap" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.3)", padding: "4px 10px", borderRadius: 8, border: "1px solid var(--border-color)" }}>
                      <span style={{ fontWeight: 800, color: home.color, fontSize: "0.95rem" }}>{ev.homeScore}</span>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>–</span>
                      <span style={{ fontWeight: 800, color: away.color, fontSize: "0.95rem" }}>{ev.awayScore}</span>
                      <span style={{ fontSize: "0.68rem", color: "#4ade80", fontWeight: 700 }}>pts</span>
                    </div>
                  </td>

                  {/* Status Badge (Clean official status, no Live, no Fixture) */}
                  <td style={{ padding: "14px 20px", textAlign: "center", whiteSpace: "nowrap" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700, color: "#4ade80", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", letterSpacing: "0.04em" }}>
                      OFFICIAL
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

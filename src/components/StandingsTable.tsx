"use client";
import { useState, useEffect } from "react";
import { DEMO_STANDINGS, getHall, HallStanding } from "@/lib/data";
import { calculateLiveStandings } from "@/lib/raceStore";

interface Props {
  data?: HallStanding[];
  compact?: boolean;
}

const MEDALS = ["🥇", "🥈", "🥉", "4️⃣"];

export default function StandingsTable({ data, compact = false }: Props) {
  const [standings, setStandings] = useState<HallStanding[]>(data || DEMO_STANDINGS);

  useEffect(() => {
    if (data) {
      setStandings(data);
      return;
    }
    const update = () => {
      try {
        const live = calculateLiveStandings();
        setStandings(live);
      } catch {
        setStandings(DEMO_STANDINGS);
      }
    };
    update();
    window.addEventListener("championship-races-changed", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("championship-races-changed", update);
      window.removeEventListener("storage", update);
    };
  }, [data]);

  const sorted = [...standings].sort((a, b) => b.pts - a.pts);

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="standings-table">
        <thead>
          <tr>
            <th style={{ width: 44, textAlign: "center" }}>Pos</th>
            <th>Hall</th>
            <th style={{ textAlign: "center", width: 55 }}>Events</th>
            <th style={{ textAlign: "center", width: 55 }}>🥇 1st</th>
            <th style={{ textAlign: "center", width: 55 }}>🥈 2nd</th>
            <th style={{ textAlign: "center", width: 55 }}>🥉 3rd</th>
            {!compact && <th style={{ textAlign: "center", width: 70 }}>Track</th>}
            {!compact && <th style={{ textAlign: "center", width: 70 }}>Field</th>}
            <th style={{ textAlign: "center", width: 85 }}>Pts</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            const h = getHall(row.hall);
            const isLeader = i === 0;

            return (
              <tr key={row.hall} style={{ background: isLeader ? "rgba(245,158,11,0.04)" : undefined }}>
                {/* Position / Medal */}
                <td style={{ textAlign: "center", fontWeight: 700, fontSize: "1.05rem" }}>
                  {MEDALS[i] ?? i + 1}
                </td>

                {/* Hall Name & Color */}
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: h.color,
                        boxShadow: `0 0 10px ${h.glow}`,
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, color: h.color, fontSize: compact ? "0.9rem" : "1rem" }}>
                        {h.name}
                      </div>
                      {!compact && (
                        <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                          {h.motto}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Events competed */}
                <td style={{ textAlign: "center", color: "#94a3b8", fontWeight: 600 }}>
                  {row.events ?? row.w + row.d + row.l}
                </td>

                {/* Gold (1st places) */}
                <td style={{ textAlign: "center", color: "#fbbf24", fontWeight: 800 }}>
                  {row.gold ?? row.w}
                </td>

                {/* Silver (2nd places) */}
                <td style={{ textAlign: "center", color: "#cbd5e1", fontWeight: 700 }}>
                  {row.silver ?? row.d}
                </td>

                {/* Bronze (3rd places) */}
                <td style={{ textAlign: "center", color: "#d97706", fontWeight: 700 }}>
                  {row.bronze ?? row.l}
                </td>

                {/* Track Points */}
                {!compact && (
                  <td style={{ textAlign: "center", color: "#818cf8", fontWeight: 600 }}>
                    {row.trackPts ?? row.gf}
                  </td>
                )}

                {/* Field Points */}
                {!compact && (
                  <td style={{ textAlign: "center", color: "#38bdf8", fontWeight: 600 }}>
                    {row.fieldPts ?? row.ga}
                  </td>
                )}

                {/* Total Points */}
                <td style={{ textAlign: "center" }}>
                  <span
                    style={{
                      fontFamily: "'Outfit',sans-serif",
                      fontWeight: 900,
                      fontSize: "1.15rem",
                      color: isLeader ? "#fcd34d" : "var(--text-primary)",
                      background: isLeader
                        ? "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(245,158,11,0.1))"
                        : "rgba(255,255,255,0.06)",
                      border: isLeader ? "1px solid rgba(245,158,11,0.4)" : "1px solid rgba(255,255,255,0.08)",
                      padding: "4px 12px",
                      borderRadius: 8,
                      display: "inline-block",
                      minWidth: 46,
                      boxShadow: isLeader ? "0 0 14px rgba(245,158,11,0.25)" : undefined,
                    }}
                  >
                    {row.pts}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

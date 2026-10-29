"use client";
import { useEffect, useState } from "react";
import { getHall } from "@/lib/data";

export interface LiveEventBroadcast {
  id: string;
  sport: string;
  eventName: string;
  category: "track" | "field" | "court" | "pitch";
  venue: string;
  status: "LIVE" | "UPCOMING" | "CONCLUDED";
  timeElapsed?: string;
  standings: {
    position: number;
    hallId: string;
    athlete: string;
    markOrTime?: string;
    points: number;
  }[];
}

export const DEFAULT_BROADCAST: LiveEventBroadcast = {
  id: "live-ath-1",
  sport: "Athletics",
  eventName: "Men's 100m Sprint — Championship Final",
  category: "track",
  venue: "Main Stadium Olympic Track",
  status: "CONCLUDED",
  timeElapsed: "Championship Final / Official Marks",
  standings: [
    { position: 1, hallId: "blue", athlete: "Abdulai", markOrTime: "10.15s", points: 12 },
    { position: 2, hallId: "gold", athlete: "Emmanuel Mensah", markOrTime: "10.24s", points: 10 },
    { position: 3, hallId: "purple", athlete: "Samuel Koffi", markOrTime: "10.51s", points: 8 },
    { position: 4, hallId: "black", athlete: "Prince Adams", markOrTime: "10.65s", points: 6 },
  ],
};

const POSITION_MEDALS = ["1ST", "2ND", "3RD", "4TH"];

export default function BreakingLiveBanner() {
  const [broadcast, setBroadcast] = useState<LiveEventBroadcast>(DEFAULT_BROADCAST);

  useEffect(() => {
    const load = () => {
      const stored = localStorage.getItem("current_live_broadcast");
      if (stored) {
        try {
          setBroadcast(JSON.parse(stored));
        } catch {}
      }
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderTop: "3px solid #3b82f6",
        borderRadius: 16,
        padding: "18px 24px",
        position: "relative",
        boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
        transition: "background 0.2s ease",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Top bar (No "Live" wording or red pulse) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                color: "#ffffff",
                fontSize: "0.72rem",
                fontWeight: 900,
                letterSpacing: "0.1em",
                padding: "3px 12px",
                borderRadius: 4,
                textTransform: "uppercase",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              🏆 FEATURE EVENT · {broadcast.sport.toUpperCase()}
            </span>
            <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "0.02em" }}>
              {broadcast.eventName}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: "0.82rem", color: "var(--text-muted)" }}>
            <span>📍 {broadcast.venue}</span>
            {broadcast.timeElapsed && (
              <span style={{ color: "var(--text-secondary)", fontWeight: 700, background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 4, border: "1px solid var(--border-color)" }}>
                ⏱ {broadcast.timeElapsed}
              </span>
            )}
          </div>
        </div>

        {/* Positions Grid: Position + Athlete/Team + Hall Color + Points */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
          {broadcast.standings
            .sort((a, b) => a.position - b.position)
            .map((pos) => {
              const hall = getHall(pos.hallId);
              const isFirst = pos.position === 1;

              return (
                <div
                  key={pos.hallId}
                  style={{
                    background: "var(--bg-secondary)",
                    border: `1px solid ${hall.color}66`,
                    borderLeft: `5px solid ${hall.color}`,
                    borderRadius: 8,
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    boxShadow: isFirst ? `0 0 16px ${hall.glow}` : undefined,
                  }}
                >
                  {/* Position badge */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        background: hall.color,
                        color: "#ffffff",
                        fontWeight: 900,
                        fontSize: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 0 10px ${hall.glow}`,
                        flexShrink: 0,
                      }}
                    >
                      {POSITION_MEDALS[pos.position - 1] || `${pos.position}`}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--text-primary)", lineHeight: 1.2 }}>
                        {pos.athlete}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: hall.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {hall.name}
                      </div>
                    </div>
                  </div>

                  {/* Mark/Time & Points awarded */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    {pos.markOrTime && (
                      <div style={{ fontFamily: "monospace", fontSize: "0.95rem", fontWeight: 800, color: isFirst ? "#f59e0b" : "var(--text-primary)" }}>
                        {pos.markOrTime}
                      </div>
                    )}
                    <div style={{ fontSize: "0.7rem", color: "#4ade80", fontWeight: 700 }}>
                      +{pos.points} pts
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

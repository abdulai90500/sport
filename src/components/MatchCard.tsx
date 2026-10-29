"use client";
import { getHall, MatchEvent } from "@/lib/data";
import { useEffect, useState } from "react";

interface Props {
  match: MatchEvent;
  showVenue?: boolean;
}

export default function MatchCard({ match, showVenue = false }: Props) {
  const home = getHall(match.homeHall);
  const away = getHall(match.awayHall);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (match.status === "live") {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 1000);
      return () => clearTimeout(t);
    }
  }, [match.homeScore, match.awayScore, match.status]);

  const statusMap = {
    live: { label: "LIVE", css: "status-live" },
    upcoming: { label: "UPCOMING", css: "status-upcoming" },
    finished: { label: "FINAL", css: "status-finished" },
  };
  const st = statusMap[match.status];

  return (
    <div className="glass-card" style={{ padding: "20px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#f1f5f9", marginBottom: 2 }}>
            {match.eventName || "Athletics Event"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
            🏃 Athletics {showVenue && match.venue ? `· ${match.venue}` : ""}
          </div>
        </div>
        <span className={`status-pill ${st.css}`}>
          {match.status === "live" && <span className="live-dot" style={{ width: 6, height: 6 }} />}
          {st.label}
        </span>
      </div>

      {/* Score / Points Row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        {/* Home */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: home.color, margin: "0 auto 8px", boxShadow: `0 0 14px ${home.glow}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
            {home.emoji}
          </div>
          <div style={{ fontWeight: 800, fontSize: "0.85rem", color: home.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {home.name}
          </div>
          {match.homeAthlete && (
            <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 4 }}>
              {match.homeAthlete}
            </div>
          )}
        </div>

        {/* Score / Timing */}
        <div className={flash ? "score-flash" : ""} style={{ textAlign: "center", minWidth: 90, borderRadius: 12, padding: "8px 14px", background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {match.status === "upcoming" ? (
            <div style={{ color: "#64748b" }}>
              <div style={{ fontSize: "0.72rem", marginBottom: 2 }}>{match.date}</div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#94a3b8" }}>{match.time}</div>
            </div>
          ) : (
            <div>
              <div className="score-num" style={{ fontSize: "1.9rem", color: "#f1f5f9", lineHeight: 1 }}>
                {match.homeScore} <span style={{ color: "#475569", fontSize: "1.3rem" }}>–</span> {match.awayScore}
              </div>
              <div style={{ fontSize: "0.68rem", color: "#4ade80", fontWeight: 700, marginTop: 4, textTransform: "uppercase" }}>
                pts awarded
              </div>
            </div>
          )}
        </div>

        {/* Away */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: away.color, margin: "0 auto 8px", boxShadow: `0 0 14px ${away.glow}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
            {away.emoji}
          </div>
          <div style={{ fontWeight: 800, fontSize: "0.85rem", color: away.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {away.name}
          </div>
          {match.awayAthlete && (
            <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 4 }}>
              {match.awayAthlete}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

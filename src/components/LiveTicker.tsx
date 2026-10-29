"use client";
import { DEMO_MATCHES, getHall } from "@/lib/data";

export default function LiveTicker() {
  const liveMatches = DEMO_MATCHES.filter((m) => m.status === "live");

  if (liveMatches.length === 0) return null;

  const items = liveMatches.flatMap((m) => {
    const h = getHall(m.homeHall);
    const a = getHall(m.awayHall);
    return [
      `🔴 LIVE TRACK · `,
      `${m.eventName || "Athletics Final"} · `,
      `${h.name} ${m.homeScore} pts vs ${a.name} ${m.awayScore} pts`,
      m.leaderMark ? ` (Leader: ${m.leaderMark})` : "",
      `     `,
    ];
  });

  return (
    <div style={{ background: "rgba(239,68,68,0.08)", borderBottom: "1px solid rgba(239,68,68,0.2)", padding: "8px 0", overflow: "hidden" }}>
      <div className="ticker-inner" style={{ display: "inline-block" }}>
        {[...items, ...items].map((t, i) => (
          <span key={i} style={{ color: "#f87171", fontWeight: 600, fontSize: "0.8rem", marginRight: 20, letterSpacing: "0.03em" }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

import { DEMO_STANDINGS, DEMO_MATCHES, getHall } from "@/lib/data";
import AdminLiveControl from "@/components/admin/AdminLiveControl";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin & Officer Dashboard | Inter-Hall Athletics" };

const STATS = [
  { label: "Registered Athletes", value: "248", icon: "🏃", color: "#818cf8" },
  { label: "Active Live Heats",   value: "2",   icon: "🔴", color: "#f87171" },
  { label: "Completed Finals",    value: "14",  icon: "✅", color: "#4ade80" },
  { label: "Pending Eligibility", value: "7",   icon: "⏳", color: "#fbbf24" },
];

const RECENT_EVENTS = [
  { time: "14:23", action: "Race Finalized", detail: "Gold Hall 1st (10.24s) in Men's 100m Sprint (+12 pts)", admin: "officer@sports.edu" },
  { time: "14:15", action: "Heat Started", detail: "Women's 200m Sprint — Heat 2 (Purple vs Black)", admin: "officer@sports.edu" },
  { time: "13:50", action: "Final Verified", detail: "Men's 4x100m Relay approved: Gold Hall 39.88s (+15 pts)", admin: "admin@sports.edu" },
  { time: "13:30", action: "Athlete Cleared", detail: "STU047 (Kwame Darko) — eligible for Shot Put", admin: "admin@sports.edu" },
  { time: "12:00", action: "Heat Created", detail: "Women's 400m Semi-Final (Blue vs Black)", admin: "admin@sports.edu" },
];

export default function AdminDashboard() {
  const live = DEMO_MATCHES.filter((m) => m.status === "live");
  const sorted = [...DEMO_STANDINGS].sort((a, b) => b.pts - a.pts);

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 999, padding: "3px 12px", marginBottom: 8 }}>
              <span style={{ fontSize: "0.8rem" }}>⚡</span>
              <span style={{ fontSize: "0.75rem", color: "#818cf8", fontWeight: 700 }}>OFFICIAL ATHLETICS CONTROL</span>
            </div>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.8rem", color: "#f1f5f9" }}>
              Championship Desk
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Season 2026 · Inter-Hall Track &amp; Field Championship</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/admin/judge" className="btn-primary" style={{ fontSize: "0.875rem", padding: "10px 18px", display: "flex", alignItems: "center", gap: 6 }}>
              <span>⚖️</span> Judge Scoring Desk
            </a>
            <a href="/admin/races" className="btn-secondary" style={{ fontSize: "0.875rem", padding: "10px 18px", display: "flex", alignItems: "center", gap: 6 }}>
              <span>🏁</span> Race Registration &amp; Edit
            </a>
          </div>
        </div>
      </div>

      {/* Admin Breaking Event Controller (Athletics & Live What's On) */}
      <AdminLiveControl />

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 36 }}>
        {STATS.map((s) => (
          <div key={s.label} className="glass-card" style={{ padding: "22px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{s.label}</div>
                <div className="score-num" style={{ fontSize: "2.2rem", color: "#f1f5f9" }}>{s.value}</div>
              </div>
              <div style={{ fontSize: "1.8rem", opacity: 0.9 }}>{s.icon}</div>
            </div>
            <div style={{ marginTop: 12, height: 3, borderRadius: 2, background: `${s.color}33` }}>
              <div style={{ width: "60%", height: "100%", borderRadius: 2, background: s.color }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
        {/* Live heats */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="live-dot" />
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1rem", color: "#f1f5f9" }}>
                Live Heats Now
              </h2>
            </div>
            <a href="/admin/matches" style={{ fontSize: "0.8rem", color: "#818cf8", textDecoration: "none" }}>Manage →</a>
          </div>
          {live.length === 0 ? (
            <p style={{ color: "#475569", fontSize: "0.88rem" }}>No active live heats.</p>
          ) : live.map((m) => {
            const home = getHall(m.homeHall);
            const away = getHall(m.awayHall);
            return (
              <div key={m.id} style={{ padding: "14px 16px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, marginBottom: 10 }}>
                <div style={{ fontSize: "0.78rem", color: "#f1f5f9", fontWeight: 700, marginBottom: 4 }}>
                  {m.eventName}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: 8 }}>
                  📍 {m.venue} {m.leaderMark ? `· Current Mark: ${m.leaderMark}` : ""}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 700, color: home.color, fontSize: "0.9rem" }}>{home.name}</span>
                  <span className="score-num" style={{ fontSize: "1.4rem", color: "#f1f5f9" }}>{m.homeScore} – {m.awayScore} pts</span>
                  <span style={{ fontWeight: 700, color: away.color, fontSize: "0.9rem" }}>{away.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Standings */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1rem", color: "#f1f5f9" }}>
              🏆 Athletics Leaderboard
            </h2>
            <a href="/admin/standings" style={{ fontSize: "0.8rem", color: "#818cf8", textDecoration: "none" }}>Manage →</a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sorted.map((row, i) => {
              const h = getHall(row.hall);
              const max = sorted[0].pts;
              return (
                <div key={row.hall}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "0.85rem" }}>{["🥇","🥈","🥉","4️⃣"][i]}</span>
                      <span style={{ fontWeight: 700, color: h.color, fontSize: "0.9rem" }}>{h.name}</span>
                      <span style={{ fontSize: "0.72rem", color: "#64748b" }}>({row.gold}G · {row.silver}S · {row.bronze}B)</span>
                    </div>
                    <span className="score-num" style={{ fontSize: "1rem", color: "#f1f5f9" }}>{row.pts} pts</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.05)" }}>
                    <div style={{ width: `${(row.pts / max) * 100}%`, height: "100%", borderRadius: 3, background: h.color, boxShadow: `0 0 8px ${h.glow}` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1rem", color: "#f1f5f9", marginBottom: 20 }}>
          📋 Recent Track &amp; Field Activity
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {RECENT_EVENTS.map((ev, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: i < RECENT_EVENTS.length - 1 ? "1px solid var(--border-color)" : "none" }}>
              <div style={{ width: 48, flexShrink: 0, textAlign: "center" }}>
                <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>{ev.time}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: "#f1f5f9", fontSize: "0.875rem" }}>{ev.action}</div>
                <div style={{ color: "#64748b", fontSize: "0.8rem" }}>{ev.detail}</div>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#475569", flexShrink: 0 }}>{ev.admin}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import Navbar from "@/components/Navbar";
import { SPORTS, DEMO_MATCHES, getHall } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Athletics Disciplines | Inter-Hall Championship",
  description: "Official track and field disciplines, rules, and scoring system for the Inter-Hall Athletics Championship.",
};

const ATHLETICS_DISCIPLINES = [
  {
    name: "Track Sprints (100m, 200m, 400m)",
    icon: "⚡",
    category: "Track",
    venue: "Main Stadium Olympic Track",
    rules: "Block start required; 8 athletes per final heat. Points awarded: 1st (10 pts), 2nd (8 pts), 3rd (6 pts), 4th (4 pts). False start results in disqualification.",
    records: "100m Record: 10.18s · 200m Record: 20.84s",
  },
  {
    name: "4x100m Relay Championship",
    icon: "🏃",
    category: "Track Relay",
    venue: "Main Stadium Track",
    rules: "4 runners per hall squad. Baton exchange must take place within the 20-meter changeover box. Points awarded: 1st (15 pts), 2nd (10 pts), 3rd (6 pts).",
    records: "Championship Record: 39.42s (Gold Hall, 2025)",
  },
  {
    name: "Middle Distance (800m & 1500m)",
    icon: "⏱️",
    category: "Track Endurance",
    venue: "Main Stadium Track",
    rules: "Staggered start blending to lane 1 after first bend. Points awarded: 1st (10 pts), 2nd (8 pts), 3rd (6 pts), 4th (4 pts).",
    records: "800m Record: 1m 51.20s · 1500m Record: 3m 56.40s",
  },
  {
    name: "High Jump Finals",
    icon: "🦘",
    category: "Field Jump",
    venue: "Field Zone B High Jump Pit",
    rules: "Fosbury Flop technique permitted. 3 attempts allowed per height increment. Three consecutive fouls eliminates the competitor.",
    records: "Championship Record: 2.12m",
  },
  {
    name: "Long Jump Finals",
    icon: "👟",
    category: "Field Jump",
    venue: "Jumping Runway & Pit 1",
    rules: "6 preliminary jumps; top 4 advance to final 3 jumps. Measurement taken perpendicular to takeoff line from nearest mark in sand.",
    records: "Championship Record: 7.45m",
  },
  {
    name: "Shot Put Finals",
    icon: "🎯",
    category: "Field Throw",
    venue: "Throwing Circle A",
    rules: "7.26kg men / 4kg women. Throw must land within the designated 34.92-degree landing sector. Athlete must exit from rear of circle.",
    records: "Championship Record: 16.85m",
  },
];

export default function SportsPage() {
  const finishedEvents = DEMO_MATCHES.filter((m) => m.status === "finished");

  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px 80px" }}>

        <div className="fade-up" style={{ marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 999, padding: "5px 14px", marginBottom: 12 }}>
            <span style={{ fontSize: "0.85rem" }}>🏃</span>
            <span style={{ fontSize: "0.78rem", color: "#818cf8", fontWeight: 700, letterSpacing: "0.08em" }}>
              OFFICIAL CHAMPIONSHIP SPORT
            </span>
          </div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "2.4rem", color: "#f1f5f9", marginBottom: 8 }}>
            Athletics &amp; Track &amp; Field
          </h1>
          <p style={{ color: "#64748b", maxWidth: 640 }}>
            Season 2026 · Exclusive championship sport. All four halls compete across 6 track &amp; field disciplines for the overall championship trophy.
          </p>
        </div>

        {/* Disciplines grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20, marginBottom: 56 }}>
          {ATHLETICS_DISCIPLINES.map((d) => (
            <div key={d.name} className="glass-card" style={{ padding: "28px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <span style={{ fontSize: "2.4rem" }}>{d.icon}</span>
                <span style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8", fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: 999, textTransform: "uppercase" }}>
                  {d.category}
                </span>
              </div>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#f1f5f9", marginBottom: 6 }}>
                {d.name}
              </h2>
              <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: 14 }}>
                📍 {d.venue}
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "12px", marginBottom: 14, fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.5 }}>
                <strong style={{ color: "#cbd5e1" }}>Rules &amp; Scoring:</strong> {d.rules}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#fbbf24", fontWeight: 600 }}>
                🏆 {d.records}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Concluded Events */}
        {finishedEvents.length > 0 && (
          <div className="glass-card" style={{ padding: "28px 32px", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#f1f5f9", marginBottom: 16 }}>
              Recent Concluded Athletics Finals
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
              {finishedEvents.map((m) => {
                const home = getHall(m.homeHall);
                const away = getHall(m.awayHall);
                return (
                  <div key={m.id} style={{ padding: "14px 16px", background: "rgba(0,0,0,0.3)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: "0.78rem", color: "#818cf8", fontWeight: 700, marginBottom: 6 }}>{m.eventName}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: home.color, fontWeight: 700, fontSize: "0.88rem" }}>{home.name} ({m.homeScore} pts)</span>
                      <span style={{ color: "#64748b", fontSize: "0.8rem" }}>vs</span>
                      <span style={{ color: away.color, fontWeight: 700, fontSize: "0.88rem" }}>{away.name} ({m.awayScore} pts)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Championship Points System */}
        <div className="glass-card" style={{ padding: "28px 32px" }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#f1f5f9", marginBottom: 16 }}>
            Official Athletics Scoring Table
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            {[
              { place: "1st Place (Gold)", pts: "+10 / +15 pts (Relay)", color: "#fbbf24", icon: "🥇" },
              { place: "2nd Place (Silver)", pts: "+8 / +10 pts (Relay)", color: "#cbd5e1", icon: "🥈" },
              { place: "3rd Place (Bronze)", pts: "+6 / +6 pts (Relay)", color: "#d97706", icon: "🥉" },
              { place: "4th Place", pts: "+4 pts", color: "#94a3b8", icon: "4️⃣" },
            ].map((p) => (
              <div key={p.place} style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: 10, borderLeft: `3px solid ${p.color}` }}>
                <div style={{ fontSize: "1.4rem", marginBottom: 4 }}>{p.icon}</div>
                <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.9rem" }}>{p.place}</div>
                <div style={{ color: p.color, fontWeight: 800, fontSize: "0.85rem", marginTop: 4 }}>{p.pts}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

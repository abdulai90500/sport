"use client";
import { useState, useEffect } from "react";
import { getHall } from "@/lib/data";

export interface EventWinner {
  id: string;
  eventName: string;
  category: "Track Sprint" | "Relay" | "Field Jump" | "Field Throw" | "Distance";
  winnerName: string;
  hallId: string;
  winningMark: string;
  points: number;
  date: string;
  venue: string;
}

export const CHAMPIONSHIP_WINNERS: EventWinner[] = [
  {
    id: "w1",
    eventName: "Men's 100m Sprint — Championship Final",
    category: "Track Sprint",
    winnerName: "Abdulai",
    hallId: "blue",
    winningMark: "10.15s",
    points: 12,
    date: "2026-10-27",
    venue: "Main Stadium Track",
  },
  {
    id: "w2",
    eventName: "Women's 200m Sprint — Championship Final",
    category: "Track Sprint",
    winnerName: "Sarah Addo",
    hallId: "purple",
    winningMark: "23.90s",
    points: 10,
    date: "2026-10-27",
    venue: "Main Stadium Track",
  },
  {
    id: "w3",
    eventName: "Men's 4x100m Relay — Grand Final",
    category: "Relay",
    winnerName: "Gold Relay Squad",
    hallId: "gold",
    winningMark: "39.88s (Record)",
    points: 15,
    date: "2026-10-26",
    venue: "Main Stadium Track",
  },
  {
    id: "w4",
    eventName: "Men's High Jump — Finals",
    category: "Field Jump",
    winnerName: "Kofi Mensah",
    hallId: "purple",
    winningMark: "2.05m",
    points: 10,
    date: "2026-10-26",
    venue: "Field Zone B",
  },
  {
    id: "w5",
    eventName: "Women's Long Jump — Finals",
    category: "Field Jump",
    winnerName: "Abena Serwaa",
    hallId: "gold",
    winningMark: "6.12m",
    points: 12,
    date: "2026-10-25",
    venue: "Jumping Pit 1",
  },
  {
    id: "w6",
    eventName: "Men's Shot Put — Championship Finals",
    category: "Field Throw",
    winnerName: "Ibrahim Fuseini",
    hallId: "gold",
    winningMark: "16.85m",
    points: 10,
    date: "2026-10-25",
    venue: "Throwing Circle A",
  },
];

export default function EventWinnersList() {
  const [winners, setWinners] = useState<EventWinner[]>(CHAMPIONSHIP_WINNERS);

  useEffect(() => {
    const loadDynamic = () => {
      try {
        const raw = localStorage.getItem("championship_races_v2");
        if (!raw) return;
        const races = JSON.parse(raw);
        if (Array.isArray(races)) {
          const dynamicWinners: EventWinner[] = [];
          races.forEach((r: any) => {
            if (r.results && r.results.positions && r.results.positions.length > 0) {
              const p1 = r.results.positions.find((p: any) => p.position === 1);
              if (p1) {
                dynamicWinners.push({
                  id: `dyn-${r.id}`,
                  eventName: r.name,
                  category: r.category === "track" ? "Track Sprint" : "Field Jump",
                  winnerName: p1.athleteName,
                  hallId: p1.hallId,
                  winningMark: p1.markOrTime,
                  points: p1.points,
                  date: r.date || "2026-10-29",
                  venue: r.venue || "Main Stadium Track",
                });
              }
            }
          });

          // Deduplicate by eventName
          const map = new Map<string, EventWinner>();
          CHAMPIONSHIP_WINNERS.forEach((w) => map.set(w.eventName, w));
          dynamicWinners.forEach((w) => map.set(w.eventName, w));
          setWinners(Array.from(map.values()));
        }
      } catch {}
    };

    loadDynamic();
    window.addEventListener("championship-races-changed", loadDynamic);
    window.addEventListener("storage", loadDynamic);
    return () => {
      window.removeEventListener("championship-races-changed", loadDynamic);
      window.removeEventListener("storage", loadDynamic);
    };
  }, []);

  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "1.4rem" }}>🥇</span>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.45rem", color: "var(--text-primary)" }}>
              Championship Event Winners List
            </h2>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 2 }}>
            Gold medalists, winning marks, and official points awarded per athletics discipline
          </p>
        </div>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fbbf24", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", padding: "4px 12px", borderRadius: 999 }}>
          🏆 {winners.length} Gold Medals Awarded
        </div>
      </div>

      {/* Grid of Winners */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 16 }}>
        {winners.map((win) => {
          const hall = getHall(win.hallId);
          const isAbdulai = win.winnerName.toLowerCase().includes("abdulai");

          return (
            <div
              key={win.id}
              className="glass-card"
              style={{
                padding: "20px 22px",
                borderLeft: `5px solid ${hall.color}`,
                boxShadow: isAbdulai ? `0 0 20px ${hall.glow}` : undefined,
                background: isAbdulai ? `linear-gradient(135deg, ${hall.bg}33, var(--bg-card))` : "var(--bg-card)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#818cf8", background: "rgba(99,102,241,0.12)", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
                  {win.category}
                </span>
                <span style={{ fontSize: "0.78rem", color: "#4ade80", fontWeight: 800 }}>
                  +{win.points} pts
                </span>
              </div>

              <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: 8, lineHeight: 1.25 }}>
                {win.eventName}
              </div>

              {/* Winner row: Medal, Name, Hall Badge */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: hall.color,
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      fontWeight: 900,
                      boxShadow: `0 0 10px ${hall.glow}`,
                      flexShrink: 0,
                    }}
                  >
                    🥇
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: "1rem", color: "var(--text-primary)" }}>
                      {win.winnerName}
                    </div>
                    <div style={{ fontSize: "0.74rem", color: hall.color, fontWeight: 700, textTransform: "uppercase" }}>
                      {hall.name}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "monospace", fontSize: "0.95rem", fontWeight: 800, color: "#fcd34d" }}>
                    {win.winningMark}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                    Winning Mark
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

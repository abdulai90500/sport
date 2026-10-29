"use client";
import { useState, useEffect } from "react";
import HallCard from "./HallCard";
import { DEMO_STANDINGS, HallStanding } from "@/lib/data";
import { calculateLiveStandings } from "@/lib/raceStore";

export default function HomeHallCards() {
  const [standings, setStandings] = useState<HallStanding[]>(DEMO_STANDINGS);

  useEffect(() => {
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
  }, []);

  const sorted = [...standings].sort((a, b) => b.pts - a.pts);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
      {sorted.map((row) => (
        <div key={row.hall} style={{ position: "relative" }}>
          <HallCard hall={row.hall} score={row.pts} size="md" showScore />
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              fontSize: "0.75rem",
              color: "#f1f5f9",
              fontWeight: 700,
              background: "rgba(0,0,0,0.55)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 6,
              padding: "3px 8px",
            }}
          >
            {row.pts} pts
          </div>
        </div>
      ))}
    </div>
  );
}

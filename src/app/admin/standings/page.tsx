"use client";
import { useState } from "react";
import { DEMO_STANDINGS, HALLS, getHall, HallStanding } from "@/lib/data";
import StandingsTable from "@/components/StandingsTable";

export default function AdminStandingsPage() {
  const [standings, setStandings] = useState<HallStanding[]>(DEMO_STANDINGS);
  const [penaltyModal, setPenaltyModal] = useState(false);
  const [selectedHall, setSelectedHall] = useState("blue");
  const [pointsAdjustment, setPointsAdjustment] = useState<number>(0);
  const [reason, setReason] = useState("");

  const handleAdjustPoints = () => {
    if (pointsAdjustment === 0) return;
    setStandings((prev) =>
      prev.map((s) => {
        if (s.hall === selectedHall) {
          return { ...s, pts: Math.max(0, s.pts + pointsAdjustment) };
        }
        return s;
      })
    );
    setPenaltyModal(false);
    setPointsAdjustment(0);
    setReason("");
  };

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 999, padding: "3px 12px", marginBottom: 8 }}>
            <span style={{ fontSize: "0.8rem" }}>🏆</span>
            <span style={{ fontSize: "0.75rem", color: "#818cf8", fontWeight: 700 }}>ATHLETICS LEADERBOARD CONTROL</span>
          </div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.8rem", color: "#f1f5f9" }}>
            Athletics Leaderboard &amp; Points Control
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
            Manage official athletics championship totals, medal tallies, and jury point adjustments
          </p>
        </div>
        <button className="btn-primary" onClick={() => setPenaltyModal(true)}>
          ⚖️ Adjust Points / Penalties
        </button>
      </div>

      {/* Standings table */}
      <div className="glass-card" style={{ padding: "24px", marginBottom: 32 }}>
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#f1f5f9", marginBottom: 16 }}>
          Live Official Athletics Standings Table
        </h2>
        <StandingsTable data={standings} />
      </div>

      {/* Hall overview cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
        {standings.map((st) => {
          const h = getHall(st.hall);
          return (
            <div key={st.hall} className="glass-card" style={{ padding: "20px", border: `1px solid ${h.color}44` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: "1.6rem" }}>{h.emoji}</span>
                <div>
                  <div style={{ fontWeight: 800, color: h.color }}>{h.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    🥇 {st.gold} · 🥈 {st.silver} · 🥉 {st.bronze}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Track : Field Pts</div>
                  <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "1rem" }}>
                    {st.trackPts} : {st.fieldPts}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Total Pts</div>
                  <div className="score-num" style={{ fontSize: "1.8rem", color: h.color }}>{st.pts}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Adjustment Modal */}
      {penaltyModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24 }}>
          <div className="glass-card" style={{ padding: "32px", width: "100%", maxWidth: 440 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#f1f5f9", marginBottom: 20 }}>
              Adjust Points / Sanctions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>Select Hall</label>
                <select className="input-field" value={selectedHall} onChange={(e) => setSelectedHall(e.target.value)}>
                  {HALLS.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                  Point Adjustment (e.g. +5 bonus record, -3 lane infringement)
                </label>
                <input
                  className="input-field"
                  type="number"
                  placeholder="0"
                  value={pointsAdjustment}
                  onChange={(e) => setPointsAdjustment(Number(e.target.value))}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>Reason / Administrative Note</label>
                <input
                  className="input-field"
                  placeholder="e.g. New championship 100m record bonus"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={handleAdjustPoints}>Apply Adjustment</button>
                <button className="btn-secondary" onClick={() => setPenaltyModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

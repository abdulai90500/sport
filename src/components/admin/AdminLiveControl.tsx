"use client";
import { useEffect, useState } from "react";
import { HALLS, getHall } from "@/lib/data";
import { LiveEventBroadcast } from "@/components/BreakingLiveBanner";

const ATHLETICS_PRESETS = [
  { eventName: "Men's 100m Sprint — Championship Final", sport: "Athletics", venue: "Main Stadium Olympic Track" },
  { eventName: "Women's 200m Sprint — Final Heat", sport: "Athletics", venue: "Main Stadium Olympic Track" },
  { eventName: "Men's 4x100m Relay — Championship Final", sport: "Athletics", venue: "Main Stadium Track" },
  { eventName: "Men's High Jump — Final Rounds", sport: "Athletics", venue: "Field Zone B" },
  { eventName: "Men's Shot Put — Finals", sport: "Athletics", venue: "Throwing Circle A" },
];

export const INITIAL_BROADCAST: LiveEventBroadcast = {
  id: "live-ath-1",
  sport: "Athletics",
  eventName: "Limkokwing 4th Inter-Hall Athletic Meet",
  category: "track",
  venue: "Main Stadium Olympic Track",
  status: "UPCOMING",
  timeElapsed: "Championship Opening · All Halls Start at 0 Points",
  standings: [
    { position: 1, hallId: "blue", athlete: "Awaiting Results", markOrTime: "—", points: 0 },
    { position: 2, hallId: "black", athlete: "Awaiting Results", markOrTime: "—", points: 0 },
    { position: 3, hallId: "gold", athlete: "Awaiting Results", markOrTime: "—", points: 0 },
    { position: 4, hallId: "purple", athlete: "Awaiting Results", markOrTime: "—", points: 0 },
  ],
};

export default function AdminLiveControl() {
  const [broadcast, setBroadcast] = useState<LiveEventBroadcast>(INITIAL_BROADCAST);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("current_live_broadcast_v3") || localStorage.getItem("current_live_broadcast");
    if (saved) {
      try {
        setBroadcast(JSON.parse(saved));
      } catch {}
    } else {
      setBroadcast(INITIAL_BROADCAST);
    }
  }, []);

  const saveBroadcast = (updated: LiveEventBroadcast) => {
    setBroadcast(updated);
    localStorage.setItem("current_live_broadcast_v3", JSON.stringify(updated));
    localStorage.setItem("current_live_broadcast", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleResetScorer = () => {
    if (confirm("Reset current event scorer and positions to default (Abdulai of Blue Hall in 1st place)?")) {
      saveBroadcast(INITIAL_BROADCAST);
    }
  };

  const handlePositionSwap = (idx: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= broadcast.standings.length) return;

    const list = [...broadcast.standings];
    const temp = list[idx];
    list[idx] = list[newIdx];
    list[newIdx] = temp;

    // re-number positions 1..4
    const updated = {
      ...broadcast,
      standings: list.map((item, i) => ({ ...item, position: i + 1 })),
    };
    saveBroadcast(updated);
  };

  const handleAthleteChange = (hallId: string, athlete: string) => {
    const updated = {
      ...broadcast,
      standings: broadcast.standings.map((s) => (s.hallId === hallId ? { ...s, athlete } : s)),
    };
    saveBroadcast(updated);
  };

  const handleMarkChange = (hallId: string, markOrTime: string) => {
    const updated = {
      ...broadcast,
      standings: broadcast.standings.map((s) => (s.hallId === hallId ? { ...s, markOrTime } : s)),
    };
    saveBroadcast(updated);
  };

  const handlePointsChange = (hallId: string, points: number) => {
    const updated = {
      ...broadcast,
      standings: broadcast.standings.map((s) => (s.hallId === hallId ? { ...s, points } : s)),
    };
    saveBroadcast(updated);
  };

  const toggleLiveStatus = () => {
    const nextStatus = broadcast.status === "LIVE" ? "CONCLUDED" : "LIVE";
    saveBroadcast({ ...broadcast, status: nextStatus });
  };

  const setPreset = (preset: typeof ATHLETICS_PRESETS[0]) => {
    saveBroadcast({
      ...broadcast,
      eventName: preset.eventName,
      sport: preset.sport,
      venue: preset.venue,
      status: "LIVE",
    });
  };

  return (
    <div className="glass-card" style={{ padding: "24px", marginBottom: 32, border: "1px solid #ef4444" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span className="live-dot" style={{ width: 8, height: 8 }} />
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.2rem", color: "var(--text-primary)", letterSpacing: "0.02em" }}>
              Breaking Live Event Broadcast Controller (Athletics)
            </h2>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Re-order positions, update athlete names (e.g. Abdulai in 1st), edit race times, or reset the scorer.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {savedNotice && (
            <span style={{ color: "#4ade80", fontSize: "0.82rem", fontWeight: 700 }}>
              ✓ Broadcast Synced to Public Viewers
            </span>
          )}
          {/* Reset Scorer Button requested by user */}
          <button
            onClick={handleResetScorer}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              background: "rgba(239,68,68,0.15)",
              color: "#f87171",
              border: "1px solid rgba(239,68,68,0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>🔄</span> Reset Scorer
          </button>
          <button
            onClick={toggleLiveStatus}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: "0.82rem",
              fontWeight: 800,
              cursor: "pointer",
              background: broadcast.status === "LIVE" ? "#ef4444" : "#22c55e",
              color: "#ffffff",
              border: "none",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {broadcast.status === "LIVE" ? "End Broadcast" : "Go LIVE Now"}
          </button>
        </div>
      </div>

      {/* Preset selector */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>Quick Presets:</span>
        {ATHLETICS_PRESETS.map((p) => (
          <button
            key={p.eventName}
            onClick={() => setPreset(p)}
            style={{
              background: broadcast.eventName === p.eventName ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "var(--text-primary)",
              borderRadius: 6,
              padding: "5px 10px",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            🏃 {p.eventName.split("—")[0]}
          </button>
        ))}
      </div>

      {/* Event Details Row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, marginBottom: 4 }}>
            Event Name &amp; Heat
          </label>
          <input
            className="input-field"
            value={broadcast.eventName}
            onChange={(e) => saveBroadcast({ ...broadcast, eventName: e.target.value })}
            placeholder="e.g. Men's 100m Sprint — Championship Final"
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, marginBottom: 4 }}>
            Venue / Track Location
          </label>
          <input
            className="input-field"
            value={broadcast.venue}
            onChange={(e) => saveBroadcast({ ...broadcast, venue: e.target.value })}
            placeholder="e.g. Main Stadium Olympic Track"
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, marginBottom: 4 }}>
            Status / Lap Progress
          </label>
          <input
            className="input-field"
            value={broadcast.timeElapsed || ""}
            onChange={(e) => saveBroadcast({ ...broadcast, timeElapsed: e.target.value })}
            placeholder="e.g. Final Heat / Gold Medals"
          />
        </div>
      </div>

      {/* Live Positions Table */}
      <div style={{ background: "var(--bg-secondary)", borderRadius: 10, padding: "16px", border: "1px solid var(--border-color)" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 12 }}>
          Live Positions &amp; Athletes (Re-order in real time to update public leaderboard)
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {broadcast.standings.map((pos, idx) => {
            const hall = getHall(pos.hallId);
            return (
              <div
                key={pos.hallId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "var(--bg-card)",
                  borderLeft: `5px solid ${hall.color}`,
                  borderRadius: 6,
                  padding: "10px 14px",
                  border: "1px solid var(--border-color)",
                }}
              >
                {/* Position controller */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 80 }}>
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 4,
                      background: hall.color,
                      color: "#ffffff",
                      fontWeight: 900,
                      fontSize: "0.78rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    #{pos.position}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <button
                      disabled={idx === 0}
                      onClick={() => handlePositionSwap(idx, "up")}
                      style={{
                        padding: "1px 6px",
                        fontSize: "0.65rem",
                        background: idx === 0 ? "transparent" : "rgba(255,255,255,0.1)",
                        color: idx === 0 ? "#404040" : "var(--text-primary)",
                        border: "none",
                        borderRadius: 3,
                        cursor: idx === 0 ? "default" : "pointer",
                      }}
                      title="Move position up"
                    >
                      ▲
                    </button>
                    <button
                      disabled={idx === broadcast.standings.length - 1}
                      onClick={() => handlePositionSwap(idx, "down")}
                      style={{
                        padding: "1px 6px",
                        fontSize: "0.65rem",
                        background: idx === broadcast.standings.length - 1 ? "transparent" : "rgba(255,255,255,0.1)",
                        color: idx === broadcast.standings.length - 1 ? "#404040" : "var(--text-primary)",
                        border: "none",
                        borderRadius: 3,
                        cursor: idx === broadcast.standings.length - 1 ? "default" : "pointer",
                      }}
                      title="Move position down"
                    >
                      ▼
                    </button>
                  </div>
                </div>

                {/* Hall token */}
                <div style={{ minWidth: 120 }}>
                  <div style={{ fontWeight: 800, color: hall.color, fontSize: "0.88rem" }}>
                    {hall.name}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{hall.id.toUpperCase()}</div>
                </div>

                {/* Athlete name */}
                <div style={{ flex: 1 }}>
                  <input
                    className="input-field"
                    style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                    placeholder="Athlete Name"
                    value={pos.athlete}
                    onChange={(e) => handleAthleteChange(pos.hallId, e.target.value)}
                  />
                </div>

                {/* Time or Mark */}
                <div style={{ width: 140 }}>
                  <input
                    className="input-field"
                    style={{ padding: "8px 12px", fontSize: "0.85rem", fontFamily: "monospace" }}
                    placeholder="Time / Mark (e.g. 10.15s)"
                    value={pos.markOrTime || ""}
                    onChange={(e) => handleMarkChange(pos.hallId, e.target.value)}
                  />
                </div>

                {/* Points */}
                <div style={{ width: 90 }}>
                  <input
                    className="input-field"
                    type="number"
                    style={{ padding: "8px 10px", fontSize: "0.85rem", textAlign: "right" }}
                    value={pos.points}
                    onChange={(e) => handlePointsChange(pos.hallId, Number(e.target.value))}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

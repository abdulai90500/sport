"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HALLS, HallId, getHall } from "@/lib/data";
import {
  RaceEvent,
  RaceAthlete,
  RaceResult,
  PositionAward,
  DEFAULT_PRIZES,
  getStoredRaces,
  submitJudgeResult,
  resetJudgeResult,
} from "@/lib/raceStore";
import { getCurrentUser } from "@/lib/auth";

export default function JudgeDeskPage() {
  const [races, setRaces] = useState<RaceEvent[]>([]);
  const [selectedRaceId, setSelectedRaceId] = useState<string>("");
  const [user, setUser] = useState(getCurrentUser());
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Edit / Correction mode for already-scored races ("if mistake edit")
  const [isEditingScores, setIsEditingScores] = useState<boolean>(false);

  // Form state for 1st, 2nd, 3rd, 4th positions
  const [p1AthleteId, setP1AthleteId] = useState("");
  const [p1Mark, setP1Mark] = useState("");
  const [p1Points, setP1Points] = useState(DEFAULT_PRIZES[1].points);
  const [p1Prize, setP1Prize] = useState(DEFAULT_PRIZES[1].prize);

  const [p2AthleteId, setP2AthleteId] = useState("");
  const [p2Mark, setP2Mark] = useState("");
  const [p2Points, setP2Points] = useState(DEFAULT_PRIZES[2].points);
  const [p2Prize, setP2Prize] = useState(DEFAULT_PRIZES[2].prize);

  const [p3AthleteId, setP3AthleteId] = useState("");
  const [p3Mark, setP3Mark] = useState("");
  const [p3Points, setP3Points] = useState(DEFAULT_PRIZES[3].points);
  const [p3Prize, setP3Prize] = useState(DEFAULT_PRIZES[3].prize);

  const [p4AthleteId, setP4AthleteId] = useState("");
  const [p4Mark, setP4Mark] = useState("");
  const [p4Points, setP4Points] = useState(DEFAULT_PRIZES[4].points);
  const [p4Prize, setP4Prize] = useState(DEFAULT_PRIZES[4].prize);

  const [notes, setNotes] = useState("");

  // Load races and check URL parameter
  useEffect(() => {
    setUser(getCurrentUser());

    const load = () => {
      const allRaces = getStoredRaces();
      setRaces(allRaces);

      // Check URL search param if present
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const eventId = params.get("eventId");
        if (eventId && allRaces.some((r) => r.id === eventId)) {
          setSelectedRaceId(eventId);
          return;
        }
      }

      if (allRaces.length > 0 && !selectedRaceId) {
        setSelectedRaceId(allRaces[0].id);
      }
    };

    load();

    const handleRacesChange = () => load();
    window.addEventListener("championship-races-changed", handleRacesChange);
    window.addEventListener("storage", handleRacesChange);
    return () => {
      window.removeEventListener("championship-races-changed", handleRacesChange);
      window.removeEventListener("storage", handleRacesChange);
    };
  }, [selectedRaceId]);

  const activeRace = races.find((r) => r.id === selectedRaceId) || races[0];

  // Whenever active race changes or results exist, pre-fill form
  useEffect(() => {
    if (!activeRace) return;

    if (activeRace.results && activeRace.results.positions && activeRace.results.positions.length >= 4) {
      const pos1 = activeRace.results.positions.find((p) => p.position === 1);
      const pos2 = activeRace.results.positions.find((p) => p.position === 2);
      const pos3 = activeRace.results.positions.find((p) => p.position === 3);
      const pos4 = activeRace.results.positions.find((p) => p.position === 4);

      if (pos1) {
        setP1AthleteId(pos1.athleteId);
        setP1Mark(pos1.markOrTime);
        setP1Points(pos1.points);
        setP1Prize(pos1.prize);
      }
      if (pos2) {
        setP2AthleteId(pos2.athleteId);
        setP2Mark(pos2.markOrTime);
        setP2Points(pos2.points);
        setP2Prize(pos2.prize);
      }
      if (pos3) {
        setP3AthleteId(pos3.athleteId);
        setP3Mark(pos3.markOrTime);
        setP3Points(pos3.points);
        setP3Prize(pos3.prize);
      }
      if (pos4) {
        setP4AthleteId(pos4.athleteId);
        setP4Mark(pos4.markOrTime);
        setP4Points(pos4.points);
        setP4Prize(pos4.prize);
      }
      setNotes(activeRace.results.notes || "");
      setIsEditingScores(false); // Locked by default until clicked "Edit Scores"
    } else {
      // Auto-suggest candidates based on registered athletes
      const athletes = activeRace.athletes || [];
      setP1AthleteId(athletes[0]?.id || "");
      setP1Mark(athletes[0]?.seedMark || "");
      setP1Points(DEFAULT_PRIZES[1].points);
      setP1Prize(DEFAULT_PRIZES[1].prize);

      setP2AthleteId(athletes[1]?.id || "");
      setP2Mark(athletes[1]?.seedMark || "");
      setP2Points(DEFAULT_PRIZES[2].points);
      setP2Prize(DEFAULT_PRIZES[2].prize);

      setP3AthleteId(athletes[2]?.id || "");
      setP3Mark(athletes[2]?.seedMark || "");
      setP3Points(DEFAULT_PRIZES[3].points);
      setP3Prize(DEFAULT_PRIZES[3].prize);

      setP4AthleteId(athletes[3]?.id || "");
      setP4Mark(athletes[3]?.seedMark || "");
      setP4Points(DEFAULT_PRIZES[4].points);
      setP4Prize(DEFAULT_PRIZES[4].prize);
      setNotes("");
      setIsEditingScores(true); // Open for initial entry
    }
  }, [activeRace?.id, activeRace?.results]);

  const getAthleteById = (athId: string) => {
    return activeRace?.athletes.find((a) => a.id === athId);
  };

  // Submit or Update Score
  const handleSubmitResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRace) return;

    const ath1 = getAthleteById(p1AthleteId);
    const ath2 = getAthleteById(p2AthleteId);
    const ath3 = getAthleteById(p3AthleteId);
    const ath4 = getAthleteById(p4AthleteId);

    if (!ath1 || !ath2 || !ath3 || !ath4) {
      alert("Please assign all 4 positions (1st, 2nd, 3rd, and 4th place) from the registered athlete list.");
      return;
    }

    // Check for unique athletes
    const ids = [ath1.id, ath2.id, ath3.id, ath4.id];
    if (new Set(ids).size !== 4) {
      alert("An athlete cannot occupy more than one position. Please assign distinct athletes to 1st, 2nd, 3rd, and 4th place.");
      return;
    }

    const positions: PositionAward[] = [
      {
        position: 1,
        athleteId: ath1.id,
        athleteName: ath1.name,
        hallId: ath1.hallId,
        markOrTime: p1Mark || "Official Mark",
        points: Number(p1Points),
        prize: p1Prize,
      },
      {
        position: 2,
        athleteId: ath2.id,
        athleteName: ath2.name,
        hallId: ath2.hallId,
        markOrTime: p2Mark || "Official Mark",
        points: Number(p2Points),
        prize: p2Prize,
      },
      {
        position: 3,
        athleteId: ath3.id,
        athleteName: ath3.name,
        hallId: ath3.hallId,
        markOrTime: p3Mark || "Official Mark",
        points: Number(p3Points),
        prize: p3Prize,
      },
      {
        position: 4,
        athleteId: ath4.id,
        athleteName: ath4.name,
        hallId: ath4.hallId,
        markOrTime: p4Mark || "Official Mark",
        points: Number(p4Points),
        prize: p4Prize,
      },
    ];

    const resultPayload: RaceResult = {
      eventId: activeRace.id,
      recordedBy: user?.name || "Official Track & Field Judge",
      recordedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      notes,
      positions,
    };

    const outcome = submitJudgeResult(activeRace.id, resultPayload, user?.name || "Judge");
    setRaces(outcome.races);
    setIsEditingScores(false);

    setSuccessNotice(
      `✓ Official Results for "${activeRace.name}" published! 1st: ${ath1.name} (${ath1.hallId.toUpperCase()} +${p1Points}pts), 2nd: ${ath2.name} (+${p2Points}pts), 3rd: ${ath3.name} (+${p3Points}pts), 4th: ${ath4.name} (+${p4Points}pts). Live leaderboard and live broadcast updated immediately!`
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset / Clear Scores ("if mistake edit" completely)
  const handleResetScores = () => {
    if (!activeRace || !activeRace.results) return;
    if (confirm(`Are you sure you want to clear/reset the official scores for "${activeRace.name}"? This will return the event to scheduled status and remove awarded points from the leaderboard.`)) {
      const outcome = resetJudgeResult(activeRace.id);
      setRaces(outcome.races);
      setIsEditingScores(true);
      setSuccessNotice(`Scores for "${activeRace.name}" were reset. You can now re-enter official results.`);
    }
  };

  const isCompleted = activeRace?.status === "completed" && !!activeRace?.results;

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1400 }}>
      {/* Top Banner Alert */}
      {successNotice && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.2))",
            border: "1px solid #10b981",
            borderRadius: 12,
            padding: "16px 20px",
            color: "#6ee7b7",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "1.4rem" }}>🏆</span>
            <div>
              <div style={{ fontWeight: 800, color: "#ffffff", fontSize: "0.95rem" }}>
                Results Officially Updated in the Live System!
              </div>
              <div style={{ fontSize: "0.85rem", color: "#a7f3d0" }}>{successNotice}</div>
            </div>
          </div>
          <button
            onClick={() => setSuccessNotice(null)}
            style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", fontSize: "1.2rem" }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(14,165,233,0.12)", border: "1px solid rgba(14,165,233,0.3)", borderRadius: 999, padding: "3px 12px", marginBottom: 8 }}>
            <span style={{ fontSize: "0.85rem" }}>⚖️</span>
            <span style={{ fontSize: "0.75rem", color: "#38bdf8", fontWeight: 700 }}>OFFICIAL JUDGE SCORING DESK</span>
          </div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.95rem", color: "#f1f5f9" }}>
            Judge Scoring &amp; Live Results Desk
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            The Judge sees the registered 4 athletes with their names &amp; Hall colors. Enter scores (1st place, points, times). <strong style={{ color: "#38bdf8" }}>The moment you click submit, live standings and broadcast update across the entire site. If a mistake was made, click Edit to correct.</strong>
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/admin/races" className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", padding: "12px 18px" }}>
            <span>🏁</span> Race &amp; Athlete Registration →
          </Link>
          <Link href="/live" target="_blank" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", padding: "12px 18px", background: "linear-gradient(135deg, #ef4444, #dc2626)" }}>
            <span className="live-dot" /> View Live Broadcast Scoreboard ↗
          </Link>
        </div>
      </div>

      {/* Main Grid: Event Selector on left / Judge Input on right */}
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 24, alignItems: "start" }}>
        {/* Left Column: Events Dropdown & Registered Competitors Live Roster */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Select Event Card */}
          <div className="glass-card" style={{ padding: "20px" }}>
            <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Select Race / Event to Score
            </label>
            <select
              className="input-field"
              value={selectedRaceId}
              onChange={(e) => setSelectedRaceId(e.target.value)}
              style={{ fontSize: "0.9rem", padding: "12px", fontWeight: 700 }}
            >
              {races.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.status === "completed" ? "✓ " : r.status === "live" ? "🔴 " : ""}
                  {r.name} ({r.athletes.length} athletes)
                </option>
              ))}
            </select>

            {activeRace && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border-color)", fontSize: "0.82rem", color: "#94a3b8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span>Format:</span>
                  <span style={{ color: "#ffffff", fontWeight: 700 }}>
                    {activeRace.raceType === "group" ? "👥 Group / Relay" : "🏃 Individual"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span>Scheduled Time:</span>
                  <span style={{ color: "#38bdf8", fontWeight: 800 }}>⏰ {activeRace.time}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span>Category:</span>
                  <span style={{ color: "#f1f5f9", fontWeight: 600 }}>{activeRace.category.toUpperCase()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Venue:</span>
                  <span style={{ color: "#f1f5f9", fontWeight: 600 }}>{activeRace.venue}</span>
                </div>
              </div>
            )}
          </div>

          {/* Real-time Registered Athlete Roster for this Event */}
          <div className="glass-card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="live-dot" />
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1rem", color: "#f1f5f9" }}>
                  Registered 4 Competitors
                </h3>
              </div>
              <span style={{ fontSize: "0.75rem", color: "#38bdf8", fontWeight: 700 }}>
                {activeRace?.athletes.length || 0} Registered
              </span>
            </div>

            <p style={{ color: "#64748b", fontSize: "0.78rem", marginBottom: 14 }}>
              ⚡ <strong>Instant View:</strong> As soon as the registrar enters athletes, their names and Hall colors appear below for the Judge to score.
            </p>

            {(!activeRace?.athletes || activeRace.athletes.length === 0) ? (
              <div style={{ padding: "24px 12px", textAlign: "center", border: "1px dashed var(--border-color)", borderRadius: 8 }}>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: 10 }}>No athletes registered yet.</p>
                <Link href="/admin/races" className="btn-secondary" style={{ fontSize: "0.78rem", padding: "6px 12px", textDecoration: "none" }}>
                  + Register Athletes Now
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "calc(100vh - 460px)", overflowY: "auto" }}>
                {activeRace.athletes.map((ath, i) => {
                  const hall = getHall(ath.hallId);
                  return (
                    <div
                      key={ath.id}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.03)",
                        border: `1px solid ${hall.color}44`,
                        borderLeft: `4px solid ${hall.color}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 800, color: hall.color, width: 44 }}>
                          Lane {ath.lane || i + 1}
                        </span>
                        <div>
                          <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.88rem" }}>{ath.name}</div>
                          <div style={{ fontSize: "0.72rem", color: hall.color, fontWeight: 600 }}>
                            {hall.emoji} {hall.name} {ath.bibNumber ? `· #${ath.bibNumber}` : ""}
                          </div>
                        </div>
                      </div>
                      {ath.seedMark && (
                        <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#38bdf8", fontWeight: 600 }}>
                          {ath.seedMark}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Judge Result Input Form with 1st, 2nd, 3rd, 4th Place & Prizes */}
        <div className="glass-card" style={{ padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: isCompleted ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                    color: isCompleted ? "#4ade80" : "#f87171",
                  }}
                >
                  {isCompleted ? "✓ RESULTS VERIFIED & LIVE" : "PENDING JUDGE SCORING"}
                </span>
                <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                  Judge: <strong style={{ color: "#f1f5f9" }}>{user?.name || "Official Judge"}</strong>
                </span>
              </div>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.55rem", color: "#f1f5f9" }}>
                {activeRace?.name}
              </h2>
            </div>

            {/* MISTAKE EDIT & RESET BUTTONS ("if mistake edit") */}
            {isCompleted && (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {!isEditingScores ? (
                  <button
                    onClick={() => setIsEditingScores(true)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      background: "rgba(56,189,248,0.15)",
                      border: "1px solid rgba(56,189,248,0.4)",
                      color: "#38bdf8",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>✏️</span> Edit / Correct Scores
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingScores(false)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#94a3b8",
                      fontSize: "0.82rem",
                      cursor: "pointer",
                    }}
                  >
                    Cancel Editing
                  </button>
                )}

                <button
                  onClick={handleResetScores}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#f87171",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  title="Reset and clear scores for this event"
                >
                  🔄 Reset Scores
                </button>
              </div>
            )}
          </div>

          {/* If already scored and NOT in editing mode, show summary display with Edit button */}
          {isCompleted && !isEditingScores ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ padding: "16px 20px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontWeight: 800, color: "#ffffff", fontSize: "1rem" }}>
                    Official Podium Standings Verified &amp; Broadcast Live
                  </div>
                  <button
                    onClick={() => setIsEditingScores(true)}
                    style={{
                      background: "rgba(56,189,248,0.2)",
                      border: "1px solid rgba(56,189,248,0.4)",
                      color: "#38bdf8",
                      padding: "6px 14px",
                      borderRadius: 6,
                      fontSize: "0.82rem",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    ✏️ Correct Mistake / Edit Scores
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                  {activeRace.results?.positions.map((pos) => {
                    const hall = getHall(pos.hallId);
                    const medal = pos.position === 1 ? "🥇 1ST PLACE" : pos.position === 2 ? "🥈 2ND PLACE" : pos.position === 3 ? "🥉 3RD PLACE" : "🎖️ 4TH PLACE";
                    return (
                      <div
                        key={pos.position}
                        style={{
                          background: "var(--bg-secondary)",
                          border: `1px solid ${hall.color}66`,
                          borderLeft: `5px solid ${hall.color}`,
                          borderRadius: 8,
                          padding: "12px 14px",
                        }}
                      >
                        <div style={{ fontSize: "0.72rem", fontWeight: 800, color: pos.position === 1 ? "#fbbf24" : "var(--text-muted)", marginBottom: 4 }}>
                          {medal}
                        </div>
                        <div style={{ fontWeight: 800, color: "#ffffff", fontSize: "1rem" }}>
                          {pos.athleteName}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: hall.color, fontWeight: 700, textTransform: "uppercase" }}>
                          {hall.name}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: "0.82rem" }}>
                          <span style={{ fontFamily: "monospace", color: "#38bdf8", fontWeight: 700 }}>{pos.markOrTime}</span>
                          <span style={{ color: "#4ade80", fontWeight: 800 }}>+{pos.points} pts</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setIsEditingScores(true)}
                  className="btn-primary"
                  style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg, #0284c7, #0ea5e9)", fontWeight: 800 }}
                >
                  ✏️ Edit Scores, Points or Placing →
                </button>
                <Link
                  href="/live"
                  target="_blank"
                  className="btn-secondary"
                  style={{ textDecoration: "none", padding: "14px 24px", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <span>🔴</span> Open Live Scoreboard ↗
                </Link>
              </div>
            </div>
          ) : (
            /* Scoring Form: Entry or Edit Mode */
            <form onSubmit={handleSubmitResult} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {isCompleted && isEditingScores && (
                <div style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.35)", borderRadius: 10, padding: "12px 16px", color: "#7dd3fc", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: "1.2rem" }}>✏️</span>
                  <span>
                    <strong>Editing Mode Active:</strong> You can adjust placings, modify points, or correct times. Once submitted, the live scoreboard and standings update instantly.
                  </span>
                </div>
              )}

              {/* 1st PLACE GOLD ("Firsts") */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(245,158,11,0.14), rgba(120,53,15,0.08))",
                  border: "1px solid rgba(245,158,11,0.45)",
                  borderRadius: 14,
                  padding: "20px 22px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "1.5rem" }}>🥇</span>
                    <span style={{ fontWeight: 900, fontSize: "1.1rem", color: "#fbbf24", fontFamily: "'Outfit',sans-serif" }}>
                      1st Place (Firsts / Gold Medal)
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "0.78rem", color: "#fcd34d", fontWeight: 700 }}>Points:</span>
                    <input
                      type="number"
                      className="input-field"
                      style={{ width: 75, padding: "6px 10px", textAlign: "center", fontWeight: 800, color: "#f59e0b", fontSize: "1rem" }}
                      value={p1Points}
                      onChange={(e) => setP1Points(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: 14, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", color: "#fde68a", marginBottom: 6, fontWeight: 700 }}>
                      Select 1st Place Competitor *
                    </label>
                    <select
                      className="input-field"
                      value={p1AthleteId}
                      onChange={(e) => {
                        setP1AthleteId(e.target.value);
                        const a = getAthleteById(e.target.value);
                        if (a && a.seedMark && !p1Mark) setP1Mark(a.seedMark);
                      }}
                      required
                      style={{ fontWeight: 700, borderColor: "rgba(245,158,11,0.5)", fontSize: "0.92rem" }}
                    >
                      <option value="">-- Choose 1st Place Athlete --</option>
                      {activeRace?.athletes.map((ath) => {
                        const h = getHall(ath.hallId);
                        return (
                          <option key={ath.id} value={ath.id}>
                            {ath.name} — {h.name} (Lane {ath.lane || 1})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", color: "#fde68a", marginBottom: 6, fontWeight: 700 }}>
                      Official Time / Distance *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. 10.15s or 2.05m"
                      value={p1Mark}
                      onChange={(e) => setP1Mark(e.target.value)}
                      required
                      style={{ fontWeight: 800, color: "#ffffff", borderColor: "rgba(245,158,11,0.5)" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "#fcd34d", marginBottom: 4, fontWeight: 600 }}>
                    🏆 1st Place Award &amp; Prize Description
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={p1Prize}
                    onChange={(e) => setP1Prize(e.target.value)}
                    placeholder="e.g. 🏆 Gold Trophy & Champion Medal + GH₵ 1,500 Prize"
                    style={{ fontSize: "0.85rem", background: "rgba(0,0,0,0.25)" }}
                  />
                </div>
              </div>

              {/* 2nd PLACE SILVER */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(203,213,225,0.08), rgba(100,116,139,0.04))",
                  border: "1px solid rgba(203,213,225,0.3)",
                  borderRadius: 14,
                  padding: "20px 22px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "1.5rem" }}>🥈</span>
                    <span style={{ fontWeight: 900, fontSize: "1.1rem", color: "#e2e8f0", fontFamily: "'Outfit',sans-serif" }}>
                      2nd Place (Silver Medal / Runner-up)
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "0.78rem", color: "#cbd5e1", fontWeight: 700 }}>Points:</span>
                    <input
                      type="number"
                      className="input-field"
                      style={{ width: 75, padding: "6px 10px", textAlign: "center", fontWeight: 800, color: "#e2e8f0", fontSize: "1rem" }}
                      value={p2Points}
                      onChange={(e) => setP2Points(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: 14, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", color: "#cbd5e1", marginBottom: 6, fontWeight: 700 }}>
                      Select 2nd Place Competitor *
                    </label>
                    <select
                      className="input-field"
                      value={p2AthleteId}
                      onChange={(e) => {
                        setP2AthleteId(e.target.value);
                        const a = getAthleteById(e.target.value);
                        if (a && a.seedMark && !p2Mark) setP2Mark(a.seedMark);
                      }}
                      required
                      style={{ fontWeight: 700 }}
                    >
                      <option value="">-- Choose 2nd Place Athlete --</option>
                      {activeRace?.athletes.map((ath) => {
                        const h = getHall(ath.hallId);
                        return (
                          <option key={ath.id} value={ath.id}>
                            {ath.name} — {h.name} (Lane {ath.lane || 1})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", color: "#cbd5e1", marginBottom: 6, fontWeight: 700 }}>
                      Official Time / Distance *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. 10.24s or 1.98m"
                      value={p2Mark}
                      onChange={(e) => setP2Mark(e.target.value)}
                      required
                      style={{ fontWeight: 800, color: "#ffffff" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "#cbd5e1", marginBottom: 4, fontWeight: 600 }}>
                    🥈 2nd Place Award &amp; Prize Description
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={p2Prize}
                    onChange={(e) => setP2Prize(e.target.value)}
                    placeholder="e.g. 🥈 Silver Medal & Runner-up Award + GH₵ 1,000 Prize"
                    style={{ fontSize: "0.85rem", background: "rgba(0,0,0,0.25)" }}
                  />
                </div>
              </div>

              {/* 3rd PLACE BRONZE */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(217,119,6,0.1), rgba(120,53,15,0.04))",
                  border: "1px solid rgba(217,119,6,0.35)",
                  borderRadius: 14,
                  padding: "20px 22px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "1.5rem" }}>🥉</span>
                    <span style={{ fontWeight: 900, fontSize: "1.1rem", color: "#f97316", fontFamily: "'Outfit',sans-serif" }}>
                      3rd Place (Bronze Medal / Podium Award)
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "0.78rem", color: "#fed7aa", fontWeight: 700 }}>Points:</span>
                    <input
                      type="number"
                      className="input-field"
                      style={{ width: 75, padding: "6px 10px", textAlign: "center", fontWeight: 800, color: "#f97316", fontSize: "1rem" }}
                      value={p3Points}
                      onChange={(e) => setP3Points(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: 14, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", color: "#fed7aa", marginBottom: 6, fontWeight: 700 }}>
                      Select 3rd Place Competitor *
                    </label>
                    <select
                      className="input-field"
                      value={p3AthleteId}
                      onChange={(e) => {
                        setP3AthleteId(e.target.value);
                        const a = getAthleteById(e.target.value);
                        if (a && a.seedMark && !p3Mark) setP3Mark(a.seedMark);
                      }}
                      required
                      style={{ fontWeight: 700 }}
                    >
                      <option value="">-- Choose 3rd Place Athlete --</option>
                      {activeRace?.athletes.map((ath) => {
                        const h = getHall(ath.hallId);
                        return (
                          <option key={ath.id} value={ath.id}>
                            {ath.name} — {h.name} (Lane {ath.lane || 1})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", color: "#fed7aa", marginBottom: 6, fontWeight: 700 }}>
                      Official Time / Distance *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. 10.51s or 1.95m"
                      value={p3Mark}
                      onChange={(e) => setP3Mark(e.target.value)}
                      required
                      style={{ fontWeight: 800, color: "#ffffff" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "#fed7aa", marginBottom: 4, fontWeight: 600 }}>
                    🥉 3rd Place Award &amp; Prize Description
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={p3Prize}
                    onChange={(e) => setP3Prize(e.target.value)}
                    placeholder="e.g. 🥉 Bronze Medal & Podium Award + GH₵ 600 Prize"
                    style={{ fontSize: "0.85rem", background: "rgba(0,0,0,0.25)" }}
                  />
                </div>
              </div>

              {/* 4th PLACE HONOR */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(79,70,229,0.04))",
                  border: "1px solid rgba(99,102,241,0.3)",
                  borderRadius: 14,
                  padding: "20px 22px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "1.5rem" }}>🎖️</span>
                    <span style={{ fontWeight: 900, fontSize: "1.1rem", color: "#a5b4fc", fontFamily: "'Outfit',sans-serif" }}>
                      4th Place (Certificate of Honor / Scoring Finish)
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "0.78rem", color: "#c7d2fe", fontWeight: 700 }}>Points:</span>
                    <input
                      type="number"
                      className="input-field"
                      style={{ width: 75, padding: "6px 10px", textAlign: "center", fontWeight: 800, color: "#818cf8", fontSize: "1rem" }}
                      value={p4Points}
                      onChange={(e) => setP4Points(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: 14, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", color: "#c7d2fe", marginBottom: 6, fontWeight: 700 }}>
                      Select 4th Place Competitor *
                    </label>
                    <select
                      className="input-field"
                      value={p4AthleteId}
                      onChange={(e) => {
                        setP4AthleteId(e.target.value);
                        const a = getAthleteById(e.target.value);
                        if (a && a.seedMark && !p4Mark) setP4Mark(a.seedMark);
                      }}
                      required
                      style={{ fontWeight: 700 }}
                    >
                      <option value="">-- Choose 4th Place Athlete --</option>
                      {activeRace?.athletes.map((ath) => {
                        const h = getHall(ath.hallId);
                        return (
                          <option key={ath.id} value={ath.id}>
                            {ath.name} — {h.name} (Lane {ath.lane || 1})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", color: "#c7d2fe", marginBottom: 6, fontWeight: 700 }}>
                      Official Time / Distance *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. 10.65s or 1.92m"
                      value={p4Mark}
                      onChange={(e) => setP4Mark(e.target.value)}
                      required
                      style={{ fontWeight: 800, color: "#ffffff" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "#c7d2fe", marginBottom: 4, fontWeight: 600 }}>
                    🎖️ 4th Place Award &amp; Prize Description
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={p4Prize}
                    onChange={(e) => setP4Prize(e.target.value)}
                    placeholder="e.g. 🎖️ 4th Place Honor Certificate + GH₵ 300 Prize"
                    style={{ fontSize: "0.85rem", background: "rgba(0,0,0,0.25)" }}
                  />
                </div>
              </div>

              {/* Official Judge Notes */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                  Judge Notes &amp; Official Verification (optional)
                </label>
                <textarea
                  className="input-field"
                  rows={2}
                  placeholder="e.g. Validated with electronic photo finish. Wind: +0.2 m/s. All competitors cleared."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Submit Action */}
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: "16px",
                    fontSize: "1rem",
                    fontWeight: 900,
                    background: isCompleted ? "linear-gradient(135deg, #0284c7, #0ea5e9)" : "linear-gradient(135deg, #10b981, #059669)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                  }}
                >
                  ⚖️ {isCompleted ? "Save Score Corrections & Broadcast Live" : "Submit Official Scores (1st – 4th Places) & Broadcast Live"} →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

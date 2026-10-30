"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HALLS, HallId, getHall } from "@/lib/data";
import {
  RaceEvent,
  RaceAthlete,
  getStoredRaces,
  saveRaceEvent,
  deleteRaceEvent,
  addAthleteToEvent,
  updateAthleteInEvent,
  removeAthleteFromEvent,
} from "@/lib/raceStore";
import { getCurrentUser } from "@/lib/auth";

interface WizardAthleteState {
  id?: string;
  name: string;
  hallId: HallId;
  lane: number;
  bibNumber: string;
  studentId: string;
  seedMark: string;
}

const DEFAULT_HALL_COLORS: HallId[] = ["blue", "black", "gold", "purple"];

export default function RaceRegistrationPage() {
  const [races, setRaces] = useState<RaceEvent[]>([]);
  const [selectedRaceId, setSelectedRaceId] = useState<string>("");
  const [user, setUser] = useState(getCurrentUser());
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);

  // ─── 4-Athlete Guided Registration Wizard State ───
  const [wizardOpen, setWizardOpen] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [wizardStep, setWizardStep] = useState<number>(0); // 0: Race Info, 1: Ath 1, 2: Ath 2, 3: Ath 3, 4: Ath 4, 5: Review & Submit

  const [wizardRace, setWizardRace] = useState({
    id: "",
    name: "",
    raceType: "individual" as "individual" | "group",
    category: "track" as "track" | "field",
    venue: "Main Stadium Olympic Track (Lanes 1-4)",
    date: "2026-10-29",
    time: "14:00",
    status: "scheduled" as "scheduled" | "live" | "completed",
  });

  const [wizardAthletes, setWizardAthletes] = useState<WizardAthleteState[]>([
    { name: "", hallId: "blue", lane: 1, bibNumber: "101", studentId: "", seedMark: "" },
    { name: "", hallId: "black", lane: 2, bibNumber: "102", studentId: "", seedMark: "" },
    { name: "", hallId: "gold", lane: 3, bibNumber: "103", studentId: "", seedMark: "" },
    { name: "", hallId: "purple", lane: 4, bibNumber: "104", studentId: "", seedMark: "" },
  ]);

  // Single Athlete modal for quick tweaks
  const [singleAthleteModalOpen, setSingleAthleteModalOpen] = useState(false);
  const [editingSingleAthlete, setEditingSingleAthlete] = useState<RaceAthlete | null>(null);
  const [singleAthleteForm, setSingleAthleteForm] = useState({
    name: "",
    hallId: "blue" as HallId,
    lane: 1,
    bibNumber: "",
    studentId: "",
    seedMark: "",
  });

  const showNotification = (msg: string) => {
    setBannerMsg(msg);
    setTimeout(() => setBannerMsg(null), 3500);
  };

  useEffect(() => {
    setUser(getCurrentUser());
    const load = () => {
      const data = getStoredRaces();
      setRaces(data);
      if (data.length > 0 && !selectedRaceId) {
        setSelectedRaceId(data[0].id);
      }
    };
    load();

    const handleUpdate = () => load();
    window.addEventListener("championship-races-changed", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("championship-races-changed", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [selectedRaceId]);

  const activeRace = races.find((r) => r.id === selectedRaceId) || races[0];

  // ─── Open Wizard for NEW Race ───
  const handleStartNewRaceWizard = () => {
    const nextTime = "14:00";
    setWizardRace({
      id: `race-${Date.now()}`,
      name: "",
      raceType: "individual",
      category: "track",
      venue: "Main Stadium Olympic Track (Lanes 1-4)",
      date: new Date().toISOString().split("T")[0],
      time: nextTime,
      status: "scheduled",
    });

    setWizardAthletes([
      { name: "", hallId: "blue", lane: 1, bibNumber: "101", studentId: "", seedMark: "" },
      { name: "", hallId: "black", lane: 2, bibNumber: "102", studentId: "", seedMark: "" },
      { name: "", hallId: "gold", lane: 3, bibNumber: "103", studentId: "", seedMark: "" },
      { name: "", hallId: "purple", lane: 4, bibNumber: "104", studentId: "", seedMark: "" },
    ]);

    setIsEditingExisting(false);
    setWizardStep(0);
    setWizardOpen(true);
  };

  // ─── Open Wizard to EDIT existing Race & its 4 Athletes ("if mistake edit") ───
  const handleEditRaceWizard = (race: RaceEvent) => {
    setWizardRace({
      id: race.id,
      name: race.name,
      raceType: race.raceType || (race.name.toLowerCase().includes("relay") ? "group" : "individual"),
      category: race.category,
      venue: race.venue,
      date: race.date,
      time: race.time,
      status: race.status,
    });

    // Populate the 4 athletes
    const athletesList: WizardAthleteState[] = [];
    for (let i = 0; i < 4; i++) {
      const existing = race.athletes[i];
      if (existing) {
        athletesList.push({
          id: existing.id,
          name: existing.name,
          hallId: existing.hallId,
          lane: existing.lane || i + 1,
          bibNumber: existing.bibNumber || `${100 + i + 1}`,
          studentId: existing.studentId || "",
          seedMark: existing.seedMark || "",
        });
      } else {
        athletesList.push({
          name: "",
          hallId: DEFAULT_HALL_COLORS[i % 4],
          lane: i + 1,
          bibNumber: `${100 + i + 1}`,
          studentId: "",
          seedMark: "",
        });
      }
    }

    setWizardAthletes(athletesList);
    setIsEditingExisting(true);
    setWizardStep(0);
    setWizardOpen(true);
  };

  // ─── Update athlete field in wizard ───
  const handleUpdateWizardAthlete = (index: number, field: keyof WizardAthleteState, value: any) => {
    setWizardAthletes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // ─── Final Submit from Wizard ───
  const handleFinalSubmitWizard = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Generate race name if empty
    let finalName = wizardRace.name.trim();
    if (!finalName) {
      if (wizardRace.raceType === "group") {
        finalName = "Men's 4x100m Relay — Championship Heat";
      } else {
        finalName = "Men's 100m Sprint — Championship Heat";
      }
    }

    // Convert wizardAthletes into RaceAthlete objects
    const finalAthletes: RaceAthlete[] = wizardAthletes.map((ath, idx) => ({
      id: ath.id || `ath-${Date.now()}-${idx + 1}`,
      name: ath.name.trim() || `${getHall(ath.hallId).name} Runner ${idx + 1}`,
      hallId: ath.hallId,
      lane: ath.lane || idx + 1,
      bibNumber: ath.bibNumber || `${100 + idx + 1}`,
      studentId: ath.studentId || "",
      seedMark: ath.seedMark || "",
    }));

    const finalRacePayload: RaceEvent = {
      ...wizardRace,
      name: finalName,
      athletes: finalAthletes,
    };

    const updatedList = saveRaceEvent(finalRacePayload);
    setRaces(updatedList);
    setSelectedRaceId(finalRacePayload.id);
    setWizardOpen(false);

    if (isEditingExisting) {
      showNotification(`✓ Race "${finalName}" & all 4 athletes updated! Changes are instantly live for the Judge desk.`);
    } else {
      showNotification(`✓ New ${wizardRace.raceType} race "${finalName}" registered with 4 athletes! Judge can now score this event.`);
    }
  };

  const handleDeleteRace = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove the race "${name}"?`)) {
      const updated = deleteRaceEvent(id);
      setRaces(updated);
      if (selectedRaceId === id && updated.length > 0) {
        setSelectedRaceId(updated[0].id);
      }
      showNotification(`Race "${name}" was deleted.`);
    }
  };

  // Quick single athlete edit modal handlers
  const handleOpenSingleAthleteModal = (athleteToEdit?: RaceAthlete) => {
    if (!activeRace) return;
    if (athleteToEdit) {
      setEditingSingleAthlete(athleteToEdit);
      setSingleAthleteForm({
        name: athleteToEdit.name,
        hallId: athleteToEdit.hallId,
        lane: athleteToEdit.lane || 1,
        bibNumber: athleteToEdit.bibNumber || "",
        studentId: athleteToEdit.studentId || "",
        seedMark: athleteToEdit.seedMark || "",
      });
    } else {
      setEditingSingleAthlete(null);
      const nextLane = (activeRace.athletes.length % 8) + 1;
      setSingleAthleteForm({
        name: "",
        hallId: "blue",
        lane: nextLane,
        bibNumber: `${100 + activeRace.athletes.length + 1}`,
        studentId: "",
        seedMark: "",
      });
    }
    setSingleAthleteModalOpen(true);
  };

  const handleSaveSingleAthlete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleAthleteForm.name.trim() || !activeRace) return;

    if (editingSingleAthlete) {
      const updatedList = updateAthleteInEvent(activeRace.id, editingSingleAthlete.id, singleAthleteForm);
      setRaces(updatedList);
      showNotification(`Athlete "${singleAthleteForm.name}" updated! Changes are instantly live for the Judge.`);
    } else {
      const updatedList = addAthleteToEvent(activeRace.id, singleAthleteForm);
      setRaces(updatedList);
      showNotification(`"${singleAthleteForm.name}" registered to ${activeRace.name}! The Judge can immediately view them.`);
    }
    setSingleAthleteModalOpen(false);
  };

  const handleDeleteAthlete = (athleteId: string, athleteName: string) => {
    if (!activeRace) return;
    if (confirm(`Remove "${athleteName}" from ${activeRace.name}?`)) {
      const updatedList = removeAthleteFromEvent(activeRace.id, athleteId);
      setRaces(updatedList);
      showNotification(`Removed "${athleteName}" from this race.`);
    }
  };

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1400 }}>
      {/* Toast Alert Banner */}
      {bannerMsg && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 9999,
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "#ffffff",
            padding: "14px 22px",
            borderRadius: 12,
            boxShadow: "0 10px 25px rgba(0,0,0,0.45)",
            fontWeight: 700,
            fontSize: "0.92rem",
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>⚡</span>
          <span>{bannerMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 999, padding: "3px 12px", marginBottom: 8 }}>
            <span style={{ fontSize: "0.85rem" }}>🏁</span>
            <span style={{ fontSize: "0.75rem", color: "#818cf8", fontWeight: 700 }}>OFFICIAL RACE &amp; ATHLETE REGISTRY</span>
          </div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.95rem", color: "#f1f5f9" }}>
            Race &amp; Athlete Registration Portal
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            Step-by-step registration for Individual and Group races. Register race time, format, and the 4 athletes. <strong style={{ color: "#38bdf8" }}>The Judge instantly sees them upon submission and live updates reflect across the site.</strong>
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            className="btn-primary"
            onClick={handleStartNewRaceWizard}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 20px",
              fontSize: "0.92rem",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>⚡</span>
            <span>Register Race &amp; 4 Athletes</span>
          </button>

          <Link href="/admin/judge" className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", padding: "12px 18px" }}>
            <span>⚖️</span> Judge Scoring Desk →
          </Link>
          <Link href="/live" target="_blank" className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", padding: "12px 18px" }}>
            <span>🔴</span> Live Scoreboard ↗
          </Link>
        </div>
      </div>

      {/* ─── MAIN 2-COLUMN LAYOUT ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 24, alignItems: "start" }}>
        {/* Left Column: Races List */}
        <div className="glass-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#f1f5f9" }}>
              Registered Races ({races.length})
            </h2>
            <button
              onClick={handleStartNewRaceWizard}
              style={{
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.3)",
                color: "#818cf8",
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + New Race
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: "calc(100vh - 280px)", overflowY: "auto" }}>
            {races.map((r) => {
              const isSelected = r.id === activeRace?.id;
              const completed = r.status === "completed";
              const live = r.status === "live";

              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRaceId(r.id)}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 10,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(129,140,248,0.1))"
                      : "rgba(255,255,255,0.03)",
                    border: isSelected
                      ? "1px solid #818cf8"
                      : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          padding: "2px 8px",
                          borderRadius: 999,
                          textTransform: "uppercase",
                          background: live ? "rgba(239,68,68,0.2)" : completed ? "rgba(34,197,94,0.15)" : "rgba(148,163,184,0.15)",
                          color: live ? "#f87171" : completed ? "#4ade80" : "#94a3b8",
                        }}
                      >
                        {live ? "🔴 LIVE" : completed ? "✓ COMPLETED" : "📅 SCHEDULED"}
                      </span>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: r.raceType === "group" ? "rgba(245,158,11,0.15)" : "rgba(56,189,248,0.15)",
                          color: r.raceType === "group" ? "#fbbf24" : "#38bdf8",
                        }}
                      >
                        {r.raceType === "group" ? "👥 Group" : "🏃 Individual"}
                      </span>
                    </div>

                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontFamily: "monospace", fontWeight: 700 }}>
                      ⏰ {r.time}
                    </span>
                  </div>

                  <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.92rem", lineHeight: 1.3, marginBottom: 8 }}>
                    {r.name}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", color: "#94a3b8" }}>
                    <span>👥 {r.athletes.length} Athletes Registered</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditRaceWizard(r);
                      }}
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#38bdf8",
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontSize: "0.72rem",
                        cursor: "pointer",
                      }}
                    >
                      ✏️ Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Race Athletes & Controls */}
        {activeRace ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Race Details Card */}
            <div className="glass-card" style={{ padding: "24px", position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        padding: "3px 10px",
                        borderRadius: 999,
                        background: activeRace.status === "completed" ? "rgba(34,197,94,0.15)" : "rgba(99,102,241,0.15)",
                        color: activeRace.status === "completed" ? "#4ade80" : "#818cf8",
                      }}
                    >
                      {activeRace.category.toUpperCase()} EVENT
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        padding: "3px 10px",
                        borderRadius: 999,
                        background: activeRace.raceType === "group" ? "rgba(245,158,11,0.15)" : "rgba(56,189,248,0.15)",
                        color: activeRace.raceType === "group" ? "#fbbf24" : "#38bdf8",
                      }}
                    >
                      {activeRace.raceType === "group" ? "👥 GROUP / RELAY" : "🏃 INDIVIDUAL"}
                    </span>
                    <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                      ⏰ Scheduled: <strong>{activeRace.time}</strong> · 📅 {activeRace.date}
                    </span>
                  </div>

                  <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.6rem", color: "#f1f5f9" }}>
                    {activeRace.name}
                  </h2>
                  <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: 4 }}>
                    📍 {activeRace.venue}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    onClick={() => handleEditRaceWizard(activeRace)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      background: "rgba(56,189,248,0.12)",
                      border: "1px solid rgba(56,189,248,0.35)",
                      color: "#38bdf8",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>✏️</span> Edit Race &amp; 4 Athletes
                  </button>

                  <Link
                    href={`/admin/judge?eventId=${activeRace.id}`}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      background: "linear-gradient(135deg, #0284c7, #0ea5e9)",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>⚖️</span> Score in Judge Desk →
                  </Link>

                  <button
                    onClick={() => handleDeleteRace(activeRace.id, activeRace.name)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "#f87171",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                    }}
                    title="Delete race"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Registered Athletes Grid */}
            <div className="glass-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#f1f5f9" }}>
                    Registered Competitors ({activeRace.athletes.length} / 4 Lanes)
                  </h3>
                  <p style={{ color: "#64748b", fontSize: "0.82rem" }}>
                    These 4 athletes are visible to the Judge desk. The judge scores 1st, 2nd, 3rd, and 4th place.
                  </p>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => handleEditRaceWizard(activeRace)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      background: "rgba(99,102,241,0.15)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      color: "#818cf8",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ⚡ Edit in 4-Athlete Wizard
                  </button>
                  <button
                    onClick={() => handleOpenSingleAthleteModal()}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#f1f5f9",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    + Add Single Athlete
                  </button>
                </div>
              </div>

              {activeRace.athletes.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", border: "1px dashed var(--border-color)", borderRadius: 10 }}>
                  <div style={{ fontSize: "2rem", marginBottom: 10 }}>🏃</div>
                  <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: 12 }}>
                    No athletes registered for this race yet.
                  </p>
                  <button className="btn-primary" onClick={() => handleEditRaceWizard(activeRace)}>
                    ⚡ Register 4 Athletes in Guided Wizard →
                  </button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                  {activeRace.athletes.map((ath, idx) => {
                    const hall = getHall(ath.hallId);
                    return (
                      <div
                        key={ath.id}
                        style={{
                          background: "var(--bg-secondary)",
                          border: `1px solid ${hall.color}66`,
                          borderLeft: `6px solid ${hall.color}`,
                          borderRadius: 12,
                          padding: "16px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          gap: 12,
                          boxShadow: `0 4px 16px ${hall.glow}`,
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 800,
                                padding: "2px 8px",
                                borderRadius: 4,
                                background: hall.color,
                                color: "#ffffff",
                              }}
                            >
                              LANE {ath.lane || idx + 1}
                            </span>
                            <span style={{ fontSize: "0.72rem", color: hall.color, fontWeight: 800, textTransform: "uppercase" }}>
                              {hall.emoji} {hall.name}
                            </span>
                          </div>

                          <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.05rem", lineHeight: 1.2 }}>
                            {ath.name}
                          </div>

                          <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: "0.78rem", color: "#94a3b8" }}>
                            {ath.bibNumber && <span>Bib: #{ath.bibNumber}</span>}
                            {ath.seedMark && <span style={{ color: "#38bdf8", fontWeight: 600 }}>Mark: {ath.seedMark}</span>}
                          </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, borderTop: "1px solid var(--border-color)", paddingTop: 10 }}>
                          <button
                            onClick={() => handleOpenSingleAthleteModal(ath)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#38bdf8",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAthlete(ath.id, ath.name)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#f87171",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Official Scoring Status & Judge Link */}
            {activeRace.results ? (
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.05))",
                  border: "1px solid rgba(16,185,129,0.3)",
                  borderRadius: 14,
                  padding: "20px 24px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "1.3rem" }}>🏆</span>
                    <div>
                      <div style={{ fontWeight: 800, color: "#ffffff", fontSize: "0.95rem" }}>
                        Official Judge Results Published
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#6ee7b7" }}>
                        Recorded by {activeRace.results.recordedBy} at {activeRace.results.recordedAt}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/admin/judge?eventId=${activeRace.id}`}
                    style={{
                      background: "rgba(16,185,129,0.2)",
                      border: "1px solid rgba(16,185,129,0.4)",
                      color: "#6ee7b7",
                      padding: "6px 14px",
                      borderRadius: 6,
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    ✏️ Edit / Correct Scores in Judge Desk →
                  </Link>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
                  {activeRace.results.positions.map((p) => {
                    const h = getHall(p.hallId);
                    const medal = p.position === 1 ? "🥇 1st" : p.position === 2 ? "🥈 2nd" : p.position === 3 ? "🥉 3rd" : "🎖️ 4th";
                    return (
                      <div key={p.position} style={{ background: "rgba(0,0,0,0.3)", padding: "10px 14px", borderRadius: 8, borderLeft: `4px solid ${h.color}` }}>
                        <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#fbbf24" }}>{medal}</div>
                        <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.9rem" }}>{p.athleteName}</div>
                        <div style={{ fontSize: "0.72rem", color: h.color }}>{h.name} · {p.markOrTime} (+{p.points} pts)</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: "rgba(99,102,241,0.08)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: 12,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.9rem" }}>
                    Awaiting Judge Scoring
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                    Once this race takes place, the Judge will enter 1st, 2nd, 3rd, and 4th place scores.
                  </div>
                </div>

                <Link
                  href={`/admin/judge?eventId=${activeRace.id}`}
                  className="btn-primary"
                  style={{ fontSize: "0.82rem", padding: "8px 16px", textDecoration: "none" }}
                >
                  ⚖️ Score Event as Judge →
                </Link>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          ⚡ GUIDED 4-ATHLETE REGISTRATION WIZARD MODAL
          "start by race time inividual or group if indicidual enter athele name
           color and move to the next atheleti after finished the four athele
           click submit if mistake edit"
         ══════════════════════════════════════════════════════════════════════════ */}
      {wizardOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            className="glass-card"
            style={{
              width: "100%",
              maxWidth: 780,
              maxHeight: "92vh",
              overflowY: "auto",
              padding: "32px",
              border: "1px solid rgba(99,102,241,0.4)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
              position: "relative",
            }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(99,102,241,0.15)", borderRadius: 999, padding: "3px 10px", marginBottom: 6 }}>
                  <span style={{ fontSize: "0.8rem" }}>⚡</span>
                  <span style={{ fontSize: "0.72rem", color: "#818cf8", fontWeight: 800, textTransform: "uppercase" }}>
                    {isEditingExisting ? "Edit Race & 4 Athletes" : "Step-by-Step 4-Athlete Registration"}
                  </span>
                </div>
                <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.5rem", color: "#f1f5f9" }}>
                  {wizardStep === 0 && "Step 1: Race Time & Format"}
                  {wizardStep >= 1 && wizardStep <= 4 && `Step ${wizardStep + 1}: Competitor ${wizardStep} of 4 (Lane ${wizardStep})`}
                  {wizardStep === 5 && "Review & Submit 4 Athletes"}
                </h2>
                <p style={{ color: "#94a3b8", fontSize: "0.82rem" }}>
                  {wizardStep === 0 && "Choose scheduled race time, individual or group format, and discipline."}
                  {wizardStep >= 1 && wizardStep <= 4 && "Enter athlete name, select Hall color (Blue, Black, Gold, Purple), then move to the next athlete."}
                  {wizardStep === 5 && "Verify all 4 athletes. If you made any mistake, edit directly before submitting to the Judge desk."}
                </p>
              </div>

              <button
                onClick={() => setWizardOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "none",
                  color: "#94a3b8",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                }}
              >
                ✕
              </button>
            </div>

            {/* Step Navigation Pills */}
            <div style={{ display: "flex", gap: 6, marginBottom: 24, overflowX: "auto", paddingBottom: 6 }}>
              {[
                { step: 0, label: "⏰ 1. Race & Time" },
                { step: 1, label: `🏃 2. Ath 1 (${wizardAthletes[0]?.name ? wizardAthletes[0].name.split(" ")[0] : "Lane 1"})` },
                { step: 2, label: `🏃 3. Ath 2 (${wizardAthletes[1]?.name ? wizardAthletes[1].name.split(" ")[0] : "Lane 2"})` },
                { step: 3, label: `🏃 4. Ath 3 (${wizardAthletes[2]?.name ? wizardAthletes[2].name.split(" ")[0] : "Lane 3"})` },
                { step: 4, label: `🏃 5. Ath 4 (${wizardAthletes[3]?.name ? wizardAthletes[3].name.split(" ")[0] : "Lane 4"})` },
                { step: 5, label: "✓ Review & Submit" },
              ].map((pill) => {
                const active = wizardStep === pill.step;
                const completed = wizardStep > pill.step;
                return (
                  <button
                    key={pill.step}
                    type="button"
                    onClick={() => setWizardStep(pill.step)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 20,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      border: active
                        ? "1px solid #818cf8"
                        : completed
                        ? "1px solid rgba(16,185,129,0.4)"
                        : "1px solid rgba(255,255,255,0.08)",
                      background: active
                        ? "rgba(99,102,241,0.25)"
                        : completed
                        ? "rgba(16,185,129,0.15)"
                        : "rgba(255,255,255,0.03)",
                      color: active ? "#ffffff" : completed ? "#6ee7b7" : "#94a3b8",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            {/* ─── STEP 0: RACE TIME, FORMAT & DISCIPLINE ─── */}
            {wizardStep === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Race Format: Individual vs Group */}
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "#f1f5f9", marginBottom: 8, fontWeight: 700 }}>
                    Race Format: Individual or Group / Relay *
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div
                      onClick={() => {
                        setWizardRace((prev) => ({
                          ...prev,
                          raceType: "individual",
                          name: prev.name.includes("Relay") ? "Men's 100m Sprint — Championship Final" : prev.name || "Men's 100m Sprint — Championship Final",
                        }));
                      }}
                      style={{
                        padding: "16px",
                        borderRadius: 10,
                        cursor: "pointer",
                        border: wizardRace.raceType === "individual" ? "2px solid #38bdf8" : "1px solid var(--border-color)",
                        background: wizardRace.raceType === "individual" ? "rgba(56,189,248,0.15)" : "rgba(255,255,255,0.02)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: "1.4rem" }}>🏃</span>
                        <span style={{ fontWeight: 800, color: "#ffffff", fontSize: "1rem" }}>Individual Event</span>
                      </div>
                      <p style={{ color: "#94a3b8", fontSize: "0.78rem", margin: 0 }}>
                        Single athlete per hall (100m, 200m, 400m, Long Jump, Shot Put)
                      </p>
                    </div>

                    <div
                      onClick={() => {
                        setWizardRace((prev) => ({
                          ...prev,
                          raceType: "group",
                          name: prev.name.includes("100m") && !prev.name.includes("Relay") ? "Men's 4x100m Relay — Championship Final" : prev.name || "Men's 4x100m Relay — Championship Final",
                        }));
                      }}
                      style={{
                        padding: "16px",
                        borderRadius: 10,
                        cursor: "pointer",
                        border: wizardRace.raceType === "group" ? "2px solid #fbbf24" : "1px solid var(--border-color)",
                        background: wizardRace.raceType === "group" ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.02)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: "1.4rem" }}>👥</span>
                        <span style={{ fontWeight: 800, color: "#ffffff", fontSize: "1rem" }}>Group / Relay Event</span>
                      </div>
                      <p style={{ color: "#94a3b8", fontSize: "0.78rem", margin: 0 }}>
                        Hall Squads &amp; Relay teams (4x100m, 4x400m, Medley Relay)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Race Time & Scheduled Date */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "#f1f5f9", marginBottom: 6, fontWeight: 700 }}>
                      ⏰ Race Time *
                    </label>
                    <input
                      type="time"
                      className="input-field"
                      value={wizardRace.time}
                      onChange={(e) => setWizardRace({ ...wizardRace, time: e.target.value })}
                      required
                      style={{ fontSize: "1rem", fontWeight: 700, padding: "10px 14px" }}
                    />
                    <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                      {["14:00", "14:30", "15:00", "15:45", "16:15"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setWizardRace({ ...wizardRace, time: t })}
                          style={{
                            background: wizardRace.time === t ? "#6366f1" : "rgba(255,255,255,0.06)",
                            border: "none",
                            borderRadius: 4,
                            padding: "2px 8px",
                            fontSize: "0.72rem",
                            color: "#ffffff",
                            cursor: "pointer",
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "#f1f5f9", marginBottom: 6, fontWeight: 700 }}>
                      📅 Scheduled Date
                    </label>
                    <input
                      type="date"
                      className="input-field"
                      value={wizardRace.date}
                      onChange={(e) => setWizardRace({ ...wizardRace, date: e.target.value })}
                      style={{ fontSize: "0.95rem", padding: "10px 14px" }}
                    />
                  </div>
                </div>

                {/* Event Name & Category */}
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "#f1f5f9", marginBottom: 6, fontWeight: 700 }}>
                    Race / Event Name *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder={wizardRace.raceType === "group" ? "e.g. Men's 4x100m Relay — Grand Final" : "e.g. Men's 100m Sprint — Championship Final"}
                    value={wizardRace.name}
                    onChange={(e) => setWizardRace({ ...wizardRace, name: e.target.value })}
                    required
                    style={{ fontSize: "0.95rem" }}
                  />
                  {/* Quick Title Presets */}
                  <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                    {(wizardRace.raceType === "group"
                      ? ["Men's 4x100m Relay Final", "Women's 4x100m Relay Final", "Mixed 4x400m Championship Relay"]
                      : ["Men's 100m Sprint Final", "Women's 200m Sprint Final", "Men's 400m Dash", "High Jump Championship", "Shot Put Championship"]
                    ).map((title) => (
                      <button
                        key={title}
                        type="button"
                        onClick={() => setWizardRace({ ...wizardRace, name: title, category: title.includes("Jump") || title.includes("Put") ? "field" : "track" })}
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 4,
                          padding: "3px 8px",
                          fontSize: "0.72rem",
                          color: "#94a3b8",
                          cursor: "pointer",
                        }}
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "#f1f5f9", marginBottom: 6, fontWeight: 700 }}>
                      Category
                    </label>
                    <select
                      className="input-field"
                      value={wizardRace.category}
                      onChange={(e) => setWizardRace({ ...wizardRace, category: e.target.value as any })}
                    >
                      <option value="track">🏃 Track (Sprint, Hurdle, Relay)</option>
                      <option value="field">🎯 Field (Jump, Throw, Vault)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "#f1f5f9", marginBottom: 6, fontWeight: 700 }}>
                      Venue
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={wizardRace.venue}
                      onChange={(e) => setWizardRace({ ...wizardRace, venue: e.target.value })}
                    />
                  </div>
                </div>

                {/* Bottom Step Control */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      if (!wizardRace.name.trim()) {
                        setWizardRace({
                          ...wizardRace,
                          name: wizardRace.raceType === "group" ? "Men's 4x100m Relay — Championship Heat" : "Men's 100m Sprint — Championship Heat",
                        });
                      }
                      setWizardStep(1);
                    }}
                    style={{
                      padding: "12px 24px",
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    }}
                  >
                    Proceed to Athlete 1 (Lane 1) →
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEPS 1 to 4: ENTER EACH ATHLETE (NAME, COLOR, LANE, MOVE TO NEXT) ─── */}
            {wizardStep >= 1 && wizardStep <= 4 && (() => {
              const currentIdx = wizardStep - 1; // 0, 1, 2, 3
              const ath = wizardAthletes[currentIdx];
              const selectedHall = getHall(ath.hallId);
              const isGroup = wizardRace.raceType === "group";

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${selectedHall.color}22, rgba(0,0,0,0.4))`,
                      border: `1px solid ${selectedHall.color}66`,
                      borderLeft: `8px solid ${selectedHall.color}`,
                      borderRadius: 12,
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.72rem", color: selectedHall.color, fontWeight: 900, textTransform: "uppercase" }}>
                        COMPETITOR {wizardStep} OF 4 · LANE {ath.lane}
                      </div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#ffffff" }}>
                        {ath.name || (isGroup ? `Enter ${selectedHall.name} Squad Name` : `Enter ${selectedHall.name} Athlete Name`)}
                      </div>
                    </div>
                    <div
                      style={{
                        background: selectedHall.color,
                        color: "#ffffff",
                        padding: "6px 14px",
                        borderRadius: 8,
                        fontWeight: 900,
                        fontSize: "0.85rem",
                        boxShadow: `0 0 14px ${selectedHall.glow}`,
                      }}
                    >
                      {selectedHall.emoji} {selectedHall.name}
                    </div>
                  </div>

                  {/* Athlete Name Input */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "#f1f5f9", marginBottom: 6, fontWeight: 700 }}>
                      {isGroup ? `Competitor ${wizardStep}: Squad / Team Name *` : `Competitor ${wizardStep}: Athlete Full Name *`}
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      autoFocus
                      placeholder={isGroup ? `e.g. ${selectedHall.name} Relay Squad A` : `e.g. Abdulai (${selectedHall.name})`}
                      value={ath.name}
                      onChange={(e) => handleUpdateWizardAthlete(currentIdx, "name", e.target.value)}
                      style={{ fontSize: "1.05rem", fontWeight: 700, borderColor: selectedHall.color }}
                      required
                    />
                  </div>

                  {/* Color Selection (The 4 Halls: Blue, Black, Gold, Purple) */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "#f1f5f9", marginBottom: 8, fontWeight: 700 }}>
                      Assign Hall / Team Color *
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                      {HALLS.map((h) => {
                        const isChosen = ath.hallId === h.id;
                        return (
                          <div
                            key={h.id}
                            onClick={() => handleUpdateWizardAthlete(currentIdx, "hallId", h.id)}
                            style={{
                              padding: "12px 10px",
                              borderRadius: 10,
                              cursor: "pointer",
                              textAlign: "center",
                              border: isChosen ? `2px solid ${h.color}` : "1px solid rgba(255,255,255,0.08)",
                              background: isChosen ? `${h.color}33` : "rgba(255,255,255,0.03)",
                              boxShadow: isChosen ? `0 0 16px ${h.glow}` : undefined,
                              transition: "all 0.15s ease",
                            }}
                          >
                            <div
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: "50%",
                                background: h.color,
                                margin: "0 auto 6px",
                                boxShadow: `0 0 8px ${h.glow}`,
                              }}
                            />
                            <div style={{ fontWeight: 800, fontSize: "0.8rem", color: isChosen ? "#ffffff" : "#94a3b8" }}>
                              {h.name}
                            </div>
                            <div style={{ fontSize: "0.68rem", color: h.color, fontWeight: 700 }}>
                              {isChosen ? "✓ SELECTED" : h.id.toUpperCase()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Lane, Bib & Seed Mark */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.78rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                        Track Lane
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={8}
                        className="input-field"
                        value={ath.lane}
                        onChange={(e) => handleUpdateWizardAthlete(currentIdx, "lane", Number(e.target.value))}
                        style={{ textAlign: "center", fontWeight: 800 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.78rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                        Bib Number (Optional)
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. 101"
                        value={ath.bibNumber}
                        onChange={(e) => handleUpdateWizardAthlete(currentIdx, "bibNumber", e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.78rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                        Best Time / Seed (Optional)
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. 10.15s"
                        value={ath.seedMark}
                        onChange={(e) => handleUpdateWizardAthlete(currentIdx, "seedMark", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Bottom Navigation Buttons */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                    <button
                      type="button"
                      onClick={() => setWizardStep(wizardStep - 1)}
                      style={{
                        padding: "10px 18px",
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "#94a3b8",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      ← Previous
                    </button>

                    {wizardStep < 4 ? (
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                          if (!ath.name.trim()) {
                            handleUpdateWizardAthlete(currentIdx, "name", `${selectedHall.name} Athlete`);
                          }
                          setWizardStep(wizardStep + 1);
                        }}
                        style={{
                          padding: "12px 24px",
                          fontSize: "0.95rem",
                          fontWeight: 800,
                          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        }}
                      >
                        Move to Athlete {wizardStep + 1} of 4 →
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                          if (!ath.name.trim()) {
                            handleUpdateWizardAthlete(currentIdx, "name", `${selectedHall.name} Athlete`);
                          }
                          setWizardStep(5); // Go to review
                        }}
                        style={{
                          padding: "12px 24px",
                          fontSize: "0.95rem",
                          fontWeight: 800,
                          background: "linear-gradient(135deg, #10b981, #059669)",
                        }}
                      >
                        All 4 Athletes Complete · Review &amp; Submit →
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ─── STEP 5: REVIEW & SUBMIT ("if mistake edit") ─── */}
            {wizardStep === 5 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Race summary box */}
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-color)", borderRadius: 10, padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "0.72rem", color: "#818cf8", fontWeight: 800, textTransform: "uppercase" }}>
                        {wizardRace.raceType.toUpperCase()} EVENT · {wizardRace.category.toUpperCase()}
                      </div>
                      <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#ffffff" }}>
                        {wizardRace.name || "Championship Race"}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: 2 }}>
                        ⏰ Scheduled: <strong>{wizardRace.time}</strong> · 📍 {wizardRace.venue}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setWizardStep(0)}
                      style={{
                        background: "rgba(56,189,248,0.15)",
                        border: "1px solid rgba(56,189,248,0.3)",
                        color: "#38bdf8",
                        padding: "6px 12px",
                        borderRadius: 6,
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      ✏️ Edit Race Info
                    </button>
                  </div>
                </div>

                {/* The 4 Competitors Review Cards */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontWeight: 800, color: "#f1f5f9", fontSize: "0.95rem" }}>
                      Registered 4 Athletes for the Judge Desk
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700 }}>
                      ✓ All 4 Lanes Ready
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                    {wizardAthletes.map((ath, idx) => {
                      const hall = getHall(ath.hallId);
                      return (
                        <div
                          key={idx}
                          style={{
                            background: "var(--bg-secondary)",
                            border: `1px solid ${hall.color}66`,
                            borderLeft: `6px solid ${hall.color}`,
                            borderRadius: 10,
                            padding: "14px 16px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                              <span style={{ fontSize: "0.7rem", fontWeight: 800, color: hall.color }}>
                                LANE {ath.lane || idx + 1}
                              </span>
                              <span style={{ fontSize: "0.72rem", color: "#64748b" }}>·</span>
                              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: hall.color, textTransform: "uppercase" }}>
                                {hall.emoji} {hall.name}
                              </span>
                            </div>
                            <div style={{ fontWeight: 800, color: "#ffffff", fontSize: "0.98rem" }}>
                              {ath.name || `Athlete ${idx + 1}`}
                            </div>
                            {ath.seedMark && (
                              <div style={{ fontSize: "0.72rem", color: "#38bdf8", marginTop: 2 }}>
                                Best: {ath.seedMark}
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => setWizardStep(idx + 1)}
                            style={{
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid rgba(255,255,255,0.15)",
                              color: "#38bdf8",
                              padding: "6px 12px",
                              borderRadius: 6,
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                            title="Edit this athlete if mistake made"
                          >
                            ✏️ Edit
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Final Submit & Mistake notice */}
                <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: "1.4rem" }}>⚖️</span>
                  <p style={{ color: "#a7f3d0", fontSize: "0.82rem", margin: 0 }}>
                    <strong>Immediate Judge Synchronization:</strong> Once you click submit, the Official Judge logging into the Judge desk will immediately see these 4 athletes with their names and hall colors ready to score 1st, 2nd, 3rd, and 4th place.
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setWizardStep(4)}
                    style={{
                      padding: "12px 20px",
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#94a3b8",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ← Back to Athlete 4
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalSubmitWizard}
                    className="btn-primary"
                    style={{
                      padding: "14px 32px",
                      fontSize: "1rem",
                      fontWeight: 900,
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      boxShadow: "0 6px 20px rgba(16,185,129,0.4)",
                    }}
                  >
                    🚀 {isEditingExisting ? "Save Updates & Notify Judge" : "Submit Race & 4 Athletes"} →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── QUICK SINGLE ATHLETE MODAL ─── */}
      {singleAthleteModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div className="glass-card" style={{ width: "100%", maxWidth: 480, padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#f1f5f9" }}>
                {editingSingleAthlete ? "Edit Athlete Details" : "Add Athlete to Race"}
              </h2>
              <button
                onClick={() => setSingleAthleteModalOpen(false)}
                style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSingleAthlete} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                  Athlete Full Name *
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={singleAthleteForm.name}
                  onChange={(e) => setSingleAthleteForm({ ...singleAthleteForm, name: e.target.value })}
                  placeholder="e.g. Abdulai"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                  Hall Color *
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {HALLS.map((h) => {
                    const selected = singleAthleteForm.hallId === h.id;
                    return (
                      <div
                        key={h.id}
                        onClick={() => setSingleAthleteForm({ ...singleAthleteForm, hallId: h.id })}
                        style={{
                          padding: "8px",
                          borderRadius: 8,
                          cursor: "pointer",
                          textAlign: "center",
                          border: selected ? `2px solid ${h.color}` : "1px solid var(--border-color)",
                          background: selected ? `${h.color}33` : "rgba(255,255,255,0.02)",
                        }}
                      >
                        <div style={{ width: 14, height: 14, borderRadius: "50%", background: h.color, margin: "0 auto 4px" }} />
                        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: selected ? "#ffffff" : "#94a3b8" }}>
                          {h.name.split(" ")[0]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                    Lane Number
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    className="input-field"
                    value={singleAthleteForm.lane}
                    onChange={(e) => setSingleAthleteForm({ ...singleAthleteForm, lane: Number(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                    Bib Number
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={singleAthleteForm.bibNumber}
                    onChange={(e) => setSingleAthleteForm({ ...singleAthleteForm, bibNumber: e.target.value })}
                    placeholder="e.g. 101"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                  Seed Mark / Best Time
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={singleAthleteForm.seedMark}
                  onChange={(e) => setSingleAthleteForm({ ...singleAthleteForm, seedMark: e.target.value })}
                  placeholder="e.g. 10.15s"
                />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSingleAthleteModalOpen(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  {editingSingleAthlete ? "Save Changes" : "Register Athlete"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

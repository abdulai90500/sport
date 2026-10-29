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

export default function RaceRegistrationPage() {
  const [races, setRaces] = useState<RaceEvent[]>([]);
  const [selectedRaceId, setSelectedRaceId] = useState<string>("");
  const [user, setUser] = useState(getCurrentUser());

  // Modals
  const [raceModalOpen, setRaceModalOpen] = useState(false);
  const [editingRace, setEditingRace] = useState<RaceEvent | null>(null);

  const [athleteModalOpen, setAthleteModalOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<RaceAthlete | null>(null);

  // Form states for Race
  const [raceForm, setRaceForm] = useState({
    name: "",
    category: "track" as "track" | "field",
    venue: "Main Stadium Olympic Track",
    date: "2026-10-29",
    time: "14:00",
    status: "scheduled" as "scheduled" | "live" | "completed",
  });

  // Form states for Athlete
  const [athleteForm, setAthleteForm] = useState({
    name: "",
    hallId: "blue" as HallId,
    lane: 1,
    bibNumber: "",
    studentId: "",
    seedMark: "",
  });

  // Feedback banner
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setBannerMsg(msg);
    setTimeout(() => setBannerMsg(null), 3000);
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

  // Open Race Create / Edit modal
  const handleOpenRaceModal = (raceToEdit?: RaceEvent) => {
    if (raceToEdit) {
      setEditingRace(raceToEdit);
      setRaceForm({
        name: raceToEdit.name,
        category: raceToEdit.category,
        venue: raceToEdit.venue,
        date: raceToEdit.date,
        time: raceToEdit.time,
        status: raceToEdit.status,
      });
    } else {
      setEditingRace(null);
      setRaceForm({
        name: "",
        category: "track",
        venue: "Main Stadium Olympic Track",
        date: new Date().toISOString().split("T")[0],
        time: "14:00",
        status: "scheduled",
      });
    }
    setRaceModalOpen(true);
  };

  const handleSaveRace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!raceForm.name.trim()) return;

    if (editingRace) {
      const updated: RaceEvent = {
        ...editingRace,
        ...raceForm,
      };
      const updatedList = saveRaceEvent(updated);
      setRaces(updatedList);
      showNotification(`Race "${raceForm.name}" updated successfully!`);
    } else {
      const newRace: RaceEvent = {
        id: `race-${Date.now()}`,
        ...raceForm,
        athletes: [],
      };
      const updatedList = saveRaceEvent(newRace);
      setRaces(updatedList);
      setSelectedRaceId(newRace.id);
      showNotification(`New race "${raceForm.name}" registered! Judges can now see this event.`);
    }
    setRaceModalOpen(false);
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

  // Open Athlete Create / Edit modal
  const handleOpenAthleteModal = (athleteToEdit?: RaceAthlete) => {
    if (!activeRace) return;
    if (athleteToEdit) {
      setEditingAthlete(athleteToEdit);
      setAthleteForm({
        name: athleteToEdit.name,
        hallId: athleteToEdit.hallId,
        lane: athleteToEdit.lane || 1,
        bibNumber: athleteToEdit.bibNumber || "",
        studentId: athleteToEdit.studentId || "",
        seedMark: athleteToEdit.seedMark || "",
      });
    } else {
      setEditingAthlete(null);
      // Next lane suggestion
      const nextLane = (activeRace.athletes.length % 8) + 1;
      setAthleteForm({
        name: "",
        hallId: "blue",
        lane: nextLane,
        bibNumber: `${100 + activeRace.athletes.length + 1}`,
        studentId: "",
        seedMark: "",
      });
    }
    setAthleteModalOpen(true);
  };

  const handleSaveAthlete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!athleteForm.name.trim() || !activeRace) return;

    if (editingAthlete) {
      const updatedList = updateAthleteInEvent(activeRace.id, editingAthlete.id, athleteForm);
      setRaces(updatedList);
      showNotification(`Athlete "${athleteForm.name}" updated! Changes are instantly live for the Judge.`);
    } else {
      const updatedList = addAthleteToEvent(activeRace.id, athleteForm);
      setRaces(updatedList);
      showNotification(`"${athleteForm.name}" registered to ${activeRace.name}! The Judge can immediately view them.`);
    }
    setAthleteModalOpen(false);
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
      {/* Top Banner alert */}
      {bannerMsg && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 999,
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "#ffffff",
            padding: "14px 20px",
            borderRadius: 10,
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            fontWeight: 700,
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span>⚡</span>
          <span>{bannerMsg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 999, padding: "3px 12px", marginBottom: 8 }}>
            <span style={{ fontSize: "0.85rem" }}>🏁</span>
            <span style={{ fontSize: "0.75rem", color: "#818cf8", fontWeight: 700 }}>OFFICIAL RACE &amp; ATHLETE REGISTRY</span>
          </div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.9rem", color: "#f1f5f9" }}>
            Race &amp; Competitor Registration
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            Register track &amp; field races and athletes. <strong style={{ color: "#38bdf8" }}>The moment an athlete is registered or edited, the Judge immediately sees their name in the scoring desk.</strong>
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-primary" onClick={() => handleOpenRaceModal()} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span>+</span> Register New Race
          </button>
          <Link href="/admin/judge" className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
            <span>⚖️</span> Judge Scoring Desk →
          </Link>
        </div>
      </div>

      {/* Main Layout: Race selector on left / Active Race Details & Athletes on right */}
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 24, alignItems: "start" }}>
        {/* Left Column: Races List */}
        <div className="glass-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#f1f5f9" }}>
              Races &amp; Events ({races.length})
            </h2>
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Select to manage</span>
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
                    <span
                      style={{
                        fontSize: "0.7rem",
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
                    <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                      {r.category === "track" ? "🏃 Track" : "🎯 Field"}
                    </span>
                  </div>

                  <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.92rem", lineHeight: 1.3, marginBottom: 6 }}>
                    {r.name}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", color: "#94a3b8" }}>
                    <span>👥 {r.athletes.length} Athletes</span>
                    <span>⏰ {r.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Race Athletes & Actions */}
        {activeRace ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Race Details Card */}
            <div className="glass-card" style={{ padding: "24px", position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        padding: "3px 10px",
                        borderRadius: 999,
                        background: activeRace.status === "completed" ? "rgba(34,197,94,0.15)" : "rgba(99,102,241,0.15)",
                        color: activeRace.status === "completed" ? "#4ade80" : "#818cf8",
                      }}
                    >
                      {activeRace.category.toUpperCase()} EVENT
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                      📍 {activeRace.venue} · 📅 {activeRace.date} at {activeRace.time}
                    </span>
                  </div>
                  <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.5rem", color: "#f1f5f9" }}>
                    {activeRace.name}
                  </h2>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => handleOpenRaceModal(activeRace)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#cbd5e1",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    ✏️ Edit Race Details
                  </button>
                  <button
                    onClick={() => handleDeleteRace(activeRace.id, activeRace.name)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "#f87171",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    🗑️ Delete
                  </button>
                  <Link
                    href={`/admin/judge?eventId=${activeRace.id}`}
                    className="btn-primary"
                    style={{
                      fontSize: "0.82rem",
                      padding: "8px 16px",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>⚖️</span> Input Results as Judge
                  </Link>
                </div>
              </div>

              {/* Status Note */}
              <div
                style={{
                  marginTop: 16,
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "rgba(56,189,248,0.08)",
                  border: "1px solid rgba(56,189,248,0.2)",
                  fontSize: "0.82rem",
                  color: "#e0f2fe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>
                  ⚡ <strong>Live Judge Sync Active:</strong> All athletes registered in this table appear in real time on the Judge result input screen for this event.
                </span>
                <span style={{ color: "#38bdf8", fontWeight: 700 }}>
                  {activeRace.athletes.length} Competitors Loaded
                </span>
              </div>
            </div>

            {/* Athletes in this Race */}
            <div className="glass-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#f1f5f9" }}>
                    Registered Athletes in this Race
                  </h3>
                  <p style={{ color: "#64748b", fontSize: "0.82rem" }}>
                    Assigned to competition lanes and represent their respective Halls.
                  </p>
                </div>

                <button
                  className="btn-primary"
                  onClick={() => handleOpenAthleteModal()}
                  style={{ fontSize: "0.85rem", padding: "8px 16px" }}
                >
                  + Add Athlete to this Event
                </button>
              </div>

              {activeRace.athletes.length === 0 ? (
                <div style={{ padding: "40px 20px", textAlign: "center", border: "1px dashed var(--border-color)", borderRadius: 10 }}>
                  <div style={{ fontSize: "2rem", marginBottom: 8 }}>🏃‍♂️</div>
                  <div style={{ fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>No Athletes Registered for this Race Yet</div>
                  <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 16 }}>
                    Register participants now so the Judge can view and score them.
                  </p>
                  <button className="btn-primary" onClick={() => handleOpenAthleteModal()}>
                    + Register First Athlete
                  </button>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                        {["Lane / Pos", "Athlete Name", "Hall Represented", "Bib Number", "Student ID", "Seed Mark", "Actions"].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "12px 14px",
                              textAlign: "left",
                              fontSize: "0.72rem",
                              color: "#64748b",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeRace.athletes.map((ath, idx) => {
                        const hall = getHall(ath.hallId);
                        return (
                          <tr
                            key={ath.id}
                            style={{
                              borderBottom: "1px solid var(--border-color)",
                              background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                            }}
                          >
                            <td style={{ padding: "14px", fontWeight: 800, color: "#818cf8", fontSize: "0.9rem" }}>
                              Lane {ath.lane || idx + 1}
                            </td>
                            <td style={{ padding: "14px", fontWeight: 700, color: "#f1f5f9", fontSize: "0.95rem" }}>
                              {ath.name}
                            </td>
                            <td style={{ padding: "14px" }}>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 6,
                                  padding: "4px 10px",
                                  borderRadius: 999,
                                  background: `${hall.color}22`,
                                  border: `1px solid ${hall.color}55`,
                                  color: hall.color,
                                  fontWeight: 700,
                                  fontSize: "0.78rem",
                                }}
                              >
                                <span>{hall.emoji}</span>
                                <span>{hall.name}</span>
                              </span>
                            </td>
                            <td style={{ padding: "14px", fontFamily: "monospace", color: "#cbd5e1", fontSize: "0.85rem" }}>
                              #{ath.bibNumber || "—"}
                            </td>
                            <td style={{ padding: "14px", fontFamily: "monospace", color: "#94a3b8", fontSize: "0.82rem" }}>
                              {ath.studentId || "—"}
                            </td>
                            <td style={{ padding: "14px", fontWeight: 600, color: "#38bdf8", fontSize: "0.85rem" }}>
                              {ath.seedMark || "—"}
                            </td>
                            <td style={{ padding: "14px" }}>
                              <div style={{ display: "flex", gap: 6 }}>
                                <button
                                  onClick={() => handleOpenAthleteModal(ath)}
                                  title="Edit Athlete"
                                  style={{
                                    padding: "4px 8px",
                                    borderRadius: 6,
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    color: "#cbd5e1",
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteAthlete(ath.id, ath.name)}
                                  title="Delete Athlete"
                                  style={{
                                    padding: "4px 8px",
                                    borderRadius: 6,
                                    background: "rgba(239,68,68,0.1)",
                                    border: "1px solid rgba(239,68,68,0.2)",
                                    color: "#f87171",
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* RACE CREATE / EDIT MODAL */}
      {raceModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
          <div className="glass-card" style={{ padding: "32px", width: "100%", maxWidth: 500, border: "1px solid #818cf8" }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#f1f5f9", marginBottom: 6 }}>
              {editingRace ? "Edit Race / Event" : "Register New Race / Event"}
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.82rem", marginBottom: 20 }}>
              Specify the race name, category, venue, and schedule.
            </p>

            <form onSubmit={handleSaveRace} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                  Race / Event Name *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Men's 100m Sprint — Championship Final"
                  value={raceForm.name}
                  onChange={(e) => setRaceForm({ ...raceForm, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                    Category
                  </label>
                  <select
                    className="input-field"
                    value={raceForm.category}
                    onChange={(e) => setRaceForm({ ...raceForm, category: e.target.value as "track" | "field" })}
                  >
                    <option value="track">🏃 Track (Sprint/Relay/Distance)</option>
                    <option value="field">🎯 Field (Jump/Throw)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                    Status
                  </label>
                  <select
                    className="input-field"
                    value={raceForm.status}
                    onChange={(e) => setRaceForm({ ...raceForm, status: e.target.value as any })}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="live">Live Now</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                  Venue
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Main Stadium Olympic Track"
                  value={raceForm.venue}
                  onChange={(e) => setRaceForm({ ...raceForm, venue: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                    Date
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={raceForm.date}
                    onChange={(e) => setRaceForm({ ...raceForm, date: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                    Time
                  </label>
                  <input
                    type="time"
                    className="input-field"
                    value={raceForm.time}
                    onChange={(e) => setRaceForm({ ...raceForm, time: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  {editingRace ? "Save Changes" : "Create Race"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setRaceModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ATHLETE REGISTRATION & EDIT MODAL */}
      {athleteModalOpen && activeRace && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
          <div className="glass-card" style={{ padding: "32px", width: "100%", maxWidth: 500, border: "1px solid #38bdf8" }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#f1f5f9", marginBottom: 6 }}>
              {editingAthlete ? "Edit Athlete Details" : "Register Athlete for Race"}
            </h2>
            <p style={{ color: "#38bdf8", fontSize: "0.82rem", marginBottom: 16 }}>
              Event: <strong>{activeRace.name}</strong>
            </p>

            <form onSubmit={handleSaveAthlete} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                  Athlete Full Name *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Abdulai Mensah"
                  value={athleteForm.name}
                  onChange={(e) => setAthleteForm({ ...athleteForm, name: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                    Hall Represented *
                  </label>
                  <select
                    className="input-field"
                    value={athleteForm.hallId}
                    onChange={(e) => setAthleteForm({ ...athleteForm, hallId: e.target.value as HallId })}
                  >
                    {HALLS.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.emoji} {h.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                    Assigned Lane (1–8)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    className="input-field"
                    value={athleteForm.lane}
                    onChange={(e) => setAthleteForm({ ...athleteForm, lane: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                    Bib Number
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 101"
                    value={athleteForm.bibNumber}
                    onChange={(e) => setAthleteForm({ ...athleteForm, bibNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                    Student ID / Reg No
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 2023/CS/001"
                    value={athleteForm.studentId}
                    onChange={(e) => setAthleteForm({ ...athleteForm, studentId: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
                  Seed / Qualifying Mark (optional)
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. 10.15s or 2.05m"
                  value={athleteForm.seedMark}
                  onChange={(e) => setAthleteForm({ ...athleteForm, seedMark: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  {editingAthlete ? "Save Changes" : "Confirm Athlete Registration"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setAthleteModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

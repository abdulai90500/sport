"use client";
import { useState } from "react";

interface DisciplineItem {
  id: string;
  name: string;
  icon: string;
  category: "Track" | "Field" | "Relay";
  matches: number;
  description: string;
  rules: string;
  pointsForWin: number;
}

const INITIAL_DISCIPLINES: DisciplineItem[] = [
  { id: "ath1", name: "100m Sprint (Men & Women)", icon: "⚡", category: "Track", matches: 4, description: "Individual sprint straight on Olympic track", rules: "Block start, false start is DQ, electronic laser photo-finish", pointsForWin: 10 },
  { id: "ath2", name: "200m Sprint", icon: "🏃", category: "Track", matches: 4, description: "Curve-to-straight sprint heat", rules: "Staggered start around first bend", pointsForWin: 10 },
  { id: "ath3", name: "4x100m Hall Relay", icon: "🔥", category: "Relay", matches: 2, description: "Premier hall relay showdown", rules: "Baton changeover within 20m box, dropped baton is DQ", pointsForWin: 15 },
  { id: "ath4", name: "400m Sprint", icon: "⏱️", category: "Track", matches: 4, description: "Full lap sprint endurance", rules: "Lane assigned throughout full lap", pointsForWin: 10 },
  { id: "ath5", name: "High Jump Championship", icon: "🦘", category: "Field", matches: 2, description: "Vertical field jump over crossbar", rules: "Fosbury Flop, 3 attempts per height", pointsForWin: 10 },
  { id: "ath6", name: "Long Jump Championship", icon: "👟", category: "Field", matches: 2, description: "Horizontal sandpit jump runway", rules: "Takeoff board measurement, 6 total attempts", pointsForWin: 10 },
  { id: "ath7", name: "Shot Put Finals", icon: "🎯", category: "Field", matches: 2, description: "Heavy metal ball throw from circle", rules: "Must land inside sector, 3 rounds + 3 final rounds", pointsForWin: 10 },
];

export default function AdminSportsPage() {
  const [disciplines, setDisciplines] = useState<DisciplineItem[]>(INITIAL_DISCIPLINES);
  const [showModal, setShowModal] = useState(false);
  const [newDiscipline, setNewDiscipline] = useState({
    name: "",
    icon: "🏃",
    category: "Track" as "Track" | "Field" | "Relay",
    matches: 2,
    description: "",
    rules: "",
    pointsForWin: 10,
  });

  const handleCreate = () => {
    if (!newDiscipline.name.trim()) return;
    const item: DisciplineItem = {
      id: `ath${Date.now()}`,
      name: newDiscipline.name,
      icon: newDiscipline.icon || "🏃",
      category: newDiscipline.category,
      matches: Number(newDiscipline.matches) || 2,
      description: newDiscipline.description || "Athletics championship heat",
      rules: newDiscipline.rules || "Standard IAAF track & field regulations apply",
      pointsForWin: Number(newDiscipline.pointsForWin) || 10,
    };
    setDisciplines([...disciplines, item]);
    setNewDiscipline({ name: "", icon: "🏃", category: "Track", matches: 2, description: "", rules: "", pointsForWin: 10 });
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setDisciplines(disciplines.filter((s) => s.id !== id));
  };

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 999, padding: "3px 12px", marginBottom: 8 }}>
            <span style={{ fontSize: "0.8rem" }}>🏃</span>
            <span style={{ fontSize: "0.75rem", color: "#818cf8", fontWeight: 700 }}>ATHLETICS ONLY CHAMPIONSHIP</span>
          </div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.8rem", color: "#f1f5f9" }}>
            Athletics Disciplines Management
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
            Configure track &amp; field events, heat allotments, regulations, and championship point weights
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Discipline</button>
      </div>

      {/* Grid of disciplines */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
        {disciplines.map((sp) => (
          <div key={sp.id} className="glass-card" style={{ padding: "24px", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span style={{ fontSize: "2.4rem" }}>{sp.icon}</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8", fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
                  {sp.category}
                </span>
                <button
                  onClick={() => handleDelete(sp.id)}
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: "0.75rem" }}
                >
                  Remove
                </button>
              </div>
            </div>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.15rem", color: "#f1f5f9", marginBottom: 6 }}>
              {sp.name}
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: 14 }}>{sp.description}</p>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 12px", marginBottom: 14, fontSize: "0.8rem", color: "#cbd5e1" }}>
              <div style={{ fontWeight: 600, color: "#818cf8", marginBottom: 4 }}>Rules &amp; Regulations:</div>
              <div>{sp.rules}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: 12, fontSize: "0.8rem", color: "#64748b" }}>
              <span>Heats: <strong style={{ color: "#f1f5f9" }}>{sp.matches}</strong></span>
              <span>1st Place Bonus: <strong style={{ color: "#fbbf24" }}>+{sp.pointsForWin} pts</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24 }}>
          <div className="glass-card" style={{ padding: "32px", width: "100%", maxWidth: 480 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#f1f5f9", marginBottom: 20 }}>
              Add Track &amp; Field Discipline
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>Discipline Name</label>
                <input className="input-field" placeholder="e.g. 1500m Run, Triple Jump, Javelin" value={newDiscipline.name} onChange={(e) => setNewDiscipline({ ...newDiscipline, name: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>Icon</label>
                  <input className="input-field" placeholder="🏃" value={newDiscipline.icon} onChange={(e) => setNewDiscipline({ ...newDiscipline, icon: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>Category</label>
                  <select className="input-field" value={newDiscipline.category} onChange={(e) => setNewDiscipline({ ...newDiscipline, category: e.target.value as any })}>
                    <option value="Track">Track</option>
                    <option value="Field">Field</option>
                    <option value="Relay">Relay</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>Win Pts</label>
                  <input className="input-field" type="number" value={newDiscipline.pointsForWin} onChange={(e) => setNewDiscipline({ ...newDiscipline, pointsForWin: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>Venue &amp; Track Location</label>
                <input className="input-field" placeholder="e.g. Main Stadium Olympic Track" value={newDiscipline.description} onChange={(e) => setNewDiscipline({ ...newDiscipline, description: e.target.value })} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>Rules Summary</label>
                <textarea className="input-field" rows={3} placeholder="False start rules, attempts, wind assistance..." value={newDiscipline.rules} onChange={(e) => setNewDiscipline({ ...newDiscipline, rules: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={handleCreate}>Save Discipline</button>
                <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

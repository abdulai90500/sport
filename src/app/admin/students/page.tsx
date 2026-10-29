"use client";
import { useState } from "react";
import { getHall, HALLS } from "@/lib/data";

const DEMO_STUDENTS = [
  { id: "STU001", name: "Kwame Asante",      hall: "blue",   reg: "2023/CS/001", status: "eligible",             year: 2 },
  { id: "STU002", name: "Akua Mensah",       hall: "gold",   reg: "2023/BUS/045", status: "ineligible",          year: 3 },
  { id: "STU003", name: "Kofi Osei",         hall: "purple", reg: "2023/ENG/012", status: "pending_verification", year: 1 },
  { id: "STU004", name: "Ama Boateng",       hall: "black",  reg: "2024/MED/003", status: "eligible",             year: 2 },
  { id: "STU005", name: "Yaw Darko",         hall: "blue",   reg: "2022/LAW/007", status: "eligible",             year: 4 },
  { id: "STU006", name: "Adwoa Ofori",       hall: "gold",   reg: "2024/SC/019",  status: "pending_verification", year: 1 },
  { id: "STU007", name: "Kwabena Frimpong",  hall: "purple", reg: "2023/ART/033", status: "eligible",             year: 2 },
  { id: "STU008", name: "Efua Amoah",        hall: "black",  reg: "2022/SOC/011", status: "ineligible",           year: 4 },
];

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  eligible:             { label: "Eligible",   color: "#4ade80", bg: "rgba(34,197,94,0.1)" },
  ineligible:           { label: "Ineligible", color: "#f87171", bg: "rgba(239,68,68,0.1)" },
  pending_verification: { label: "Pending",    color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
};

export default function StudentsPage() {
  const [students, setStudents] = useState(DEMO_STUDENTS);
  const [search, setSearch] = useState("");
  const [hallFilter, setHallFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", reg: "", hall: "blue", year: "1" });

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.reg.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchHall   = hallFilter === "all" || s.hall === hallFilter;
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchHall && matchStatus;
  });

  const toggleStatus = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const next = s.status === "eligible" ? "ineligible" : "eligible";
        return { ...s, status: next };
      })
    );
  };

  const addStudent = () => {
    if (!newStudent.name || !newStudent.reg) return;
    const id = `STU${String(students.length + 1).padStart(3, "0")}`;
    setStudents((prev) => [...prev, { ...newStudent, id, status: "pending_verification", year: Number(newStudent.year) }]);
    setNewStudent({ name: "", reg: "", hall: "blue", year: "1" });
    setShowModal(false);
  };

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.8rem", color: "#f1f5f9" }}>Student Registry</h1>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>{students.length} registered students</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Register Student</button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <input className="input-field" style={{ maxWidth: 280 }} placeholder="Search name, ID, or reg number…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input-field" style={{ maxWidth: 160 }} value={hallFilter} onChange={(e) => setHallFilter(e.target.value)}>
          <option value="all">All Halls</option>
          {HALLS.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
        <select className="input-field" style={{ maxWidth: 180 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="eligible">Eligible</option>
          <option value="pending_verification">Pending</option>
          <option value="ineligible">Ineligible</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                {["ID", "Name", "Reg Number", "Hall", "Year", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const hall = getHall(s.hall);
                const st = STATUS_STYLES[s.status];
                return (
                  <tr key={s.id} style={{ borderBottom: "1px solid var(--border-color)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
                    <td style={{ padding: "14px 20px", fontFamily: "monospace", color: "#818cf8", fontSize: "0.85rem" }}>{s.id}</td>
                    <td style={{ padding: "14px 20px", fontWeight: 600, color: "#f1f5f9" }}>{s.name}</td>
                    <td style={{ padding: "14px 20px", fontFamily: "monospace", color: "#94a3b8", fontSize: "0.85rem" }}>{s.reg}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: hall.color, fontWeight: 700, fontSize: "0.85rem" }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: hall.color, display: "inline-block" }} />
                        {hall.name}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", color: "#94a3b8" }}>Year {s.year}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: "0.75rem", fontWeight: 700, color: st.color, background: st.bg }}>{st.label}</span>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => toggleStatus(s.id)}
                          style={{ padding: "5px 12px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", background: s.status === "eligible" ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", color: s.status === "eligible" ? "#f87171" : "#4ade80", border: "none" }}
                        >
                          {s.status === "eligible" ? "Revoke" : "Approve"}
                        </button>
                        <button style={{ padding: "5px 10px", borderRadius: 6, fontSize: "0.75rem", cursor: "pointer", background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "none" }}>Edit</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: "40px", textAlign: "center", color: "#475569" }}>No students match your filters.</div>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24 }}>
          <div className="glass-card" style={{ padding: "32px", width: "100%", maxWidth: 480 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#f1f5f9", marginBottom: 24 }}>Register New Student</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>Full Name</label>
                <input className="input-field" placeholder="e.g. Kwame Asante" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>Registration Number</label>
                <input className="input-field" placeholder="e.g. 2024/CS/042" value={newStudent.reg} onChange={(e) => setNewStudent({ ...newStudent, reg: e.target.value })} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>Hall</label>
                <select className="input-field" value={newStudent.hall} onChange={(e) => setNewStudent({ ...newStudent, hall: e.target.value })}>
                  {HALLS.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>Year of Study</label>
                <select className="input-field" value={newStudent.year} onChange={(e) => setNewStudent({ ...newStudent, year: e.target.value })}>
                  {[1,2,3,4].map((y) => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={addStudent}>Register</button>
                <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

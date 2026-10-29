"use client";
import { useState } from "react";
import { getHall } from "@/lib/data";

interface AuditEntry {
  id: string;
  timestamp: string;
  admin: string;
  action: "SCORE_UPDATE" | "STATUS_CHANGE" | "STUDENT_VERIFIED" | "PENALTY_APPLIED" | "FIXTURE_CREATED";
  hallAffected?: string;
  details: string;
  ipAddress: string;
}

const INITIAL_LOGS: AuditEntry[] = [
  {
    id: "aud-001",
    timestamp: "2026-10-27 14:23:11",
    admin: "officer@sports.edu",
    action: "SCORE_UPDATE",
    hallAffected: "gold",
    details: "Men's 100m Sprint Final: Gold Hall awarded +12 pts (Emmanuel Mensah: 10.24s)",
    ipAddress: "192.168.1.45",
  },
  {
    id: "aud-002",
    timestamp: "2026-10-27 14:15:02",
    admin: "officer@sports.edu",
    action: "STATUS_CHANGE",
    details: "Women's 200m Sprint Heat 2 started (Status set to LIVE)",
    ipAddress: "192.168.1.88",
  },
  {
    id: "aud-003",
    timestamp: "2026-10-27 13:50:44",
    admin: "admin@sports.edu",
    action: "SCORE_UPDATE",
    hallAffected: "gold",
    details: "Men's 4x100m Relay final result verified: Gold Hall 39.88s (Awarded +15 championship pts)",
    ipAddress: "192.168.1.12",
  },
  {
    id: "aud-004",
    timestamp: "2026-10-27 13:30:18",
    admin: "admin@sports.edu",
    action: "STUDENT_VERIFIED",
    hallAffected: "purple",
    details: "Student athlete STU003 eligibility status updated: pending -> eligible",
    ipAddress: "192.168.1.104",
  },
  {
    id: "aud-005",
    timestamp: "2026-10-27 12:00:00",
    admin: "officer@sports.edu",
    action: "FIXTURE_CREATED",
    details: "Created heat: Women's 400m Sprint Semi-Final (Blue vs Black) for 2026-10-28",
    ipAddress: "192.168.1.45",
  },
  {
    id: "aud-006",
    timestamp: "2026-10-26 18:22:10",
    admin: "admin@sports.edu",
    action: "PENALTY_APPLIED",
    hallAffected: "black",
    details: "Sanction: -1 point deducted from Black Hall for relay lane boundary violation",
    ipAddress: "192.168.1.15",
  },
];

const ACTION_BADGES: Record<string, { label: string; bg: string; color: string }> = {
  SCORE_UPDATE:     { label: "Score Event",    bg: "rgba(99,102,241,0.15)", color: "#818cf8" },
  STATUS_CHANGE:    { label: "Match Status",   bg: "rgba(239,68,68,0.15)",  color: "#f87171" },
  STUDENT_VERIFIED: { label: "Student Record", bg: "rgba(34,197,94,0.15)",  color: "#4ade80" },
  PENALTY_APPLIED:  { label: "Point Sanction", bg: "rgba(245,158,11,0.15)", color: "#fbbf24" },
  FIXTURE_CREATED:  { label: "Fixture Setup",  bg: "rgba(139,92,246,0.15)", color: "#c084fc" },
};

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>(INITIAL_LOGS);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("ALL");

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.admin.toLowerCase().includes(search.toLowerCase()) ||
      log.id.toLowerCase().includes(search.toLowerCase());
    const matchesAction = filterAction === "ALL" || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.8rem", color: "#f1f5f9" }}>Audit Log &amp; Score History</h1>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
            Immutable trace of all administrator operations, score updates, match starts, and eligibility changes
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => alert("Audit export generated as CSV")}
            className="btn-secondary"
            style={{ fontSize: "0.85rem", padding: "10px 16px" }}
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <input
          className="input-field"
          style={{ maxWidth: 300 }}
          placeholder="Search by action, admin email, hall..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input-field"
          style={{ maxWidth: 200 }}
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
        >
          <option value="ALL">All Actions</option>
          <option value="SCORE_UPDATE">Score Updates</option>
          <option value="STATUS_CHANGE">Status Changes</option>
          <option value="STUDENT_VERIFIED">Student Eligibility</option>
          <option value="PENALTY_APPLIED">Penalties / Sanctions</option>
          <option value="FIXTURE_CREATED">Fixtures Created</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                {["Timestamp", "Action Type", "Affected Hall", "Details & Event Log", "Authorized User", "Origin IP"].map((h) => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => {
                const badge = ACTION_BADGES[log.action] || { label: log.action, bg: "rgba(255,255,255,0.1)", color: "#fff" };
                const hallObj = log.hallAffected ? getHall(log.hallAffected) : null;

                return (
                  <tr key={log.id} style={{ borderBottom: "1px solid var(--border-color)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
                    <td style={{ padding: "14px 20px", fontSize: "0.8rem", color: "#94a3b8", whiteSpace: "nowrap" }}>
                      {log.timestamp}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 700, color: badge.color, background: badge.bg }}>
                        {badge.label}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      {hallObj ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: hallObj.color, fontWeight: 700, fontSize: "0.85rem" }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: hallObj.color, display: "inline-block" }} />
                          {hallObj.name}
                        </span>
                      ) : (
                        <span style={{ color: "#64748b", fontSize: "0.8rem" }}>General</span>
                      )}
                    </td>
                    <td style={{ padding: "14px 20px", color: "#f1f5f9", fontSize: "0.88rem", maxWidth: 400 }}>
                      {log.details}
                    </td>
                    <td style={{ padding: "14px 20px", color: "#818cf8", fontSize: "0.82rem", fontFamily: "monospace" }}>
                      {log.admin}
                    </td>
                    <td style={{ padding: "14px 20px", color: "#64748b", fontSize: "0.8rem", fontFamily: "monospace" }}>
                      {log.ipAddress}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: "40px", textAlign: "center", color: "#475569" }}>
              No audit log entries found for this filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

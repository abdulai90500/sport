"use client";
import { useState } from "react";

interface EligibilityResult {
  status: "eligible" | "pending_verification" | "ineligible" | "not_found";
  hall?: string;
  message: string;
}

// Demo lookup — replace with real Supabase query
const DEMO_LOOKUP: Record<string, EligibilityResult> = {
  "STU001": { status: "eligible", hall: "blue", message: "Student is eligible to compete for Blue Hall." },
  "STU002": { status: "ineligible", hall: "gold", message: "Student has been marked ineligible. Contact your hall administrator." },
  "STU003": { status: "pending_verification", hall: "purple", message: "Eligibility pending verification. Please check back later." },
  "STU004": { status: "eligible", hall: "black", message: "Student is eligible to compete for Black Hall." },
};

const STATUS_CONFIG = {
  eligible:             { color: "#4ade80", bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.3)",  icon: "✅", label: "ELIGIBLE" },
  ineligible:           { color: "#f87171", bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.3)",  icon: "❌", label: "NOT ELIGIBLE" },
  pending_verification: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.3)", icon: "⏳", label: "PENDING" },
  not_found:            { color: "#94a3b8", bg: "rgba(148,163,184,0.1)",border: "rgba(148,163,184,0.3)",icon: "🔍", label: "NOT FOUND" },
};

const HALL_COLORS: Record<string, string> = {
  blue: "#3b82f6", gold: "#f59e0b", purple: "#8b5cf6", black: "#9ca3af",
};

export default function EligibilitySearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    const found = DEMO_LOOKUP[query.trim().toUpperCase()];
    setResult(found ?? { status: "not_found", message: "No student found with that registration number." });
    setLoading(false);
  };

  const cfg = result ? STATUS_CONFIG[result.status] : null;

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <form onSubmit={handleSearch} style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <input
          className="input-field"
          id="eligibility-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter Student ID or Reg. Number (e.g. STU001)"
          style={{ flex: 1 }}
        />
        <button className="btn-primary" id="eligibility-search-btn" type="submit" style={{ flexShrink: 0 }} disabled={loading}>
          {loading ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ animation: "spin 1s linear infinite" }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          )}
          Search
        </button>
      </form>

      {result && cfg && (
        <div className="glass-card fade-up" style={{ padding: "24px", border: `1px solid ${cfg.border}`, background: cfg.bg }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: "2rem" }}>{cfg.icon}</span>
            <div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: cfg.color }}>
                {cfg.label}
              </div>
              {result.hall && (
                <div style={{ fontSize: "0.8rem", color: HALL_COLORS[result.hall] ?? "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {result.hall.charAt(0).toUpperCase() + result.hall.slice(1)} Hall
                </div>
              )}
            </div>
          </div>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6 }}>{result.message}</p>
          <p style={{ marginTop: 12, fontSize: "0.75rem", color: "#475569" }}>
            ⚠️ Full student details are restricted to authorised administrators only.
          </p>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

import Navbar from "@/components/Navbar";
import { HALLS } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Inter-Hall Sports Championship",
  description: "Learn about the Inter-Hall Sports Championship, its rules, and the four competing halls.",
};

export default function AboutPage() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "100px 24px 80px" }}>

        <div className="fade-up" style={{ marginBottom: 48 }}>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "2.2rem", color: "#f1f5f9", marginBottom: 8 }}>
            About the Championship
          </h1>
          <p style={{ color: "#64748b" }}>Annual Inter-Hall Sports Competition · Est. 2018</p>
        </div>

        {/* Overview */}
        <div className="glass-card" style={{ padding: "32px", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#f1f5f9", marginBottom: 16 }}>🏆 Overview</h2>
          <p style={{ color: "#94a3b8", lineHeight: 1.8 }}>
            The Inter-Hall Sports Championship is an annual multi-sport competition that brings together students from four residential halls in a spirited battle for the overall championship title. Held each academic year, the competition spans six sports disciplines over four weeks, culminating in a Grand Finals Day and Awards Ceremony.
          </p>
        </div>

        {/* Hall profiles */}
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#f1f5f9", marginBottom: 20 }}>The Four Halls</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 40 }}>
          {HALLS.map((h) => (
            <div key={h.id} className="glass-card" style={{ padding: "24px", border: `1px solid ${h.color}44`, boxShadow: `0 0 20px ${h.glow}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: h.color, boxShadow: `0 0 12px ${h.glow}`, flexShrink: 0 }} />
                <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, color: h.color, fontSize: "1rem", textTransform: "uppercase" }}>{h.name}</div>
              </div>
              <p style={{ color: "#64748b", fontSize: "0.85rem", fontStyle: "normal", marginBottom: 8 }}>"{h.motto}"</p>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ padding: "2px 10px", borderRadius: 999, background: `${h.color}22`, color: h.color, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>
                  {h.id} hall
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Rules */}
        <div className="glass-card" style={{ padding: "32px", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#f1f5f9", marginBottom: 20 }}>📋 Competition Rules</h2>
          <div style={{ display: "grid", gap: 14 }}>
            {[
              "Each sport contributes points towards the overall Hall Championship.",
              "Points: Win = 3, Draw = 1, Loss = 0 for each sport fixture.",
              "All participating students must be registered residents of their hall.",
              "Eligibility must be verified by hall administrators before match day.",
              "Score disputes must be raised within 24 hours of match completion.",
              "The hall with the most accumulated points at the end of all fixtures wins.",
              "In the event of a tie on points, goal difference is used to separate halls.",
              "Finals Day determines any remaining undecided sport champions.",
            ].map((rule, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: "50%", background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", color: "#818cf8", fontWeight: 700 }}>
                  {i + 1}
                </span>
                <span style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact / admin */}
        <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 16, padding: "28px 32px", textAlign: "center" }}>
          <h3 style={{ fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>Are you a competition administrator?</h3>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: 20 }}>Manage scores, students, and fixtures from the secure admin dashboard.</p>
          <a href="/admin" className="btn-primary" style={{ display: "inline-flex" }}>Access Admin Dashboard →</a>
        </div>
      </div>
    </main>
  );
}

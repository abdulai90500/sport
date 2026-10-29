import Navbar from "@/components/Navbar";
import EligibilitySearch from "@/components/EligibilitySearch";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Eligibility | Inter-Hall Sports",
  description: "Check if a student is eligible to compete in the Inter-Hall Sports Championship.",
};

export default function EligibilityPage() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "100px 24px 80px" }}>

        <div className="fade-up" style={{ marginBottom: 48, textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "2.2rem", color: "#f1f5f9", marginBottom: 12 }}>
            Student Eligibility Checker
          </h1>
          <p style={{ color: "#94a3b8", lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
            Enter a student registration number to check whether they are eligible to represent their hall in the championship.
          </p>
        </div>

        <div className="glass-card" style={{ padding: "36px 32px", marginBottom: 32 }}>
          <EligibilitySearch />
        </div>

        {/* Demo hint */}
        <div style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 12, padding: "16px 20px", marginBottom: 32 }}>
          <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
            💡 <strong style={{ color: "#818cf8" }}>Demo IDs:</strong> Try <code style={{ background: "rgba(99,102,241,0.15)", padding: "1px 6px", borderRadius: 4, color: "#a5b4fc" }}>STU001</code>, <code style={{ background: "rgba(99,102,241,0.15)", padding: "1px 6px", borderRadius: 4, color: "#a5b4fc" }}>STU002</code>, <code style={{ background: "rgba(99,102,241,0.15)", padding: "1px 6px", borderRadius: 4, color: "#a5b4fc" }}>STU003</code>, or <code style={{ background: "rgba(99,102,241,0.15)", padding: "1px 6px", borderRadius: 4, color: "#a5b4fc" }}>STU004</code>
          </p>
        </div>

        {/* Rules */}
        <div className="glass-card" style={{ padding: "24px 28px" }}>
          <h2 style={{ fontWeight: 700, color: "#f1f5f9", marginBottom: 16, fontSize: "1rem" }}>📋 Eligibility Rules</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {[
              { icon: "✅", text: "Student must be a currently registered member of their hall" },
              { icon: "🆔", text: "A valid, unique student registration number is required" },
              { icon: "🏛️", text: "Eligibility is assessed and verified by hall administrators" },
              { icon: "🔒", text: "Full student records are restricted to authorised staff only" },
              { icon: "⏳", text: "Pending students must be cleared by an administrator before matches" },
            ].map((r) => (
              <div key={r.text} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0 }}>{r.icon}</span>
                <span style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.5 }}>{r.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

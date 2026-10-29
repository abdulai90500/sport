"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HALLS } from "@/lib/data";
import { loginUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("admin@sports.edu");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      const res = loginUser(identifier, password);
      setLoading(false);
      if (res.success && res.user) {
        if (res.user.role === "judge") {
          router.push("/admin/judge");
        } else {
          router.push("/admin");
        }
      } else {
        setError(res.error || "Authentication failed. Please check your credentials.");
      }
    }, 400);
  };

  const handleQuickRole = (roleType: "admin" | "judge") => {
    if (roleType === "admin") {
      setIdentifier("admin@sports.edu");
      setPassword("admin123");
    } else {
      setIdentifier("judge@sports.edu");
      setPassword("judge123");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      {/* Background orbs */}
      <div className="orb" style={{ width: 500, height: 500, background: "#6366f1", top: "10%", left: "10%" }} />
      <div className="orb" style={{ width: 400, height: 400, background: "#f59e0b", bottom: "10%", right: "10%" }} />

      <div className="glass-card fade-up" style={{ width: "100%", maxWidth: 490, padding: "36px 32px", position: "relative", zIndex: 10 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Limkokwing University of Creative Technology"
            style={{ height: 48, width: "auto", objectFit: "contain", margin: "0 auto 14px", display: "block" }}
          />
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.75rem", color: "#f1f5f9", marginBottom: 6 }}>
            Official Portal Login
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
            Limkokwing 4th Inter-Hall Athletic Sport Meet
          </p>
        </div>

        {/* Credentials Reference Card */}
        <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 12, padding: "14px 16px", marginBottom: 22, fontSize: "0.82rem" }}>
          <div style={{ fontWeight: 700, color: "#818cf8", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <span>🔑</span> Official Portal Credentials
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            <div style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontWeight: 800, color: "#a5b4fc", fontSize: "0.78rem" }}>👑 Admin Role</div>
              <div style={{ color: "#e2e8f0", fontSize: "0.74rem", fontFamily: "monospace" }}>admin@sports.edu</div>
              <div style={{ color: "#94a3b8", fontSize: "0.72rem", fontFamily: "monospace" }}>PW: admin123</div>
            </div>
            <div style={{ background: "rgba(14,165,233,0.12)", border: "1px solid rgba(14,165,233,0.3)", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontWeight: 800, color: "#38bdf8", fontSize: "0.78rem" }}>⚖️ Judge Role</div>
              <div style={{ color: "#e2e8f0", fontSize: "0.74rem", fontFamily: "monospace" }}>judge@sports.edu</div>
              <div style={{ color: "#94a3b8", fontSize: "0.72rem", fontFamily: "monospace" }}>PW: judge123</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => handleQuickRole("admin")}
              style={{
                flex: 1,
                padding: "7px 10px",
                borderRadius: 7,
                background: identifier.includes("admin") ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.06)",
                border: identifier.includes("admin") ? "1px solid #818cf8" : "1px solid rgba(255,255,255,0.12)",
                color: "#ffffff",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              👑 Fill Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickRole("judge")}
              style={{
                flex: 1,
                padding: "7px 10px",
                borderRadius: 7,
                background: identifier.includes("judge") ? "rgba(14,165,233,0.35)" : "rgba(255,255,255,0.06)",
                border: identifier.includes("judge") ? "1px solid #38bdf8" : "1px solid rgba(255,255,255,0.12)",
                color: "#ffffff",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ⚖️ Fill Judge
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", color: "#f87171", fontSize: "0.85rem", marginBottom: 20 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
              Email or Username
            </label>
            <input
              type="text"
              className="input-field"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin@sports.edu or officer@sports.edu"
              required
            />
            <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: 4 }}>
              {identifier.toLowerCase().includes("admin")
                ? "✨ Recognized role: Administrator (Full System Control)"
                : identifier.toLowerCase().includes("officer")
                ? "✨ Recognized role: Event Officer (Track/Field & Score Control)"
                : "Enter 'admin' or 'officer' credentials"}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
              Password
            </label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", cursor: "pointer" }}>
              <input type="checkbox" defaultChecked /> Remember session
            </label>
            <span style={{ color: "#64748b" }}>Official authorization</span>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: "100%",
              padding: "14px",
              marginTop: 8,
              background: identifier.toLowerCase().includes("officer")
                ? "linear-gradient(135deg, #0284c7, #0ea5e9)"
                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            }}
            disabled={loading}
          >
            {loading
              ? "Authenticating..."
              : identifier.toLowerCase().includes("officer")
              ? "Sign In as Event Officer →"
              : "Sign In as Administrator →"}
          </button>
        </form>

        <div style={{ marginTop: 28, textAlign: "center", borderTop: "1px solid var(--border-color)", paddingTop: 20 }}>
          <Link href="/" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.85rem" }}>
            ← Back to Public Championship Site
          </Link>
        </div>

        {/* Four Halls decorative bar */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
          {HALLS.map((h) => (
            <div key={h.id} style={{ width: 10, height: 10, borderRadius: "50%", background: h.color, boxShadow: `0 0 6px ${h.glow}` }} title={h.name} />
          ))}
        </div>
      </div>
    </div>
  );
}

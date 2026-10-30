"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HALLS } from "@/lib/data";
import { loginUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
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
        } else if (res.user.role === "registrar") {
          router.push("/admin/races");
        } else {
          router.push("/admin");
        }
      } else {
        setError(res.error || "Authentication failed. Please check your credentials.");
      }
    }, 400);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      {/* Background orbs */}
      <div className="orb" style={{ width: 500, height: 500, background: "#6366f1", top: "10%", left: "10%" }} />
      <div className="orb" style={{ width: 400, height: 400, background: "#f59e0b", bottom: "10%", right: "10%" }} />

      <div className="glass-card fade-up" style={{ width: "100%", maxWidth: 460, padding: "40px 32px", position: "relative", zIndex: 10 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Limkokwing University of Creative Technology"
            style={{ height: 48, width: "auto", objectFit: "contain", margin: "0 auto 16px", display: "block" }}
          />
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.8rem", color: "#f1f5f9", marginBottom: 6 }}>
            Official Portal Login
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.88rem" }}>
            Limkokwing 4th Inter-Hall Athletic Sport Meet
          </p>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "12px 16px", color: "#f87171", fontSize: "0.85rem", marginBottom: 20 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
              Email or Username
            </label>
            <input
              type="text"
              className="input-field"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter authorized email or username"
              required
              autoFocus
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.82rem", color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
              Password
            </label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
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
              marginTop: 6,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              fontSize: "0.95rem",
              fontWeight: 700,
            }}
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In to Portal →"}
          </button>
        </form>

        {/* 1-Click Quick Role Sign-in Shortcuts */}
        <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--border-color)" }}>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, textAlign: "center" }}>
            ⚡ Instant 1-Click Role Sign-In
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button
              type="button"
              onClick={() => {
                setIdentifier("judge");
                setPassword("pass123");
                const res = loginUser("judge", "pass123");
                if (res.success) router.push("/admin/judge");
              }}
              style={{
                padding: "10px 8px",
                borderRadius: 8,
                background: "rgba(14,165,233,0.12)",
                border: "1px solid rgba(14,165,233,0.35)",
                color: "#38bdf8",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              ⚖️ Official Judge Desk
            </button>

            <button
              type="button"
              onClick={() => {
                setIdentifier("registrar");
                setPassword("pass123");
                const res = loginUser("registrar", "pass123");
                if (res.success) router.push("/admin/races");
              }}
              style={{
                padding: "10px 8px",
                borderRadius: 8,
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.35)",
                color: "#818cf8",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              🏁 Race Registrar
            </button>
          </div>
        </div>

        <div style={{ marginTop: 20, textAlign: "center", borderTop: "1px solid var(--border-color)", paddingTop: 16 }}>
          <Link href="/" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.85rem" }}>
            ← Back to Public Championship Site
          </Link>
        </div>

        {/* Four Halls decorative bar */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 18 }}>
          {HALLS.map((h) => (
            <div key={h.id} style={{ width: 10, height: 10, borderRadius: "50%", background: h.color, boxShadow: `0 0 6px ${h.glow}` }} title={h.name} />
          ))}
        </div>
      </div>
    </div>
  );
}

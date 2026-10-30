"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, logoutUser, AuthUser } from "@/lib/auth";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/live", label: "Live" },
  { href: "/standings", label: "Standings" },
  { href: "/sports", label: "Disciplines" },
  { href: "/eligibility", label: "Eligibility" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());

    const handleAuthChange = () => {
      setUser(getCurrentUser());
    };

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setOpen(false);
    router.push("/");
  };

  return (
    <nav className="navbar" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Limkokwing University of Creative Technology"
            style={{ height: 38, width: "auto", objectFit: "contain", filter: "brightness(1.05)" }}
          />
          <div style={{ height: 26, width: 1, background: "rgba(255,255,255,0.15)" }} />
          <div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)", lineHeight: 1.1 }}>INTER-HALL</div>
            <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Athletics Championship</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: "0.875rem",
                fontWeight: 500,
                textDecoration: "none",
                color: pathname === l.href ? "#818cf8" : "var(--text-secondary)",
                background: pathname === l.href ? "rgba(99,102,241,0.12)" : "transparent",
                border: pathname === l.href ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
                transition: "all 0.2s",
              }}
            >
              {l.href === "/live" ? (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="live-dot" />
                  {l.label}
                </span>
              ) : l.label}
            </Link>
          ))}

          {/* Theme Toggle Button (White / Black Mode) */}
          <ThemeToggle />

          {/* Role-based Auth button / Login button */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 4 }}>
              <Link
                href={user.role === "judge" ? "/admin/judge" : user.role === "registrar" ? "/admin/races" : "/admin"}
                style={{
                  padding: "7px 14px",
                  borderRadius: 8,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  background: user.role === "admin"
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : user.role === "judge"
                    ? "linear-gradient(135deg, #0284c7, #0ea5e9)"
                    : user.role === "registrar"
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "linear-gradient(135deg, #0ea5e9, #0284c7)",
                  color: "white",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                }}
              >
                <span>{user.role === "admin" ? "👑 Admin" : user.role === "judge" ? "⚖️ Judge Desk" : user.role === "registrar" ? "📋 Registrar" : "🎯 Event Officer"}</span>
                <span style={{ fontSize: "0.7rem", opacity: 0.85, background: "rgba(0,0,0,0.25)", padding: "1px 6px", borderRadius: 4 }}>
                  Panel
                </span>
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  padding: "7px 10px",
                  borderRadius: 8,
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--border-color)",
                  cursor: "pointer",
                }}
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              style={{
                marginLeft: 4,
                padding: "7px 18px",
                borderRadius: 8,
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "none",
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                color: "white",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 2px 10px rgba(59,130,246,0.25)",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
              </svg>
              Login
            </Link>
          )}
        </div>

        {/* Mobile controls */}
        <div style={{ display: "none" }} className="mobile-actions">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: 8 }} id="nav-toggle">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {open ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border-color)", padding: "12px 24px 20px" }}>
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ display: "block", padding: "10px 0", color: pathname === l.href ? "#818cf8" : "var(--text-secondary)", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem", borderBottom: "1px solid var(--border-color)" }}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  padding: "10px 16px",
                  borderRadius: 8,
                  background: user.role === "admin" ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "linear-gradient(135deg, #0ea5e9, #0284c7)",
                  color: "white",
                  textDecoration: "none",
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                {user.role === "admin" ? "👑 Admin Dashboard" : "🎯 Event Officer Dashboard"}
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#f87171",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                Sign Out ({user.email})
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                marginTop: 12,
                padding: "10px 16px",
                borderRadius: 8,
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                color: "white",
                textDecoration: "none",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              Sign In (Login)
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-actions { display: flex !important; align-items: center; gap: 8px; }
          #nav-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

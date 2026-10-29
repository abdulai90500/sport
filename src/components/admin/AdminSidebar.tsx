"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, logoutUser, AuthUser } from "@/lib/auth";

const LINKS = [
  { href: "/admin",            icon: "📊", label: "Dashboard", adminOnly: false },
  { href: "/admin/matches",    icon: "🏃", label: "Athletics & Scores", adminOnly: false },
  { href: "/admin/standings",  icon: "🏆", label: "Leaderboard", adminOnly: false },
  { href: "/admin/sports",     icon: "🏅", label: "Disciplines", adminOnly: false },
  { href: "/admin/students",   icon: "🎓", label: "Student Registry", adminOnly: true },
  { href: "/admin/audit",      icon: "📋", label: "Audit Log", adminOnly: true },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    const handleAuthChange = () => setUser(getCurrentUser());
    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  const handleSignOut = () => {
    logoutUser();
    router.push("/auth/login");
  };

  const isOfficer = user?.role === "event_officer";

  return (
    <aside
      className="sidebar"
      style={{
        width: collapsed ? 64 : 240,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        transition: "width 0.2s ease",
      }}
    >
      {/* Logo */}
      <div style={{ padding: collapsed ? "16px 8px" : "18px 16px", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: 10 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Limkokwing University"
          style={{ height: collapsed ? 24 : 30, width: "auto", objectFit: "contain", flexShrink: 0 }}
        />
        {!collapsed && (
          <div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "0.82rem", color: "#f1f5f9", lineHeight: 1.1 }}>
              {isOfficer ? "EVENT OFFICER" : "ADMIN PANEL"}
            </div>
            <div style={{ fontSize: "0.6rem", color: isOfficer ? "#38bdf8" : "#818cf8", letterSpacing: "0.1em", fontWeight: 700 }}>
              {isOfficer ? "TRACK & FIELD DESK" : "CHAMPIONSHIP SYSTEM"}
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ marginLeft: "auto", background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 4 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            {collapsed
              ? <path strokeLinecap="round" d="M9 18l6-6-6-6" />
              : <path strokeLinecap="round" d="M15 18l-6-6 6-6" />}
          </svg>
        </button>
      </div>

      {/* User info banner (expanded) */}
      {!collapsed && (
        <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: isOfficer ? "#38bdf8" : "#818cf8" }} />
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f1f5f9" }}>
              {user ? user.roleTitle : "Administrator"}
            </div>
          </div>
          <div style={{ fontSize: "0.68rem", color: "#64748b", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user ? user.email : "admin@sports.edu"}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ padding: "16px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        {LINKS.map((l) => {
          const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`sidebar-link${active ? " active" : ""}`}
              title={collapsed ? l.label : undefined}
              style={{ justifyContent: collapsed ? "center" : "flex-start", position: "relative" }}
            >
              <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{l.icon}</span>
              {!collapsed && (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <span>{l.label}</span>
                  {l.adminOnly && isOfficer && (
                    <span style={{ fontSize: "0.6rem", background: "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: 4, color: "#64748b" }}>
                      Admin
                    </span>
                  )}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "16px 10px", borderTop: "1px solid var(--border-color)" }}>
        <Link
          href="/"
          className="sidebar-link"
          title={collapsed ? "Public Site" : undefined}
          style={{ justifyContent: collapsed ? "center" : "flex-start" }}
        >
          <span style={{ fontSize: "1.1rem" }}>🌐</span>
          {!collapsed && <span>Public Site</span>}
        </Link>
        <button
          onClick={handleSignOut}
          className="sidebar-link"
          title={collapsed ? "Sign Out" : undefined}
          style={{
            color: "#f87171",
            marginTop: 4,
            justifyContent: collapsed ? "center" : "flex-start",
            background: "none",
            border: "none",
            width: "100%",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>🚪</span>
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

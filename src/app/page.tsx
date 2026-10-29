import Link from "next/link";
import Navbar from "@/components/Navbar";
import HomeHallCards from "@/components/HomeHallCards";
import StandingsTable from "@/components/StandingsTable";
import EventsTable from "@/components/EventsTable";
import EventWinnersList from "@/components/EventWinnersList";
import BreakingLiveBanner from "@/components/BreakingLiveBanner";
import { HALLS } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to Limkokwing 4th Inter-Hall Athletic Sport Meet | Championship",
  description: "Limkokwing University 4th Inter-Hall Athletic Sport Meet — championship hall cards, event winners, race marks, and official leaderboard.",
};

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", transition: "background 0.2s ease, color 0.2s ease" }}>
      <Navbar />

      {/* ─── 1. TOP MARQUEE: WELCOME TO LIMKOKWING 4TH INTER-HALL ATHLETIC SPORT MEET ─── */}
      <div style={{ paddingTop: 64 }}>
        <div
          style={{
            background: "linear-gradient(90deg, rgba(99,102,241,0.1), rgba(245,158,11,0.15), rgba(99,102,241,0.1))",
            borderBottom: "1px solid var(--border-color)",
            padding: "13px 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="marquee-container">
            <div className="marquee-content">
              {[1, 2, 3].map((copyIdx) => (
                <div key={copyIdx} style={{ display: "inline-flex", alignItems: "center", gap: 24, paddingRight: 24 }}>
                  <span
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 900,
                      fontSize: "1.1rem",
                      letterSpacing: "0.06em",
                      color: "var(--text-primary)",
                      textTransform: "uppercase",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span>🏆</span>
                    WELCOME TO LIMKOKWING 4TH INTER-HALL ATHLETIC SPORT MEET
                  </span>
                  <span style={{ color: "#3b82f6", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.04em" }}>
                    🔵 BLUE HALL
                  </span>
                  <span style={{ color: "#f59e0b", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.04em" }}>
                    🟡 GOLD HALL
                  </span>
                  <span style={{ color: "#8b5cf6", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.04em" }}>
                    🟣 PURPLE HALL
                  </span>
                  <span style={{ color: "#9ca3af", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.04em" }}>
                    ⚫ BLACK HALL
                  </span>
                  <span style={{ color: "#fcd34d", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.05em" }}>
                    ⚡ TRACK &amp; FIELD CHAMPIONSHIP
                  </span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>★</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. TOP: 4 HALL CARDS (Starts at 0 points for all halls) ─── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", paddingTop: 32, paddingBottom: 32, paddingLeft: 24, paddingRight: 24 }}>
        <HomeHallCards />
      </section>

      {/* ─── 3. FEATURE EVENT (Abdulai of Blue Hall in 1st Place) ─── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 36px" }}>
        <BreakingLiveBanner />
      </section>

      {/* ─── 4. WINNERS OF EVENTS LIST ─── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 44px" }}>
        <EventWinnersList />
      </section>

      {/* ─── 5. EVENTS, NAMES & SCORES TABLE ─── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 48px" }}>
        <EventsTable />
      </section>

      {/* ─── 6. OFFICIAL CHAMPIONSHIP LEADERBOARD (Football-Style Standings Table) ─── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 64px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "1.4rem" }}>🏆</span>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.45rem", color: "var(--text-primary)" }}>
                Official Championship Leaderboard
              </h2>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 2 }}>
              Ranked hall standings · Gold, silver, and bronze tallies with total championship points
            </p>
          </div>
          <Link href="/standings" className="btn-secondary" style={{ fontSize: "0.82rem", padding: "8px 16px" }}>
            Full Points Breakdown →
          </Link>
        </div>

        <div className="glass-card" style={{ padding: "8px 0", border: "1px solid var(--border-color)" }}>
          <StandingsTable />
        </div>
      </section>

      {/* ─── 7. ELIGIBILITY BANNER ─── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))",
            border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: 20,
            padding: "36px 32px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.7rem", color: "var(--text-primary)", marginBottom: 8 }}>
            Check Athlete Eligibility
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 20, maxWidth: 500, margin: "0 auto 20px" }}>
            Are you registered to represent your hall in track &amp; field? Search student ID or registration number to verify instantly.
          </p>
          <Link href="/eligibility" className="btn-primary" style={{ fontSize: "0.95rem", padding: "12px 28px" }}>
            Check Eligibility Now →
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: "1px solid var(--border-color)", padding: "32px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 16, flexWrap: "wrap" }}>
            {HALLS.map((h) => (
              <span key={h.id} style={{ fontSize: "0.8rem", color: h.color, fontWeight: 700 }}>
                {h.emoji} {h.name}
              </span>
            ))}
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
            © 2026 Limkokwing 4th Inter-Hall Athletic Sport Meet · All marks and scores are official
          </p>
        </div>
      </footer>
    </main>
  );
}

"use client";
import { getHall } from "@/lib/data";

interface Props {
  hall: string;
  score?: number | string;
  size?: "sm" | "md" | "lg";
  showScore?: boolean;
}

export default function HallCard({ hall, score, size = "md", showScore = false }: Props) {
  const h = getHall(hall);
  const sizes = {
    sm: { pad: "12px 16px", nameSize: "0.8rem", scoreSize: "1.8rem", dotSize: 28 },
    md: { pad: "20px 24px", nameSize: "0.9rem", scoreSize: "2.8rem", dotSize: 40 },
    lg: { pad: "28px 32px", nameSize: "1rem",   scoreSize: "3.8rem", dotSize: 52 },
  };
  const s = sizes[size];

  return (
    <div
      className={`hall-card-glow`}
      style={{
        padding: s.pad,
        borderRadius: 16,
        background: `linear-gradient(135deg, ${h.bg}cc, rgba(13,13,31,0.95))`,
        border: `1px solid ${h.color}44`,
        boxShadow: `0 0 24px ${h.glow}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        textAlign: "center",
        cursor: "default",
        transition: "transform 0.2s",
        "--hg": h.glow,
      } as React.CSSProperties}
      onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "translateY(0)")}
    >
      {/* Hall dot */}
      <div style={{ width: s.dotSize, height: s.dotSize, borderRadius: "50%", background: h.color, boxShadow: `0 0 16px ${h.glow}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: s.dotSize * 0.5 }}>
        {h.emoji.replace("🔵","💙").replace("⚫","🖤").replace("🟡","💛").replace("🟣","💜")}
      </div>
      <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: s.nameSize, color: h.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {h.name}
      </div>
      {showScore && score !== undefined && (
        <div className="score-num" style={{ fontSize: s.scoreSize, color: "#f1f5f9", lineHeight: 1, textShadow: `0 0 20px ${h.glow}` }}>
          {score}
        </div>
      )}
      <div style={{ fontSize: "0.72rem", color: "#64748b", fontStyle: "normal" }}>"{h.motto}"</div>
    </div>
  );
}

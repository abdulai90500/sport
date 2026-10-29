"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Check saved theme or system preference
    const saved = localStorage.getItem("app_theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
      if (saved === "light") {
        document.documentElement.classList.add("light-mode");
      } else {
        document.documentElement.classList.remove("light-mode");
      }
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("app_theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark and light mode"
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 8,
        border: theme === "light" ? "1px solid rgba(0,0,0,0.15)" : "1px solid rgba(255,255,255,0.15)",
        background: theme === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)",
        color: theme === "light" ? "#0f172a" : "#f1f5f9",
        cursor: "pointer",
        fontSize: "0.8rem",
        fontWeight: 600,
        transition: "all 0.2s ease",
      }}
    >
      <span>{theme === "dark" ? "🌙 Dark" : "☀️ Light"}</span>
    </button>
  );
}

// Hall configuration — single source of truth
export const HALLS = [
  {
    id: "blue",
    name: "Blue Hall",
    color: "#3b82f6",
    bg: "#1e3a8a",
    glow: "rgba(59,130,246,0.35)",
    cssClass: "hall-blue",
    emoji: "🔵",
    motto: "Unity in Excellence",
  },
  {
    id: "black",
    name: "Black Hall",
    color: "#9ca3af",
    bg: "#111827",
    glow: "rgba(156,163,175,0.3)",
    cssClass: "hall-black",
    emoji: "⚫",
    motto: "Strength & Resilience",
  },
  {
    id: "gold",
    name: "Gold Hall",
    color: "#f59e0b",
    bg: "#78350f",
    glow: "rgba(245,158,11,0.35)",
    cssClass: "hall-gold",
    emoji: "🟡",
    motto: "Glory & Triumph",
  },
  {
    id: "purple",
    name: "Purple Hall",
    color: "#8b5cf6",
    bg: "#4c1d95",
    glow: "rgba(139,92,246,0.3)",
    cssClass: "hall-purple",
    emoji: "🟣",
    motto: "Honour & Ambition",
  },
] as const;

export type HallId = (typeof HALLS)[number]["id"];

export const getHall = (id: string) =>
  HALLS.find((h) => h.id === id) ?? HALLS[0];

// Athletics Championship Standings / Leaderboard data
export interface HallStanding {
  hall: string;
  pts: number;
  events: number;
  gold: number;
  silver: number;
  bronze: number;
  trackPts: number;
  fieldPts: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
}

export const DEMO_STANDINGS: HallStanding[] = [
  { hall: "blue",   pts: 0, events: 0, gold: 0, silver: 0, bronze: 0, trackPts: 0, fieldPts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 },
  { hall: "black",  pts: 0, events: 0, gold: 0, silver: 0, bronze: 0, trackPts: 0, fieldPts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 },
  { hall: "gold",   pts: 0, events: 0, gold: 0, silver: 0, bronze: 0, trackPts: 0, fieldPts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 },
  { hall: "purple", pts: 0, events: 0, gold: 0, silver: 0, bronze: 0, trackPts: 0, fieldPts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 },
];

export interface MatchEvent {
  id: string;
  sport: string;
  eventName: string;
  category: "track" | "field";
  homeHall: string;
  awayHall: string;
  homeScore: number;
  awayScore: number;
  status: "finished" | "live" | "upcoming";
  date: string;
  time: string;
  venue: string;
  homeAthlete?: string;
  awayAthlete?: string;
  leaderMark?: string;
}

export const DEMO_MATCHES: MatchEvent[] = [
  {
    id: "m1",
    sport: "Athletics",
    eventName: "Men's 100m Sprint — Championship Final",
    category: "track",
    homeHall: "blue",
    awayHall: "gold",
    homeScore: 0,
    awayScore: 0,
    status: "upcoming",
    date: "2026-10-29",
    time: "14:00",
    venue: "Main Stadium Olympic Track",
    homeAthlete: "Blue Hall Sprinter",
    awayAthlete: "Gold Hall Sprinter",
  },
  {
    id: "m2",
    sport: "Athletics",
    eventName: "Women's 200m Sprint — Championship Final",
    category: "track",
    homeHall: "purple",
    awayHall: "black",
    homeScore: 0,
    awayScore: 0,
    status: "upcoming",
    date: "2026-10-29",
    time: "14:30",
    venue: "Main Stadium Olympic Track",
    homeAthlete: "Purple Hall Sprinter",
    awayAthlete: "Black Hall Sprinter",
  },
  {
    id: "m3",
    sport: "Athletics",
    eventName: "Men's 4x100m Relay — Grand Final",
    category: "track",
    homeHall: "gold",
    awayHall: "black",
    homeScore: 0,
    awayScore: 0,
    status: "upcoming",
    date: "2026-10-29",
    time: "15:00",
    venue: "Main Stadium Olympic Track",
    homeAthlete: "Gold Relay Squad",
    awayAthlete: "Black Relay Squad",
  },
  {
    id: "m4",
    sport: "Athletics",
    eventName: "Men's High Jump — Championship Finals",
    category: "field",
    homeHall: "purple",
    awayHall: "blue",
    homeScore: 0,
    awayScore: 0,
    status: "upcoming",
    date: "2026-10-29",
    time: "15:30",
    venue: "Field Zone B",
    homeAthlete: "Purple Hall Jumper",
    awayAthlete: "Blue Hall Jumper",
  },
  {
    id: "m5",
    sport: "Athletics",
    eventName: "Women's 400m Sprint — Championship Final",
    category: "track",
    homeHall: "blue",
    awayHall: "black",
    homeScore: 0,
    awayScore: 0,
    status: "upcoming",
    date: "2026-10-29",
    time: "16:00",
    venue: "Main Stadium Olympic Track",
    homeAthlete: "Blue Hall Runner",
    awayAthlete: "Black Hall Runner",
  },
  {
    id: "m6",
    sport: "Athletics",
    eventName: "Men's Shot Put — Championship Finals",
    category: "field",
    homeHall: "gold",
    awayHall: "purple",
    homeScore: 0,
    awayScore: 0,
    status: "upcoming",
    date: "2026-10-29",
    time: "16:30",
    venue: "Throwing Circle A",
    homeAthlete: "Gold Hall Thrower",
    awayAthlete: "Purple Hall Thrower",
  },
];

export const SPORTS = [
  {
    name: "Athletics",
    icon: "🏃",
    matches: 8,
    description: "Track & Field: 100m, 200m, 400m, 800m, 4x100m Relay, High Jump, Long Jump, Shot Put",
  },
];

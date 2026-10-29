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
  { hall: "gold",   pts: 48, events: 6, gold: 4, silver: 1, bronze: 1, trackPts: 30, fieldPts: 18, w: 4, d: 1, l: 1, gf: 30, ga: 18 },
  { hall: "blue",   pts: 40, events: 6, gold: 2, silver: 3, bronze: 1, trackPts: 24, fieldPts: 16, w: 3, d: 2, l: 1, gf: 24, ga: 16 },
  { hall: "purple", pts: 32, events: 6, gold: 1, silver: 2, bronze: 2, trackPts: 18, fieldPts: 14, w: 2, d: 2, l: 2, gf: 18, ga: 14 },
  { hall: "black",  pts: 24, events: 6, gold: 1, silver: 0, bronze: 2, trackPts: 12, fieldPts: 12, w: 1, d: 1, l: 4, gf: 12, ga: 12 },
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
    homeScore: 12,
    awayScore: 10,
    status: "finished",
    date: "2026-10-27",
    time: "14:00",
    venue: "Main Stadium Olympic Track",
    homeAthlete: "Abdulai (10.15s)",
    awayAthlete: "Emmanuel Mensah (10.24s)",
    leaderMark: "10.15s",
  },
  {
    id: "m2",
    sport: "Athletics",
    eventName: "Women's 200m Sprint — Championship Final",
    category: "track",
    homeHall: "purple",
    awayHall: "black",
    homeScore: 10,
    awayScore: 8,
    status: "finished",
    date: "2026-10-27",
    time: "14:30",
    venue: "Main Stadium Olympic Track",
    homeAthlete: "Sarah Addo (23.90s)",
    awayAthlete: "Grace Nyarko (24.15s)",
    leaderMark: "23.90s",
  },
  {
    id: "m3",
    sport: "Athletics",
    eventName: "Men's 4x100m Relay — Grand Final",
    category: "track",
    homeHall: "gold",
    awayHall: "black",
    homeScore: 15,
    awayScore: 8,
    status: "finished",
    date: "2026-10-26",
    time: "10:00",
    venue: "Main Stadium Olympic Track",
    homeAthlete: "Gold Relay Squad (39.88s)",
    awayAthlete: "Black Relay Squad (40.52s)",
    leaderMark: "39.88s",
  },
  {
    id: "m4",
    sport: "Athletics",
    eventName: "Men's High Jump — Championship Finals",
    category: "field",
    homeHall: "purple",
    awayHall: "blue",
    homeScore: 10,
    awayScore: 8,
    status: "finished",
    date: "2026-10-26",
    time: "16:00",
    venue: "Field Zone B",
    homeAthlete: "Kofi Mensah (2.05m)",
    awayAthlete: "Daniel Kwarteng (1.98m)",
    leaderMark: "2.05m",
  },
  {
    id: "m5",
    sport: "Athletics",
    eventName: "Women's 400m Sprint — Championship Final",
    category: "track",
    homeHall: "blue",
    awayHall: "black",
    homeScore: 10,
    awayScore: 8,
    status: "finished",
    date: "2026-10-26",
    time: "15:00",
    venue: "Main Stadium Olympic Track",
    homeAthlete: "Linda Ansah (52.40s)",
    awayAthlete: "Patience Bonsu (53.10s)",
    leaderMark: "52.40s",
  },
  {
    id: "m6",
    sport: "Athletics",
    eventName: "Men's Shot Put — Championship Finals",
    category: "field",
    homeHall: "gold",
    awayHall: "purple",
    homeScore: 12,
    awayScore: 8,
    status: "finished",
    date: "2026-10-25",
    time: "09:30",
    venue: "Throwing Circle A",
    homeAthlete: "Ibrahim Fuseini (16.85m)",
    awayAthlete: "Kwame Darko (15.90m)",
    leaderMark: "16.85m",
  },
  {
    id: "m7",
    sport: "Athletics",
    eventName: "Men's 800m Run — Finals",
    category: "track",
    homeHall: "blue",
    awayHall: "purple",
    homeScore: 10,
    awayScore: 8,
    status: "finished",
    date: "2026-10-25",
    time: "11:00",
    venue: "Main Stadium Olympic Track",
    homeAthlete: "Felix Appiah (1m 51.20s)",
    awayAthlete: "Benjamin Arthur (1m 52.80s)",
    leaderMark: "1m 51.20s",
  },
  {
    id: "m8",
    sport: "Athletics",
    eventName: "Women's Long Jump — Championship Finals",
    category: "field",
    homeHall: "gold",
    awayHall: "blue",
    homeScore: 12,
    awayScore: 10,
    status: "finished",
    date: "2026-10-25",
    time: "11:00",
    venue: "Jumping Pit 1",
    homeAthlete: "Abena Serwaa (6.12m)",
    awayAthlete: "Jessica Owusu (5.98m)",
    leaderMark: "6.12m",
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

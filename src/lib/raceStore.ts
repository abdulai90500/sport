import { HALLS, HallId } from "./data";
import { LiveEventBroadcast } from "@/components/BreakingLiveBanner";

export interface RaceAthlete {
  id: string;
  name: string;
  hallId: HallId;
  lane?: number;
  bibNumber?: string;
  studentId?: string;
  seedMark?: string;
}

export interface PositionAward {
  position: 1 | 2 | 3 | 4;
  athleteId: string;
  athleteName: string;
  hallId: HallId;
  markOrTime: string;
  points: number;
  prize: string;
}

export interface RaceResult {
  eventId: string;
  recordedBy: string;
  recordedAt: string;
  notes?: string;
  positions: PositionAward[];
}

export interface RaceEvent {
  id: string;
  name: string;
  category: "track" | "field";
  raceType?: "individual" | "group";
  venue: string;
  date: string;
  time: string;
  status: "scheduled" | "live" | "completed";
  athletes: RaceAthlete[];
  results?: RaceResult;
}

export const DEFAULT_PRIZES = {
  1: { points: 12, prize: "🏆 Gold Trophy & Champion Medal + GH₵ 1,500 Prize" },
  2: { points: 9,  prize: "🥈 Silver Medal & Runner-up Award + GH₵ 1,000 Prize" },
  3: { points: 6,  prize: "🥉 Bronze Medal & Podium Award + GH₵ 600 Prize" },
  4: { points: 4,  prize: "🎖️ 4th Place Honor Certificate + GH₵ 300 Prize" },
};

export const INITIAL_RACES: RaceEvent[] = [
  {
    id: "race-100m-m",
    name: "Men's 100m Sprint — Championship Final",
    category: "track",
    venue: "Main Stadium Olympic Track (Lane 1-4)",
    date: "2026-10-29",
    time: "14:00",
    status: "scheduled",
    athletes: [
      { id: "ath-1", name: "Abdulai", hallId: "blue", lane: 3, bibNumber: "101", studentId: "LUCT-2023-01", seedMark: "10.15s" },
      { id: "ath-2", name: "Emmanuel Mensah", hallId: "gold", lane: 4, bibNumber: "102", studentId: "LUCT-2023-45", seedMark: "10.24s" },
      { id: "ath-3", name: "Samuel Koffi", hallId: "purple", lane: 2, bibNumber: "103", studentId: "LUCT-2023-12", seedMark: "10.51s" },
      { id: "ath-4", name: "Prince Adams", hallId: "black", lane: 5, bibNumber: "104", studentId: "LUCT-2024-03", seedMark: "10.65s" },
    ],
  },
  {
    id: "race-200m-w",
    name: "Women's 200m Sprint — Championship Final",
    category: "track",
    venue: "Main Stadium Olympic Track",
    date: "2026-10-29",
    time: "14:45",
    status: "scheduled",
    athletes: [
      { id: "ath-5", name: "Sarah Addo", hallId: "purple", lane: 3, bibNumber: "201", seedMark: "23.90s" },
      { id: "ath-6", name: "Grace Nyarko", hallId: "black", lane: 4, bibNumber: "202", seedMark: "24.15s" },
      { id: "ath-7", name: "Linda Ansah", hallId: "blue", lane: 2, bibNumber: "203", seedMark: "24.60s" },
      { id: "ath-8", name: "Patience Bonsu", hallId: "gold", lane: 5, bibNumber: "204", seedMark: "24.95s" },
    ],
  },
  {
    id: "race-relay-4x100m",
    name: "Men's 4x100m Relay — Grand Final",
    category: "track",
    venue: "Main Stadium Track",
    date: "2026-10-29",
    time: "15:15",
    status: "scheduled",
    athletes: [
      { id: "ath-9",  name: "Gold Relay Squad", hallId: "gold", lane: 4, bibNumber: "401", seedMark: "39.88s" },
      { id: "ath-10", name: "Blue Relay Squad", hallId: "blue", lane: 3, bibNumber: "402", seedMark: "40.10s" },
      { id: "ath-11", name: "Black Relay Squad", hallId: "black", lane: 5, bibNumber: "403", seedMark: "40.52s" },
      { id: "ath-12", name: "Purple Relay Squad", hallId: "purple", lane: 2, bibNumber: "404", seedMark: "40.90s" },
    ],
  },
  {
    id: "race-highjump-m",
    name: "Men's High Jump — Championship Finals",
    category: "field",
    venue: "Field Zone B High Jump Pit",
    date: "2026-10-29",
    time: "15:45",
    status: "scheduled",
    athletes: [
      { id: "ath-13", name: "Kofi Mensah", hallId: "purple", lane: 1, bibNumber: "301", seedMark: "2.05m" },
      { id: "ath-14", name: "Daniel Kwarteng", hallId: "blue", lane: 2, bibNumber: "302", seedMark: "1.98m" },
      { id: "ath-15", name: "Kwame Darko", hallId: "gold", lane: 3, bibNumber: "303", seedMark: "1.95m" },
      { id: "ath-16", name: "Ibrahim Fuseini", hallId: "black", lane: 4, bibNumber: "304", seedMark: "1.92m" },
    ],
  },
  {
    id: "race-shotput-m",
    name: "Men's Shot Put — Championship Finals",
    category: "field",
    venue: "Throwing Circle A",
    date: "2026-10-29",
    time: "16:15",
    status: "scheduled",
    athletes: [
      { id: "ath-17", name: "Ibrahim Fuseini", hallId: "gold", lane: 1, bibNumber: "501", seedMark: "16.85m" },
      { id: "ath-18", name: "Kwame Darko", hallId: "purple", lane: 2, bibNumber: "502", seedMark: "15.90m" },
      { id: "ath-19", name: "Yaw Mensah", hallId: "blue", lane: 3, bibNumber: "503", seedMark: "15.40m" },
      { id: "ath-20", name: "Kofi Frimpong", hallId: "black", lane: 4, bibNumber: "504", seedMark: "14.80m" },
    ],
  },
  {
    id: "race-400m-w",
    name: "Women's 400m Sprint — Championship Final",
    category: "track",
    venue: "Main Stadium Olympic Track",
    date: "2026-10-29",
    time: "16:45",
    status: "scheduled",
    athletes: [
      { id: "ath-21", name: "Linda Ansah", hallId: "blue", lane: 3, bibNumber: "601", seedMark: "52.40s" },
      { id: "ath-22", name: "Patience Bonsu", hallId: "black", lane: 4, bibNumber: "602", seedMark: "53.10s" },
      { id: "ath-23", name: "Abena Serwaa", hallId: "gold", lane: 2, bibNumber: "603", seedMark: "53.80s" },
      { id: "ath-24", name: "Jessica Owusu", hallId: "purple", lane: 5, bibNumber: "604", seedMark: "54.20s" },
    ],
  },
];

const STORAGE_KEY = "championship_races_zero_v3";

export function getStoredRaces(): RaceEvent[] {
  if (typeof window === "undefined") return INITIAL_RACES;
  // Cleanup older demo keys with non-zero points
  try {
    localStorage.removeItem("championship_races_v1");
    localStorage.removeItem("championship_races_v2");
  } catch {}

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RACES));
    return INITIAL_RACES;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return INITIAL_RACES;
  } catch {
    return INITIAL_RACES;
  }
}

// Compute live standings strictly from verified race results (starts at 0 points for all halls)
export function calculateLiveStandings(races?: RaceEvent[]): {
  hall: HallId;
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
}[] {
  const currentRaces = races || getStoredRaces();
  const standingsMap: Record<HallId, {
    hall: HallId;
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
  }> = {
    blue:   { hall: "blue",   pts: 0, events: 0, gold: 0, silver: 0, bronze: 0, trackPts: 0, fieldPts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 },
    black:  { hall: "black",  pts: 0, events: 0, gold: 0, silver: 0, bronze: 0, trackPts: 0, fieldPts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 },
    gold:   { hall: "gold",   pts: 0, events: 0, gold: 0, silver: 0, bronze: 0, trackPts: 0, fieldPts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 },
    purple: { hall: "purple", pts: 0, events: 0, gold: 0, silver: 0, bronze: 0, trackPts: 0, fieldPts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 },
  };

  currentRaces.forEach((r) => {
    if (r.results && r.results.positions && r.results.positions.length > 0) {
      r.results.positions.forEach((pos) => {
        const item = standingsMap[pos.hallId];
        if (item) {
          item.pts += pos.points;
          item.events += 1;
          if (r.category === "track") item.trackPts += pos.points;
          else item.fieldPts += pos.points;

          if (pos.position === 1) item.gold += 1;
          else if (pos.position === 2) item.silver += 1;
          else if (pos.position === 3) item.bronze += 1;
        }
      });
    }
  });

  return Object.values(standingsMap).sort((a, b) => b.pts - a.pts);
}

export function saveAllRaces(races: RaceEvent[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(races));
  // Dispatch custom event for real-time local reactivity
  window.dispatchEvent(new CustomEvent("championship-races-changed", { detail: races }));
  window.dispatchEvent(new Event("storage"));
}

export function saveRaceEvent(updatedRace: RaceEvent): RaceEvent[] {
  const all = getStoredRaces();
  const index = all.findIndex((r) => r.id === updatedRace.id);
  let next: RaceEvent[];
  if (index >= 0) {
    next = all.map((r) => (r.id === updatedRace.id ? updatedRace : r));
  } else {
    next = [updatedRace, ...all];
  }
  saveAllRaces(next);
  return next;
}

export function deleteRaceEvent(raceId: string): RaceEvent[] {
  const all = getStoredRaces();
  const next = all.filter((r) => r.id !== raceId);
  saveAllRaces(next);
  return next;
}

export function addAthleteToEvent(raceId: string, athlete: Omit<RaceAthlete, "id">): RaceEvent[] {
  const all = getStoredRaces();
  const next = all.map((r) => {
    if (r.id !== raceId) return r;
    const newAthlete: RaceAthlete = {
      ...athlete,
      id: `ath-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };
    return {
      ...r,
      athletes: [...r.athletes, newAthlete],
    };
  });
  saveAllRaces(next);
  return next;
}

export function updateAthleteInEvent(raceId: string, athleteId: string, updates: Partial<RaceAthlete>): RaceEvent[] {
  const all = getStoredRaces();
  const next = all.map((r) => {
    if (r.id !== raceId) return r;
    return {
      ...r,
      athletes: r.athletes.map((a) => (a.id === athleteId ? { ...a, ...updates } : a)),
    };
  });
  saveAllRaces(next);
  return next;
}

export function removeAthleteFromEvent(raceId: string, athleteId: string): RaceEvent[] {
  const all = getStoredRaces();
  const next = all.map((r) => {
    if (r.id !== raceId) return r;
    return {
      ...r,
      athletes: r.athletes.filter((a) => a.id !== athleteId),
    };
  });
  saveAllRaces(next);
  return next;
}

// Judge submits final result with 1st, 2nd, 3rd, 4th positions and prizes
export function submitJudgeResult(
  raceId: string,
  result: RaceResult,
  judgeName: string = "Official Judge"
): { races: RaceEvent[]; broadcast: LiveEventBroadcast } {
  const all = getStoredRaces();
  let targetRace: RaceEvent | undefined;

  const next = all.map((r) => {
    if (r.id !== raceId) return r;
    targetRace = {
      ...r,
      status: "completed" as const,
      results: {
        ...result,
        recordedBy: judgeName,
        recordedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    };
    return targetRace;
  });

  saveAllRaces(next);

  // Synchronize with the Live Banner Broadcast
  const liveBroadcast: LiveEventBroadcast = {
    id: `live-${raceId}`,
    sport: "Athletics",
    eventName: targetRace ? targetRace.name : "Athletics Championship Event",
    category: targetRace?.category || "track",
    venue: targetRace?.venue || "Main Stadium Olympic Track",
    status: "CONCLUDED",
    timeElapsed: `Official Results Verified by ${judgeName}`,
    standings: result.positions.map((p) => ({
      position: p.position,
      hallId: p.hallId,
      athlete: p.athleteName,
      markOrTime: p.markOrTime,
      points: p.points,
    })),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem("current_live_broadcast_v3", JSON.stringify(liveBroadcast));
    localStorage.setItem("current_live_broadcast", JSON.stringify(liveBroadcast));
    window.dispatchEvent(new Event("storage"));
  }

  return { races: next, broadcast: liveBroadcast };
}

// Reset or clear judge scoring for an event
export function resetJudgeResult(raceId: string): { races: RaceEvent[]; broadcast?: LiveEventBroadcast } {
  const all = getStoredRaces();
  const next = all.map((r) => {
    if (r.id !== raceId) return r;
    const { results, ...rest } = r;
    return {
      ...rest,
      status: "scheduled" as const,
    };
  });

  saveAllRaces(next);

  // If the cleared race was on the live broadcast, refresh broadcast to another completed event or default
  const remainingCompleted = next.find((r) => r.status === "completed" && r.results);
  let broadcast: LiveEventBroadcast;
  if (remainingCompleted && remainingCompleted.results) {
    broadcast = {
      id: `live-${remainingCompleted.id}`,
      sport: "Athletics",
      eventName: remainingCompleted.name,
      category: remainingCompleted.category,
      venue: remainingCompleted.venue,
      status: "CONCLUDED",
      timeElapsed: `Official Results Verified by ${remainingCompleted.results.recordedBy}`,
      standings: remainingCompleted.results.positions.map((p) => ({
        position: p.position,
        hallId: p.hallId,
        athlete: p.athleteName,
        markOrTime: p.markOrTime,
        points: p.points,
      })),
    };
  } else {
    broadcast = {
      id: "live-ath-1",
      sport: "Athletics",
      eventName: "Limkokwing 4th Inter-Hall Athletic Meet",
      category: "track",
      venue: "Main Stadium Olympic Track",
      status: "UPCOMING",
      timeElapsed: "Championship Opening · All Halls Start at 0 Points",
      standings: [
        { position: 1, hallId: "blue", athlete: "Awaiting Results", markOrTime: "—", points: 0 },
        { position: 2, hallId: "black", athlete: "Awaiting Results", markOrTime: "—", points: 0 },
        { position: 3, hallId: "gold", athlete: "Awaiting Results", markOrTime: "—", points: 0 },
        { position: 4, hallId: "purple", athlete: "Awaiting Results", markOrTime: "—", points: 0 },
      ],
    };
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("current_live_broadcast_v3", JSON.stringify(broadcast));
    localStorage.setItem("current_live_broadcast", JSON.stringify(broadcast));
    window.dispatchEvent(new Event("storage"));
  }

  return { races: next, broadcast };
}

// Atomically save or update a race and its 4 athletes
export function saveRaceWithAthletes(race: RaceEvent): RaceEvent[] {
  return saveRaceEvent(race);
}


export type UserRole = "admin" | "judge" | "event_officer";

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
  roleTitle: string;
}

const STORAGE_KEY = "interhall_sports_user";

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function loginUser(emailOrUsername: string, pass: string): { success: boolean; user?: AuthUser; error?: string } {
  const identifier = emailOrUsername.trim().toLowerCase();
  
  if (!identifier) {
    return { success: false, error: "Please enter your email or username" };
  }

  let role: UserRole = "judge";
  let name = "Official Track & Field Judge";
  let roleTitle = "Championship Judge";
  let canonicalEmail = identifier;

  if (
    identifier === "admin" ||
    identifier.startsWith("admin@") ||
    identifier.includes("admin") ||
    identifier === "superadmin"
  ) {
    role = "admin";
    name = "Championship Administrator";
    roleTitle = "Administrator";
    canonicalEmail = identifier.includes("@") ? identifier : "admin@sports.edu";
  } else if (
    identifier === "judge" ||
    identifier.startsWith("judge@") ||
    identifier.includes("judge") ||
    identifier.includes("referee") ||
    identifier.includes("scorer")
  ) {
    role = "judge";
    name = "Official Track & Field Judge";
    roleTitle = "Championship Judge";
    canonicalEmail = identifier.includes("@") ? identifier : "judge@sports.edu";
  } else if (
    identifier === "officer" ||
    identifier.startsWith("officer@") ||
    identifier.includes("officer") ||
    identifier.includes("event")
  ) {
    role = "event_officer";
    name = "Track & Field Event Officer";
    roleTitle = "Event Officer";
    canonicalEmail = identifier.includes("@") ? identifier : "officer@sports.edu";
  } else {
    // Default to Judge
    role = "judge";
    name = "Championship Official Judge";
    roleTitle = "Championship Judge";
    canonicalEmail = identifier.includes("@") ? identifier : `${identifier}@sports.edu`;
  }

  const user: AuthUser = {
    email: canonicalEmail,
    name,
    role,
    roleTitle,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("auth-change"));
  }

  return { success: true, user };
}

export function logoutUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("auth-change"));
  }
}

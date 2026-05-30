import fs from "fs/promises";
import path from "path";

export type UserStatus = "Active" | "Suspended";
export type MembershipTier = "Basic" | "Silver" | "Gold" | "Platinum";

export type UserRecord = {
  email: string;
  password: string;
  name?: string;
  status: UserStatus;
  tier: MembershipTier;
  memberId: string;
  createdAt: string;
  lastCheckIn?: string;
};

export type AdminRecord = {
  email: string;
  password: string;
  role: "admin" | "super";
  name?: string;
  createdAt?: string;
};

export type AttendanceRecord = {
  id: string;
  memberId: string;
  email?: string;
  timestamp: string;
  source: "manual" | "qr";
};

export type ActivityRecord = {
  id: string;
  email: string;
  type: string;
  timestamp: string;
  details?: Record<string, string>;
};

export const MEMBERSHIP_TIERS: MembershipTier[] = ["Basic", "Silver", "Gold", "Platinum"];
export const USER_STATUSES: UserStatus[] = ["Active", "Suspended"];

const USERS_FILE = path.join(process.cwd(), "users.json");
const ADMINS_FILE = path.join(process.cwd(), "admins.json");
const ACTIVITIES_FILE = path.join(process.cwd(), "activities.json");
const CONTACTS_FILE = path.join(process.cwd(), "contact-submissions.json");
const ATTENDANCE_FILE = path.join(process.cwd(), "attendance-submissions.json");

export function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function sanitizeText(value: unknown, maxLength = 2000) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function createId(prefix: string) {
  const safePrefix = prefix.replace(/[^a-z0-9-]/gi, "").toUpperCase() || "ID";
  return `${safePrefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function memberIdForEmail(email: string) {
  return `ELG-${Buffer.from(email).toString("base64url").slice(0, 10).toUpperCase()}`;
}

async function readJsonArray<T>(file: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeJsonArray<T>(file: string, rows: T[]) {
  await fs.writeFile(file, JSON.stringify(rows, null, 2), "utf8");
}

function normalizeUser(user: Partial<UserRecord> & { email?: string; password?: string }): UserRecord {
  const email = normalizeEmail(user.email);
  const now = new Date().toISOString();
  const status = USER_STATUSES.includes(user.status as UserStatus) ? (user.status as UserStatus) : "Active";
  const tier = MEMBERSHIP_TIERS.includes(user.tier as MembershipTier) ? (user.tier as MembershipTier) : "Basic";

  return {
    ...user,
    email,
    password: user.password || "",
    status,
    tier,
    memberId: user.memberId || memberIdForEmail(email),
    createdAt: user.createdAt || now,
  };
}

export async function getContacts() {
  return readJsonArray(CONTACTS_FILE);
}

export async function getAttendance() {
  return readJsonArray<AttendanceRecord>(ATTENDANCE_FILE);
}

export async function writeAttendance(records: AttendanceRecord[]) {
  await writeJsonArray(ATTENDANCE_FILE, records);
}

export async function addAttendance(record: AttendanceRecord) {
  const records = await getAttendance();
  records.push(record);
  await writeAttendance(records);
}

export async function getUsers() {
  const users = await readJsonArray<Partial<UserRecord>>(USERS_FILE);
  return users.map(normalizeUser).filter((user) => user.email && user.password);
}

export async function writeUsers(users: UserRecord[]) {
  await writeJsonArray(USERS_FILE, users.map(normalizeUser));
}

export async function getAdmins() {
  const admins = await readJsonArray<Partial<AdminRecord>>(ADMINS_FILE);
  return admins
    .map((admin) => ({
      ...admin,
      email: normalizeEmail(admin.email),
      password: admin.password || "",
      role: admin.role === "super" ? "super" : "admin",
    }))
    .filter((admin): admin is AdminRecord => Boolean(admin.email && admin.password));
}

export async function writeAdmins(admins: AdminRecord[]) {
  await writeJsonArray(ADMINS_FILE, admins);
}

export async function getActivities() {
  return readJsonArray<ActivityRecord>(ACTIVITIES_FILE);
}

export async function writeActivities(activities: ActivityRecord[]) {
  await writeJsonArray(ACTIVITIES_FILE, activities);
}

export async function addActivity(activity: ActivityRecord) {
  const activities = await getActivities();
  activities.push(activity);
  await writeActivities(activities);
}

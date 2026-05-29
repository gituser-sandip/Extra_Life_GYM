import fs from "fs/promises";
import path from "path";

export async function getContacts() {
  try {
    const file = path.join(process.cwd(), "contact-submissions.json");
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

export async function getAttendance() {
  try {
    const file = path.join(process.cwd(), "attendance-submissions.json");
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

// ---------- New Helpers ----------
const USERS_FILE = path.join(process.cwd(), "users.json");
const ADMINS_FILE = path.join(process.cwd(), "admins.json");
const ACTIVITIES_FILE = path.join(process.cwd(), "activities.json");

export async function getUsers() {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

export async function writeUsers(users: any[]) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

export async function getAdmins() {
  try {
    const raw = await fs.readFile(ADMINS_FILE, "utf8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

export async function writeAdmins(admins: any[]) {
  await fs.writeFile(ADMINS_FILE, JSON.stringify(admins, null, 2), "utf8");
}

export async function getActivities() {
  try {
    const raw = await fs.readFile(ACTIVITIES_FILE, "utf8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

export async function writeActivities(acts: any[]) {
  await fs.writeFile(ACTIVITIES_FILE, JSON.stringify(acts, null, 2), "utf8");
}

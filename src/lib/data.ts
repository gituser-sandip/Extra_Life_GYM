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

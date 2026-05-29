import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

type AttendancePayload = {
  memberId: string;
};

const ATTENDANCE_FILE = path.join(process.cwd(), "attendance-submissions.json");

async function saveAttendance(payload: AttendancePayload) {
  try {
    let current: AttendancePayload[] = [];
    try {
      const raw = await fs.readFile(ATTENDANCE_FILE, "utf8");
      current = JSON.parse(raw || "[]");
    } catch {
      current = [];
    }
    current.push({ ...payload });
    await fs.writeFile(ATTENDANCE_FILE, JSON.stringify(current, null, 2), "utf8");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { memberId } = body as AttendancePayload;

    if (!memberId || typeof memberId !== "string" || !memberId.trim()) {
      return NextResponse.json({ error: "Member ID is required." }, { status: 400 });
    }

    await saveAttendance({ memberId: memberId.trim() });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save attendance." }, { status: 500 });
  }
}

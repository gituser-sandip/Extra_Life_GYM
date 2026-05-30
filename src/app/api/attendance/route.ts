import { NextResponse } from "next/server";
import {
  addActivity,
  addAttendance,
  createId,
  getUsers,
  sanitizeText,
  writeUsers,
} from "@/lib/data";

type AttendancePayload = {
  memberId: string;
  source?: "manual" | "qr";
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { source } = body as AttendancePayload;
    const memberId = sanitizeText(body.memberId, 120);

    if (!memberId) {
      return NextResponse.json({ error: "Member ID is required." }, { status: 400 });
    }

    const users = await getUsers();
    const lookup = memberId.toLowerCase();
    const user = users.find((item) => item.memberId.toLowerCase() === lookup || item.email === lookup);

    if (!user) {
      return NextResponse.json({ error: "Member not found. Please check your ID." }, { status: 404 });
    }

    if (user.status !== "Active") {
      return NextResponse.json({ error: "This membership is not active." }, { status: 403 });
    }

    const timestamp = new Date().toISOString();
    const record = {
      id: createId("ATT"),
      memberId: user.memberId,
      email: user.email,
      timestamp,
      source: source === "qr" ? "qr" : "manual",
    } as const;

    user.lastCheckIn = timestamp;
    await Promise.all([
      addAttendance(record),
      addActivity({
        id: createId("ACT"),
        email: user.email,
        type: "Check-In",
        timestamp,
        details: { memberId: user.memberId, source: record.source },
      }),
      writeUsers(users),
    ]);

    return NextResponse.json({ ok: true, memberId: user.memberId, email: user.email, timestamp });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save attendance." }, { status: 500 });
  }
}

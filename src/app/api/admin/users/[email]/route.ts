import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import {
  getActivities,
  getAttendance,
  getUsers,
  isValidEmail,
  MEMBERSHIP_TIERS,
  normalizeEmail,
  sanitizeText,
  USER_STATUSES,
  writeActivities,
  writeAttendance,
  writeUsers,
} from "@/lib/data";

export async function PATCH(req: Request, { params }: { params: Promise<{ email: string }> }) {
  try {
    const session = await requireAdminSession(req);
    if (!session.ok) return NextResponse.json({ error: session.error }, { status: session.status });

    const { email } = await params;
    const currentEmail = normalizeEmail(decodeURIComponent(email));
    const body = await req.json();

    const nextEmail = normalizeEmail(body.email || currentEmail);
    const name = sanitizeText(body.name, 80);
    const memberId = sanitizeText(body.memberId, 120);
    const status = body.status;
    const tier = body.tier;

    if (!nextEmail || !isValidEmail(nextEmail)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (!memberId) {
      return NextResponse.json({ error: "Member ID is required." }, { status: 400 });
    }
    if (status && !USER_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    if (tier && !MEMBERSHIP_TIERS.includes(tier)) {
      return NextResponse.json({ error: "Invalid tier." }, { status: 400 });
    }

    const users = await getUsers();
    const user = users.find((item) => item.email === currentEmail);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const duplicateEmail = users.some((item) => item.email === nextEmail && item.email !== currentEmail);
    if (duplicateEmail) {
      return NextResponse.json({ error: "Another member already uses this email." }, { status: 400 });
    }

    const duplicateMemberId = users.some((item) => item.memberId === memberId && item.email !== currentEmail);
    if (duplicateMemberId) {
      return NextResponse.json({ error: "Another member already uses this member ID." }, { status: 400 });
    }

    const previousEmail = user.email;
    const previousMemberId = user.memberId;
    user.email = nextEmail;
    user.name = name;
    user.memberId = memberId;
    if (status) user.status = status;
    if (tier) user.tier = tier;

    const [activities, attendances] = await Promise.all([getActivities(), getAttendance()]);
    const updatedActivities = activities.map((activity) =>
      activity.email === previousEmail ? { ...activity, email: nextEmail } : activity
    );
    const updatedAttendances = attendances.map((attendance) =>
      attendance.email === previousEmail || attendance.memberId === previousMemberId
        ? { ...attendance, email: nextEmail, memberId }
        : attendance
    );

    await Promise.all([
      writeUsers(users),
      writeActivities(updatedActivities),
      writeAttendance(updatedAttendances),
    ]);

    return NextResponse.json({
      ok: true,
      user: {
        email: user.email,
        name: user.name,
        status: user.status,
        tier: user.tier,
        memberId: user.memberId,
        createdAt: user.createdAt,
        lastCheckIn: user.lastCheckIn,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ email: string }> }) {
  try {
    const session = await requireAdminSession(req);
    if (!session.ok) return NextResponse.json({ error: session.error }, { status: session.status });
    if (session.role !== "super") {
      return NextResponse.json({ error: "Only super admins can delete users" }, { status: 403 });
    }

    const { email } = await params;
    const decodedEmail = normalizeEmail(decodeURIComponent(email));
    const users = await getUsers();
    const filtered = users.filter((u: { email: string }) => u.email !== decodedEmail);
    if (filtered.length === users.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    await writeUsers(filtered);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

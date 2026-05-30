import { NextResponse } from "next/server";
import { requireUserSession } from "@/lib/auth";
import { getActivities, getUsers } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await requireUserSession(req);
    if (!session.ok) return NextResponse.json({ error: session.error }, { status: session.status });

    const users = await getUsers();
    const user = users.find((item) => item.email === session.email);
    if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });

    const activities = (await getActivities())
      .filter((activity) => activity.email === user.email)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      user: {
        email: user.email,
        name: user.name,
        status: user.status,
        tier: user.tier,
        memberId: user.memberId,
        createdAt: user.createdAt,
        lastCheckIn: user.lastCheckIn,
      },
      stats: {
        totalActivities: activities.length,
        checkIns: activities.filter((activity) => activity.type === "Check-In").length,
        lastActivity: activities[0]?.timestamp || null,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { requireAdminSession, requireUserSession } from "@/lib/auth";
import { getActivities, normalizeEmail } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const requestedEmail = normalizeEmail(url.searchParams.get("email"));
    let email = requestedEmail;

    if (requestedEmail) {
      const admin = await requireAdminSession(req);
      if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status });
    } else {
      const user = await requireUserSession(req);
      if (!user.ok) return NextResponse.json({ error: user.error }, { status: user.status });
      email = user.email;
    }

    const activities = (await getActivities())
      .filter((activity) => activity.email === email)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return NextResponse.json({ activities });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

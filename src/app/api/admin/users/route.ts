import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { getUsers, MEMBERSHIP_TIERS, normalizeEmail, USER_STATUSES, writeUsers } from "@/lib/data";

export async function PATCH(req: Request) {
  try {
    const session = await requireAdminSession(req);
    if (!session.ok) return NextResponse.json({ error: session.error }, { status: session.status });

    const body = await req.json();
    const email = normalizeEmail(body.email);
    const status = body.status;
    const tier = body.tier;
    if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });
    if (status && !USER_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    if (tier && !MEMBERSHIP_TIERS.includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const users = await getUsers();
    const user = users.find((u: { email: string }) => u.email === email);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (status) user.status = status;
    if (tier) user.tier = tier;

    await writeUsers(users);
    return NextResponse.json({ ok: true, user });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

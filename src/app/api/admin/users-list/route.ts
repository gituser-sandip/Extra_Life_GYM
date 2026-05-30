import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { getUsers } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await requireAdminSession(req);
    if (!session.ok) return NextResponse.json({ error: session.error }, { status: session.status });

    const users = await getUsers();
    const safeUsers = users.map((user) => ({
      email: user.email,
      name: user.name,
      status: user.status,
      tier: user.tier,
      memberId: user.memberId,
      createdAt: user.createdAt,
      lastCheckIn: user.lastCheckIn,
    }));
    return NextResponse.json({ users: safeUsers, isSuperAdmin: session.role === "super" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

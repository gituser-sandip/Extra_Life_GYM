import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { getUsers, writeUsers } from "@/lib/data";

export async function PATCH(req: Request) {
  try {
    const token = req.headers.get("cookie")?.match(/admin_session=([^;]+)/)?.[1];
    if (!token) return NextResponse.json({ error: "No admin session" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { email, status, tier } = await req.json();
    if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

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

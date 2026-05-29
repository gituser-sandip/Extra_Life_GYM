import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { getUsers, getAdmins } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("cookie")?.match(/admin_session=([^;]+)/)?.[1];
    if (!token) return NextResponse.json({ error: "No admin session" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const admins = await getAdmins();
    const requester = admins.find((a: { email: string; role: string }) => a.email === payload.email);
    const isSuperAdmin = requester?.role === "super";

    const users = await getUsers();
    return NextResponse.json({ users, isSuperAdmin });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

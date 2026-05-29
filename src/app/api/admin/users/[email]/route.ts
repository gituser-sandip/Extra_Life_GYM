import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { getUsers, writeUsers } from "@/lib/data";

export async function DELETE(req: Request, { params }: { params: Promise<{ email: string }> }) {
  try {
    const token = req.headers.get("cookie")?.match(/admin_session=([^;]+)/)?.[1];
    if (!token) return NextResponse.json({ error: "No admin session" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // Only super admins can delete users
    const { getAdmins } = await import("@/lib/data");
    const admins = await getAdmins();
    const requester = admins.find((a: { email: string; role: string }) => a.email === payload.email);
    if (!requester || requester.role !== "super") {
      return NextResponse.json({ error: "Only super admins can delete users" }, { status: 403 });
    }

    const { email } = await params;
    const decodedEmail = decodeURIComponent(email);
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

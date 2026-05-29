import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { getAdmins, writeAdmins } from "@/lib/data";

export async function POST(req: Request) {
  try {
    // Verify the requester is a super admin
    const token = req.headers.get("cookie")?.match(/admin_session=([^;]+)/)?.[1];
    if (!token) return NextResponse.json({ error: "No admin session" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const admins = await getAdmins();
    const requester = admins.find((a: { email: string; role: string }) => a.email === payload.email);
    if (!requester || requester.role !== "super") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const { email, role } = await req.json();
    if (!email || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (role !== "super" && role !== "admin") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const target = admins.find((a: { email: string; role: string }) => a.email === email);
    if (!target) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }
    target.role = role as "super" | "admin";
    await writeAdmins(admins);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

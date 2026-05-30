import { NextResponse } from "next/server";
import { getAdmins, normalizeEmail, writeAdmins } from "@/lib/data";
import { requireAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await requireAdminSession(req);
    if (!session.ok) return NextResponse.json({ error: session.error }, { status: session.status });
    if (session.role !== "super") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const admins = await getAdmins();
    const body = await req.json();
    const email = normalizeEmail(body.email);
    const role = body.role;
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

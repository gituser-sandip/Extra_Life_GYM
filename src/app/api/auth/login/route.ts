import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { comparePassword } from "@/lib/password";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";

const ADMINS_FILE = path.join(process.cwd(), "admins.json");

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let admins: any[] = [];
    try {
      const raw = await fs.readFile(ADMINS_FILE, "utf8");
      admins = JSON.parse(raw || "[]");
    } catch {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const admin = admins.find((a) => a.email === email);
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({ email });
    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

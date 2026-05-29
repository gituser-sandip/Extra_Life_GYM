import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { hashPassword } from "@/lib/password";

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
      admins = [];
    }

    const existingUser = admins.find((a) => a.email === email);
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashed = await hashPassword(password);
    admins.push({ email, password: hashed });

    await fs.writeFile(ADMINS_FILE, JSON.stringify(admins, null, 2), "utf8");

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

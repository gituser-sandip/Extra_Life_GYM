import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { hashPassword } from "@/lib/password";

const USERS_FILE = path.join(process.cwd(), "users.json");

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let users: any[] = [];
    try {
      const raw = await fs.readFile(USERS_FILE, "utf8");
      users = JSON.parse(raw || "[]");
    } catch {
      users = [];
    }

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashed = await hashPassword(password);
    users.push({ email, password: hashed });

    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

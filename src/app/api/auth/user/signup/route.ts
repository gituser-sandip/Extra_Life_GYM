import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { createId, getUsers, isValidEmail, normalizeEmail, sanitizeText, writeUsers } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = normalizeEmail(body.email);
    const password = sanitizeText(body.password, 128);
    const name = sanitizeText(body.name, 80);

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const users = await getUsers();
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashed = await hashPassword(password);
    users.push({
      email,
      name,
      password: hashed,
      status: "Active",
      tier: "Basic",
      memberId: createId("ELG"),
      createdAt: new Date().toISOString(),
    });

    await writeUsers(users);

    const token = await signToken({ email });
    const cookieStore = await cookies();
    cookieStore.set("user_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

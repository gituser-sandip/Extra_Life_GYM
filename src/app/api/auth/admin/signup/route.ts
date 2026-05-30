import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";
import { getAdmins, isValidEmail, normalizeEmail, sanitizeText, writeAdmins } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = normalizeEmail(body.email);
    const password = sanitizeText(body.password, 128);

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const admins = await getAdmins();
    const existingUser = admins.find((a) => a.email === email);
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashed = await hashPassword(password);
    admins.push({ email, password: hashed, role: admins.length === 0 ? "super" : "admin", createdAt: new Date().toISOString() });

    await writeAdmins(admins);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

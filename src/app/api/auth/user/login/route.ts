import { NextResponse } from "next/server";
import { comparePassword } from "@/lib/password";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { getUsers, normalizeEmail, sanitizeText } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = normalizeEmail(body.email);
    const password = sanitizeText(body.password, 128);

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const users = await getUsers();
    const user = users.find((u) => u.email === email);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (user.status !== "Active") {
      return NextResponse.json({ error: "This account is suspended." }, { status: 403 });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({ email });
    const cookieStore = await cookies();
    cookieStore.set("user_session", token, {
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

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { isValidEmail, normalizeEmail, sanitizeText } from "@/lib/data";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

const SUBMISSIONS_FILE = path.join(process.cwd(), "contact-submissions.json");

async function saveSubmission(payload: ContactPayload) {
  try {
    let current: ContactPayload[] = [];
    try {
      const raw = await fs.readFile(SUBMISSIONS_FILE, "utf8");
      current = JSON.parse(raw || "[]");
    } catch {
      // file may not exist yet
      current = [];
    }

    current.push({ ...payload });
    await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(current, null, 2), "utf8");
  } catch (e) {
    // swallow — caller will handle; log for debugging
    console.error(e);
    throw e;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = sanitizeText(body.name, 100);
    const email = normalizeEmail(body.email);
    const message = sanitizeText(body.message, 2000);

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await saveSubmission({ name, email, message });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

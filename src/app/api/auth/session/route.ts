import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("user_session")?.value;
  const adminToken = cookieStore.get("admin_session")?.value;

  if (adminToken) {
    const payload = await verifyToken(adminToken);
    if (typeof payload?.email === "string") {
      return NextResponse.json({ authenticated: true, type: "admin", email: payload.email });
    }
  }

  if (userToken) {
    const payload = await verifyToken(userToken);
    if (typeof payload?.email === "string") {
      return NextResponse.json({ authenticated: true, type: "user", email: payload.email });
    }
  }

  return NextResponse.json({ authenticated: false, type: null, email: null });
}

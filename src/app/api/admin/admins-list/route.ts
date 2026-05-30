import { NextResponse } from "next/server";
import { getAdmins } from "@/lib/data";
import { requireAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await requireAdminSession(req);
    if (!session.ok) return NextResponse.json({ error: session.error }, { status: session.status });
    const admins = await getAdmins();
    const safeAdmins = admins.map((admin) => ({
      email: admin.email,
      name: admin.name,
      role: admin.role,
      createdAt: admin.createdAt,
    }));

    return NextResponse.json({ admins: safeAdmins, isSuperAdmin: session.role === "super" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

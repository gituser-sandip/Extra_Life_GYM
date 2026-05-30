import { verifyToken } from "@/lib/jwt";
import { getAdmins, getUsers } from "@/lib/data";

type SessionResult =
  | { ok: true; email: string; role?: "admin" | "super" }
  | { ok: false; status: 401 | 403; error: string };

function readCookie(req: Request, name: string) {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

export async function requireUserSession(req: Request): Promise<SessionResult> {
  const token = readCookie(req, "user_session");
  if (!token) return { ok: false, status: 401, error: "Please sign in again." };

  const payload = await verifyToken(token);
  const email = typeof payload?.email === "string" ? payload.email : "";
  if (!email) return { ok: false, status: 401, error: "Please sign in again." };

  const users = await getUsers();
  const user = users.find((item) => item.email === email);
  if (!user) return { ok: false, status: 401, error: "Account not found." };
  if (user.status !== "Active") return { ok: false, status: 403, error: "Account is suspended." };

  return { ok: true, email };
}

export async function requireAdminSession(req: Request): Promise<SessionResult> {
  const token = readCookie(req, "admin_session");
  if (!token) return { ok: false, status: 401, error: "No admin session." };

  const payload = await verifyToken(token);
  const email = typeof payload?.email === "string" ? payload.email : "";
  if (!email) return { ok: false, status: 401, error: "Invalid admin session." };

  const admins = await getAdmins();
  const admin = admins.find((item) => item.email === email);
  if (!admin) return { ok: false, status: 403, error: "Admin access required." };

  return { ok: true, email, role: admin.role };
}

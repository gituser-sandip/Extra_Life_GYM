"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

type DashboardData = {
  user: {
    email: string;
    name?: string;
    status: string;
    tier: string;
    memberId: string;
    createdAt: string;
    lastCheckIn?: string;
  };
  stats: {
    totalActivities: number;
    checkIns: number;
    lastActivity: string | null;
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const res = await fetch("/api/user/me");
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || "Unable to load dashboard.");
        if (active) setData(payload);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unable to load dashboard.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/user/logout", { method: "POST" });
    router.push("/login");
  };

  const user = data?.user;
  const stats = data?.stats;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Welcome{user?.name ? `, ${user.name}` : ""} to <span>ExtraLife</span> GYM</h1>
        <p>Your personal member dashboard. Track your check-ins and manage your membership.</p>
      </div>

      {error && <div className={styles.alert}>{error}</div>}

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2>Membership Status</h2>
          <div className={styles.statValue}>{loading ? "Loading" : user?.status || "Active"}</div>
          {user && <p className={styles.meta}>Tier: {user.tier}</p>}
        </div>

        <div className={styles.card}>
          <h2>Member ID</h2>
          <div className={styles.memberId}>{loading ? "Loading..." : user?.memberId || "Unavailable"}</div>
          {user?.lastCheckIn && <p className={styles.meta}>Last check-in: {new Date(user.lastCheckIn).toLocaleString()}</p>}
        </div>

        <div className={styles.card}>
          <h2>Activity</h2>
          <div className={styles.statRow}>
            <span>{stats?.checkIns || 0}</span>
            <small>Check-ins</small>
          </div>
          <div className={styles.statRow}>
            <span>{stats?.totalActivities || 0}</span>
            <small>Total activities</small>
          </div>
        </div>

        <div className={styles.card}>
          <h2>Quick Links</h2>
          <div className={styles.links}>
            <Link href="/classes" className={styles.navLink}>Browse Classes</Link>
            <Link href="/trainers" className={styles.navLink}>Our Trainers</Link>
            <Link href="/attendance" className={styles.navLink}>Member Check-In</Link>
            <Link href="/pricing" className={styles.navLink}>Upgrade Membership</Link>
            <Link href="/contact" className={styles.navLink}>Contact Us</Link>
          </div>
        </div>
      </div>

      <div className={styles.logoutBtn}>
        <button className="btn-secondary" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

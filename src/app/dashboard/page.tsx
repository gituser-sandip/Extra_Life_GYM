"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/user/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Welcome to <span>ExtraLife</span> GYM</h1>
        <p>Your personal member dashboard. Track your journey and manage your membership.</p>
      </div>

      <div className={styles.grid}>
        {/* Membership Status */}
        <div className={styles.card}>
          <h2>Membership Status</h2>
          <div className={styles.statValue}>Active</div>
        </div>

        {/* Quick Links */}
        <div className={styles.card}>
          <h2>Quick Links</h2>
          <div className={styles.links}>
            <Link href="/classes" className={styles.navLink}>
              🏋️ Browse Classes
            </Link>
            <Link href="/trainers" className={styles.navLink}>
              👤 Our Trainers
            </Link>
            <Link href="/attendance" className={styles.navLink}>
              ✅ Member Check-In
            </Link>
            <Link href="/pricing" className={styles.navLink}>
              💳 Upgrade Membership
            </Link>
          </div>
        </div>

        {/* Next Steps */}
        <div className={styles.card}>
          <h2>Get Started</h2>
          <div className={styles.links}>
            <Link href="/contact" className={styles.navLink}>
              📬 Contact Us
            </Link>
            <Link href="/classes" className={styles.navLink}>
              📅 Book a Class
            </Link>
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

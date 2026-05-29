"use client";

import Link from "next/link";
import styles from "./FloatingCheckIn.module.css";
import { usePathname } from "next/navigation";

export default function FloatingCheckIn() {
  const pathname = usePathname();

  // Hide the FAB on the attendance page itself or admin pages
  if (pathname === "/attendance" || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <Link href="/attendance" className={styles.fab} aria-label="Member Check-In">
      <div className={styles.icon}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>
      <span className={styles.label}>Check-In</span>
    </Link>
  );
}

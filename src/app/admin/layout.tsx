"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./layout.module.css";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Exclude sidebar on login/signup pages
  if (pathname === "/admin/login" || pathname === "/admin/signup") {
    return <div className={styles.adminLayout}>{children}</div>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          Admin <span>Panel</span>
        </div>
        <nav className={styles.nav}>
          <Link
            href="/admin"
            className={`${styles.navLink} ${pathname === "/admin" ? styles.activeLink : ""}`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/contacts"
            className={`${styles.navLink} ${pathname === "/admin/contacts" ? styles.activeLink : ""}`}
          >
            Contact Submissions
          </Link>
          <Link
            href="/admin/attendance"
            className={`${styles.navLink} ${pathname === "/admin/attendance" ? styles.activeLink : ""}`}
          >
            Attendance Logs
          </Link>
          <Link
            href="/admin/users"
            className={`${styles.navLink} ${pathname === "/admin/users" ? styles.activeLink : ""}`}
          >
            Users Management
          </Link>
          <Link
            href="/admin/admins"
            className={`${styles.navLink} ${pathname === "/admin/admins" ? styles.activeLink : ""}`}
          >
            Admins Management
          </Link>
        </nav>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}

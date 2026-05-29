"use client";

import Link from "next/link";
import styles from "./Navbar.module.css";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const open = menuOpen && menuPath === pathname;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // handle ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    { href: "/classes", label: "Classes" },
    { href: "/trainers", label: "Trainers" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`} aria-label="Main navigation">
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo} aria-label="ExtraLife GYM home">
          ExtraLife <span>GYM</span>
        </Link>

        <button
          className={`${styles.mobileToggle} ${open ? styles.openToggle : ""}`}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => {
            if (!menuOpen) setMenuPath(pathname);
            setMenuOpen((s) => !s);
          }}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className={styles.hamburger} aria-hidden="true"></span>
        </button>

        <div className={styles.links}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${styles.link} ${isActive(l.href) ? styles.active : ""}`}
              aria-current={isActive(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          <Link href="/attendance" className={styles.attendanceBtn}>
            Member Check-In
          </Link>
          <Link href="/pricing" className="btn-primary" aria-label="Join ExtraLife GYM">
            Join Now
          </Link>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${open ? styles.open : ""}`}
        role={open ? "dialog" : undefined}
        aria-modal={open ? true : undefined}
        aria-hidden={!open}
      >
        <div className={styles.mobileContent}>
          <div className={styles.mobileLinks}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`${styles.mobileLink} ${isActive(l.href) ? styles.active : ""}`}
                aria-current={isActive(l.href) ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className={styles.mobileActions}>
            <Link href="/attendance" className={styles.mobileAttendance}>Member Check-In</Link>
            <Link href="/pricing" className="btn-primary" style={{ width: "100%" }}>Join Now</Link>
          </div>
        </div>
        <div className={styles.mobileBackdrop} onClick={() => setMenuOpen(false)} aria-hidden="true"></div>
      </div>
    </nav>
  );
}

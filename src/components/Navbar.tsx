"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Detect authentication status on client side
  useEffect(() => {
    const cookies = document.cookie;
    const loggedIn = /(?:admin_session|user_session)=/.test(cookies);
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = async () => {
    // Attempt to logout both user and admin sessions (ignore errors)
    await fetch('/api/auth/user/logout', { method: 'POST' }).catch(() => {});
    await fetch('/api/auth/admin/logout', { method: 'POST' }).catch(() => {});
    setIsLoggedIn(false);
    router.push('/login');
  };
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
          <div className={styles.logoImageWrapper}>
            <div className={styles.logoImageInner}>
              <Image src="/logo.jpg" alt="Extra Life GYM Logo" fill style={{ objectFit: 'cover' }} sizes="45px" />
            </div>
          </div>
          <div className={styles.logoText}>ExtraLife <span>GYM</span></div>
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
            {isLoggedIn ? (
              <button onClick={handleLogout} className="btn-primary">Logout</button>
            ) : (
              <Link href="/login" className="btn-primary" aria-label="Login / Sign Up">
                Login / Sign Up
              </Link>
            )}
          </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${open ? styles.open : ""}`}
        role={open ? "dialog" : undefined}
        aria-modal={open ? true : undefined}
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
            {isLoggedIn ? (
              <button onClick={handleLogout} className="btn-primary" style={{ width: "100%" }}>Logout</button>
            ) : (
              <Link href="/login" className="btn-primary" style={{ width: "100%" }}>Login / Sign Up</Link>
            )}
          </div>
        </div>
        <div className={styles.mobileBackdrop} onClick={() => setMenuOpen(false)} aria-hidden="true"></div>
      </div>
    </nav>
  );
}

import styles from "./Footer.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <div className={styles.brandLogoContainer}>
            <div className={styles.logoImageWrapper}>
              <div className={styles.logoImageInner}>
                <Image src="/logo.jpg" alt="Extra Life GYM Logo" fill style={{ objectFit: 'cover' }} sizes="45px" />
              </div>
            </div>
            <h2>ExtraLife <span>GYM</span></h2>
          </div>
          <p>Unleash your potential in the most premium fitness environment.</p>
        </div>
        <div className={styles.links}>
          <h3>Quick Links</h3>
          <ul>
            <li><Link href="/classes">Classes</Link></li>
            <li><Link href="/trainers">Trainers</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/attendance">Member Check-In</Link></li>
            <li><Link href="/login">Member Login</Link></li>
            <li><Link href="/signup">Member Sign Up</Link></li>
            <li><Link href="/admin/login">Admin Portal</Link></li>
          </ul>
        </div>
        <div className={styles.contact}>
          <h3>Contact Us</h3>
          <p>123 Neon Street, Cybertown</p>
          <p>info@extralifegym.com</p>
          <p>+1 (555) 123-4567</p>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} ExtraLife GYM. All rights reserved.</p>
      </div>
    </footer>
  );
}

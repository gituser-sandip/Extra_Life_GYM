import styles from "./HeroSection.module.css";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Overlay for readability */}
      <div className={styles.overlay}></div>
      
      <div className={`container ${styles.content}`}>
        <h1 className={styles.headline}>
          ELEVATE YOUR <br />
          <span className={styles.highlight}>FITNESS</span> JOURNEY
        </h1>
        <p className={styles.subheadline}>
          Premium equipment, intense red neon vibes, and expert trainers. 
          Push past your limits at ExtraLife GYM.
        </p>
        <div className={styles.actions}>
          <Link href="/pricing" className="btn-primary">Start Free Trial</Link>
          <Link href="/classes" className="btn-secondary">View Classes</Link>
        </div>
      </div>
      
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <h3>50+</h3>
          <p>Weekly Classes</p>
        </div>
        <div className={styles.statItem}>
          <h3>24/7</h3>
          <p>Access</p>
        </div>
        <div className={styles.statItem}>
          <h3>15+</h3>
          <p>Expert Trainers</p>
        </div>
      </div>
    </section>
  );
}

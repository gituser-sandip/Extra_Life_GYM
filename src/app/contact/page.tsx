"use client";

import Footer from "@/components/Footer";
import styles from "./page.module.css";
import headerStyles from "../classes/page.module.css";
import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <main>
      <div className={headerStyles.header}>
        <div className="container">
              <h1>Get In <span>Touch</span></h1>
              <p>We&apos;re here to answer any questions you have.</p>
        </div>
      </div>
      
      <section className={`container ${styles.contactSection}`}>
        <div className={`glass ${styles.infoCard}`}>
          <h3>Location</h3>
          <p>123 Neon Street<br />Cybertown, CT 90210</p>
          
          <h3 style={{ marginTop: "2rem" }}>Hours</h3>
          <p>Monday - Friday: 5am - 11pm<br />Weekend: 6am - 9pm</p>
          
          <h3 style={{ marginTop: "2rem" }}>Contact</h3>
          <p>Email: info@extralifegym.com<br />Phone: +1 (555) 123-4567</p>
        </div>
        
        <form onSubmit={handleSubmit} className={`glass ${styles.contactForm}`} aria-live="polite">
          <div className={styles.formGroup}>
            <label htmlFor="contact-name">Name</label>
            <input id="contact-name" value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Your Name" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your Email" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="contact-message">Message</label>
            <textarea id="contact-message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help you?" rows={5}></textarea>
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={status === "loading"}>
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>

          {status === "success" && <p className={styles.formStatus} role="status">Thanks! Your message was sent.</p>}
          {status === "error" && <p className={styles.formStatus} role="status" style={{ color: "#FF6B6B" }}>There was an error. Please check your input.</p>}
        </form>
      </section>

      <Footer />
    </main>
  );
}

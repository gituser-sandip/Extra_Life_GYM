"use client";

import Footer from "@/components/Footer";
import styles from "./page.module.css";
import { useState } from "react";

export default function AttendancePage() {
  const [memberId, setMemberId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId.trim()) {
      setStatus("error");
      setMessage("Please enter your member ID.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId }),
      });
      if (!res.ok) {
        throw new Error("Check-in failed");
      }
      setStatus("success");
      setMessage("Check-in successful! Have a great workout.");
      setMemberId("");
    } catch {
      setStatus("error");
      setMessage("Unable to process check-in. Please try again.");
    }
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <main className={styles.main}>
      <div className={styles.attendanceContainer}>
        <div className={`glass ${styles.card}`}>
          <h2>MEMBER <span>CHECK-IN</span></h2>
          <p>Enter your ID to log your attendance.</p>
          
          <form onSubmit={handleCheckIn} className={styles.form}>
            <input 
              type="text" 
              placeholder="Enter Member ID..." 
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className={styles.input}
              disabled={status === "loading" || status === "success"}
            />
            <button 
              type="submit" 
              className={`btn-primary ${styles.btn}`}
              disabled={status === "loading" || status === "success"}
            >
              {status === "loading" ? "Checking In..." : "CHECK IN"}
            </button>
          </form>

          {status === "success" && (
            <div className={styles.successMessage}>
              <div className={styles.checkmark}>✔</div>
              <h3>Check-In Successful!</h3>
              <p>{message}</p>
            </div>
          )}
          {status === "error" && (
            <div className={styles.successMessage}>
              <div className={styles.checkmark} style={{ background: "#FF003C" }}>✖</div>
              <h3>Unable to Check In</h3>
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

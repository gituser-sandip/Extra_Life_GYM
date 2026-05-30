"use client";

import Footer from "@/components/Footer";
import styles from "./page.module.css";
import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

type ScanResult = Array<{ rawValue: string }>;

export default function AttendancePage() {
  const [memberId, setMemberId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const processCheckIn = async (id: string, source: "manual" | "qr" = "manual") => {
    if (!id.trim()) {
      setStatus("error");
      setMessage("Please enter your member ID.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: id, source }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Check-in failed");
      }
      setStatus("success");
      setMessage(`Check-in successful for ${data.memberId}. Have a great workout.`);
      setMemberId("");
      setIsScanning(false);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unable to process check-in. Please try again.");
    }
    setTimeout(() => setStatus("idle"), 3000);
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await processCheckIn(memberId);
  };

  const handleScan = (result: ScanResult) => {
    if (result && result.length > 0) {
      const scannedId = result[0].rawValue;
      setMemberId(scannedId);
      processCheckIn(scannedId, "qr");
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.attendanceContainer}>
        <div className={`glass ${styles.card}`}>
          <h2>MEMBER <span>CHECK-IN</span></h2>
          <p>Scan your QR code or enter your ID manually.</p>
          
          <div className={styles.toggleContainer}>
            <button 
              className={!isScanning ? styles.activeToggle : styles.inactiveToggle}
              onClick={() => setIsScanning(false)}
            >
              Manual Entry
            </button>
            <button 
              className={isScanning ? styles.activeToggle : styles.inactiveToggle}
              onClick={() => setIsScanning(true)}
            >
              Scan QR
            </button>
          </div>

          {isScanning ? (
            <div className={styles.scannerWrapper}>
              <Scanner onScan={handleScan} />
            </div>
          ) : (
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
          )}

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

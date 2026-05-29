import { getContacts, getAttendance } from "@/lib/data";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const contacts = await getContacts();
  const attendances = await getAttendance();

  return (
    <div>
      <header className={styles.header}>
        <h1>Dashboard Overview</h1>
        <p>Welcome to the ExtraLife GYM Admin Panel. Here are your current stats.</p>
      </header>

      <div className={styles.grid}>
        <div className={`glass ${styles.statCard}`}>
          <div className={styles.statTitle}>Total Contact Submissions</div>
          <div className={styles.statValue}>{contacts.length}</div>
        </div>
        <div className={`glass ${styles.statCard}`}>
          <div className={styles.statTitle}>Total Check-Ins</div>
          <div className={styles.statValue}>{attendances.length}</div>
        </div>
      </div>
    </div>
  );
}

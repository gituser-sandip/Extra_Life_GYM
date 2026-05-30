import { getAttendance } from "@/lib/data";
import styles from "../table.module.css";
import pageStyles from "../page.module.css";

export const dynamic = "force-dynamic";

export default async function AdminAttendance() {
  const attendances = await getAttendance();

  return (
    <div>
      <header className={pageStyles.header}>
        <h1>Attendance Logs</h1>
        <p>View recent member check-ins.</p>
      </header>

      <div className={styles.tableContainer}>
        {attendances.length === 0 ? (
          <div className={styles.emptyState}>No attendance records found.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Email</th>
                <th>Source</th>
                <th>Checked In</th>
              </tr>
            </thead>
            <tbody>
              {[...attendances].reverse().map((record, index) => (
                <tr key={record.id || index}>
                  <td>{record.memberId}</td>
                  <td>{record.email || "Unknown"}</td>
                  <td>{record.source || "manual"}</td>
                  <td>{record.timestamp ? new Date(record.timestamp).toLocaleString() : "Unknown"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

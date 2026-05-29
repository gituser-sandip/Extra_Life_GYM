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
              </tr>
            </thead>
            <tbody>
              {attendances.map((record: any, index: number) => (
                <tr key={index}>
                  <td>{record.memberId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

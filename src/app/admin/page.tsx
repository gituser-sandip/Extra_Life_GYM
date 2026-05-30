import Link from "next/link";
import { getActivities, getAttendance, getContacts, getUsers } from "@/lib/data";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

function formatDate(value?: string) {
  if (!value) return "No activity yet";
  return new Date(value).toLocaleString();
}

export default async function AdminDashboard() {
  const [contacts, attendances, users, activities] = await Promise.all([
    getContacts(),
    getAttendance(),
    getUsers(),
    getActivities(),
  ]);

  const activeMembers = users.filter((user) => user.status === "Active").length;
  const suspendedMembers = users.filter((user) => user.status === "Suspended").length;
  const recentCheckIns = [...attendances]
    .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
    .slice(0, 5);
  const recentActivity = [...activities]
    .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
    .slice(0, 5);
  const lastCheckIn = recentCheckIns[0]?.timestamp;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Dashboard Overview</h1>
          <p>Monitor members, check-ins, messages, and account health from one place.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/admin/users" className="btn-primary">Manage Users</Link>
          <Link href="/admin/attendance" className="btn-secondary">Attendance</Link>
        </div>
      </header>

      <section className={styles.grid} aria-label="Admin stats">
        <div className={`glass ${styles.statCard}`}>
          <div className={styles.statTitle}>Total Members</div>
          <div className={styles.statValue}>{users.length}</div>
          <div className={styles.statMeta}>{activeMembers} active, {suspendedMembers} suspended</div>
        </div>
        <div className={`glass ${styles.statCard}`}>
          <div className={styles.statTitle}>Total Check-Ins</div>
          <div className={styles.statValue}>{attendances.length}</div>
          <div className={styles.statMeta}>Latest: {formatDate(lastCheckIn)}</div>
        </div>
        <div className={`glass ${styles.statCard}`}>
          <div className={styles.statTitle}>Contact Messages</div>
          <div className={styles.statValue}>{contacts.length}</div>
          <div className={styles.statMeta}>Review inquiries from prospective members</div>
        </div>
        <div className={`glass ${styles.statCard}`}>
          <div className={styles.statTitle}>Tracked Activity</div>
          <div className={styles.statValue}>{activities.length}</div>
          <div className={styles.statMeta}>Member actions recorded by the system</div>
        </div>
      </section>

      <section className={styles.panels}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Recent Check-Ins</h2>
            <Link href="/admin/attendance">View all</Link>
          </div>
          {recentCheckIns.length === 0 ? (
            <div className={styles.empty}>No check-ins recorded yet.</div>
          ) : (
            <div className={styles.list}>
              {recentCheckIns.map((record, index) => (
                <div className={styles.listItem} key={record.id || `${record.memberId}-${index}`}>
                  <div>
                    <strong>{record.memberId}</strong>
                    <span>{record.email || "Unknown member"}</span>
                  </div>
                  <time>{formatDate(record.timestamp)}</time>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Recent Activity</h2>
            <Link href="/admin/users">Open users</Link>
          </div>
          {recentActivity.length === 0 ? (
            <div className={styles.empty}>No activity has been recorded yet.</div>
          ) : (
            <div className={styles.list}>
              {recentActivity.map((activity) => (
                <div className={styles.listItem} key={activity.id}>
                  <div>
                    <strong>{activity.type}</strong>
                    <span>{activity.email}</span>
                  </div>
                  <time>{formatDate(activity.timestamp)}</time>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

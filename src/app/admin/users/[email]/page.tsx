"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";

type Activity = {
  id: string;
  type: string;
  timestamp: string;
  details?: Record<string, string>;
};

type User = {
  email: string;
  name: string;
  status: string;
  tier: string;
  createdAt?: string;
};

const TIER_COLORS: Record<string, string> = {
  Basic: "#aaa",
  Silver: "silver",
  Gold: "gold",
  Platinum: "#64c8ff",
};

const ACTIVITY_ICONS: Record<string, string> = {
  "Check-In": "🏋️",
  "Purchase": "💳",
  "Profile-Update": "✏️",
  "Class-Attendance": "📅",
};

export default function UserDetailPage() {
  const { email } = useParams<{ email: string }>();
  const router = useRouter();
  const decoded = decodeURIComponent(email);

  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");

  const fetchData = useCallback(async () => {
    const [usersRes, actRes] = await Promise.all([
      fetch("/api/admin/users-list"),
      fetch(`/api/user/activities?email=${encodeURIComponent(decoded)}`),
    ]);
    const { users } = await usersRes.json();
    const found = (users || []).find((u: User) => u.email === decoded);
    setUser(found || null);

    const actData = await actRes.json();
    setActivities(actData.activities || []);
    setLoading(false);
  }, [decoded]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchData]);

  const activityTypes = ["All", ...Array.from(new Set(activities.map((a) => a.type)))];
  const filtered = filterType === "All" ? activities : activities.filter((a) => a.type === filterType);

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.spinner} />
      Loading member data...
    </div>
  );

  if (!user) return (
    <div className={styles.loading}>
      <p>Member not found.</p>
      <button onClick={() => router.back()} className={styles.backBtn}>← Go Back</button>
    </div>
  );

  return (
    <div className={styles.page}>
      <button onClick={() => router.back()} className={styles.backBtn}>← Back to Users</button>

      {/* Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.avatarLarge}>
          {(user.name || user.email)[0].toUpperCase()}
        </div>
        <div className={styles.profileInfo}>
          <h1 className={styles.name}>{user.name || user.email}</h1>
          <p className={styles.emailText}>{user.email}</p>
          <div className={styles.badges}>
            <span className={styles.badge} style={{ color: TIER_COLORS[user.tier] || "#aaa", borderColor: TIER_COLORS[user.tier] || "#aaa" }}>
              {user.tier || "Basic"} Member
            </span>
            <span className={`${styles.badge} ${user.status === "Active" ? styles.activeBadge : styles.suspendedBadge}`}>
              {user.status || "Active"}
            </span>
          </div>
        </div>
        <div className={styles.profileStats}>
          <div className={styles.profileStat}>
            <div className={styles.profileStatValue}>{activities.length}</div>
            <div className={styles.profileStatLabel}>Total Activities</div>
          </div>
          <div className={styles.profileStat}>
            <div className={styles.profileStatValue}>
              {activities.filter((a) => a.type === "Check-In").length}
            </div>
            <div className={styles.profileStatLabel}>Check-Ins</div>
          </div>
          <div className={styles.profileStat}>
            <div className={styles.profileStatValue}>
              {activities.filter((a) => a.type === "Class-Attendance").length}
            </div>
            <div className={styles.profileStatLabel}>Classes</div>
          </div>
          <div className={styles.profileStat}>
            <div className={styles.profileStatValue}>
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
            </div>
            <div className={styles.profileStatLabel}>Joined</div>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className={styles.activitySection}>
        <div className={styles.activityHeader}>
          <h2 className={styles.sectionTitle}>Activity Log</h2>
          <div className={styles.filterTabs}>
            {activityTypes.map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`${styles.filterTab} ${filterType === t ? styles.activeTab : ""}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>No activity recorded yet.</div>
        ) : (
          <div className={styles.timeline}>
            {[...filtered].reverse().map((act) => (
              <div key={act.id} className={styles.timelineItem}>
                <div className={styles.timelineIcon}>
                  {ACTIVITY_ICONS[act.type] || "📌"}
                </div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineTitle}>{act.type}</div>
                  {act.details && Object.keys(act.details).length > 0 && (
                    <div className={styles.timelineDetails}>
                      {Object.entries(act.details).map(([k, v]) => (
                        <span key={k} className={styles.detailChip}>
                          {k}: <strong>{v}</strong>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className={styles.timelineTime}>
                  {new Date(act.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

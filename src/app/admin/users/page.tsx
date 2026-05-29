"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import styles from "./page.module.css";

type User = {
  email: string;
  name: string;
  status: string;
  tier: string;
  createdAt?: string;
};

const TIERS = ["Basic", "Silver", "Gold", "Platinum"];
const STATUSES = ["Active", "Suspended"];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users-list");
    const data = await res.json();
    setUsers(data.users || []);
    setIsSuperAdmin(data.isSuperAdmin || false);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUser = async (email: string, field: "status" | "tier", value: string) => {
    setSaving(email);
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, [field]: value }),
    });
    setUsers((prev) =>
      prev.map((u) => (u.email === email ? { ...u, [field]: value } : u))
    );
    setSaving(null);
  };

  const deleteUser = async (email: string) => {
    if (!confirm(`Delete user ${email}? This cannot be undone.`)) return;
    await fetch(`/api/admin/users/${encodeURIComponent(email)}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u.email !== email));
  };

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>User Management</h1>
          <p className={styles.subtitle}>Manage member accounts, tiers & statuses</p>
        </div>
        <div className={styles.stats}>
          <span className={styles.statBadge}>{users.length} Total Members</span>
          <span className={`${styles.statBadge} ${styles.active}`}>
            {users.filter((u) => u.status === "Active").length} Active
          </span>
        </div>
      </header>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          Loading members...
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>No members found.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Member</th>
                <th>Email</th>
                <th>Tier</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.email} className={saving === user.email ? styles.saving : ""}>
                  <td>
                    <div className={styles.memberCell}>
                      <div className={styles.avatar}>
                        {(user.name || user.email)[0].toUpperCase()}
                      </div>
                      <span>{user.name || "—"}</span>
                    </div>
                  </td>
                  <td className={styles.email}>{user.email}</td>
                  <td>
                    <select
                      className={`${styles.select} ${styles[user.tier?.toLowerCase() || "basic"]}`}
                      value={user.tier || "Basic"}
                      onChange={(e) => updateUser(user.email, "tier", e.target.value)}
                    >
                      {TIERS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      className={`${styles.select} ${user.status === "Active" ? styles.activeSelect : styles.suspendedSelect}`}
                      value={user.status || "Active"}
                      onChange={(e) => updateUser(user.email, "status", e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className={styles.date}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/admin/users/${encodeURIComponent(user.email)}`} className={styles.viewBtn}>
                        View
                      </Link>
                      {isSuperAdmin && (
                        <button onClick={() => deleteUser(user.email)} className={styles.deleteBtn}>
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

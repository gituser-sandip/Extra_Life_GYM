"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import styles from "./page.module.css";

type User = {
  email: string;
  name?: string;
  memberId: string;
  status: string;
  tier: string;
  createdAt?: string;
  lastCheckIn?: string;
};

const TIERS = ["Basic", "Silver", "Gold", "Platinum"];
const STATUSES = ["Active", "Suspended"];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    memberId: "",
    tier: "Basic",
    status: "Active",
  });

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users-list");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to load members.");
      setUsers(data.users || []);
      setIsSuperAdmin(data.isSuperAdmin || false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load members.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchUsers();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchUsers]);

  const updateUser = async (email: string, field: "status" | "tier", value: string) => {
    setSaving(email);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, [field]: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to save member.");
      setUsers((prev) =>
        prev.map((user) => (user.email === email ? { ...user, [field]: value } : user))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save member.");
    } finally {
      setSaving(null);
    }
  };

  const openEdit = (user: User) => {
    setError("");
    setEditing(user);
    setEditForm({
      name: user.name || "",
      email: user.email,
      memberId: user.memberId || "",
      tier: user.tier || "Basic",
      status: user.status || "Active",
    });
  };

  const saveEdit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;

    setSaving(editing.email);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(editing.email)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to update member.");

      setUsers((prev) =>
        prev.map((user) => (user.email === editing.email ? data.user : user))
      );
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update member.");
    } finally {
      setSaving(null);
    }
  };

  const deleteUser = async (email: string) => {
    if (!confirm(`Delete user ${email}? This cannot be undone.`)) return;
    setError("");
    const res = await fetch(`/api/admin/users/${encodeURIComponent(email)}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Unable to delete member.");
      return;
    }
    setUsers((prev) => prev.filter((user) => user.email !== email));
  };

  const filtered = users.filter(
    (user) =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.memberId?.toLowerCase().includes(search.toLowerCase()) ||
      user.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>User Management</h1>
          <p className={styles.subtitle}>Edit member accounts, IDs, tiers, and access status.</p>
        </div>
        <div className={styles.stats}>
          <span className={styles.statBadge}>{users.length} Total Members</span>
          <span className={`${styles.statBadge} ${styles.active}`}>
            {users.filter((user) => user.status === "Active").length} Active
          </span>
          <span className={`${styles.statBadge} ${styles.suspended}`}>
            {users.filter((user) => user.status === "Suspended").length} Suspended
          </span>
        </div>
      </header>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          type="text"
          placeholder="Search by name, email, or member ID..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}

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
                <th>Member ID</th>
                <th>Email</th>
                <th>Tier</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Last Check-In</th>
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
                      <span>{user.name || "No name"}</span>
                    </div>
                  </td>
                  <td className={styles.memberId}>{user.memberId || "Missing"}</td>
                  <td className={styles.email}>{user.email}</td>
                  <td>
                    <select
                      className={`${styles.select} ${styles[user.tier?.toLowerCase() || "basic"]}`}
                      value={user.tier || "Basic"}
                      onChange={(event) => updateUser(user.email, "tier", event.target.value)}
                    >
                      {TIERS.map((tier) => (
                        <option key={tier} value={tier}>{tier}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      className={`${styles.select} ${user.status === "Active" ? styles.activeSelect : styles.suspendedSelect}`}
                      value={user.status || "Active"}
                      onChange={(event) => updateUser(user.email, "status", event.target.value)}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className={styles.date}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                  </td>
                  <td className={styles.date}>
                    {user.lastCheckIn ? new Date(user.lastCheckIn).toLocaleDateString() : "Never"}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/admin/users/${encodeURIComponent(user.email)}`} className={styles.viewBtn}>
                        View
                      </Link>
                      <button onClick={() => openEdit(user)} className={styles.editBtn}>
                        Edit
                      </button>
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

      {editing && (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={() => setEditing(null)}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="edit-user-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 id="edit-user-title">Edit Member</h2>
                <p>Update profile fields, membership level, and account access.</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setEditing(null)} aria-label="Close edit dialog">
                x
              </button>
            </div>

            <form className={styles.editForm} onSubmit={saveEdit}>
              <label>
                <span>Name</span>
                <input
                  value={editForm.name}
                  onChange={(event) => setEditForm((form) => ({ ...form, name: event.target.value }))}
                  placeholder="Member name"
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(event) => setEditForm((form) => ({ ...form, email: event.target.value }))}
                  required
                />
              </label>

              <label>
                <span>Member ID</span>
                <input
                  value={editForm.memberId}
                  onChange={(event) => setEditForm((form) => ({ ...form, memberId: event.target.value }))}
                  required
                />
              </label>

              <div className={styles.formGrid}>
                <label>
                  <span>Tier</span>
                  <select
                    value={editForm.tier}
                    onChange={(event) => setEditForm((form) => ({ ...form, tier: event.target.value }))}
                  >
                    {TIERS.map((tier) => (
                      <option key={tier} value={tier}>{tier}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Status</span>
                  <select
                    value={editForm.status}
                    onChange={(event) => setEditForm((form) => ({ ...form, status: event.target.value }))}
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setEditing(null)}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn} disabled={saving === editing.email}>
                  {saving === editing.email ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

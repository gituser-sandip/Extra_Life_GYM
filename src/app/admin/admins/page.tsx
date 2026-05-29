"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";

type Admin = {
  email: string;
  name?: string;
  role: string;
};

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/admins-list");
    const data = await res.json();
    setAdmins(data.admins || []);
    setIsSuperAdmin(data.isSuperAdmin || false);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const changeRole = async (email: string, role: string) => {
    setSaving(email);
    setMsg(null);
    const res = await fetch("/api/admin/promote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });
    const data = await res.json();
    if (res.ok) {
      setAdmins((prev) => prev.map((a) => (a.email === email ? { ...a, role } : a)));
      setMsg({ text: `Role updated for ${email}`, ok: true });
    } else {
      setMsg({ text: data.error || "Failed to update role", ok: false });
    }
    setSaving(null);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin Management</h1>
          <p className={styles.subtitle}>Promote or demote admin roles (Super Admin only)</p>
        </div>
      </header>

      {msg && (
        <div className={`${styles.toast} ${msg.ok ? styles.toastOk : styles.toastErr}`}>
          {msg.text}
        </div>
      )}

      {!isSuperAdmin && (
        <div className={styles.notice}>
          ⚠️ Only Super Admins can change roles. You are viewing in read-only mode.
        </div>
      )}

      {loading ? (
        <div className={styles.loading}><div className={styles.spinner} /> Loading admins...</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Admin</th>
                <th>Email</th>
                <th>Current Role</th>
                {isSuperAdmin && <th>Change Role</th>}
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.email} className={saving === admin.email ? styles.saving : ""}>
                  <td>
                    <div className={styles.memberCell}>
                      <div className={`${styles.avatar} ${admin.role === "super" ? styles.superAvatar : ""}`}>
                        {(admin.name || admin.email)[0].toUpperCase()}
                      </div>
                      <span>{admin.name || "—"}</span>
                    </div>
                  </td>
                  <td className={styles.email}>{admin.email}</td>
                  <td>
                    <span className={`${styles.roleBadge} ${admin.role === "super" ? styles.superBadge : styles.adminBadge}`}>
                      {admin.role === "super" ? "⭐ Super Admin" : "Admin"}
                    </span>
                  </td>
                  {isSuperAdmin && (
                    <td>
                      <div className={styles.roleActions}>
                        {admin.role !== "super" ? (
                          <button
                            className={styles.promoteBtn}
                            onClick={() => changeRole(admin.email, "super")}
                          >
                            Promote to Super
                          </button>
                        ) : (
                          <button
                            className={styles.demoteBtn}
                            onClick={() => changeRole(admin.email, "admin")}
                          >
                            Demote to Admin
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

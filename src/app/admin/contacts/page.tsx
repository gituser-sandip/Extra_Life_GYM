import { getContacts } from "@/lib/data";
import styles from "../table.module.css";
import pageStyles from "../page.module.css";

export const dynamic = "force-dynamic";

type ContactSubmission = {
  name?: string;
  email?: string;
  message?: string;
};

export default async function AdminContacts() {
  const contacts = await getContacts() as ContactSubmission[];

  return (
    <div>
      <header className={pageStyles.header}>
        <h1>Contact Submissions</h1>
        <p>Review messages from prospective members.</p>
      </header>

      <div className={styles.tableContainer}>
        {contacts.length === 0 ? (
          <div className={styles.emptyState}>No contact submissions found.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, index) => (
                <tr key={index}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

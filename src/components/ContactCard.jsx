/**
 * components/ContactCard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Displays a single contact. Emits onEdit / onDelete events.
 */

import { FiMail, FiPhone, FiBriefcase, FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from './ContactCard.module.css';

/** Avatar initials — picks first letter of each word, max 2 */
const initials = (name = '') =>
  name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');

/** Deterministic hue from string */
const hue = (str = '') => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffff;
  return h % 360;
};

export default function ContactCard({ contact, onEdit, onDelete, deleting }) {
  const h = hue(contact.name);

  return (
    <article className={styles.card}>
      {/* Avatar */}
      <div
        className={styles.avatar}
        style={{ '--hue': h }}
        aria-hidden="true"
      >
        {initials(contact.name)}
      </div>

      {/* Info */}
      <div className={styles.info}>
        <h3 className={styles.name}>{contact.name}</h3>
        {contact.company && (
          <span className={styles.company}>
            <FiBriefcase size={12} /> {contact.company}
          </span>
        )}
        <a href={`mailto:${contact.email}`} className={styles.detail}>
          <FiMail size={13} /> {contact.email}
        </a>
        {contact.phone && (
          <a href={`tel:${contact.phone}`} className={styles.detail}>
            <FiPhone size={13} /> {contact.phone}
          </a>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${styles.editBtn}`}
          onClick={() => onEdit(contact)}
          aria-label={`Edit ${contact.name}`}
        >
          <FiEdit2 size={15} />
        </button>
        <button
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
          onClick={() => onDelete(contact.id)}
          disabled={deleting}
          aria-label={`Delete ${contact.name}`}
        >
          {deleting ? <span className={styles.spinner} /> : <FiTrash2 size={15} />}
        </button>
      </div>
    </article>
  );
}

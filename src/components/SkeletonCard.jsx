/**
 * components/SkeletonCard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Loading skeleton that mimics the ContactCard layout.
 * Rendered while API call is in-flight.
 */

import styles from './SkeletonCard.module.css';

export default function SkeletonCard() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.avatar} />
      <div className={styles.info}>
        <div className={`${styles.line} ${styles.name}`}   />
        <div className={`${styles.line} ${styles.email}`}  />
        <div className={`${styles.line} ${styles.phone}`}  />
      </div>
      <div className={styles.actions}>
        <div className={styles.btn} />
        <div className={styles.btn} />
      </div>
    </div>
  );
}

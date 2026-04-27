/**
 * components/ErrorBanner.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Shown when a persistent error exists (e.g. backend down).
 * Offers a Retry button.
 */

import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import styles from './ErrorBanner.module.css';

export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className={styles.banner} role="alert">
      <FiAlertCircle size={22} className={styles.icon} />
      <div className={styles.body}>
        <p className={styles.title}>Something went wrong</p>
        <p className={styles.msg}>{message}</p>
      </div>
      {onRetry && (
        <button className={styles.retryBtn} onClick={onRetry}>
          <FiRefreshCw size={14} /> Retry
        </button>
      )}
    </div>
  );
}

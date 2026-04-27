/**
 * components/ContactForm.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable Add / Edit form modal.
 * Receives `contact` prop when editing (pre-fills fields), null for new.
 * Calls onSubmit(data) → parent decides create vs update.
 */

import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiX, FiSave } from 'react-icons/fi';
import styles from './ContactForm.module.css';

// ── Field-level validation rules ──────────────────────────────────────────────
const validate = (fields) => {
  const errs = {};
  if (!fields.name.trim())            errs.name    = 'Full name is required.';
  if (!/\S+@\S+\.\S+/.test(fields.email)) errs.email = 'Enter a valid email.';
  if (fields.phone && !/^[0-9+\-() ]{7,15}$/.test(fields.phone))
    errs.phone = 'Enter a valid phone number.';
  return errs;
};

const EMPTY = { name: '', email: '', phone: '', company: '' };

export default function ContactForm({ contact = null, onSubmit, onCancel, loading }) {
  const [fields, setFields]   = useState(EMPTY);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  // Pre-fill when editing
  useEffect(() => {
    if (contact) {
      setFields({
        name:    contact.name    ?? '',
        email:   contact.email   ?? '',
        phone:   contact.phone   ?? '',
        company: contact.company ?? '',
      });
    } else {
      setFields(EMPTY);
    }
    setErrors({});
    setTouched({});
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Revalidate on change if field was already touched
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, ...validate({ ...fields, [name]: value }) }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate({ ...fields, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mark all as touched to show all errors
    setTouched({ name: true, email: true, phone: true });
    const errs = validate(fields);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const result = await onSubmit(fields);
    if (result?.success) {
      setFields(EMPTY);
      setTouched({});
    }
  };

  const isEdit = Boolean(contact);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Contact form">
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{isEdit ? 'Edit Contact' : 'Add New Contact'}</h2>
          <button className={styles.closeBtn} onClick={onCancel} aria-label="Close">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          {/* Name */}
          <Field
            icon={<FiUser />}
            label="Full Name"
            name="name"
            type="text"
            placeholder="Jane Smith"
            value={fields.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name && errors.name}
            required
          />
          {/* Email */}
          <Field
            icon={<FiMail />}
            label="Email"
            name="email"
            type="email"
            placeholder="jane@example.com"
            value={fields.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && errors.email}
            required
          />
          {/* Phone */}
          <Field
            icon={<FiPhone />}
            label="Phone"
            name="phone"
            type="tel"
            placeholder="+1 555 000 0000"
            value={fields.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.phone && errors.phone}
          />
          {/* Company */}
          <Field
            icon={<FiBriefcase />}
            label="Company"
            name="company"
            type="text"
            placeholder="Acme Corp"
            value={fields.company}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {/* Actions */}
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : <FiSave size={16} />}
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Reusable field atom ───────────────────────────────────────────────────────
function Field({ icon, label, name, error, required, ...rest }) {
  return (
    <div className={styles.fieldGroup}>
      <label htmlFor={`field-${name}`} className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <div className={`${styles.inputWrapper} ${error ? styles.hasError : ''}`}>
        <span className={styles.inputIcon} aria-hidden="true">{icon}</span>
        <input id={`field-${name}`} name={name} className={styles.input} {...rest} />
      </div>
      {error && <p className={styles.errorMsg} role="alert">{error}</p>}
    </div>
  );
}

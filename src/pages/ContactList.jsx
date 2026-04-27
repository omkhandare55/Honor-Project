/**
 * pages/ContactList.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Main page — lists all contacts, search bar, add/edit modal, delete confirm.
 *
 * DATA FLOW:
 *   useContacts() ──► contacts[]  ──► renders ContactCard grid
 *                 └──► loading    ──► shows SkeletonCard × 6
 *                 └──► error      ──► shows ErrorBanner
 *
 * MODAL STATE (local):
 *   formOpen      — whether the form modal is visible
 *   editingContact— contact being edited (null = new)
 */

import { useState } from 'react';
import {
  FiPlus, FiSearch, FiUsers, FiXCircle,
} from 'react-icons/fi';
import { useContacts }  from '../hooks/useContacts';
import ContactCard      from '../components/ContactCard';
import ContactForm      from '../components/ContactForm';
import SkeletonCard     from '../components/SkeletonCard';
import ErrorBanner      from '../components/ErrorBanner';
import styles           from './ContactList.module.css';

export default function ContactList() {
  const {
    contacts,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    refresh,
    createContact,
    editContact,
    removeContact,
  } = useContacts();

  // ── Local UI state (modal) ────────────────────────────────────────────────
  const [formOpen,        setFormOpen]        = useState(false);
  const [editingContact,  setEditingContact]  = useState(null);
  const [formLoading,     setFormLoading]     = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const openAdd = () => { setEditingContact(null); setFormOpen(true); };

  const openEdit = (contact) => { setEditingContact(contact); setFormOpen(true); };

  const closeForm = () => { setFormOpen(false); setEditingContact(null); };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    const result = editingContact
      ? await editContact(editingContact.id, data)
      : await createContact(data);
    setFormLoading(false);
    if (result.success) closeForm();
    return result;
  };

  // ── Render helpers ────────────────────────────────────────────────────────
  const renderGrid = () => {
    if (loading) {
      return (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }

    if (contacts.length === 0) {
      return (
        <div className={styles.empty}>
          <FiUsers size={48} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>
            {searchQuery ? 'No contacts match your search.' : 'No contacts yet.'}
          </p>
          {!searchQuery && (
            <button className={styles.emptyAction} onClick={openAdd}>
              <FiPlus size={16} /> Add your first contact
            </button>
          )}
          {searchQuery && (
            <button className={styles.emptyAction} onClick={() => setSearchQuery('')}>
              <FiXCircle size={16} /> Clear search
            </button>
          )}
        </div>
      );
    }

    return (
      <div className={styles.grid}>
        {contacts.map((c) => (
          <ContactCard
            key={c.id}
            contact={c}
            onEdit={openEdit}
            onDelete={removeContact}
          />
        ))}
      </div>
    );
  };

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <main className={styles.page}>
      {/* ── Hero header ── */}
      <header className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            Contacts <span className={styles.heroAccent}>Manager</span>
          </h1>
          <p className={styles.heroSub}>
            {loading
              ? 'Loading…'
              : `${contacts.length} contact${contacts.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button className={styles.addBtn} onClick={openAdd} id="btn-add-contact">
          <FiPlus size={18} /> New Contact
        </button>
      </header>

      {/* ── Search bar ── */}
      <div className={styles.searchWrap}>
        <FiSearch className={styles.searchIcon} size={16} />
        <input
          id="contact-search"
          className={styles.searchInput}
          type="search"
          placeholder="Search by name, email or company…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search contacts"
        />
        {searchQuery && (
          <button
            className={styles.clearSearch}
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            <FiXCircle size={16} />
          </button>
        )}
      </div>

      {/* ── Error banner (persistent errors e.g. network down) ── */}
      {error && !loading && <ErrorBanner message={error} onRetry={refresh} />}

      {/* ── Contact grid / skeletons / empty state ── */}
      {renderGrid()}

      {/* ── Form modal ── */}
      {formOpen && (
        <ContactForm
          contact={editingContact}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
          loading={formLoading}
        />
      )}
    </main>
  );
}

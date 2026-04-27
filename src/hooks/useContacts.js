/**
 * hooks/useContacts.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Custom hook that owns ALL contact state + async logic.
 * Components stay thin — they just call hook methods and render.
 *
 * Exported state:
 *   contacts      — current list displayed
 *   loading       — true while fetching
 *   error         — error message or null
 *   searchQuery   — controlled search string
 *   setSearchQuery— updates search + triggers debounced API call
 *
 * Exported actions:
 *   refresh()             — re-fetches full list
 *   createContact(data)   — POST + optimistic UI update
 *   editContact(id, data) — PUT  + optimistic UI update
 *   removeContact(id)     — DELETE + optimistic UI update
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  getAllContacts,
  addContact,
  updateContact,
  deleteContact,
  searchContacts,
} from '../services/api';

// Debounce delay for search (ms)
const SEARCH_DEBOUNCE = 400;

export function useContacts() {
  const [contacts, setContacts]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Abort controller ref — cancels in-flight search on new keystroke
  const abortRef = useRef(null);
  // Debounce timer ref
  const debounceRef = useRef(null);

  // ── Fetch all contacts ────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllContacts();
      setContacts(data);
    } catch (err) {
      const msg = err.friendlyMessage ?? err.message;
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Debounced search ──────────────────────────────────────────────────────
  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (!searchQuery.trim()) {
      fetchAll();
      return;
    }

    debounceRef.current = setTimeout(async () => {
      // Cancel previous in-flight search
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      setError(null);
      try {
        const { data } = await searchContacts(searchQuery.trim(), abortRef.current.signal);
        setContacts(data);
      } catch (err) {
        if (err.name === 'CanceledError') return; // expected — user typed again
        const msg = err.friendlyMessage ?? err.message;
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }, SEARCH_DEBOUNCE);

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery, fetchAll]);

  // ── CREATE ────────────────────────────────────────────────────────────────
  const createContact = useCallback(async (formData) => {
    const toastId = toast.loading('Adding contact…');
    try {
      const { data: created } = await addContact(formData);
      // Optimistically append — no full re-fetch needed
      setContacts((prev) => [created, ...prev]);
      toast.success('Contact added!', { id: toastId });
      return { success: true };
    } catch (err) {
      const msg = err.friendlyMessage ?? err.message;
      toast.error(msg, { id: toastId });
      return { success: false, error: msg };
    }
  }, []);

  // ── UPDATE ────────────────────────────────────────────────────────────────
  const editContact = useCallback(async (id, formData) => {
    const toastId = toast.loading('Saving changes…');
    try {
      const { data: updated } = await updateContact(id, formData);
      // Swap the old entry in place
      setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
      toast.success('Contact updated!', { id: toastId });
      return { success: true };
    } catch (err) {
      const msg = err.friendlyMessage ?? err.message;
      toast.error(msg, { id: toastId });
      return { success: false, error: msg };
    }
  }, []);

  // ── DELETE ────────────────────────────────────────────────────────────────
  const removeContact = useCallback(async (id) => {
    // Optimistic removal — feels instant
    setContacts((prev) => prev.filter((c) => c.id !== id));
    const toastId = toast.loading('Deleting…');
    try {
      await deleteContact(id);
      toast.success('Contact deleted.', { id: toastId });
    } catch (err) {
      // Rollback on failure
      fetchAll();
      const msg = err.friendlyMessage ?? err.message;
      toast.error(msg, { id: toastId });
    }
  }, [fetchAll]);

  return {
    contacts,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    refresh: fetchAll,
    createContact,
    editContact,
    removeContact,
  };
}

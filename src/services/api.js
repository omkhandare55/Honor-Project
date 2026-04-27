/**
 * services/api.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralised Axios instance + all Contact API methods.
 *
 * WHY A SEPARATE FILE?
 *   • Single place to change the base URL (staging vs production)
 *   • Interceptors applied once, work everywhere
 *   • Easy to mock in tests
 *
 * BASEURL STRATEGY (two options — pick one):
 *   Option A (Vite proxy, recommended for dev):
 *     baseURL = '/api/contacts'
 *     Vite forwards /api/* → http://localhost:8080/api/* — zero CORS issues
 *
 *   Option B (direct, good for prod / when CORS is configured on Spring Boot):
 *     baseURL = 'http://localhost:8080/api/contacts'
 */

import axios from 'axios';

// ─── 1. Axios Instance ────────────────────────────────────────────────────────
const apiClient = axios.create({
  // Using Option A: let Vite proxy handle forwarding (no CORS headaches in dev)
  baseURL: '/api/contacts',
  timeout: 10_000,               // fail fast if backend is down (10 s)
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── 2. Request Interceptor ───────────────────────────────────────────────────
// Runs before EVERY outgoing request.
// Good place to attach auth tokens: apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
apiClient.interceptors.request.use(
  (config) => {
    // 🔑 Attach JWT if present (uncomment when auth is wired up)
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    if (import.meta.env.DEV) {
      console.log(
        `%c⬆ ${config.method?.toUpperCase()} ${config.baseURL}${config.url ?? ''}`,
        'color:#89b4fa;font-weight:600',
        config.data ?? '',
      );
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── 3. Response Interceptor ──────────────────────────────────────────────────
// Runs after EVERY response — success AND error paths.
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(
        `%c⬇ ${response.status} ${response.config.url}`,
        'color:#a6e3a1;font-weight:600',
        response.data,
      );
    }
    return response;
  },
  (error) => {
    // ── Classify the error ──────────────────────────────────────────────────
    if (!error.response) {
      // Network error / backend not running / CORS block before response
      console.error('[API] Network error — is Spring Boot running?', error.message);
      return Promise.reject(new Error('Unable to reach the server. Is the backend running?'));
    }

    const { status, data } = error.response;

    // Friendly messages per HTTP status
    const messages = {
      400: data?.message ?? 'Invalid request data.',
      401: 'Session expired — please log in again.',
      403: 'You do not have permission to do this.',
      404: 'Resource not found.',
      409: data?.message ?? 'A conflict occurred (duplicate entry?).',
      422: data?.message ?? 'Validation failed on the server.',
      500: 'Internal server error. Please try again later.',
      503: 'Service temporarily unavailable.',
    };

    const friendly = messages[status] ?? `Unexpected error (${status}).`;
    console.error(`[API] ${status} →`, friendly, data);

    // Attach friendly message so callers can display it directly
    error.friendlyMessage = friendly;
    return Promise.reject(error);
  },
);

// ─── 4. API Methods ───────────────────────────────────────────────────────────

/**
 * GET /api/contacts
 * Returns the full list of contacts.
 */
export const getAllContacts = () => apiClient.get('/');

/**
 * GET /api/contacts/search?query=…
 * Full-text search delegated to the backend.
 * Uses AbortController so in-flight requests can be cancelled on re-type.
 *
 * @param {string} query
 * @param {AbortSignal} [signal]  — pass controller.signal for cancellation
 */
export const searchContacts = (query, signal) =>
  apiClient.get('/search', { params: { query }, signal });

/**
 * GET /api/contacts/:id
 */
export const getContactById = (id) => apiClient.get(`/${id}`);

/**
 * POST /api/contacts
 * @param {{ name: string, email: string, phone?: string, company?: string }} data
 */
export const addContact = (data) => apiClient.post('/', data);

/**
 * PUT /api/contacts/:id
 * Full replace — send the complete contact object.
 * @param {number|string} id
 * @param {object} data
 */
export const updateContact = (id, data) => apiClient.put(`/${id}`, data);

/**
 * DELETE /api/contacts/:id
 */
export const deleteContact = (id) => apiClient.delete(`/${id}`);

// Export the raw instance for edge cases (e.g. file upload with multipart)
export default apiClient;

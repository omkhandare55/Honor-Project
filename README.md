# Contacts Manager — React + Spring Boot

A production-quality full-stack contacts management app connecting a **React (Vite)** frontend to a **Spring Boot** backend.

---

## Project Structure

```
src/
├── services/
│   └── api.js              # Axios instance + all API methods (SINGLE SOURCE OF TRUTH)
├── hooks/
│   └── useContacts.js      # Custom hook — owns all contact state & async logic
├── components/
│   ├── ContactCard.jsx     # Single contact display card
│   ├── ContactForm.jsx     # Add / Edit modal form (reusable)
│   ├── SkeletonCard.jsx    # Loading skeleton (shimmer animation)
│   └── ErrorBanner.jsx     # Persistent error display with retry
├── pages/
│   └── ContactList.jsx     # Main page — orchestrates everything
├── App.jsx                 # Router setup
├── App.css                 # App shell styles
├── index.css               # Design system tokens + global reset
└── main.jsx                # React entry point + Toast provider

spring-boot-reference/
└── CorsConfig.java         # Copy into your Spring Boot project
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start Spring Boot backend
```bash
./mvnw spring-boot:run
# Backend must be running on http://localhost:8080
```

### 3. Start the React frontend
```bash
npm run dev
# Opens at http://localhost:5173
```

---

## How CORS Is Handled

### Option A — Vite Proxy (Dev — Zero Config)
`vite.config.js` forwards all `/api/*` requests to `http://localhost:8080`:

```js
proxy: {
  '/api': { target: 'http://localhost:8080', changeOrigin: true }
}
```

### Option B — Spring Boot CORS (Production)
Copy `spring-boot-reference/CorsConfig.java` to your Spring Boot project and update the allowed origins.

---

## API Methods (`src/services/api.js`)

| Function                        | HTTP   | Endpoint               |
|---------------------------------|--------|------------------------|
| `getAllContacts()`              | GET    | `/api/contacts/`       |
| `searchContacts(query, signal)` | GET    | `/api/contacts/search` |
| `getContactById(id)`           | GET    | `/api/contacts/:id`    |
| `addContact(data)`             | POST   | `/api/contacts/`       |
| `updateContact(id, data)`      | PUT    | `/api/contacts/:id`    |
| `deleteContact(id)`            | DELETE | `/api/contacts/:id`    |

---

## Key Design Decisions

### 1. Centralized Axios Instance
All requests go through one `apiClient`. Interceptors handle logging and error mapping.

### 2. Custom Hook (`useContacts`)
Keeps pages thin. The hook owns debounced search (400ms) with `AbortController` to cancel stale requests and optimistic UI updates.

### 3. Optimistic Updates
```
User clicks Delete → list updates instantly → API call fires in background
If API fails → list is rolled back + error toast shown
```

### 4. Loading States
- **First load**: 6 shimmer skeleton cards
- **Form submit**: Spinner inside button + toast
- **Delete**: Spinner in the delete button

### 5. Error Handling (3 layers)
1. **Axios interceptor** — translates status codes to friendly strings
2. **ErrorBanner** — shown for persistent errors (e.g. network down) with Retry
3. **Toast notifications** — shown for transient feedback

---

## Debugging Guide

### CORS Error
```
Access to XMLHttpRequest ... has been blocked by CORS policy
```
**Fix**: Add `CorsConfig.java` to your Spring Boot project + ensure Vite proxy is active.

### 404 Error
Check that Spring Boot runs on port 8080 and `@RequestMapping("/api/contacts")` matches.

### 500 Error
Check Spring Boot console for stack trace. Axios interceptor logs the full response.

### Backend Not Running
Axios timeout (10s) fires → `"Unable to reach the server. Is the backend running?"` in ErrorBanner.

### Debugging API Calls
1. Open **DevTools → Network tab** → filter by `api`
2. Check **DevTools → Console** for colored interceptor logs (dev only)

---

## Bonus Features Included
- Toast notifications via `react-hot-toast`
- Debounced search (400ms + AbortController)
- Optimistic UI updates
- Skeleton loading with shimmer effect
- Field-level form validation
- Responsive grid layout
- ARIA attributes for accessibility
# Honor-Project

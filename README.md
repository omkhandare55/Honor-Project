# 📇 Contacts Manager — React + Spring Boot

A production-quality full-stack **Contacts Management System** built with **React (Vite)** frontend and **Spring Boot** backend. Features CRUD operations, real-time search, optimistic UI updates, and a modern dark-themed interface.

> **Course:** DevOps (Development and Operations) — RCP23IH1201  
> **Class:** SY B.Tech IT  
> **Faculty:** Sakshi V. Badgujar

---

## 👥 Team Members

| Sr. No. | Name               | Role                         | Branch Worked On        |
| 1       | om                 | Frontend UI Components       | `feature/om`            |
| 2       | Tanushri           | API Services & State Hooks   | `feature/tanushri`      |
| 3       | krushna            | CI/CD Pipeline & Docs        | `feature/krushna`       |


---

## ✨ Features

- **CRUD Operations** — Create, Read, Update, Delete contacts
- **Real-time Search** — Debounced search (400ms) with AbortController for cancellation
- **Optimistic UI Updates** — Instant feedback; rolls back on failure
- **Skeleton Loading** — Shimmer animation while data loads
- **Toast Notifications** — Success/error feedback via `react-hot-toast`
- **Form Validation** — Client-side field-level validation
- **Responsive Design** — CSS Grid layout adapts to all screen sizes
- **Error Handling** — 3-layer system: Axios interceptor → ErrorBanner → Toast
- **Dark Theme** — Modern Catppuccin Mocha color palette
- **GitHub Actions CI** — Automated build verification on push/PR

---

## 🛠️ Tech Stack

| Layer        | Technology                       |
|--------------|----------------------------------|
| Frontend     | React 18, Vite 5, CSS Modules   |
| HTTP Client  | Axios (centralized instance)     |
| Backend      | Spring Boot (Java)               |
| Mock Server  | json-server (for dev)            |
| CI/CD        | GitHub Actions                   |
| Icons        | react-icons (Feather)            |
| Notifications| react-hot-toast                  |

---

## 📁 Project Structure

```
Honor-Project/
├── .github/
│   └── workflows/
│       └── ci.yml                # GitHub Actions CI pipeline
├── src/
│   ├── services/
│   │   └── api.js                # Axios instance + all API methods
│   ├── hooks/
│   │   └── useContacts.js        # Custom hook — state & async logic
│   ├── components/
│   │   ├── ContactCard.jsx       # Single contact display card
│   │   ├── ContactCard.module.css
│   │   ├── ContactForm.jsx       # Add/Edit modal form
│   │   ├── ContactForm.module.css
│   │   ├── SkeletonCard.jsx      # Loading skeleton
│   │   ├── SkeletonCard.module.css
│   │   ├── ErrorBanner.jsx       # Error display with retry
│   │   └── ErrorBanner.module.css
│   ├── pages/
│   │   ├── ContactList.jsx       # Main page
│   │   └── ContactList.module.css
│   ├── App.jsx                   # Router setup
│   ├── App.css                   # App shell styles
│   ├── index.css                 # Design system tokens
│   └── main.jsx                  # Entry point + Toast provider
├── spring-boot-reference/
│   └── CorsConfig.java           # CORS config for Spring Boot
├── db.json                       # Mock data (json-server)
├── mock-server.cjs               # Mock API server
├── vite.config.js                # Vite config + proxy
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/Honor-Project.git
cd Honor-Project
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the mock API server
```bash
npm run mock
# Runs on http://localhost:8080
```

### 4. Start the frontend (new terminal)
```bash
npm run dev
# Opens at http://localhost:5173
```

> **With Spring Boot:** If your Spring Boot backend is running on port 8080, skip step 3. The Vite proxy automatically forwards `/api/*` requests.

---

## 🔀 Branching Strategy

This project follows a **feature-branch workflow**:

```
main
 ├── feature/om              ← UI components (ContactCard, ContactForm, Skeleton, ErrorBanner)
 ├── feature/tanushri        ← API layer (api.js, useContacts hook, mock server, Vite proxy)
 └── feature/krushna         ← CI/CD pipeline (GitHub Actions) + documentation (README)
```

Each branch was developed independently and merged into `main` via pull requests.

---

## ⚙️ GitHub Actions (CI)

A CI pipeline runs automatically on every push and pull request:

- **Checkout** → clones the repo
- **Setup Node.js** → tests on Node 18.x and 20.x
- **Install** → `npm ci` for reproducible builds
- **Build** → `npm run build` verifies the production bundle compiles
- **Notify** → prints a success summary

📄 Workflow file: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

---

## 📡 API Endpoints

| Function                        | Method | Endpoint               |
|---------------------------------|--------|------------------------|
| `getAllContacts()`              | GET    | `/api/contacts/`       |
| `searchContacts(query, signal)` | GET    | `/api/contacts/search` |
| `getContactById(id)`           | GET    | `/api/contacts/:id`    |
| `addContact(data)`             | POST   | `/api/contacts/`       |
| `updateContact(id, data)`      | PUT    | `/api/contacts/:id`    |
| `deleteContact(id)`            | DELETE | `/api/contacts/:id`    |

---

## 🎯 Key Design Decisions

1. **Centralized Axios Instance** — Single `apiClient` with request/response interceptors
2. **Custom Hook (`useContacts`)** — Encapsulates all state management and async logic
3. **Optimistic Updates** — UI updates instantly, rolls back on API failure
4. **Debounced Search** — 400ms delay with `AbortController` to cancel stale requests
5. **CSS Modules** — Scoped styles prevent class-name collisions
6. **Mock Server** — Enables frontend development without Spring Boot

---

## 📝 License

This project is developed for academic purposes as part of the DevOps course (RCP23IH1201).

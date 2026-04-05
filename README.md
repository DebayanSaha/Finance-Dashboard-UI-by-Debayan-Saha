# Finance Dashboard UI

## Overview

A browser-based personal finance dashboard for tracking balances, managing transactions, and exploring spending insights. Built entirely on React with no backend — all data is persisted via `localStorage`. State is managed globally through Context API, with all metrics derived dynamically from raw transaction data.

---

## Feature Checklist

- [x] Dashboard Overview — KPI cards + time-based trend chart + category breakdown chart
- [x] Transactions — search, filter by category, sort chronologically, Admin CRUD
- [x] Role-Based UI — Viewer (read-only) / Admin (full access), global toggle
- [x] Insights — highest spending category, monthly comparisons, dynamic aggregations
- [x] State Management — React Context API, single source of truth
- [x] Responsive UI — desktop, tablet, and mobile layouts
- [x] Empty State Handling — graceful placeholders for no-data and filtered-out states
- [x] Data Persistence — localStorage, survives page reloads
- [x] Dark Mode — consistent design system across themes
- [x] Dynamic Chart Filtering — Day / Month / Year granularity toggle

---

## Requirement Mapping

| Requirement | Implementation |
|---|---|
| Dashboard Overview | KPI cards (Balance, Income, Expenses), balance trend chart, category breakdown chart |
| Transactions | Search, category filter, chronological sort, Admin CRUD operations |
| Role-Based UI | Viewer = read-only; Admin = full access; switched via global state toggle |
| Insights | Category aggregation, monthly grouping — all derived from raw transaction data |
| State Management | React Context API — no Redux overhead, no prop-drilling |
| UI/UX | Fully responsive layout, empty state placeholders, input validation |

---

## Features

### Dashboard
- KPI cards: Balance, Income, Expenses (dynamically calculated)
- Balance trend chart with Day / Month / Year filter
- Categorical spending breakdown chart
- Real-time sync — any transaction change propagates instantly

### Transactions
- Fields: Date, Amount, Category, Type
- Real-time search, category filter, chronological sort
- Admin: full CRUD (add, edit, delete)
- Viewer: read-only; write controls hidden from rendered output

### Insights
- Highest spending category via category aggregation
- Monthly comparisons via dynamic transaction grouping
- All metrics derived on the fly — nothing hardcoded

---

## Role-Based UI (Simulated RBAC)

| Role | Permissions | UI Behavior |
|---|---|---|
| Admin | Read + Write | All forms, add/edit/delete controls visible |
| Viewer | Read only | Forms and write controls hidden / disabled |

- Role switching handled via a global state toggle
- UI updates across all pages with no page reload
- Controls are logically excluded from render, not just visually hidden

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Component-based UI architecture |
| Vite | Fast dev server with HMR, optimized production builds |
| Context API | Global state — transactions, filters, roles |
| Recharts | Responsive, declarative data visualization |
| CSS | Custom styling — design tokens, responsive layouts, no utility framework |

---

## State Management & Data Logic

- **Single source of truth:** Only raw transactions are stored in Context; all other values are derived.
- **Derived state:** Metrics like Total Balance and Total Income are computed dynamically on each render — never stored independently, eliminating desync bugs.
- **localStorage:** Changes to the transaction list are automatically serialized and persisted, providing zero-backend data persistence across sessions.

---

## Edge Case Handling & Performance

- Empty state placeholders for no-data and filtered-out views
- Form validation prevents malformed or incomplete transaction records
- Safe initialization when `localStorage` is empty on first load
- Efficient array operations for filtering and sorting
- Optimized aggregations for chart generation and monthly grouping

---

## Key Engineering Takeaways

- **Derived state over stored state** — metrics computed on the fly, no desync risk
- **Single source of truth** — Context API ensures predictable, traceable data flow
- **Frontend RBAC** — capability-based UI gating via conditional rendering, no backend required
- **Production-grade patterns** — component separation, reusable utilities, scalable context architecture

---

## Project Structure

```
src/
├── components/   # Modular, reusable UI components (Cards, Charts, Forms)
├── context/      # Global state — transactions, roles, filters
├── utils/        # Helpers for formatting, derivation, aggregation
└── pages/        # Route containers: Dashboard, Transactions, Insights
```

---

## Additional Enhancements

- localStorage persistence — data survives reloads and browser closures
- Dynamic chart filtering — Day / Month / Year granularity
- Smooth animations — hover transitions, modal animations
- Dark mode — full design system support

---

## Future Improvements

- **Backend & Auth** — Node.js / PostgreSQL backend with JWT authentication
- **Export** — CSV and PDF export for filtered transaction histories
- **Advanced Filtering** — multi-select tags, date-range queries

---

## Setup Instructions

**1. Clone the repository:**
```bash
git clone https://github.com/DebayanSaha/Finance-Dashboard-UI-by-Debayan-Saha
cd <project-folder>
```

**2. Install dependencies:**
```bash
npm install
```

**3. Start the development server:**
```bash
npm run dev --host
```

---

## Live Demo
https://finance-dashboard-phi-ten.vercel.app/

---

## Screenshots

*(Reviewers: Please run the project locally or view the live deployment link for the complete experience!)*

###  Dashboard Page

<table>
  <tr>
    <td align="center"><b> Light Mode</b></td>
    <td align="center"><b> Dark Mode</b></td>
  </tr>
  <tr>
    <td><img alt="Dashboard Light View" src="https://github.com/DebayanSaha/Finance-Dashboard-UI-by-Debayan-Saha/raw/main/public/screenshots/1.png" width="100%" /></td>
    <td><img alt="Dashboard Dark View" src="https://github.com/DebayanSaha/Finance-Dashboard-UI-by-Debayan-Saha/raw/main/public/screenshots/2.png" width="100%" /></td>
  </tr>
</table>

---

###  Transactions Page

<table>
  <tr>
    <td align="center"><b> Light Mode</b></td>
    <td align="center"><b> Dark Mode</b></td>
  </tr>
  <tr>
    <td><img alt="Transactions Light View" src="https://github.com/DebayanSaha/Finance-Dashboard-UI-by-Debayan-Saha/raw/main/public/screenshots/3.png" width="100%" /></td>
    <td><img alt="Transactions Dark View" src="https://github.com/DebayanSaha/Finance-Dashboard-UI-by-Debayan-Saha/raw/main/public/screenshots/4.png" width="100%" /></td>
  </tr>
</table>

---

###  Insights Page

<table>
  <tr>
    <td align="center"><b> Light Mode</b></td>
    <td align="center"><b> Dark Mode</b></td>
  </tr>
  <tr>
    <td><img alt="Insights Light View" src="https://github.com/DebayanSaha/Finance-Dashboard-UI-by-Debayan-Saha/raw/main/public/screenshots/5.png" width="100%" /></td>
    <td><img alt="Insights Dark View" src="https://github.com/DebayanSaha/Finance-Dashboard-UI-by-Debayan-Saha/raw/main/public/screenshots/6.png" width="100%" /></td>
  </tr>
</table>
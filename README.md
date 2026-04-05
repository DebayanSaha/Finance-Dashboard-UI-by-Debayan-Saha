# Finance Dashboard UI

> A real-world fintech dashboard simulation with production-level data handling and UI patterns.
> Built entirely on React — no backend, no database. All data is derived dynamically from a single source of truth and persisted via `localStorage`.

---

## Live Demo

 [finance-dashboard-phi-ten.vercel.app](https://finance-dashboard-phi-ten.vercel.app/)

---

## User Interface

*(Reviewers: Please run the project locally or view the live deployment link for the complete experience!)*

### Dashboard Page

<table>
  <tr>
    <td align="center"><b>Light Mode</b></td>
    <td align="center"><b>Dark Mode</b></td>
  </tr>
  <tr>
    <td><img alt="Dashboard Light View" src="https://github.com/DebayanSaha/Finance-Dashboard-UI-by-Debayan-Saha/raw/main/public/screenshots/1.png" width="100%" /></td>
    <td><img alt="Dashboard Dark View" src="https://github.com/DebayanSaha/Finance-Dashboard-UI-by-Debayan-Saha/raw/main/public/screenshots/2.png" width="100%" /></td>
  </tr>
</table>

---

### Transactions Page

<table>
  <tr>
    <td align="center"><b>Light Mode</b></td>
    <td align="center"><b>Dark Mode</b></td>
  </tr>
  <tr>
    <td><img alt="Transactions Light View" src="https://github.com/DebayanSaha/Finance-Dashboard-UI-by-Debayan-Saha/raw/main/public/screenshots/3.png" width="100%" /></td>
    <td><img alt="Transactions Dark View" src="https://github.com/DebayanSaha/Finance-Dashboard-UI-by-Debayan-Saha/raw/main/public/screenshots/4.png" width="100%" /></td>
  </tr>
</table>

---

### Insights Page

<table>
  <tr>
    <td align="center"><b>Light Mode</b></td>
    <td align="center"><b>Dark Mode</b></td>
  </tr>
  <tr>
    <td><img alt="Insights Light View" src="https://github.com/DebayanSaha/Finance-Dashboard-UI-by-Debayan-Saha/raw/main/public/screenshots/5.png" width="100%" /></td>
    <td><img alt="Insights Dark View" src="https://github.com/DebayanSaha/Finance-Dashboard-UI-by-Debayan-Saha/raw/main/public/screenshots/6.png" width="100%" /></td>
  </tr>
</table>

---

## Feature Checklist

- [x] **Dashboard Overview** — KPI cards + time-based balance trend chart + category spending breakdown
- [x] **Transactions** — debounced search, category filter, sort, sticky header, Admin CRUD
- [x] **Role-Based UI** — Viewer (read-only) / Admin (full access), global toggle
- [x] **Insights** — highest spending category, monthly comparisons, dynamic aggregations + auto-generated insight text
- [x] **State Management** — React Context API, single source of truth, derived metrics
- [x] **Data Persistence** — `localStorage`, survives page reloads and browser closures
- [x] **Dark Mode** — full design system support across both themes
- [x] **Responsive UI** — desktop, tablet, and mobile layouts
- [x] **Empty State Handling** — graceful placeholders for no-data and filtered-out states
- [x] **Dynamic Chart Filtering** — Day / Month / Year granularity toggle

---

## Project Setup

### Tech Stack

| Technology | Purpose |
|---|---|
| React | Component-based UI architecture |
| Vite | Fast dev server with HMR, optimized production builds |
| Context API | Global state — transactions, filters, roles |
| Tailwind CSS | Utility-first styling with custom design tokens |
| Recharts | Responsive, declarative data visualization |

### Folder Structure

```
src/
├── components/   # Reusable UI pieces: Cards, Charts, Modals, Buttons
├── pages/        # Route containers: Dashboard, Transactions, Insights
├── context/      # Global state: transactions, role, filters
├── utils/        # Helpers for formatting, aggregation, derivation
└── data/         # Mock transaction dataset (seed data)
```

Each folder has a clear single responsibility. `components/` are stateless and reusable; `pages/` wire them together; `context/` owns the data; `utils/` holds pure logic.

### Routing

The app uses React Router with three main routes:

| Route | Page | Description |
|---|---|---|
| `/dashboard` | Dashboard | Overview: KPI cards + charts |
| `/transactions` | Transactions | CRUD table with search + filters |
| `/insights` | Insights | Aggregated spending analysis |

### Layout System

Every page shares a persistent layout:

- **Sidebar** — navigation links, role toggle, dark mode switch
- **Topbar** — page title and global controls

The layout is defined once and wraps all route children, so there is no duplication across pages.

### Design System

The app uses a consistent visual language:

- **Spacing** — 8px grid system (0.5rem increments)
- **Typography** — three clear levels: heading, body, caption
- **Colors** — a CSS custom property palette (`--color-primary`, `--color-surface`, etc.) that switches between light and dark themes from a single toggle
- **Components** — all reusable components (Card, Badge, Button) consume these tokens, so theme changes propagate everywhere automatically

---

## Mock Data Design

### Dataset Structure

Each transaction is a flat object with the following fields:

```js
{
  id: "txn_001",
  date: "2024-03-15",
  amount: 4500,
  category: "Salary",
  type: "income",          // "income" | "expense"
  description: "Monthly salary deposit"
}
```

### What the Dataset Covers

- **Multiple months** — data spans several months, enabling meaningful trend charts and month-over-month comparisons
- **Mixed categories** — Food, Rent, Travel, Entertainment, Salary, Freelance, Utilities, and more
- **Both income and expense** entries, with realistic proportions

### Edge Cases Handled

| Scenario | How it's handled |
|---|---|
| Empty dataset | UI shows a friendly empty state instead of a broken chart |
| First-time load (no `localStorage`) | Safe initialization with seed data |
| Large dataset | Efficient array operations; no blocking renders |
| Filtered results return nothing | "No results found" placeholder |

### Chart Granularity

The same raw dataset powers all three chart views:
- **Day** — shows individual daily totals
- **Month** — groups transactions by calendar month
- **Year** — aggregates into yearly totals

No separate datasets exist for each view — the granularity is derived on the fly from the same transaction array.

---

## State Management

### Why Context API?

Local `useState` only works within a single component. When multiple pages all need the same transaction list, filters, and role, you need a shared global store.

Context API was chosen over Redux because:
- This app's state is straightforward — one dataset, a few filters, one role flag
- Context has no boilerplate overhead
- It keeps the codebase accessible to developers of all levels

### What's Stored Globally

```
Context Store
├── transactions[]      ← the single source of truth
├── filters             ← { search, category, dateRange }
└── role                ← "admin" | "viewer"
```

### Separation of Concerns: Data vs UI State

| State type | What it contains | Where it lives |
|---|---|---|
| **Data state** | Raw transaction array | Context |
| **UI state** | Modal open/close, active tab | Local component `useState` |

UI state is kept local on purpose. Only data that multiple components need to share lives in Context. This keeps the global store lean and predictable.

### localStorage Persistence

Every time the transaction list changes, it is automatically serialized (`JSON.stringify`) and written to `localStorage`. On reload, the app reads it back (`JSON.parse`) and restores the full state. If `localStorage` is empty (first visit), the app initializes with seed data instead of breaking.

---

## Design Decisions

### 1. Single unified dataset

All metrics — balance, income, expenses, charts, insights — are computed from one raw transaction array. There are no secondary arrays or pre-aggregated values stored anywhere. This eliminates an entire class of bugs where two different data sources get out of sync.

### 2. Derived state, never stored state

Metrics like Total Balance and Total Income are recalculated on each render from the raw data. Storing them separately would mean updating them every time a transaction changes — a brittle pattern that often leads to stale values. Deriving them is always correct by definition.

### 3. Chart aggregation by granularity

Instead of three separate datasets, the same raw array is reduced at render time based on the selected granularity (Day / Month / Year). This means any new transaction instantly appears correctly at all zoom levels with no extra work.

### 4. Role-based UI: Admin vs Viewer

The role system simulates real-world RBAC (Role-Based Access Control) without a backend. A single global role flag gates write operations across all pages — add, edit, and delete are only available to Admins.

### 5. Disabled vs hidden controls

Admin-only buttons are **disabled** in Viewer mode rather than removed from the DOM. This is a deliberate UX decision: it lets the Viewer see what functionality exists, while making it clear they cannot use it. A tooltip reading "Admin only" reinforces this. Hiding controls entirely can feel confusing — users wonder if a feature exists at all.

---

## Transactions Page

The Transactions page is the most feature-dense view in the app.

### Table Features

- **Columns**: Date, Amount, Category, Type
- **Sticky header** — the column header row stays fixed when scrolling through long lists
- **Debounced search** — the search input waits 300ms after the user stops typing before filtering, reducing unnecessary re-renders on every keystroke
- **Highlighted search text** — matched characters inside transaction descriptions are visually highlighted
- **Filter by category** — dropdown to narrow results to a single spending category
- **Filter by type** — toggle between income and expense entries
- **Sort by Date or Amount** — ascending and descending

### Admin Controls

Visible only when role is set to Admin:

- **Add** — opens a modal form with validation (required fields, positive amounts only)
- **Edit** — inline edit for any transaction row
- **Delete** — triggers a confirmation prompt before removing

---

## UI/UX Enhancements

### Responsive Design

| Breakpoint | Layout |
|---|---|
| Desktop (≥1024px) | Sidebar + main content side by side |
| Tablet (768–1023px) | Collapsed sidebar, full-width content |
| Mobile (<768px) | Stacked layout, bottom navigation |

### Loading States

Skeleton screens are shown while data initializes — no blank white pages or layout jumps.

### Empty States

Every view that can return no results has a dedicated empty state:
- "No transactions yet" — when the dataset is empty
- "No results match your search" — when filters exclude everything
- "No data for this period" — when a chart has no points to render

These prevent confusing blank UIs and communicate clearly to the user.

### Micro-interactions

- Hover effects on table rows and navigation links
- Smooth modal open/close animations
- Button press feedback (scale transform on click)
- Chart tooltips on hover with formatted values
- Dark mode toggle with a smooth color transition

---

## Error & Edge Case Handling

| Scenario | Behavior |
|---|---|
| Empty `localStorage` on first load | Falls back to seed data gracefully |
| Search returns no matches | Shows "No results found" placeholder |
| Chart has no data for selected period | Shows empty state instead of broken chart |
| Invalid or incomplete form submission | Form validation blocks the save and shows inline error messages |
| Large transaction list | Efficient JS array operations (filter, reduce, sort) keep renders fast |
| Dark mode preference | Persisted in `localStorage`, restored on reload |

No scenario results in a crash or unhandled error. Every state the app can reach has a defined, intentional UI response.

---

## Requirement Mapping

| Requirement | Implementation |
|---|---|
| Dashboard Overview | KPI cards (Balance, Income, Expenses), balance trend chart, category breakdown chart |
| Transactions | Debounced search, category filter, sort, sticky header, Admin CRUD |
| Role-Based UI | Viewer = read-only; Admin = full access; switched via global state toggle |
| Insights | Category aggregation, monthly grouping — all derived from raw transaction data |
| State Management | React Context API — no Redux overhead, no prop-drilling |
| UI/UX | Fully responsive, empty + loading states, micro-interactions, dark mode |

---

## Key Engineering Takeaways

- **Derived state over stored state** — metrics computed on the fly, zero desync risk
- **Single source of truth** — Context API ensures predictable, traceable data flow
- **Frontend RBAC** — capability-based UI gating via conditional rendering, no backend required
- **Accessible empty states** — every possible "no content" scenario is explicitly handled
- **Production-grade patterns** — component separation, reusable utilities, scalable context architecture

---

##  If I Had More Time, I Would…

These are features I would prioritize next, in order of impact:

1. **Backend + Database** — Replace `localStorage` with a Node.js API and PostgreSQL. Real persistence, multi-device sync, and proper data integrity.

2. **Authentication** — Add JWT-based login so the Admin/Viewer role is tied to a real user account rather than a toggle. This makes the RBAC simulation production-realistic.

3. **Export (CSV + PDF)** — Let users download filtered transaction histories. A core feature for any finance tool and a common recruiter ask.

4. **Real-time Sync** — WebSocket or polling so that changes in one tab/device reflect instantly in another. Pairs naturally with a backend.

5. **AI-powered Insights** — Use an LLM to generate plain-English summaries: *"You spent 40% more on Food this month compared to your 3-month average. Your highest single expense was Travel on March 12th."* This transforms raw numbers into actionable advice.

6. **Advanced Filtering** — Multi-select category tags, custom date range picker, and amount range sliders for power users.

7. **Performance Optimization** — `React.memo`, `useMemo` for expensive aggregations, and lazy-loaded route chunks for faster initial load.

---

## Setup Instructions

**1. Clone the repository:**
```bash
git clone https://github.com/DebayanSaha/Finance-Dashboard-UI-by-Debayan-Saha
cd Finance-Dashboard-UI-by-Debayan-Saha
```

**2. Install dependencies:**
```bash
npm install
```

**3. Start the development server:**
```bash
npm run dev --host
```

**4. Open in browser:**
```
http://localhost:5173
```

No environment variables, no API keys, no backend setup required. The app runs fully in the browser.

---

*Built by Debayan Saha*

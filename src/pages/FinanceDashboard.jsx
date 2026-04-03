import { useState, useMemo, useReducer } from "react";

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const INITIAL_TRANSACTIONS = [
  { id: 1,  date: "2024-01-03", description: "Salary",          category: "Income",        amount: 5200,  type: "income"  },
  { id: 2,  date: "2024-01-05", description: "Rent",            category: "Housing",       amount: 1500,  type: "expense" },
  { id: 3,  date: "2024-01-07", description: "Grocery Store",   category: "Food",          amount: 210,   type: "expense" },
  { id: 4,  date: "2024-01-10", description: "Netflix",         category: "Subscriptions", amount: 18,    type: "expense" },
  { id: 5,  date: "2024-01-12", description: "Freelance Work",  category: "Income",        amount: 1200,  type: "income"  },
  { id: 6,  date: "2024-01-15", description: "Electric Bill",   category: "Utilities",     amount: 95,    type: "expense" },
  { id: 7,  date: "2024-01-18", description: "Restaurant",      category: "Food",          amount: 64,    type: "expense" },
  { id: 8,  date: "2024-01-20", description: "Gym Membership",  category: "Health",        amount: 45,    type: "expense" },
  { id: 9,  date: "2024-01-22", description: "Bonus",           category: "Income",        amount: 800,   type: "income"  },
  { id: 10, date: "2024-01-25", description: "Clothing",        category: "Shopping",      amount: 130,   type: "expense" },
  { id: 11, date: "2024-02-03", description: "Salary",          category: "Income",        amount: 5200,  type: "income"  },
  { id: 12, date: "2024-02-05", description: "Rent",            category: "Housing",       amount: 1500,  type: "expense" },
  { id: 13, date: "2024-02-08", description: "Grocery Store",   category: "Food",          amount: 190,   type: "expense" },
  { id: 14, date: "2024-02-11", description: "Spotify",         category: "Subscriptions", amount: 10,    type: "expense" },
  { id: 15, date: "2024-02-14", description: "Valentine Dinner",category: "Food",          amount: 120,   type: "expense" },
  { id: 16, date: "2024-02-17", description: "Internet Bill",   category: "Utilities",     amount: 60,    type: "expense" },
  { id: 17, date: "2024-02-20", description: "Freelance Work",  category: "Income",        amount: 950,   type: "income"  },
  { id: 18, date: "2024-02-24", description: "Pharmacy",        category: "Health",        amount: 35,    type: "expense" },
  { id: 19, date: "2024-03-03", description: "Salary",          category: "Income",        amount: 5200,  type: "income"  },
  { id: 20, date: "2024-03-06", description: "Rent",            category: "Housing",       amount: 1500,  type: "expense" },
  { id: 21, date: "2024-03-10", description: "Grocery Store",   category: "Food",          amount: 230,   type: "expense" },
  { id: 22, date: "2024-03-15", description: "Steam Games",     category: "Subscriptions", amount: 60,    type: "expense" },
  { id: 23, date: "2024-03-18", description: "Consulting Fee",  category: "Income",        amount: 1500,  type: "income"  },
  { id: 24, date: "2024-03-22", description: "Dentist",         category: "Health",        amount: 200,   type: "expense" },
  { id: 25, date: "2024-03-28", description: "Gas",             category: "Transport",     amount: 80,    type: "expense" },
];

const BALANCE_TREND = [
  { month: "Oct", balance: 8200 },
  { month: "Nov", balance: 9400 },
  { month: "Dec", balance: 7800 },
  { month: "Jan", balance: 11300 },
  { month: "Feb", balance: 13100 },
  { month: "Mar", balance: 15700 },
];

const CATEGORY_COLORS = {
  Housing:       "#e05c5c",
  Food:          "#e07a5c",
  Subscriptions: "#6c8ebf",
  Utilities:     "#7b9e87",
  Health:        "#b07fc4",
  Shopping:      "#c4a85a",
  Transport:     "#5ab5c4",
  Income:        "#5ca86c",
};

// ─────────────────────────────────────────────
// REDUCER
// ─────────────────────────────────────────────
function txReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, { ...action.payload, id: Date.now() }];
    case "EDIT":
      return state.map(t => t.id === action.payload.id ? { ...t, ...action.payload } : t);
    default:
      return state;
  }
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// ─────────────────────────────────────────────
// ICONS (inline SVG)
// ─────────────────────────────────────────────
const Icon = {
  wallet:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M20 12V8a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2v-4"/><path d="M20 12h-4a2 2 0 000 4h4"/></svg>,
  income:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  expense:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  plus:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  search:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  edit:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  lightbulb: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14"/></svg>,
  arrow:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
};

// ─────────────────────────────────────────────
// SUMMARY CARD
// ─────────────────────────────────────────────
function SummaryCard({ label, value, icon: IconComp, accent, sub }) {
  return (
    <div className={`rounded-2xl p-5 flex flex-col gap-3 border ${accent}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest uppercase opacity-60">{label}</span>
        <span className="opacity-70"><IconComp /></span>
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      {sub && <p className="text-xs opacity-50">{sub}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// BALANCE TREND CHART (SVG path)
// ─────────────────────────────────────────────
function BalanceTrend({ data }) {
  const W = 560, H = 140, pad = 36;
  const vals = data.map(d => d.balance);
  const min = Math.min(...vals), max = Math.max(...vals);
  const xStep = (W - pad * 2) / (data.length - 1);
  const yScale = v => H - pad - ((v - min) / (max - min)) * (H - pad * 1.5);
  const pts = data.map((d, i) => [pad + i * xStep, yScale(d.balance)]);
  const pathD = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `C${pts[i-1][0]+xStep/2},${pts[i-1][1]} ${p[0]-xStep/2},${p[1]} ${p[0]},${p[1]}`)).join(" ");
  const areaD = `${pathD} L${pts[pts.length-1][0]},${H-8} L${pts[0][0]},${H-8} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 280 }}>
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e05c5c" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#e05c5c" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#trendGrad)" />
        <path d={pathD} fill="none" stroke="#e05c5c" strokeWidth="2.5" strokeLinecap="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p[0]} cy={p[1]} r="4" fill="#e05c5c" stroke="white" strokeWidth="2" />
            <text x={p[0]} y={H - 4} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.45">{data[i].month}</text>
            <text x={p[0]} y={p[1] - 10} textAnchor="middle" fontSize="9" fill="#e05c5c" opacity="0.8">
              {(data[i].balance / 1000).toFixed(1)}k
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
// SPENDING BY CATEGORY (horizontal bar)
// ─────────────────────────────────────────────
function CategoryChart({ transactions }) {
  const expenses = transactions.filter(t => t.type === "expense");
  const totals = {};
  expenses.forEach(t => { totals[t.category] = (totals[t.category] || 0) + t.amount; });
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const maxVal = sorted[0]?.[1] || 1;

  if (sorted.length === 0) return <p className="text-sm opacity-40 py-4 text-center">No expense data</p>;

  return (
    <div className="flex flex-col gap-3">
      {sorted.map(([cat, val]) => (
        <div key={cat} className="flex items-center gap-3">
          <span className="text-xs w-24 shrink-0 opacity-70 truncate">{cat}</span>
          <div className="flex-1 bg-gray-100 dark:bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(val / maxVal) * 100}%`, backgroundColor: CATEGORY_COLORS[cat] || "#aaa" }}
            />
          </div>
          <span className="text-xs font-semibold w-16 text-right opacity-80">{fmt(val)}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// TRANSACTION ROW
// ─────────────────────────────────────────────
function TxRow({ tx, isAdmin, onEdit }) {
  return (
    <div className="flex items-center gap-3 py-3 px-1 border-b border-gray-100 dark:border-white/5 last:border-0 group hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: CATEGORY_COLORS[tx.category] || "#aaa" }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{tx.description}</p>
        <p className="text-xs opacity-40">{fmtDate(tx.date)} · {tx.category}</p>
      </div>
      <span className={`text-sm font-bold tabular-nums ${tx.type === "income" ? "text-emerald-500" : "text-red-400"}`}>
        {tx.type === "income" ? "+" : "−"}{fmt(tx.amount)}
      </span>
      {isAdmin && (
        <button
          onClick={() => onEdit(tx)}
          className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10"
          title="Edit"
        >
          <Icon.edit />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ADD / EDIT MODAL
// ─────────────────────────────────────────────
const EMPTY_FORM = { description: "", date: "", amount: "", category: "Food", type: "expense" };
const CATEGORIES = ["Food", "Housing", "Utilities", "Health", "Shopping", "Subscriptions", "Transport", "Income"];

function TxModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.description || !form.date || !form.amount) return alert("Fill all fields");
    onSave({ ...form, amount: parseFloat(form.amount) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 border border-gray-100 dark:border-white/10"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-base font-bold mb-5">{initial?.id ? "Edit Transaction" : "Add Transaction"}</h3>
        <div className="flex flex-col gap-3">
          {[
            { label: "Description", key: "description", type: "text" },
            { label: "Date", key: "date", type: "date" },
            { label: "Amount ($)", key: "amount", type: "number" },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs opacity-50 mb-1 block">{f.label}</label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={e => set(f.key, e.target.value)}
                className="w-full border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
          ))}
          <div>
            <label className="text-xs opacity-50 mb-1 block">Category</label>
            <select
              value={form.category}
              onChange={e => set("category", e.target.value)}
              className="w-full border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs opacity-50 mb-1 block">Type</label>
            <div className="flex gap-2">
              {["income", "expense"].map(t => (
                <button
                  key={t}
                  onClick={() => set("type", t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize border transition-colors ${form.type === t ? "bg-red-400 text-white border-red-400" : "border-gray-200 dark:border-white/10 opacity-60"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm opacity-60 hover:opacity-100">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2 rounded-lg bg-red-400 text-white text-sm font-semibold hover:bg-red-500 transition-colors">Save</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// INSIGHTS PANEL
// ─────────────────────────────────────────────
function Insights({ transactions }) {
  const expenses = transactions.filter(t => t.type === "expense");
  const income   = transactions.filter(t => t.type === "income");

  // Highest spending category
  const catTotals = {};
  expenses.forEach(t => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount; });
  const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

  // Monthly comparison (last 2 months by month label)
  const monthMap = {};
  transactions.forEach(t => {
    const m = t.date.slice(0, 7);
    if (!monthMap[m]) monthMap[m] = { income: 0, expense: 0 };
    monthMap[m][t.type] += t.amount;
  });
  const months = Object.keys(monthMap).sort();
  const last = months[months.length - 1];
  const prev = months[months.length - 2];
  const lastExp  = last ? monthMap[last].expense : 0;
  const prevExp  = prev ? monthMap[prev].expense : 0;
  const expDiff  = lastExp - prevExp;
  const expLabel = new Date(last + "-01").toLocaleDateString("en-US", { month: "long" });
  const prevLabel= prev ? new Date(prev + "-01").toLocaleDateString("en-US", { month: "long" }) : "previous";

  // Savings rate
  const totalIncome  = income.reduce((s, t) => s + t.amount, 0);
  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
  const savingsRate  = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  const cards = [
    {
      icon: "🏆",
      title: "Top Spending Category",
      body: topCat ? `${topCat[0]} at ${fmt(topCat[1])} total` : "No data",
    },
    {
      icon: expDiff > 0 ? "📈" : "📉",
      title: `Spending vs ${prevLabel}`,
      body: expDiff === 0
        ? "Same spending as last month"
        : `${expLabel} spending is ${Math.abs(Math.round((expDiff / prevExp) * 100))}% ${expDiff > 0 ? "higher" : "lower"} (${expDiff > 0 ? "+" : ""}${fmt(expDiff)})`,
    },
    {
      icon: "💰",
      title: "Savings Rate",
      body: `You're saving ${savingsRate}% of your income across all recorded months`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c, i) => (
        <div key={i} className="rounded-xl border border-gray-100 dark:border-white/10 p-4 flex flex-col gap-2 bg-gray-50 dark:bg-white/5">
          <span className="text-2xl">{c.icon}</span>
          <p className="text-xs font-bold opacity-60 uppercase tracking-wide">{c.title}</p>
          <p className="text-sm opacity-80 leading-relaxed">{c.body}</p>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function FinanceDashboard() {
  const [transactions, dispatch] = useReducer(txReducer, INITIAL_TRANSACTIONS);
  const [role, setRole]          = useState("viewer");
  const [search, setSearch]      = useState("");
  const [filterType, setFilter]  = useState("all");
  const [sortKey, setSort]       = useState("date");
  const [modal, setModal]        = useState(null); // null | { mode: "add"|"edit", tx?: {} }
  const [activeTab, setTab]      = useState("overview");

  const isAdmin = role === "admin";

  // Computed summary
  const totalIncome  = useMemo(() => transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpense = useMemo(() => transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0), [transactions]);
  const balance      = totalIncome - totalExpense;

  // Filtered + sorted transactions
  const filtered = useMemo(() => {
    let list = [...transactions];
    if (filterType !== "all") list = list.filter(t => t.type === filterType);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      if (sortKey === "date")   return new Date(b.date) - new Date(a.date);
      if (sortKey === "amount") return b.amount - a.amount;
      return a.description.localeCompare(b.description);
    });
    return list;
  }, [transactions, filterType, search, sortKey]);

  const handleSave = (data) => {
    if (data.id) dispatch({ type: "EDIT", payload: data });
    else         dispatch({ type: "ADD",  payload: data });
  };

  const TABS = ["overview", "transactions", "insights"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111113] text-gray-900 dark:text-gray-100 font-sans">
      {/* TOP NAV */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#111113]/90 backdrop-blur border-b border-gray-100 dark:border-white/5">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-red-400 flex items-center justify-center text-white text-xs font-black">№</span>
            <span className="font-bold text-sm tracking-tight">FinanceDesk</span>
          </div>

          <nav className="flex gap-1">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${activeTab === t ? "bg-red-400 text-white" : "hover:bg-gray-100 dark:hover:bg-white/10 opacity-60"}`}
              >
                {t}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="text-xs border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-red-300"
            >
              <option value="viewer">👁 Viewer</option>
              <option value="admin">🔑 Admin</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* ROLE BANNER */}
        {isAdmin && (
          <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 px-4 py-2.5 flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
            <span className="font-bold">Admin Mode</span>
            <span className="opacity-60">— You can add and edit transactions</span>
          </div>
        )}

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SummaryCard
                label="Total Balance"
                value={fmt(balance)}
                icon={Icon.wallet}
                accent="border-gray-200 dark:border-white/10 bg-white dark:bg-white/5"
                sub="All time net"
              />
              <SummaryCard
                label="Total Income"
                value={fmt(totalIncome)}
                icon={Icon.income}
                accent="border-emerald-100 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10"
                sub={`${transactions.filter(t=>t.type==="income").length} transactions`}
              />
              <SummaryCard
                label="Total Expenses"
                value={fmt(totalExpense)}
                icon={Icon.expense}
                accent="border-red-100 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10"
                sub={`${transactions.filter(t=>t.type==="expense").length} transactions`}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-5">
                <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Balance Trend</p>
                <BalanceTrend data={BALANCE_TREND} />
              </div>
              <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-5">
                <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Spending by Category</p>
                <CategoryChart transactions={transactions} />
              </div>
            </div>

            {/* Recent Transactions preview */}
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-widest opacity-50">Recent Transactions</p>
                <button onClick={() => setTab("transactions")} className="text-xs text-red-400 flex items-center gap-1 hover:underline">
                  View all <Icon.arrow />
                </button>
              </div>
              {transactions.slice(-5).reverse().map(tx => (
                <TxRow key={tx.id} tx={tx} isAdmin={isAdmin} onEdit={tx => setModal({ mode: "edit", tx })} />
              ))}
            </div>
          </>
        )}

        {/* ── TRANSACTIONS TAB ── */}
        {activeTab === "transactions" && (
          <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-5">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="flex items-center gap-2 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 flex-1 min-w-0">
                <Icon.search />
                <input
                  type="text"
                  placeholder="Search transactions…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-transparent text-sm outline-none w-full"
                />
              </div>

              <select
                value={filterType}
                onChange={e => setFilter(e.target.value)}
                className="border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <select
                value={sortKey}
                onChange={e => setSort(e.target.value)}
                className="border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none"
              >
                <option value="date">Sort: Date</option>
                <option value="amount">Sort: Amount</option>
                <option value="description">Sort: Name</option>
              </select>

              {isAdmin && (
                <button
                  onClick={() => setModal({ mode: "add" })}
                  className="flex items-center gap-1.5 bg-red-400 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-red-500 transition-colors"
                >
                  <Icon.plus /> Add
                </button>
              )}
            </div>

            {/* List */}
            {filtered.length === 0 ? (
              <div className="py-12 text-center opacity-30 text-sm">No transactions found</div>
            ) : (
              filtered.map(tx => (
                <TxRow key={tx.id} tx={tx} isAdmin={isAdmin} onEdit={tx => setModal({ mode: "edit", tx })} />
              ))
            )}

            <p className="text-xs opacity-30 mt-4 text-right">{filtered.length} transaction{filtered.length !== 1 ? "s" : ""}</p>
          </div>
        )}

        {/* ── INSIGHTS TAB ── */}
        {activeTab === "insights" && (
          <>
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-5">
              <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-5">Financial Insights</p>
              <Insights transactions={transactions} />
            </div>

            <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-5">
              <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Category Breakdown</p>
              <CategoryChart transactions={transactions} />
            </div>
          </>
        )}
      </main>

      {/* MODAL */}
      {modal && (
        <TxModal
          initial={modal.tx}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
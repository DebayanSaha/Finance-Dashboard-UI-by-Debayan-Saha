import React, { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import transactionsData from "../../data/transactionsData";
import { AddTransactionButton, RowActions } from "./TransactionActions";
import { useRole } from "../../context/RoleContext";
import { useTheme } from "../../context/Themecontext";
import { formatCurrency } from "../../utils/currency";
import ConfirmModal from "../common/ConfirmModal";

const PAGE_SIZE = 10;
const STORAGE_KEY = "transactions";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });


const blankTransaction = (defaultCategory = "") => ({
  id: Date.now(),
  transactionId: `TXN-NEW-${Date.now()}`,
  date: new Date().toISOString().slice(0, 10),
  title: "",
  category: defaultCategory,
  type: "Expense",
  amount: "",
  spark: [1, 1, 1, 1, 1, 1, 1],
  _isNew: true,
});

// ── Sparkline ────────────────────────────────────────────────────────────────
const Sparkline = ({ points = [0, 0], isIncome }) => {
  const safePoints = points.length > 1 ? points : [0, 0];
  const W = 80, H = 28, PAD = 2;
  const mn  = Math.min(...safePoints);
  const mx  = Math.max(...safePoints);
  const rng = mx - mn || 1;
  const x   = (i) => (PAD + (i / (safePoints.length - 1)) * (W - PAD * 2)).toFixed(1);
  const y   = (v) => (PAD + (1 - (v - mn) / rng) * (H - PAD * 2)).toFixed(1);
  const polyPts = safePoints.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const areaD   = `M${x(0)},${H} L${polyPts} L${x(safePoints.length - 1)},${H} Z`;
  const stroke  = isIncome ? "#3b6d11" : "#a32d2d";
  const fill    = isIncome ? "rgba(59,109,17,0.08)" : "rgba(163,45,45,0.08)";
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <path d={areaD} fill={fill} stroke="none" />
      <polyline points={polyPts} fill="none" stroke={stroke} strokeWidth="1.5"
        strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(safePoints.length - 1)} cy={y(safePoints[safePoints.length - 1])}
        r="2.5" fill={stroke} />
    </svg>
  );
};

// ── KPI Card ─────────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, sub, valueClass = "", darkBorderClass = "border-amber-700/40" }) => {
  const { isDark } = useTheme();
  return (
    <div className={`flex-1 border rounded-xl p-4 min-w-[140px] transition-colors duration-300
      ${isDark
        ? `bg-transparent ${darkBorderClass}`
        : "bg-white border-[#fdb74db7]"
      }`}>
      <p className={`text-sm mb-1 font-[font2] transition-colors duration-300
        ${isDark ? "text-white" : "text-gray-400"}`}>
        {label}
      </p>
      <p className={`text-3xl max-md:text-2xl font-[font1] ${isDark ? "text-white" : valueClass}`}>{value}</p>
      <p className={`text-sm font-[font2] mt-1 ${isDark ? "text-gray-400" : (valueClass || "text-gray-400")}`}>
        {sub}
      </p>
    </div>
  );
};

// ── Editable cell input ───────────────────────────────────────────────────────
const EditableInput = ({ value, onChange, type = "text", options, isDark }) => {
  const base = `w-full text-xs font-[font3] border rounded-md px-1.5 py-0.5 outline-none transition-colors duration-300
    ${isDark
      ? "bg-transparent border-gray-600 text-gray-200"
      : "bg-white border-[#fdb74db7] text-gray-700"
    }`;
  if (options) {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} className={base}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  return (
    <input type={type} value={value}
      onChange={(e) => onChange(e.target.value)} className={base} />
  );
};

// ── MOBILE TRANSACTION CARD ───────────────────────────────────────────────────
const MobileTransactionCard = ({
  tx, isEditing, draft, allCategories,
  onEdit, onDelete, onSaveEdit, onCancelEdit, updateDraft,
  role, isAdmin, isDark,
}) => {
  if (isEditing) {
    return (
      <div className={`border rounded-xl p-3 flex flex-col gap-2 transition-colors duration-300
        ${isDark ? "bg-amber-900/20 border-amber-800/40" : "bg-amber-50/40 border-amber-100"}`}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className={`text-[10px] font-[font2] mb-0.5 ${isDark ? "text-gray-400" : "text-gray-400"}`}>Date</p>
            <EditableInput type="date" value={draft.date}
              onChange={(v) => updateDraft("date", v)} isDark={isDark} />
          </div>
          <div>
            <p className={`text-[10px] font-[font2] mb-0.5 ${isDark ? "text-gray-400" : "text-gray-400"}`}>Category</p>
            <EditableInput value={draft.category}
              onChange={(v) => updateDraft("category", v)} options={allCategories} isDark={isDark} />
          </div>
          <div>
            <p className={`text-[10px] font-[font2] mb-0.5 ${isDark ? "text-gray-400" : "text-gray-400"}`}>Title</p>
            <EditableInput value={draft.title}
              onChange={(v) => updateDraft("title", v)} isDark={isDark} />
          </div>
          <div>
            <p className={`text-[10px] font-[font2] mb-0.5 ${isDark ? "text-gray-400" : "text-gray-400"}`}>Amount (₹)</p>
            <EditableInput type="number" value={draft.amount}
              onChange={(v) => updateDraft("amount", v)} isDark={isDark} />
          </div>
          <div>
            <p className={`text-[10px] font-[font2] mb-0.5 ${isDark ? "text-gray-400" : "text-gray-400"}`}>Type</p>
            <EditableInput value={draft.type}
              onChange={(v) => updateDraft("type", v)} options={["Income", "Expense"]} isDark={isDark} />
          </div>
        </div>
        {isAdmin && (
          <div className="flex gap-1">
            <button onClick={onSaveEdit}
              className={`h-7 px-3 text-xs font-[font2] border rounded-lg transition-colors
                ${isDark
                  ? "border-green-700 bg-transparent text-green-400 hover:bg-green-900/20"
                  : "border-green-200 bg-white text-green-600 hover:bg-green-50"
                }`}>
              Save
            </button>
            <button onClick={onCancelEdit}
              className={`h-7 px-3 text-xs font-[font2] border rounded-lg transition-colors
                ${isDark
                  ? "border-gray-600 bg-transparent text-gray-400 hover:bg-gray-800"
                  : "border-gray-200 bg-white text-gray-400 hover:bg-gray-100"
                }`}>
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`border rounded-xl p-3 flex flex-col gap-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]
      transition-colors duration-300
      ${isDark ? "bg-transparent border-gray-700" : "bg-white border-gray-100"}`}>
      {/* Title + type badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className={`text-sm font-[font3] truncate transition-colors duration-300
            ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {tx.title}
          </p>
          <span className={`inline-block font-[font3] px-2 py-0.5 rounded-full text-[10px] w-fit border
            ${isDark
              ? "bg-transparent text-gray-400 border-gray-700"
              : "bg-gray-100 text-gray-500 border-gray-200"
            }`}>
            {tx.category}
          </span>
        </div>
        <span className={`shrink-0 inline-block px-2 py-0.5 rounded-full text-xs font-[font2] ${
          tx.type === "Income"
            ? "bg-[#3ec6094c] text-green-800"
            : "bg-[#bf23235a] text-red-800"
        }`}>
          {tx.type}
        </span>
      </div>

      {/* Amount + sparkline + date */}
      <div className="flex items-center justify-between gap-2">
        <p className={`text-base font-[font2] tabular-nums ${
          tx.type === "Income" ? "text-green-700" : "text-orange-500"
        }`}>
          {tx.type === "Income" ? "+" : "−"} {formatCurrency(tx.amount, { type: "transaction" })}
        </p>
        <div className="flex items-center gap-2">
          <Sparkline points={tx.spark || [0, 0]} isIncome={tx.type === "Income"} />
          <p className="text-[11px] text-gray-400 font-[font3] whitespace-nowrap">
            {formatDate(tx.date)}
          </p>
        </div>
      </div>

      {/* Txn ID + actions */}
      <div className="flex items-center justify-between gap-2">
        <span className={`font-[font3] px-2 py-0.5 rounded-full text-[10px] border truncate max-w-[55%]
          ${isDark
            ? "bg-transparent text-gray-500 border-gray-700"
            : "bg-gray-100 text-gray-400 border-gray-200"
          }`}>
          {tx.transactionId}
        </span>
        <RowActions role={role} tx={tx} onEdit={onEdit}
          onDelete={onDelete} isEditing={false} />
      </div>
    </div>
  );
};

// ── MOBILE NEW ROW CARD ───────────────────────────────────────────────────────
const MobileNewRowCard = ({
  newRow, allCategories, updateNewRow, onSave, onCancel, isAdmin, isDark,
}) => (
  <div className={`border rounded-xl p-3 flex flex-col gap-2 transition-colors duration-300
    ${isDark ? "bg-amber-900/20 border-amber-800/40" : "bg-amber-50/40 border-amber-100"}`}>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <p className="text-[10px] text-gray-400 font-[font2] mb-0.5">Date</p>
        <EditableInput type="date" value={newRow.date}
          onChange={(v) => updateNewRow("date", v)} isDark={isDark} />
      </div>
      <div>
        <p className="text-[10px] text-gray-400 font-[font2] mb-0.5">Category</p>
        <EditableInput value={newRow.category}
          onChange={(v) => updateNewRow("category", v)} options={allCategories} isDark={isDark} />
      </div>
      <div>
        <p className="text-[10px] text-gray-400 font-[font2] mb-0.5">Title</p>
        <EditableInput value={newRow.title}
          onChange={(v) => updateNewRow("title", v)} isDark={isDark} />
      </div>
      <div>
        <p className="text-[10px] text-gray-400 font-[font2] mb-0.5">Amount (₹)</p>
        <EditableInput type="number" value={newRow.amount}
          onChange={(v) => updateNewRow("amount", v)} isDark={isDark} />
      </div>
      <div>
        <p className="text-[10px] text-gray-400 font-[font2] mb-0.5">Type</p>
        <EditableInput value={newRow.type}
          onChange={(v) => updateNewRow("type", v)} options={["Income", "Expense"]} isDark={isDark} />
      </div>
    </div>
    {isAdmin && (
      <div className="flex gap-1">
        <button onClick={onSave}
          className={`h-7 px-3 text-xs font-[font2] border rounded-lg transition-colors
            ${isDark
              ? "border-green-700 bg-transparent text-green-400 hover:bg-green-900/20"
              : "border-green-200 bg-white text-green-600 hover:bg-green-50"
            }`}>
          Save
        </button>
        <button onClick={onCancel}
          className={`h-7 px-3 text-xs font-[font2] border rounded-lg transition-colors
            ${isDark
              ? "border-gray-600 bg-transparent text-gray-400 hover:bg-gray-800"
              : "border-gray-200 bg-white text-gray-400 hover:bg-gray-100"
            }`}>
          Cancel
        </button>
      </div>
    )}
  </div>
);

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const TransactionsTable = () => {
  const { role }   = useRole();
  const { isDark } = useTheme();
  const isAdmin    = role === "Admin";

  const [transactions, setTransactions] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : transactionsData;
    } catch { return transactionsData; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const [editingId,  setEditingId]  = useState(null);
  const [editDraft,  setEditDraft]  = useState({});
  const [newRow,     setNewRow]     = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null); // tx awaiting confirmation

  const [search,           setSearch]           = useState("");
  const [debouncedSearch,  setDebouncedSearch]  = useState("");
  const [filterType,       setFilterType]       = useState("All");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo,   setDateTo]   = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const allCategories = useMemo(
    () => [...new Set(transactions.map((t) => t.category))],
    [transactions]
  );

  const { totalIncome, totalExpense, netBalance } = useMemo(() => {
    const income  = transactions.filter((t) => t.type === "Income").reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter((t) => t.type === "Expense").reduce((s, t) => s + t.amount, 0);
    return { totalIncome: income, totalExpense: expense, netBalance: income - expense };
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions
      .filter((tx) => tx.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
      .filter((tx) => filterType === "All" ? true : tx.type === filterType)
      .filter((tx) =>
        selectedCategories.length === 0 ? true : selectedCategories.includes(tx.category)
      )
      .filter((tx) => {
        if (!dateFrom && !dateTo) return true;
        const txDate = new Date(tx.date);
        if (dateFrom && txDate < new Date(dateFrom)) return false;
        if (dateTo   && txDate > new Date(dateTo))   return false;
        return true;
      })
      .sort((a, b) => {
        if (sortOrder === "latest") return new Date(b.date) - new Date(a.date);
        if (sortOrder === "oldest") return new Date(a.date) - new Date(b.date);
        if (sortOrder === "high")   return b.amount - a.amount;
        if (sortOrder === "low")    return a.amount - b.amount;
        return 0;
      });
  }, [transactions, debouncedSearch, filterType, selectedCategories, dateFrom, dateTo, sortOrder]);

  const totalPages   = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage  = Math.min(page, totalPages);
  const paginated    = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  );

  const handleSearch      = (e) => { setSearch(e.target.value); setPage(1); };
  const handleFilter      = (e) => { setFilterType(e.target.value); setPage(1); };
  const handleSort        = (e) => { setSortOrder(e.target.value); setPage(1); };
  const handleDateFrom    = (e) => { setDateFrom(e.target.value); setPage(1); };
  const handleDateTo      = (e) => { setDateTo(e.target.value); setPage(1); };

  const handleCategoryToggle = useCallback((cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setPage(1);
  }, []);

  const handleClearCategories = useCallback(() => {
    setSelectedCategories([]); setPage(1);
  }, []);

  const handleExport = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const data   = stored ? JSON.parse(stored) : transactions;
      const blob   = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url    = URL.createObjectURL(blob);
      const a      = document.createElement("a");
      a.href = url;
      a.download = `transactions_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Transactions exported successfully");
    } catch { toast.error("Export failed"); }
  }, [transactions]);

  const handleAdd = useCallback(() => {
    if (newRow) return;
    setNewRow(blankTransaction(allCategories[0] || ""));
    setPage(1);
  }, [newRow, allCategories]);

  const updateNewRow = useCallback((field, value) => {
    setNewRow((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSaveNew = useCallback(() => {
    if (!newRow.title.trim() || !newRow.category.trim() || !newRow.amount) return;
    const saved = {
      ...newRow,
      amount: Number(newRow.amount),
      transactionId: `TXN-NEW-${newRow.id}`,
      _isNew: undefined,
    };
    setTransactions((prev) => [saved, ...prev]);
    setNewRow(null);
    toast.success("Transaction added successfully");
  }, [newRow]);

  const handleCancelNew  = useCallback(() => setNewRow(null), []);
  const handleEdit       = useCallback((tx) => { setEditingId(tx.id); setEditDraft({ ...tx }); }, []);
  const updateDraft      = useCallback((field, value) => {
    setEditDraft((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSaveEdit = useCallback(() => {
    setTransactions((prev) =>
      prev.map((tx) => String(tx.id) === String(editingId)
        ? { ...editDraft, amount: Number(editDraft.amount) } : tx)
    );
    setEditingId(null);
    setEditDraft({});
    toast.success("Transaction updated successfully");
  }, [editingId, editDraft]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null); setEditDraft({});
  }, []);

  const handleDelete = useCallback((tx) => {
    setPendingDelete(tx);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!pendingDelete) return;
    setTransactions((prev) => prev.filter((t) => String(t.id) !== String(pendingDelete.id)));
    toast.success("Transaction deleted successfully");
    setPendingDelete(null);
  }, [pendingDelete]);

  const cancelDelete = useCallback(() => setPendingDelete(null), []);

  // Desktop Save/Cancel buttons
  const SaveCancelButtons = ({ onSave, onCancel }) => (
    <div className="flex gap-1">
      <button onClick={onSave}
        className={`h-6 px-2 text-xs font-[font2] border rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95
          ${isDark
            ? "border-green-700 bg-transparent text-green-400 hover:bg-green-900/20"
            : "border-green-200 bg-white text-green-600 hover:bg-green-50"
          }`}>
        Save
      </button>
      <button onClick={onCancel}
        className={`h-6 px-2 text-xs font-[font2] border rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95
          ${isDark
            ? "border-gray-600 bg-transparent text-gray-400 hover:bg-gray-800"
            : "border-gray-200 bg-white text-gray-400 hover:bg-gray-100"
          }`}>
        Cancel
      </button>
    </div>
  );

  // Reusable control class
  const controlClass = `h-8 px-3 text-xs border font-[font2] rounded-full outline-none transition-colors duration-300
    ${isDark
      ? "border-amber-700/40 bg-transparent text-gray-300"
      : "border-[#fdb74db7] bg-white text-gray-700"
    }`;

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-6xl mx-auto max-md:p-3 max-sm:p-2">

      {/* ── KPI Cards ── */}
      <div className="flex gap-3 mb-6 max-md:flex-wrap max-sm:flex-col">
        <KpiCard
          label="Total value locked"
          value={formatCurrency(netBalance, { type: "kpi" })}
          sub={`Net ${netBalance >= 0 ? "surplus" : "deficit"} · ${transactions.length} transactions`}
          valueClass={netBalance >= 0 ? "text-green-800" : "text-red-800"}
          darkBorderClass="border-green-800"
        />
        <KpiCard
          label="Total income"
          value={formatCurrency(totalIncome, { type: "kpi" })}
          sub={`${transactions.filter((t) => t.type === "Income").length} income entries`}
          valueClass="text-green-800"
          darkBorderClass="border-green-500"
        />
        <KpiCard
          label="Total expenses"
          value={formatCurrency(totalExpense, { type: "kpi" })}
          sub={`${transactions.filter((t) => t.type === "Expense").length} expense entries`}
          valueClass="text-red-800"
          darkBorderClass="border-red-500"
        />
      </div>

      <h2 className={`text-xl font-[font2] mb-3 transition-colors duration-300
        ${isDark ? "text-gray-100" : "text-gray-800"}`}>
        Transactions
      </h2>

      {/* ── Controls Row ── */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <input
          type="text"
          placeholder="Enter title…"
          value={search}
          onChange={handleSearch}
          className={`rounded-full font-[font2] h-8 px-3 text-xs border outline-none
            w-48 max-sm:w-full transition-colors duration-300
            ${isDark
              ? "border-amber-700/40 bg-transparent text-gray-300 placeholder-gray-600"
              : "border-[#fdb74db7] bg-white text-gray-700 placeholder-gray-400"
            }`}
        />
        <select value={filterType} onChange={handleFilter} className={controlClass}>
          <option value="All">All types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        <select value={sortOrder} onChange={handleSort} className={controlClass}>
          <option value="latest">Latest first</option>
          <option value="oldest">Oldest first</option>
          <option value="high">Amount: High → Low</option>
          <option value="low">Amount: Low → High</option>
        </select>
        <input
          type="date" value={dateFrom} onChange={handleDateFrom} title="From date"
          className={controlClass + " w-36 px-2 max-sm:flex-1"}
        />
        <span className="text-xs text-gray-400 font-[font2]">to</span>
        <input
          type="date" value={dateTo} onChange={handleDateTo} title="To date"
          className={controlClass + " w-36 px-2 max-sm:flex-1"}
        />
        <AddTransactionButton role={role} onAdd={handleAdd} />
        <button
          onClick={handleExport}
          className={`h-8 px-3 text-xs font-[font2] border rounded-full outline-none
            transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95 cursor-pointer
            ${isDark
              ? "border-green-700/50 bg-transparent text-gray-300 hover:bg-green-900/20"
              : "border-[#5cfd4db7] bg-white text-gray-700 hover:bg-green-50"
            }`}
        >
          Export Transactions
        </button>
        <span className="ml-auto text-xs text-gray-400">
          {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Category pills ── */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`text-xs font-[font2] ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          Categories:
        </span>
        {allCategories.map((cat) => {
          const active = selectedCategories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => handleCategoryToggle(cat)}
              className={`h-7 px-2.5 text-xs font-[font2] border rounded-full transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95
                ${active
                  ? isDark
                    ? "border-amber-600 bg-amber-900/30 text-amber-300"
                    : "border-[#fdb74d] bg-amber-50 text-amber-700"
                  : isDark
                    ? "border-gray-600 bg-transparent text-gray-400 hover:bg-gray-800"
                    : "border-[#fdb74db7] bg-white text-gray-500 hover:bg-amber-50"
                }`}
            >
              {cat}
            </button>
          );
        })}
        {selectedCategories.length > 0 && (
          <button
            onClick={handleClearCategories}
            className={`h-7 px-2.5 text-xs font-[font2] border rounded-full transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95
              ${isDark
                ? "border-gray-600 bg-transparent text-gray-400 hover:bg-gray-800"
                : "border-gray-200 bg-white text-gray-400 hover:bg-gray-100"
              }`}
          >
            Clear
          </button>
        )}
      </div>

      {/* ════════════════════════════ DESKTOP TABLE ════════════════════════════ */}
      <div className={`border rounded-xl overflow-hidden max-md:hidden transition-colors duration-300
        ${isDark ? "border-gray-700" : "border-gray-200"}`}>
        <table className="w-full border-collapse text-left" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "120px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "90px" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "80px" }} />
            <col style={{ width: "110px" }} />
          </colgroup>
          <thead className={`sticky top-0 z-10 transition-colors duration-300
            ${isDark ? "bg-black" : "bg-gray-50"}`}>
            <tr>
              {["Txn ID", "Date", "Title", "Category", "24h Trend", "Amount", "Type", "Actions"].map((h) => (
                <th key={h}
                  className={`px-3 py-2.5 text-xs font-[font1] border-b truncate transition-colors duration-300
                    ${isDark ? "text-gray-400 border-gray-700" : "text-gray-500 border-gray-200"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* ── New row ── */}
            {newRow && currentPage === 1 && (
              <tr className={`border-b transition-colors duration-300
                ${isDark ? "border-amber-800/40 bg-amber-900/20" : "border-amber-100 bg-amber-50/40"}`}>
                <td className="px-3 py-2.5">
                  <span className={`inline-block font-[font3] px-2 py-0.5 rounded-full text-xs border truncate max-w-full
                    ${isDark ? "bg-transparent text-gray-500 border-gray-600" : "bg-gray-100 text-gray-400 border-gray-200"}`}>
                    auto
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <EditableInput type="date" value={newRow.date} onChange={(v) => updateNewRow("date", v)} isDark={isDark} />
                </td>
                <td className="px-3 py-2.5">
                  <EditableInput value={newRow.title} onChange={(v) => updateNewRow("title", v)} isDark={isDark} />
                </td>
                <td className="px-3 py-2.5">
                  <EditableInput value={newRow.category} onChange={(v) => updateNewRow("category", v)} options={allCategories} isDark={isDark} />
                </td>
                <td className="px-3 py-2">
                  <Sparkline points={[1,1,1,1,1,1,1]} isIncome={newRow.type === "Income"} />
                </td>
                <td className="px-3 py-2.5">
                  <EditableInput type="number" value={newRow.amount} onChange={(v) => updateNewRow("amount", v)} isDark={isDark} />
                </td>
                <td className="px-3 py-2.5">
                  <EditableInput value={newRow.type} onChange={(v) => updateNewRow("type", v)} options={["Income", "Expense"]} isDark={isDark} />
                </td>
                <td className="px-3 py-2.5">
                  {isAdmin && <SaveCancelButtons onSave={handleSaveNew} onCancel={handleCancelNew} />}
                </td>
              </tr>
            )}

            {/* ── Empty state ── */}
            {paginated.length === 0 && !newRow ? (
              <tr>
                <td colSpan={8} className={`text-center py-8 text-xl font-[font2]
                  ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                  No transactions found. Try adjusting filters.
                </td>
              </tr>
            ) : (
              paginated.map((tx) => {
                const isEditing = editingId === tx.id;
                const draft     = isEditing ? editDraft : tx;
                return (
                  <tr key={tx.id}
                    className={`border-b last:border-b-0 transition-all duration-200 ease-in-out hover:scale-[1.01] hover:shadow-sm dark:hover:shadow-black/20
                      ${isEditing
                        ? isDark ? "bg-amber-900/20" : "bg-amber-50/40"
                        : isDark ? "border-gray-700/50 hover:bg-gray-800/50" : "border-gray-100 hover:bg-gray-50"
                      }`}>
                    {/* TXN ID */}
                    <td className="px-3 py-2.5">
                      <span className={`inline-block font-[font3] px-2 py-0.5 rounded-full text-xs border truncate max-w-full
                        ${isDark
                          ? "bg-transparent text-gray-400 border-gray-600"
                          : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}>
                        {tx.transactionId}
                      </span>
                    </td>
                    {/* DATE */}
                    <td className="px-3 py-2.5 text-xs text-gray-400 font-[font3] truncate">
                      {isEditing
                        ? <EditableInput type="date" value={draft.date} onChange={(v) => updateDraft("date", v)} isDark={isDark} />
                        : formatDate(tx.date)}
                    </td>
                    {/* TITLE */}
                    <td className={`px-3 py-2.5 text-xs font-[font3] truncate transition-colors duration-300
                      ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      {isEditing
                        ? <EditableInput value={draft.title} onChange={(v) => updateDraft("title", v)} isDark={isDark} />
                        : tx.title}
                    </td>
                    {/* CATEGORY */}
                    <td className="px-3 py-2.5">
                      {isEditing
                        ? <EditableInput value={draft.category} onChange={(v) => updateDraft("category", v)} options={allCategories} isDark={isDark} />
                        : <span className={`inline-block font-[font3] px-2 py-0.5 rounded-full text-xs border truncate max-w-full
                            ${isDark
                              ? "bg-transparent text-gray-400 border-gray-600"
                              : "bg-gray-100 text-gray-500 border-gray-200"
                            }`}>{tx.category}</span>}
                    </td>
                    {/* 24H TREND */}
                    <td className="px-3 py-2">
                      <Sparkline
                        points={tx.spark || [0, 0]}
                        isIncome={isEditing ? draft.type === "Income" : tx.type === "Income"}
                      />
                    </td>
                    {/* AMOUNT */}
                    <td className={`px-3 py-2.5 text-xs font-[font2] tabular-nums ${
                      (isEditing ? draft.type : tx.type) === "Income"
                        ? "text-green-700" : "text-orange-500"
                    }`}>
                      {isEditing
                        ? <EditableInput type="number" value={draft.amount} onChange={(v) => updateDraft("amount", v)} isDark={isDark} />
                        : `${tx.type === "Income" ? "+" : "−"} ${formatCurrency(tx.amount, { type: "transaction" })}`}
                    </td>
                    {/* TYPE */}
                    <td className="px-3 py-2.5">
                      {isEditing
                        ? <EditableInput value={draft.type} onChange={(v) => updateDraft("type", v)} options={["Income", "Expense"]} isDark={isDark} />
                        : <span className={`inline-block px-3 py-1 rounded-full text-xs font-[font2] ${
                            tx.type === "Income"
                              ? "bg-[#3ec6094c] text-green-800"
                              : "bg-[#bf23235a] text-red-800"
                          }`}>{tx.type}</span>}
                    </td>
                    {/* ACTIONS */}
                    <td className="px-3 py-2.5">
                      {isEditing
                        ? <SaveCancelButtons onSave={handleSaveEdit} onCancel={handleCancelEdit} />
                        : <RowActions role={role} tx={tx} onEdit={handleEdit} onDelete={handleDelete} isEditing={false} />}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ════════════════════════════ MOBILE CARD LIST ════════════════════════ */}
      <div className="hidden max-md:flex flex-col gap-2">
        {newRow && currentPage === 1 && (
          <MobileNewRowCard
            newRow={newRow} allCategories={allCategories} updateNewRow={updateNewRow}
            onSave={handleSaveNew} onCancel={handleCancelNew} isAdmin={isAdmin} isDark={isDark}
          />
        )}

        {paginated.length === 0 && !newRow ? (
          <p className={`text-center py-8 text-base font-[font2]
            ${isDark ? "text-gray-600" : "text-gray-400"}`}>
            No transactions found. Try adjusting filters.
          </p>
        ) : (
          paginated.map((tx) => (
            <MobileTransactionCard
              key={tx.id}
              tx={tx}
              isEditing={editingId === tx.id}
              draft={editingId === tx.id ? editDraft : tx}
              allCategories={allCategories}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              updateDraft={updateDraft}
              role={role}
              isAdmin={isAdmin}
              isDark={isDark}
            />
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      <div className={`flex items-center justify-between px-3 py-2.5 border-t
        max-sm:flex-col max-sm:items-start max-sm:gap-2 transition-colors duration-300
        ${isDark ? "bg-transparent border-gray-700" : "bg-gray-50 border-gray-200"}`}>
        <span className="text-xs text-gray-400">
          {filtered.length === 0 ? "" : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(
            currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={currentPage <= 1}
            className={`h-7 px-3 text-xs border rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95
              disabled:opacity-40 disabled:cursor-not-allowed
              ${isDark
                ? "border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
              }`}
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={currentPage >= totalPages}
            className={`h-7 px-3 text-xs border rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95
              disabled:opacity-40 disabled:cursor-not-allowed
              ${isDark
                ? "border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
              }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* ── ConfirmModal — replaces window.confirm() ── */}
      <ConfirmModal
        isOpen={pendingDelete !== null}
        title={pendingDelete ? `Delete "${pendingDelete.title}"?` : ""}
        message="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

    </div>
  );
};

export default TransactionsTable;
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import transactionsData from "../../data/transactionsData";
import { AddTransactionButton, RowActions } from "./TransactionActions";
import { useRole } from "../../context/RoleContext";

const PAGE_SIZE = 10;
const STORAGE_KEY = "transactions";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatMoney = (n) => "₹" + n.toLocaleString("en-IN");

// ── Blank transaction template for new rows ───────────────────────────────────
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

// ── Sparkline ─────────────────────────────────────────────────────────────────
const Sparkline = ({ points = [0, 0], isIncome }) => {
  const safePoints = points.length > 1 ? points : [0, 0];
  const W = 80, H = 28, PAD = 2;
  const mn = Math.min(...safePoints);
  const mx = Math.max(...safePoints);
  const rng = mx - mn || 1;
  const x = (i) => (PAD + (i / (safePoints.length - 1)) * (W - PAD * 2)).toFixed(1);
  const y = (v) => (PAD + (1 - (v - mn) / rng) * (H - PAD * 2)).toFixed(1);
  const polyPts = safePoints.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const areaD = `M${x(0)},${H} L${polyPts} L${x(safePoints.length - 1)},${H} Z`;
  const stroke = isIncome ? "#3b6d11" : "#a32d2d";
  const fill = isIncome ? "rgba(59,109,17,0.08)" : "rgba(163,45,45,0.08)";

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <path d={areaD} fill={fill} stroke="none" />
      <polyline
        points={polyPts}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle
        cx={x(safePoints.length - 1)}
        cy={y(safePoints[safePoints.length - 1])}
        r="2.5"
        fill={stroke}
      />
    </svg>
  );
};

// ── KPI Card ──────────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, sub, valueClass = "" }) => (
  <div className="flex-1 bg-white border border-[#fdb74db7] rounded-xl p-4">
    <p className="text-sm text-gray-400 mb-1 font-[font2]">{label}</p>
    <p className={`text-3xl font-[font1] ${valueClass}`}>{value}</p>
    <p className={`text-sm font-[font2] mt-1 ${valueClass || "text-gray-400"}`}>{sub}</p>
  </div>
);

// ── Inline editable cell input ────────────────────────────────────────────────
const EditableInput = ({ value, onChange, type = "text", options }) => {
  const base =
    "w-full text-xs font-[font3] text-gray-700 border border-[#fdb74db7] rounded-md px-1.5 py-0.5 outline-none bg-white";

  if (options) {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} className={base}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={base}
    />
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const TransactionsTable = () => {
  const { role } = useRole();
  const isAdmin = role === "Admin";

  // ── Transactions: lazy-init from localStorage, fallback to JSON ──
  const [transactions, setTransactions] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : transactionsData;
    } catch {
      return transactionsData;
    }
  });

  // ── Persist transactions to localStorage on every change ──
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // ── Editing state ──
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({});

  // ── New row pending state ──
  const [newRow, setNewRow] = useState(null);

  // ── Filters ──
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");           // kept for backward compat
  const [selectedCategories, setSelectedCategories] = useState([]);      // NEW: multi-category
  const [dateFrom, setDateFrom] = useState("");                          // NEW: date range start
  const [dateTo, setDateTo] = useState("");                              // NEW: date range end
  const [sortOrder, setSortOrder] = useState("latest");
  const [page, setPage] = useState(1);

  // ── Debounce Search ──
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Categories ──
  const allCategories = useMemo(
    () => [...new Set(transactions.map((t) => t.category))],
    [transactions]
  );

  // ── KPIs ──
  const { totalIncome, totalExpense, netBalance } = useMemo(() => {
    const income = transactions.filter((t) => t.type === "Income").reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter((t) => t.type === "Expense").reduce((s, t) => s + t.amount, 0);
    return { totalIncome: income, totalExpense: expense, netBalance: income - expense };
  }, [transactions]);

  // ── Filter + Sort ──
  const filtered = useMemo(() => {
    return transactions
      .filter((tx) => tx.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
      .filter((tx) => (filterType === "All" ? true : tx.type === filterType))
      // Multi-category filter: if nothing selected, show all
      .filter((tx) =>
        selectedCategories.length === 0 ? true : selectedCategories.includes(tx.category)
      )
      // Date range filter
      .filter((tx) => {
        if (!dateFrom && !dateTo) return true;
        const txDate = new Date(tx.date);
        if (dateFrom && txDate < new Date(dateFrom)) return false;
        if (dateTo && txDate > new Date(dateTo)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortOrder === "latest") return new Date(b.date) - new Date(a.date);
        if (sortOrder === "oldest") return new Date(a.date) - new Date(b.date);
        if (sortOrder === "high") return b.amount - a.amount;
        if (sortOrder === "low") return a.amount - b.amount;
        return 0;
      });
  }, [transactions, debouncedSearch, filterType, selectedCategories, dateFrom, dateTo, sortOrder]);

  // ── Pagination ──
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  );

  // ── Filter handlers ──
  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleFilter = (e) => { setFilterType(e.target.value); setPage(1); };
  const handleSort = (e) => { setSortOrder(e.target.value); setPage(1); };

  // NEW: Multi-category toggle
  const handleCategoryToggle = useCallback((cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setPage(1);
  }, []);

  const handleClearCategories = useCallback(() => {
    setSelectedCategories([]);
    setPage(1);
  }, []);

  // NEW: Date range handlers
  const handleDateFrom = (e) => { setDateFrom(e.target.value); setPage(1); };
  const handleDateTo = (e) => { setDateTo(e.target.value); setPage(1); };

  // ── EXPORT: download localStorage transactions as JSON ──────────────────────
  const handleExport = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : transactions;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Transactions exported successfully");
    } catch {
      toast.error("Export failed");
    }
  }, [transactions]);

  // ── ADD ──
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

  const handleCancelNew = useCallback(() => setNewRow(null), []);

  // ── EDIT ──
  const handleEdit = useCallback((tx) => {
    setEditingId(tx.id);
    setEditDraft({ ...tx });
  }, []);

  const updateDraft = useCallback((field, value) => {
    setEditDraft((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSaveEdit = useCallback(() => {
    setTransactions((prev) =>
      prev.map((tx) =>
        String(tx.id) === String(editingId)
          ? { ...editDraft, amount: Number(editDraft.amount) }
          : tx
      )
    );
    setEditingId(null);
    setEditDraft({});
    toast.success("Transaction updated successfully");
  }, [editingId, editDraft]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditDraft({});
  }, []);

  // ── DELETE ──
  const handleDelete = useCallback((tx) => {
    if (!window.confirm(`Delete "${tx.title}"? This cannot be undone.`)) return;
    setTransactions((prev) => prev.filter((t) => String(t.id) !== String(tx.id)));
    toast.success("Transaction deleted successfully");
  }, []);

  // ── Save/Cancel buttons ──
  const SaveCancelButtons = ({ onSave, onCancel }) => (
    <div className="flex gap-1">
      <button
        onClick={onSave}
        className="h-6 px-2 text-xs font-[font2] border border-green-200 rounded-lg bg-white text-green-600 hover:bg-green-50 transition-colors"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        className="h-6 px-2 text-xs font-[font2] border border-gray-200 rounded-lg bg-white text-gray-400 hover:bg-gray-100 transition-colors"
      >
        Cancel
      </button>
    </div>
  );

  // ── Shared input class (reused from existing controls) ────────────────────
  const controlClass =
    "h-8 px-3 text-xs border font-[font2] border-[#fdb74db7] rounded-full bg-white outline-none text-gray-700";

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* ── KPI Cards ── */}
      <div className="flex gap-3 mb-6">
        <KpiCard
          label="Total value locked"
          value={formatMoney(netBalance)}
          sub={`Net ${netBalance >= 0 ? "surplus" : "deficit"} · ${transactions.length} transactions`}
          valueClass={netBalance >= 0 ? "text-green-800" : "text-red-800"}
        />
        <KpiCard
          label="Total income"
          value={formatMoney(totalIncome)}
          sub={`${transactions.filter((t) => t.type === "Income").length} income entries`}
          valueClass="text-green-800"
        />
        <KpiCard
          label="Total expenses"
          value={formatMoney(totalExpense)}
          sub={`${transactions.filter((t) => t.type === "Expense").length} expense entries`}
          valueClass="text-red-800"
        />
      </div>

      {/* ── Section Title ── */}
      <h2 className="text-xl font-[font2] text-gray-800 mb-3">Transactions</h2>

      {/* ── Controls Row 1: existing filters ── */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {/* Search */}
        <input
          type="text"
          placeholder="Enter title…"
          value={search}
          onChange={handleSearch}
          className="rounded-full font-[font2] h-8 px-3 text-xs border border-[#fdb74db7] bg-white outline-none text-gray-700 placeholder-gray-400 w-48"
        />

        {/* Type filter */}
        <select
          value={filterType}
          onChange={handleFilter}
          className={controlClass}
        >
          <option value="All">All types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        {/* Sort */}
        <select
          value={sortOrder}
          onChange={handleSort}
          className={controlClass}
        >
          <option value="latest">Latest first</option>
          <option value="oldest">Oldest first</option>
          <option value="high">Amount: High → Low</option>
          <option value="low">Amount: Low → High</option>
        </select>

        {/* ── NEW: Date Range ── */}
        <input
          type="date"
          value={dateFrom}
          onChange={handleDateFrom}
          title="From date"
          className={controlClass + " w-36 px-2"}
        />
        <span className="text-xs text-gray-400 font-[font2]">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={handleDateTo}
          title="To date"
          className={controlClass + " w-36 px-2"}
        />

        {/* Add Transaction button */}
        <AddTransactionButton role={role} onAdd={handleAdd} />

        {/* ── NEW: Export button ── */}
        <button
          onClick={handleExport}
          className="h-8 px-3 text-xs font-[font2] border border-[#5cfd4db7] rounded-full bg-white outline-none text-gray-700 hover:bg-green-50 transition-colors cursor-pointer"
        >
          Export Transactions
        </button>

        <span className="ml-auto text-xs text-gray-400">
          {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Controls Row 2: NEW multi-category filter ── */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-xs font-[font2] text-gray-400">Categories:</span>
        {allCategories.map((cat) => {
          const active = selectedCategories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => handleCategoryToggle(cat)}
              className={`h-7 px-2.5 text-xs font-[font2] border rounded-full transition-colors ${
                active
                  ? "border-[#fdb74d] bg-amber-50 text-amber-700"
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
            className="h-7 px-2.5 text-xs font-[font2] border border-gray-200 rounded-full bg-white text-gray-400 hover:bg-gray-100 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
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

          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {[
                "Txn ID", "Date", "Title", "Category",
                "24h Trend", "Amount", "Type", "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-xs font-[font1] text-gray-500 border-b border-gray-200 truncate"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* ── NEW ROW ── */}
            {newRow && currentPage === 1 && (
              <tr className="border-b border-amber-100 bg-amber-50/40">
                <td className="px-3 py-2.5">
                  <span className="inline-block font-[font3] px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-400 border border-gray-200 truncate max-w-full">
                    auto
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <EditableInput type="date" value={newRow.date} onChange={(v) => updateNewRow("date", v)} />
                </td>
                <td className="px-3 py-2.5">
                  <EditableInput value={newRow.title} onChange={(v) => updateNewRow("title", v)} />
                </td>
                <td className="px-3 py-2.5">
                  <EditableInput value={newRow.category} onChange={(v) => updateNewRow("category", v)} options={allCategories} />
                </td>
                <td className="px-3 py-2">
                  <Sparkline points={[1, 1, 1, 1, 1, 1, 1]} isIncome={newRow.type === "Income"} />
                </td>
                <td className="px-3 py-2.5">
                  <EditableInput type="number" value={newRow.amount} onChange={(v) => updateNewRow("amount", v)} />
                </td>
                <td className="px-3 py-2.5">
                  <EditableInput value={newRow.type} onChange={(v) => updateNewRow("type", v)} options={["Income", "Expense"]} />
                </td>
                {isAdmin && (
                  <td className="px-3 py-2.5">
                    <SaveCancelButtons onSave={handleSaveNew} onCancel={handleCancelNew} />
                  </td>
                )}
              </tr>
            )}

            {/* ── EXISTING ROWS ── */}
            {paginated.length === 0 && !newRow ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-xl text-gray-400 font-[font2]">
                  No transactions found. Try adjusting filters.
                </td>
              </tr>
            ) : (
              paginated.map((tx) => {
                const isEditing = editingId === tx.id;
                const draft = isEditing ? editDraft : tx;

                return (
                  <tr
                    key={tx.id}
                    className={`border-b border-gray-100 last:border-b-0 transition-colors duration-100 ${
                      isEditing ? "bg-amber-50/40" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-3 py-2.5">
                      <span className="inline-block font-[font3] px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 border border-gray-200 truncate max-w-full">
                        {tx.transactionId}
                      </span>
                    </td>

                    <td className="px-3 py-2.5 text-xs text-gray-400 font-[font3] truncate">
                      {isEditing ? (
                        <EditableInput type="date" value={draft.date} onChange={(v) => updateDraft("date", v)} />
                      ) : (
                        formatDate(tx.date)
                      )}
                    </td>

                    <td className="px-3 py-2.5 text-xs font-[font3] text-gray-700 truncate">
                      {isEditing ? (
                        <EditableInput value={draft.title} onChange={(v) => updateDraft("title", v)} />
                      ) : (
                        tx.title
                      )}
                    </td>

                    <td className="px-3 py-2.5">
                      {isEditing ? (
                        <EditableInput value={draft.category} onChange={(v) => updateDraft("category", v)} options={allCategories} />
                      ) : (
                        <span className="inline-block font-[font3] px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 border border-gray-200 truncate max-w-full">
                          {tx.category}
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-2">
                      <Sparkline
                        points={tx.spark || [0, 0]}
                        isIncome={isEditing ? draft.type === "Income" : tx.type === "Income"}
                      />
                    </td>

                    <td className={`px-3 py-2.5 text-xs font-[font2] tabular-nums ${
                      (isEditing ? draft.type : tx.type) === "Income" ? "text-green-700" : "text-orange-500"
                    }`}>
                      {isEditing ? (
                        <EditableInput type="number" value={draft.amount} onChange={(v) => updateDraft("amount", v)} />
                      ) : (
                        `${tx.type === "Income" ? "+" : "−"} ${formatMoney(tx.amount)}`
                      )}
                    </td>

                    <td className="px-3 py-2.5">
                      {isEditing ? (
                        <EditableInput value={draft.type} onChange={(v) => updateDraft("type", v)} options={["Income", "Expense"]} />
                      ) : (
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-[font2] ${
                          tx.type === "Income" ? "bg-[#3ec6094c] text-green-800" : "bg-[#bf23235a] text-red-800"
                        }`}>
                          {tx.type}
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-2.5">
                      {isEditing ? (
                        <SaveCancelButtons onSave={handleSaveEdit} onCancel={handleCancelEdit} />
                      ) : (
                        <RowActions role={role} tx={tx} onEdit={handleEdit} onDelete={handleDelete} isEditing={false} />
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 border-t border-gray-200">
        <span className="text-xs text-gray-400">
          {filtered.length === 0
            ? ""
            : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(
                currentPage * PAGE_SIZE,
                filtered.length
              )} of ${filtered.length}`}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={currentPage <= 1}
            className="h-7 px-3 text-xs border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={currentPage >= totalPages}
            className="h-7 px-3 text-xs border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;
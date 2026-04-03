import React, { useState } from "react";
import transactionsData from "../data/transactionsData";

const PAGE_SIZE = 10;

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatMoney = (n) => "₹" + n.toLocaleString("en-IN");

// ── Sparkline ─────────────────────────────────────────────────────────────────
const Sparkline = ({ points, isIncome }) => {
  const W = 80,
    H = 28,
    PAD = 2;
  const mn = Math.min(...points);
  const mx = Math.max(...points);
  const rng = mx - mn || 1;
  const x = (i) => (PAD + (i / (points.length - 1)) * (W - PAD * 2)).toFixed(1);
  const y = (v) => (PAD + (1 - (v - mn) / rng) * (H - PAD * 2)).toFixed(1);

  const polyPts = points.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const areaD = `M${x(0)},${H} L${polyPts} L${x(points.length - 1)},${H} Z`;

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
        cx={x(points.length - 1)}
        cy={y(points[points.length - 1])}
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

// ── Main Component ────────────────────────────────────────────────────────────
const TransactionsTable = () => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortOrder, setSortOrder] = useState("latest");
  const [page, setPage] = useState(1);

  // KPI calculations
  const totalIncome = transactionsData
    .filter((t) => t.type === "Income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactionsData
    .filter((t) => t.type === "Expense")
    .reduce((s, t) => s + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  // Filtered + sorted data
  const filtered = transactionsData
    .filter((tx) => tx.title.toLowerCase().includes(search.toLowerCase()))
    .filter((tx) => (filterType === "All" ? true : tx.type === filterType))
    .sort((a, b) => {
      if (sortOrder === "latest") return new Date(b.date) - new Date(a.date);
      if (sortOrder === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortOrder === "high") return b.amount - a.amount;
      if (sortOrder === "low") return a.amount - b.amount;
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleFilter = (e) => { setFilterType(e.target.value); setPage(1); };
  const handleSort = (e) => { setSortOrder(e.target.value); setPage(1); };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* ── KPI Cards ── */}
      <div className="flex gap-3 mb-6">
        <KpiCard
          label="Total value locked"
          value={formatMoney(netBalance)}
          sub={`Net ${netBalance >= 0 ? "surplus" : "deficit"} · ${transactionsData.length} transactions`}
          valueClass={netBalance >= 0 ? "text-green-800" : "text-red-800"}
        />
        <KpiCard
          label="Total income"
          value={formatMoney(totalIncome)}
          sub={`${transactionsData.filter((t) => t.type === "Income").length} income entries`}
          valueClass="text-green-800"
        />
        <KpiCard
          label="Total expenses"
          value={formatMoney(totalExpense)}
          sub={`${transactionsData.filter((t) => t.type === "Expense").length} expense entries`}
          valueClass="text-red-800"
        />
      </div>

      {/* ── Section Title ── */}
      <h2 className="text-xl font-[font2] text-gray-800 mb-3">Transactions</h2>

      {/* ── Controls ── */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <input
          type="text"
          placeholder="Search transactions…"
          value={search}
          onChange={handleSearch}
          className="rounded-full font-[font2] h-8 px-3 text-xs border border-[#fdb74db7] bg-white outline-none text-gray-700 placeholder-gray-400 w-48"
        />
        <select
          value={filterType}
          onChange={handleFilter}
          className="h-8 px-3 text-xs border font-[font2] border-[#fdb74db7] rounded-full bg-white outline-none text-gray-700"
        >
          <option value="All">All types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        <select
          value={sortOrder}
          onChange={handleSort}
          className="h-8 px-3 text-xs font-[font2] border border-[#fdb74db7] rounded-full bg-white outline-none text-gray-700"
        >
          <option value="latest">Latest first</option>
          <option value="oldest">Oldest first</option>
          <option value="high">Amount: High → Low</option>
          <option value="low">Amount: Low → High</option>
        </select>
        <span className="ml-auto text-xs text-gray-400">
          {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Table ── */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full border-collapse text-left" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "100px" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "90px" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "80px" }} />
          </colgroup>

          <thead className="bg-gray-50">
            <tr>
              {["Date", "Title", "Category", "24h Trend", "Amount", "Type"].map((h) => (
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
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-xs text-gray-400">
                  No transactions found
                </td>
              </tr>
            ) : (
              paginated.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-100"
                >
                  <td className="px-3 py-2.5 text-xs text-gray-400 font-[font3] truncate">
                    {formatDate(tx.date)}
                  </td>
                  <td className="px-3 py-2.5 text-xs font-[font3] text-gray-700 truncate">
                    {tx.title}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="inline-block font-[font3] px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 border border-gray-200 truncate max-w-full">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <Sparkline points={tx.spark} isIncome={tx.type === "Income"} />
                  </td>
                  <td
                    className={`px-3 py-2.5 text-xs font-[font2] tabular-nums ${
                      tx.type === "Income" ? "text-green-700" : "text-orange-500"
                    }`}
                  >
                    {tx.type === "Income" ? "+" : "−"} {formatMoney(tx.amount)}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-[font2] ${
                        tx.type === "Income"
                          ? "bg-[#3ec6094c] text-green-800"
                          : "bg-[#bf23235a] text-red-800"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ── Footer / Pagination ── */}
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
    </div>
  );
};

export default TransactionsTable;
import { useTheme } from "../../context/Themecontext";
import { formatCurrency } from "../../utils/currency";

// ─── Extract from JSON ─────────────────────────────────────────────
import data from "../../data/insightsData.json";
const { rawData, transactionData, categoryEngine } = data;

// ─── Recompute values (REQUIRED) ───────────────────────────────────
const currentMonthIncome = rawData.currentMonthIncome;
const lastMonthIncome    = rawData.lastMonthIncome;
const thisMonthExpense   = rawData.thisMonthExpense;
const lastMonthExpense   = rawData.lastMonthExpense;

const savings = currentMonthIncome - thisMonthExpense;

const incomeTrend = +((
  (currentMonthIncome - lastMonthIncome) / lastMonthIncome
) * 100).toFixed(1);

const expenseTrend = +((
  (thisMonthExpense - lastMonthExpense) / lastMonthExpense
) * 100).toFixed(1);

// ─── Fix highestCategory (JSON-safe) ───────────────────────────────
const highestCategoryRaw = categoryEngine.rawCategories.reduce((a, b) =>
  a.raw > b.raw ? a : b
);

const total = categoryEngine.rawCategories.reduce((sum, c) => sum + c.raw, 0);

const highestCategory = {
  label: highestCategoryRaw.label,
  value: +((highestCategoryRaw.raw / total) * 100).toFixed(1),
};

// ─── Data mapping ──────────────────────────────────────────────────
const insightCardsData = [
  {
    id: "savings",
    title: "Savings",
    value: formatCurrency(savings, { type: "kpi" }),
    statement: "saved this month",
    icon: "ri-hand-coin-line",
    trend: savings >= 0 ? "up" : "down",
    trendVal: formatCurrency(Math.abs(savings), { type: "kpi" }),
    border: "border-purple-400",
  },
  {
    id: "income",
    title: "Income Growth",
    value: `+${incomeTrend}%`,
    statement: "vs last month",
    icon: "ri-funds-line",
    trend: incomeTrend >= 0 ? "up" : "down",
    trendVal: `${Math.abs(incomeTrend)}%`,
    border: "border-green-400",
  },
  {
    id: "category",
    title: "Top Spend",
    value: highestCategory.label,
    statement: `${highestCategory.value}% of expenses`,
    icon: "ri-fire-line",
    trend: "down",
    trendVal: `${highestCategory.value}%`,
    border: "border-orange-400",
  },
  {
    id: "expense",
    title: "Expense Rise",
    value: `+${expenseTrend}%`,
    statement: "vs last month",
    icon: "ri-pulse-line",
    trend: "down",
    trendVal: `${expenseTrend}%`,
    border: "border-red-400",
  },
];

// ─── Single card ───────────────────────────────────────────────────
const InsightCard = ({ title, value, statement, icon, trend, trendVal, border }) => {
  const { isDark } = useTheme();
  const isPositive = trend === "up";

  return (
    <div
      className={`flex flex-col justify-between p-5 rounded-3xl w-full border-2 ${border}
        bg-transparent backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md dark:hover:shadow-black/30`}
    >
      <div className="flex items-center justify-between">
        <h3 className={`text-[13px] font-[font3] uppercase tracking-widest transition-colors duration-300
          ${isDark ? "text-gray-400" : "text-black/50"}`}>
          {title}
        </h3>
        <div className={`text-2xl transition-colors duration-300 ${isDark ? "text-gray-300" : "text-black"}`}>
          <i className={icon} />
        </div>
      </div>

      <div className="mt-3">
        <h2 className={`text-3xl max-md:text-2xl font-[font1] leading-tight transition-colors duration-300
          ${isDark ? "text-gray-100" : "text-black"}`}>
          {value}
        </h2>
        <p className={`text-[11px] font-[font3] mt-0.5 transition-colors duration-300
          ${isDark ? "text-gray-500" : "text-black/40"}`}>
          {statement}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full font-[font3] text-[11px]
            ${isPositive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}
        >
          <i className={isPositive ? "ri-arrow-up-line" : "ri-arrow-down-line"} />
          {trendVal}
        </div>
        <span className={`font-[font3] text-[11px] transition-colors duration-300
          ${isDark ? "text-gray-500" : "text-black/40"}`}>
          vs last month
        </span>
      </div>
    </div>
  );
};

// ─── Grid ──────────────────────────────────────────────────────────
const InsightCards = () => (
  <div className="grid grid-cols-2 gap-3 h-full">
    {insightCardsData.map((card) => (
      <InsightCard key={card.id} {...card} />
    ))}
  </div>
);

export default InsightCards;
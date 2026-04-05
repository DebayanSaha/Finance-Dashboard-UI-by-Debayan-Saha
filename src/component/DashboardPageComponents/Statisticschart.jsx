import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { formatCurrency } from "../../utils/currency";
import data from "../../data/dashboardData.json";
import { useTheme } from "../../context/Themecontext";

Chart.register(...registerables);

const COLORS = ["#f97316","#fb923c","#fdba74","#4f46e5","#a78bfa","#67696b"];

export default function StatisticsChart() {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  const { isDark } = useTheme();

  const categories = data.expenses.categories;
  const total      = data.expenses.total;

  // Rebuild chart when isDark changes so tooltip/border colors stay correct
  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const tipBg     = isDark ? "rgba(17,24,39,0.92)"   : "#fff";
    const tipBorder = isDark ? "#374151"                : "#e8e8ee";
    const tipTitle  = isDark ? "#9ca3af"                : "#0f0f14";
    const tipBody   = isDark ? "#d1d5db"                : "#555";
    const segBorder = isDark ? "#000000"                : "#ffffff";

    const chart = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: categories.map((c) => c.name),
        datasets: [{
          data:            categories.map((c) => c.amount),
          backgroundColor: COLORS,
          borderWidth:     3,
          borderColor:     segBorder,
          hoverOffset:     6,
          borderRadius:    4,
        }],
      },
      options: {
        cutout:    "70%",
        responsive: false,
        plugins: {
          legend:  { display: false },
          tooltip: {
            backgroundColor: tipBg,
            borderColor:     tipBorder,
            borderWidth:     1,
            titleColor:      tipTitle,
            bodyColor:       tipBody,
            padding:         10,
            callbacks: {
              label: (item) =>
                `  ${formatCurrency(item.raw, { type: "kpi" })} (${categories[item.dataIndex].percentage}%)`,
            },
          },
        },
      },
    });

    chartRef.current = chart;
    return () => chart.destroy();
  }, [isDark]); // rebuild on theme change

  return (
    <div className={`rounded-2xl p-5 w-full h-full flex flex-col
      max-md:p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md dark:hover:shadow-black/30
      ${isDark ? "bg-transparent" : "bg-white"}`}>

      {/* Header */}
      <div className="mb-1">
        <span className={`text-[22px] font-[font2] max-sm:text-lg transition-colors duration-300
          ${isDark ? "text-gray-100" : "text-gray-900"}`}>
          Statistics
        </span>
      </div>

      <p className="text-[13px] text-gray-400 leading-tight mb-4 font-[font3] max-sm:text-[11px]">
        You have an increase of expenses in several categories this month
      </p>

      {/* ── Donut ── */}
      <div className="flex justify-center items-center mb-5">
        <div className="relative w-[224px] h-[224px] flex-shrink-0
          max-md:w-[180px] max-md:h-[180px]
          max-sm:w-[160px] max-sm:h-[160px]">

          <div className="w-[224px] h-[224px] origin-top-left
            max-md:[transform:scale(0.8)] max-md:w-[180px] max-md:h-[180px]
            max-sm:[transform:scale(0.71)] max-sm:w-[160px] max-sm:h-[160px]">
            <canvas ref={canvasRef} width={224} height={224} />
          </div>

          {/* Centre label */}
          <div className="absolute inset-0 flex flex-col items-center
            justify-center pointer-events-none">
            <span className="text-[11px] text-gray-400 mb-0.5 max-sm:text-[9px]">
              This month expense
            </span>
            <div className="flex items-baseline gap-px">
              <span className={`text-3xl max-md:text-2xl font-[font1] transition-colors duration-300
                ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                {formatCurrency(total, { type: "kpi" })}
              </span>
            </div>
            <span className="mt-1.5 text-[10px] bg-green-50 text-green-700
              px-2 py-0.5 rounded-full font-[font2] max-sm:text-[9px]">
              ▲ {data.expenses.changePercent}%
            </span>
          </div>

          {/* Top-spend badge */}
          <div className={`absolute -top-1 -right-14 rounded-xl px-2.5 py-2 text-center border
            max-sm:-right-10 max-sm:px-1.5 max-sm:py-1.5 transition-colors duration-300
            ${isDark
              ? "bg-orange-900/30 border-orange-800/40"
              : "bg-orange-50 border-orange-100"
            }`}>
            <div className="text-[13px] font-[font3] text-orange-600 leading-none max-sm:text-[11px]">
              {data.expenses.insights.topCategory.percentage}%
            </div>
            <div className="text-[11px] text-orange-500 mt-1 max-sm:text-[9px]">
              {formatCurrency(data.expenses.insights.topCategory.amount, { type: "kpi" })}
            </div>
            <div className="text-[10px] text-orange-400 mt-0.5 max-sm:text-[8px]">
              Top spend
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={`border-t pt-3 mt-auto transition-colors duration-300
        ${isDark ? "border-gray-700" : "border-gray-100"}`}>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 max-sm:gap-y-1.5">
          {categories.map(({ name, percentage }, i) => (
            <div key={name} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[i] }}
              />
              <span className={`text-[11px] truncate flex-1 max-sm:text-[10px]
                ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {name}
              </span>
              <span
                className="text-[11px] font-[font3] flex-shrink-0 max-sm:text-[10px]"
                style={{ color: COLORS[i] }}
              >
                {percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
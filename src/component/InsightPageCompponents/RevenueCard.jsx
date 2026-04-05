import { useState, useEffect, useRef } from "react";
import data from "../../data/insightsData.json";
import { formatCurrency } from "../../utils/currency";
import { useTheme } from "../../context/Themecontext";

const RevenueCard = () => {
  const { revenueData } = data;
  const { isDark } = useTheme();

  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  const [activeTab, setActiveTab] = useState("1W");

  const tabs = ["1W", "1M", "1Y"];

  useEffect(() => {
    const loadChart = async () => {
      const { Chart, registerables } = await import("https://esm.sh/chart.js@4.4.1");

      Chart.register(...registerables);

      if (chartRef.current) chartRef.current.destroy();

      const period = revenueData.byPeriod[activeTab];
      const ctx = canvasRef.current.getContext("2d");

      // Theme-aware tooltip colors
      const tipBg     = isDark ? "rgba(17,24,39,0.92)" : "rgba(255,255,255,0.95)";
      const tipBorder = isDark ? "#374151"              : "#e5e7eb";
      const tipBody   = isDark ? "#f9fafb"              : "#111827";

      chartRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: period.labels,
          datasets: [
            {
              data: period.values,
              backgroundColor: period.values.map((_, i) =>
                i >= period.highlight[0] && i <= period.highlight[1]
                  ? "rgba(249,115,22,0.9)"
                  : isDark ? "rgba(255,168,87,0.3)" : "rgba(255,168,87,0.5)"
              ),
              borderRadius: 3,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: tipBg,
              borderColor:     tipBorder,
              borderWidth:     1,
              bodyColor:       tipBody,
              callbacks: {
                label: (ctx) => `${formatCurrency(ctx.parsed.y, { type: "kpi" })} Income`,
              },
            },
          },
          scales: { x: { display: false }, y: { display: false } },
          animation: { duration: 500 },
        },
      });
    };

    if (canvasRef.current && revenueData) loadChart();

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [activeTab, revenueData, isDark]); // isDark triggers chart rebuild

  const xLabels = revenueData.byPeriod[activeTab].xLabels;

  return (
    <div className={`rounded-3xl border shadow-sm p-5 max-sm:p-4
      transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md dark:hover:shadow-black/30
      ${isDark ? "bg-transparent border-orange-500/50" : "bg-white border-orange-400/60"}`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xl font-[font2] transition-colors duration-300
          ${isDark ? "text-gray-100" : "text-gray-800"}`}>
          Revenue
        </span>
      </div>

      {/* Big number */}
      <div className={`text-3xl max-md:text-2xl font-[font1]
        transition-colors duration-300
        ${isDark ? "text-gray-50" : "text-gray-900"}`}>
        {formatCurrency(revenueData.current, { type: "kpi" })}
      </div>

      <div className="flex items-center gap-1 text-green-500 text-xs font-semibold mt-1.5 mb-4">
        <span><i className="ri-arrow-up-line" /></span>
        <span>{revenueData.trend}% vs last month</span>
      </div>

      {/* Tabs */}
      <div className="flex justify-end gap-1 mb-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95 cursor-pointer
              ${activeTab === t
                ? isDark
                  ? "bg-gray-700 border border-gray-600 text-gray-100"
                  : "bg-gray-100 border border-gray-200 text-gray-800"
                : isDark
                  ? "text-gray-500 hover:text-gray-300"
                  : "text-gray-400 hover:text-gray-600"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative h-[160px] max-sm:h-[120px]">
        <canvas ref={canvasRef} />
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-[11px] text-gray-400 px-1">
        {xLabels.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
};

export default RevenueCard;

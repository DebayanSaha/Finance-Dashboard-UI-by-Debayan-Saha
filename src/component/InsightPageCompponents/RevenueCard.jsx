import { useState, useEffect, useRef } from "react";
import data from "../../data/insightsData.json";

const RevenueCard = () => {
  const { revenueData } = data;

  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [activeTab, setActiveTab] = useState("1W");

  const tabs = ["1W", "1M", "1Y"];

  useEffect(() => {
    const loadChart = async () => {
      const { Chart, registerables } = await import("https://esm.sh/chart.js@4.4.1");

      Chart.register(...registerables);

      if (chartRef.current) chartRef.current.destroy();

      // Active dataset
      const period = revenueData.byPeriod[activeTab];

      const ctx = canvasRef.current.getContext("2d");

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
                  : "rgba(255,168,87,0.5)"
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
              callbacks: {
                label: (ctx) => `$${ctx.parsed.y.toLocaleString()} Income`,
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
  }, [activeTab, revenueData]);

  // Dynamic labels
  const xLabels = revenueData.byPeriod[activeTab].xLabels;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xl font-[font2] text-gray-800">Revenue</span>
      </div>

      {/* Big number */}
      <div className="text-[35px] font-[font1] text-gray-900 leading-none">
        ${revenueData.current.toLocaleString()}
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
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer
              ${
                activeTab === t
                  ? "bg-gray-100 border border-gray-200 text-gray-800"
                  : "text-gray-400 hover:text-gray-600"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative h-[160px]">
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
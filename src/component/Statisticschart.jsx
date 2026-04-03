import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const categories = [
  { label: "Money transfer",     value: 2500, pct: 40, color: "#f97316" },
  { label: "Cafe & Restaurants", value: 1200, pct: 19, color: "#fb923c" },
  { label: "Rent",               value:  900, pct: 14, color: "#fdba74" },
  { label: "Education",          value:  600, pct: 10, color: "#4f46e5" },
  { label: "Food & Groceries",   value:  700, pct: 11, color: "#a78bfa" },
  { label: "Others",             value:  322, pct:  6, color: "#e2e8f0" },
];

const total = categories.reduce((s, c) => s + c.value, 0);

export default function StatisticsChart() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: categories.map((c) => c.label),
        datasets: [{
          data: categories.map((c) => c.value),
          backgroundColor: categories.map((c) => c.color),
          borderWidth: 3,
          borderColor: "#ffffff",
          hoverOffset: 6,
          borderRadius: 4,
        }],
      },
      options: {
        cutout: "70%",
        responsive: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#fff",
            borderColor: "#e8e8ee",
            borderWidth: 1,
            titleColor: "#0f0f14",
            bodyColor: "#555",
            padding: 10,
            callbacks: {
              label: (item) =>
                `  $${item.raw.toLocaleString()} (${categories[item.dataIndex].pct}%)`,
            },
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-5 w-[300px] border border-gray-100 ">

      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[22px] font-[font2] text-gray-900">Statistics</span>
        <div className="flex gap-1.5 rounded-full">
          {["Expense ↓", "Details →"].map((label) => (
            <button
              key={label}
              className="text-[11px] px-2.5 py-1 rounded-full border border-orange-400 bg-transparent text-gray-500 hover:bg-gray-50 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[13px] text-gray-400 leading-tight mb-4 font-[font3]">
        You have an increase of expenses in several categories this month
      </p>

      {/* Chart */}
      <div className="relative flex justify-center items-center mb-4">
        <div className="relative w-[196px] h-[196px]">
          <canvas ref={canvasRef} width={196} height={196} />

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] text-gray-400 mb-0.5">This month expense</span>
            <div className="flex items-baseline gap-px">
              <span className="text-[24px] font-[font1] text-gray-900">
                ${total.toLocaleString()}
              </span>
              <span className="text-[15px] text-gray-300">.00</span>
            </div>
            <span className="mt-1.5 text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-[font2]">
              ▲ 8.4%
            </span>
          </div>
        </div>

        {/* Top spend badge */}
        <div className="absolute top-1 right-0 bg-orange-50 border border-orange-100 rounded-xl px-2.5 py-2 text-center">
          <div className="text-[13px] font-[font3] text-orange-600 leading-none">{categories[0].pct}%</div>
          <div className="text-[11px] text-orange-500 mt-1">${categories[0].value.toLocaleString()}</div>
          <div className="text-[10px] text-orange-400 mt-0.5">Top spend</div>
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-gray-100 pt-3">
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          {categories.map(({ label, color, pct }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-[11px] text-gray-500 truncate flex-1">{label}</span>
              <span className="text-[11px] text-gray-300 flex-shrink-0">{pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
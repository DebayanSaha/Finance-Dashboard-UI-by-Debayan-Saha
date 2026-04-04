import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import data from "../../data/dashboardData.json";

Chart.register(...registerables);

const COLORS = [
  "#f97316",
  "#fb923c",
  "#fdba74",
  "#4f46e5",
  "#a78bfa",
  "#67696b",
];

export default function StatisticsChart() {
  const canvasRef = useRef(null);

  const categories = data.expenses.categories;
  const total = data.expenses.total;

  useEffect(() => {
    if (!canvasRef.current) return;

    const chart = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: categories.map((c) => c.name),
        datasets: [
          {
            data: categories.map((c) => c.amount),
            backgroundColor: COLORS,
            borderWidth: 3,
            borderColor: "#ffffff",
            hoverOffset: 6,
            borderRadius: 4,
          },
        ],
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
                `  $${item.raw.toLocaleString()} (${categories[item.dataIndex].percentage}%)`,
            },
          },
        },
      },
    });

    return () => chart.destroy();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-5 w-full h-full flex flex-col">

      {/* Header */}
      <div className="mb-1">
        <span className="text-[22px] font-[font2] text-gray-900">
          Statistics
        </span>
      </div>

      <p className="text-[13px] text-gray-400 leading-tight mb-4 font-[font3]">
        You have an increase of expenses in several categories this month
      </p>

      {/* Donut — increased to 224px */}
      <div className="flex justify-center items-center mb-5">
        <div className="relative w-[224px] h-[224px] flex-shrink-0">
          <canvas ref={canvasRef} width={224} height={224} />

          {/* Centre label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] text-gray-400 mb-0.5">
              This month expense
            </span>
            <div className="flex items-baseline gap-px">
              <span className="text-[24px] font-[font1] text-gray-900">
                ${total.toLocaleString()}
              </span>
              <span className="text-[15px] text-gray-300">.00</span>
            </div>
            <span className="mt-1.5 text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-[font2]">
              ▲ {data.expenses.changePercent}%
            </span>
          </div>

          {/* Top-spend badge */}
          <div className="absolute -top-1 -right-14 bg-orange-50 border border-orange-100 rounded-xl px-2.5 py-2 text-center">
            <div className="text-[13px] font-[font3] text-orange-600 leading-none">
              {data.expenses.insights.topCategory.percentage}%
            </div>
            <div className="text-[11px] text-orange-500 mt-1">
              ${data.expenses.insights.topCategory.amount.toLocaleString()}
            </div>
            <div className="text-[10px] text-orange-400 mt-0.5">Top spend</div>
          </div>
        </div>
      </div>

      {/* Legend — dots now use the matching chart segment color */}
      <div className="border-t border-gray-100 pt-3 mt-auto">
        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
          {categories.map(({ name, percentage }, i) => (
            <div key={name} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[i] }}
              />
              <span className="text-[11px] text-gray-500 truncate flex-1">
                {name}
              </span>
              <span
                className="text-[11px] font-[font3] flex-shrink-0"
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
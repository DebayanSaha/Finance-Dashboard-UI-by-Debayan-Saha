import { useEffect, useRef } from "react";
import { transactionData } from "../../data/dashboardData";

const MiniBarChart = ({ data, color }) => {
  const ref      = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const { Chart, registerables } = await import("https://esm.sh/chart.js@4.4.1");
      Chart.register(...registerables);
      if (chartRef.current) chartRef.current.destroy();
      chartRef.current = new Chart(ref.current.getContext("2d"), {
        type: "bar",
        data: {
          labels: ["M", "T", "W", "T", "F", "S", "S"],
          datasets: [{ data, backgroundColor: color, borderRadius: 3 }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } },
          animation: { duration: 500 },
        },
      });
    };
    if (ref.current) load();
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, []);

  return <canvas ref={ref} />;
};

const TransactionCard = () => {
  const catRef      = useRef(null);
  const catChartRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const { Chart, registerables } = await import("https://esm.sh/chart.js@4.4.1");
      Chart.register(...registerables);
      if (catChartRef.current) catChartRef.current.destroy();
      catChartRef.current = new Chart(catRef.current.getContext("2d"), {
        type: "bar",
        data: {
          labels: transactionData.categories.map((c) => c.label),
          datasets: [{
            data: transactionData.categories.map((c) => c.value),
            backgroundColor: transactionData.categories.map((c) => c.color),
            borderRadius: 4,
          }],
        },
        options: {
          indexAxis: "y",
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.x}%` } },
          },
          scales: {
            x: { display: false, max: 40 },
            y: {
              ticks: { font: { size: 10 }, color: "#9ca3af" },
              grid: { display: false },
              border: { display: false },
            },
          },
        },
      });
    };
    if (catRef.current) load();
    return () => { if (catChartRef.current) catChartRef.current.destroy(); };
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-[18px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Transactions
        </span>
        <select className="text-[11px] border border-gray-200 rounded-lg px-2 py-1 text-gray-500 bg-gray-50 outline-none cursor-pointer">
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Yearly</option>
        </select>
      </div>

      {/* Stat */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-[28px] font-semibold tracking-tight text-gray-900 leading-none tabular-nums">
              ${(transactionData.total / 1000).toFixed(1)}k
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
              ↑ {transactionData.trend}%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">vs last month</p>
        </div>
        <button className="w-7 h-7 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-[11px] text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer">
          ↗
        </button>
      </div>

      {/* Mini bar charts */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {[
          { key: "thisWeek", label: "This week", val: transactionData.thisWeek.label, values: transactionData.thisWeek.values, color: "#3b82f6" },
          { key: "forecast", label: "Forecast",  val: transactionData.forecast.label,  values: transactionData.forecast.values,  color: "#f97316" },
        ].map(({ key, label, val, values, color }) => (
          <div key={key}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
              {label}
            </p>
            <p className="text-[13px] font-semibold text-gray-800 mb-2 tabular-nums">{val}</p>
            <div className="h-[44px]">
              <MiniBarChart data={values} color={color} />
            </div>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2.5">
          Category split
        </p>
        <div className="h-[56px]">
          <canvas ref={catRef} />
        </div>
      </div>

    </div>
  );
};

export default TransactionCard;
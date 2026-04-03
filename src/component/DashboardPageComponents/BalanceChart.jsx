import { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import data from "../../data/dashboardData.json";

Chart.register(...registerables);

export default function BalanceChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [view, setView] = useState("balance");

  const { timeseries } = data;
  const labels = timeseries.labels;
  const d = timeseries[view];

  const latest = d.analytics.latest;
  const prevLatest = d.analytics.previousLatest;
  const delta = d.analytics.change;
  const deltaPct = d.analytics.changePercent.toFixed(1);
  const isPos = delta >= 0;

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const ctx = canvasRef.current.getContext("2d");
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const gridCol = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
    const tickCol = isDark ? "#6b7280" : "#9ca3af";
    const tipBg = isDark ? "#1f2937" : "#ffffff";
    const tipBorder = isDark ? "#374151" : "#e5e7eb";
    const tipTitle = isDark ? "#9ca3af" : "#6b7280";
    const tipBody = isDark ? "#f9fafb" : "#111827";

    const fillGrad = ctx.createLinearGradient(0, 0, 0, 240);
    fillGrad.addColorStop(0, "rgba(249,115,22,0.25)");
    fillGrad.addColorStop(0.6, "rgba(249,115,22,0.08)");
    fillGrad.addColorStop(1, "rgba(249,115,22,0)");

    const curr = d.current;
    const prev = d.previous;

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "This month",
            data: curr,
            borderColor: "#f97316",
            borderWidth: 2,
            pointBackgroundColor: "#f97316",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 3.5,
            pointHoverRadius: 6,
            fill: true,
            backgroundColor: fillGrad,
            tension: 0.45,
            order: 1,
          },
          {
            label: "Last month",
            data: prev,
            borderColor: "#fdba74",
            borderWidth: 1.5,
            borderDash: [6, 4],
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: "#c4b5fd",
            fill: false,
            tension: 0.45,
            order: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: tipBg,
            borderColor: tipBorder,
            borderWidth: 1,
            titleColor: tipTitle,
            titleFont: { size: 11, weight: "400" },
            bodyColor: tipBody,
            bodyFont: { size: 12, weight: "500" },
            padding: 12,
            callbacks: {
              title: (items) => items[0].label,
              label: (item) => {
                const lbl =
                  item.datasetIndex === 0 ? "This month" : "Last month";
                return `  ${lbl}    $${item.raw.toLocaleString()}`;
              },
              afterLabel: (item) => {
                if (item.datasetIndex === 0) {
                  const p = prev[item.dataIndex];
                  const c = curr[item.dataIndex];
                  const diff = c - p;
                  const pct = ((diff / p) * 100).toFixed(1);
                  const s = diff >= 0 ? "+" : "";
                  return `  Change    ${s}$${Math.abs(diff).toLocaleString()} (${s}${pct}%)`;
                }
                return "";
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: gridCol, drawTicks: false },
            border: { display: false },
            ticks: {
              color: tickCol,
              font: { size: 11 },
              padding: 8,
              maxRotation: 0,
              autoSkip: false,
            },
          },
          y: {
            position: "left",
            grid: { color: gridCol, drawTicks: false },
            border: { display: false },
            ticks: {
              color: tickCol,
              font: { size: 11 },
              padding: 10,
              maxTicksLimit: 6,
              callback: (v) =>
                "$" + (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v),
            },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [view]);

  const stats = [
    {
      label: "Current",
      value: `$${latest.toLocaleString()}`,
      sub: `${isPos ? "▲" : "▼"} ${Math.abs(deltaPct)}% vs last month`,
      subColor: isPos ? "text-green-600" : "text-red-600",
    },
    {
      label: "Peak",
      value: `$${d.analytics.peak.value.toLocaleString()}`,
      sub: d.analytics.peak.date,
      subColor: null,
    },
    {
      label: "Trough",
      value: `$${d.analytics.trough.value.toLocaleString()}`,
      sub: d.analytics.trough.date,
      subColor: null,
    },
    {
      label: "Avg daily",
      value: `$${d.analytics.average.current.toLocaleString()}`,
      sub: `vs $${d.analytics.average.previous.toLocaleString()} prev`,
      subColor: null,
    },
  ];

  return (
    <div className="bg-transparent shadow-sm p-2 w-full">
      {/* SAME UI — unchanged */}
      {/* ... keep everything exactly same below ... */}

      <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
        <div>
          <p className="text-[22px] text-gray-900 mb-0.5 font-[font2]">
            Total balance overview
          </p>
          <p className="text-[13px] text-gray-400 m-0 font-[font3]">
            Jul 1 – Jul 19, 2025 · Daily resolution
          </p>
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-[18px] text-xs text-gray-500">
            <span className="flex items-center gap-1.5 font-[font3]">
              <span className="inline-block w-[22px] h-0.5 bg-orange-500 rounded-sm" />
              This month
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block w-[22px]"
                style={{ borderTop: "2px dashed #fdba74" }}
              />
              Same period last month
            </span>
          </div>

          <div className="flex gap-1.5">
            {["balance", "income"].map((v) => {
              const active = view === v;
              return (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`text-[11px] px-3 py-1 rounded-full border cursor-pointer transition-all duration-150
                    ${
                      active
                        ? "bg-orange-500 border-orange-500 text-white font-[font3]"
                        : "bg-transparent border-gray-200 text-gray-500 font-[font3]"
                    }`}
                >
                  {v === "balance" ? "Total balance" : "Income"}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2.5 mb-5">
        {stats.map(({ label, value, sub, subColor }) => (
          <div key={label} className="bg-orange-400/6 rounded-lg px-3.5 py-3">
            <p className="text-[15px] text-gray-400 mb-0.5 font-[font3]">
              {label}
            </p>
            <p className="text-[18px] font-medium text-gray-900 m-0 font-[font3]">
              {value}
            </p>
            <p
              className={`text-[13px] mt-0.5 font-[font2] ${subColor ?? "text-gray-400"}`}
            >
              {sub}
            </p>
          </div>
        ))}
      </div>

      <div className="w-full flex justify-center">
        <div className="w-[98%]">
          <div className="relative h-65">
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
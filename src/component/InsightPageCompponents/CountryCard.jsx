import { useEffect, useRef } from "react";
import data from "../../data/insightsData.json";
import { formatCurrency } from "../../utils/currency";
import { useTheme } from "../../context/Themecontext";

const CountryCard = () => {
  const { countryData = [] } = data;
  const { isDark } = useTheme();

  const donutRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const loadChart = async () => {
      const { Chart, registerables } =
        await import("https://esm.sh/chart.js@4.4.1");

      Chart.register(...registerables);

      if (chartRef.current) chartRef.current.destroy();

      chartRef.current = new Chart(donutRef.current.getContext("2d"), {
        type: "doughnut",
        data: {
          datasets: [
            {
              data:            countryData.map((c) => c.value),
              backgroundColor: countryData.map((c) => c.color),
              borderWidth: 0,
              hoverOffset: 4,
            },
          ],
        },
        options: {
          cutout: "72%",
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: isDark ? "rgba(17,24,39,0.92)" : "rgba(255,255,255,0.95)",
              borderColor:     isDark ? "#374151"              : "#e5e7eb",
              borderWidth:     1,
              bodyColor:       isDark ? "#f9fafb"              : "#111827",
              callbacks: {
                label: (ctx) => `${formatCurrency(ctx.parsed, { type: "kpi" })}`,
              },
            },
          },
          animation: { animateRotate: true, duration: 800 },
        },
      });
    };

    if (donutRef.current && countryData.length) loadChart();

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [countryData, isDark]); // isDark triggers rebuild

  return (
    <div className={`rounded-3xl border shadow-sm p-[18px] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md dark:hover:shadow-black/30
      ${isDark ? "bg-transparent border-orange-500/50" : "bg-white border-orange-400/60"}`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-[font2] uppercase tracking-widest text-gray-400">
          By Category
        </span>
        {/* <button className={`w-6 h-6 rounded-md border flex items-center justify-center
          text-[11px] cursor-pointer transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95
          ${isDark
            ? "bg-transparent border-gray-600 text-gray-400 hover:bg-gray-700"
            : "bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200"
          }`}>
          ↗
        </button> */}
      </div>

      {/* Donut + legend */}
      <div className="flex items-center gap-3 mb-4 max-sm:gap-2">
        <div className="w-[96px] h-[96px] flex-shrink-0 max-sm:w-[80px] max-sm:h-[80px]">
          <canvas ref={donutRef} />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-[font2] uppercase tracking-widest text-gray-400 mb-1">
            Revenue split
          </p>

          {countryData.map((c) => (
            <span
              key={c.name}
              className="flex items-center gap-1.5 text-[11px] text-gray-400 font-[font3]"
            >
              <i
                className={c.icon}
                style={{ fontSize: 11, color: c.color }}
              />
              {c.name.split(" ")[0]}
            </span>
          ))}
        </div>
      </div>

      {/* Category rows */}
      <div className="flex flex-col gap-1.5">
        {countryData.map((c) => (
          <div
            key={c.name}
            className={`font-[font3] flex items-center justify-between px-3 py-2.5 rounded-xl border
              border-orange-200/60 transition-all duration-200 ease-in-out hover:scale-[1.01] hover:shadow-sm dark:hover:shadow-black/20 cursor-default
              max-sm:px-2 max-sm:py-2
              ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}
          >
            <div>
              <p className="text-[11px] text-gray-400">{c.name}</p>
              <p className={`text-[14px] font-[font3] tabular-nums max-sm:text-[13px]
                transition-colors duration-300
                ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                {formatCurrency(c.value, { type: "kpi" })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className={`w-10 h-[3px] rounded-full overflow-hidden
                ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${c.pct}%`, background: c.color }}
                />
              </div>
              <i
                className={c.icon}
                style={{ fontSize: 16, color: c.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountryCard;
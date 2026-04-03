import { useEffect, useRef } from "react";
import { countryData } from "../../data/insightsData";

const CountryCard = () => {
  const donutRef  = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    const loadChart = async () => {
      const { Chart, registerables } = await import("https://esm.sh/chart.js@4.4.1");
      Chart.register(...registerables);
      if (chartRef.current) chartRef.current.destroy();

      chartRef.current = new Chart(donutRef.current.getContext("2d"), {
        type: "doughnut",
        data: {
          datasets: [{
            data: countryData.map((c) => c.value),
            backgroundColor: countryData.map((c) => c.color),
            borderWidth: 0,
            hoverOffset: 4,
          }],
        },
        options: {
          cutout: "72%",
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => `$${ctx.parsed.toLocaleString()}` } },
          },
          animation: { animateRotate: true, duration: 800 },
        },
      });
    };
    if (donutRef.current) loadChart();
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-[18px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-[font2] uppercase tracking-widest text-gray-400">
          By Country
        </span>
        <button className="w-6 h-6 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-[11px] text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors">
          ↗
        </button>
      </div>

      {/* Donut + legend */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-[72px] h-[72px] flex-shrink-0">
          <canvas ref={donutRef} />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-[font2] uppercase tracking-widest text-gray-400 mb-1">
            Revenue split
          </p>
          {countryData.map((c) => (
            <span key={c.name} className="flex items-center gap-1.5 text-[11px] text-gray-500 font-[font3]">
              <span className="w-1.5 h-1.5  rounded-sm shrink-0" style={{ background: c.color }} />
              {c.name.split(" ")[0]}
            </span>
          ))}
        </div>
      </div>

      {/* Country rows */}
      <div className="flex flex-col gap-1.5">
        {countryData.map((c) => (
          <div
            key={c.name}
            className="font-[font3] flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-200/80 hover:bg-gray-50 transition-colors cursor-default"
          >
            <div>
              <p className="text-[11px] text-gray-400">{c.name}</p>
              <p className="text-[14px] font-[font3] text-gray-900 tabular-nums">
                ${c.value.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-[3px] bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${c.pct}%`, background: c.color }}
                />
              </div>
              <span className="text-lg font-[font3]">{c.flag}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CountryCard;
import { useEffect, useRef, useState } from "react";
import { registrations, regSparkline } from "../../data/insightsData";

const statusStyles = {
  Approved: "bg-emerald-50 text-emerald-700",
  Pending:  "bg-orange-50  text-orange-600",
  Declined: "bg-red-50     text-red-600",
};

const statusDot = {
  Approved: "bg-emerald-400",
  Pending:  "bg-orange-400",
  Declined: "bg-red-400",
};

const RegistrationCard = () => {
  const sparkRef      = useRef(null);
  const sparkChartRef = useRef(null);
  const [activeTab, setActiveTab] = useState("1W");

  useEffect(() => {
    const load = async () => {
      const { Chart, registerables } = await import("https://esm.sh/chart.js@4.4.1");
      Chart.register(...registerables);
      if (sparkChartRef.current) sparkChartRef.current.destroy();

      const ctx  = sparkRef.current.getContext("2d");
      const grad = ctx.createLinearGradient(0, 0, 0, 40);
      grad.addColorStop(0, "rgba(249,115,22,0.25)");
      grad.addColorStop(1, "rgba(249,115,22,0)");

      sparkChartRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: regSparkline.map(() => ""),
          datasets: [{
            data: regSparkline,
            borderColor: "#f97316",
            borderWidth: 2,
            backgroundColor: grad,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } },
        },
      });
    };
    if (sparkRef.current) load();
    return () => { if (sparkChartRef.current) sparkChartRef.current.destroy(); };
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-[18px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[15px] font-[font3] uppercase text-gray-400">
          Registrations
        </span>
        <div className="flex gap-0.5 bg-orange-100 border border-orange-200 rounded-full p-0.75">
          {["1W", "1M", "1Y"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`text-[10px] font-semibold px-2.5 py-[3px] rounded-full transition-all cursor-pointer
                ${activeTab === t
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Stat */}
      <div className="flex items-baseline gap-2.5 mb-1">
        <span className="text-[28px] font-[font1] tracking-tight text-gray-900 leading-none tabular-nums">
          24,050
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-[font3] text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
          ↑ 44%
        </span>
      </div>
      <p className="text-[11px] text-gray-400 mb-2 font-[font3]">vs last Sunday</p>

      {/* Sparkline */}
      <div className="h-10 mb-4">
        <canvas ref={sparkRef} />
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Client", "Time", "Email", "Status"].map((h) => (
                <th
                  key={h}
                  className="text-[10px] font-[font3] uppercase tracking-widest text-gray-400 pb-2 text-left border-b border-gray-100"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => (
              <tr
                key={reg.id}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
              >
                {/* Client */}
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[9px] font-[font2] flex-shrink-0"
                      style={{ background: reg.bg, color: reg.fg }}
                    >
                      {reg.initials}
                    </div>
                    <span className="text-[12px] font-[font3] text-gray-800 whitespace-nowrap">
                      {reg.name}
                    </span>
                  </div>
                </td>

                {/* Time */}
                <td className="py-2 pr-3">
                  <span className="text-[11px] text-gray-400 whitespace-nowrap font-[font3] tabular-nums">
                    {reg.time}
                  </span>
                </td>

                {/* Email */}
                <td className="py-2 pr-3">
                  <span className="text-[11px] text-gray-500 font-[font3] whitespace-nowrap">
                    {reg.email}
                  </span>
                </td>

                {/* Status */}
                <td className="py-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-[font3] px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyles[reg.status]}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot[reg.status]}`} />
                    {reg.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default RegistrationCard;
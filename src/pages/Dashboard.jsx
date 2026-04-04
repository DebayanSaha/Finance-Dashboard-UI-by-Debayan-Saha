import { useState } from "react";
import StatsCards from "../component/DashboardPageComponents/StatsCards";
import BalanceChart from "../component/DashboardPageComponents/BalanceChart";
import StatisticsChart from "../component/DashboardPageComponents/Statisticschart";
import MonthSelector from "../component/DashboardPageComponents/MonthSelector";
import useLoading from "../hooks/useLoading";                          // ← ADD
import { DashboardSkeleton } from "../component/common/SkeletonLoader"; // ← ADD

const MONTHS_FULL = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const Dashboard = () => {
  const loading = useLoading(1200); // ← ADD
  const today = new Date();
  const [selectedPeriod, setSelectedPeriod] = useState({
    month: today.getMonth(),
    year:  today.getFullYear(),
  });

  const isCurrentMonth =
    selectedPeriod.month === today.getMonth() &&
    selectedPeriod.year  === today.getFullYear();

  const labelText = isCurrentMonth
    ? "This month"
    : `${MONTHS_FULL[selectedPeriod.month]} ${selectedPeriod.year}`;

  // ── Skeleton gate ──────────────────────────────────────────────────────────
  if (loading) return <DashboardSkeleton />; // ← ADD

  // ── Real content — COMPLETELY UNCHANGED ───────────────────────────────────
  return (
    <div className="flex bg-white h-screen p-1">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 mt-20">
          <div className="w-95 mt-2 h-18 bg-[#fbd69e53] p-6 flex items-center justify-center rounded-xl">
            <h1 className="font-[font2] text-7xl text-orange-400">Dashboard.</h1>
          </div>
          <div>
            <div className="w-full h-15 mt-8 flex gap-2">
              <MonthSelector
                selectedMonth={selectedPeriod.month}
                selectedYear={selectedPeriod.year}
                onMonthChange={setSelectedPeriod}
              />
              <div className="w-40 h-12 rounded-full border border-[#fbd69e] flex items-center justify-center">
                <h1 className="text-xl font-[font2] text-[#8f5b43]">{labelText}</h1>
              </div>
            </div>
            <div className="w-full px-2 py-1">
              <StatsCards />
            </div>
          </div>
          <div className="w-full mt-8 flex gap-2">
            <div className="w-[70%] p-2 border-2 rounded-3xl border-[#f7962e98]">
              <BalanceChart />
            </div>
            <div className="w-[30%] border-2 border-[#f7962e98] rounded-3xl overflow-hidden">
              <StatisticsChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
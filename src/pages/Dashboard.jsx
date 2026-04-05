import { useState } from "react";
import StatsCards from "../component/DashboardPageComponents/StatsCards";
import BalanceChart from "../component/DashboardPageComponents/BalanceChart";
import StatisticsChart from "../component/DashboardPageComponents/Statisticschart";
import MonthSelector from "../component/DashboardPageComponents/MonthSelector";
import useLoading from "../hooks/useLoading";
import { DashboardSkeleton } from "../component/common/SkeletonLoader";
import { useTheme } from "../context/Themecontext";

const MONTHS_FULL = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const Dashboard = () => {
  const loading = useLoading(1200);
  const { isDark } = useTheme();
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

  if (loading) return <DashboardSkeleton />;

  return (
    <div className={`flex min-h-screen p-1 transition-colors duration-300 ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 pt-2 max-md:p-3">

          {/* ── Heading ── */}
          <div className={`w-95 mt-2 h-18 p-6 flex items-center
            justify-center rounded-xl
            max-md:w-full max-md:p-4 max-md:h-auto
            transition-colors duration-300
            ${isDark ? "bg-amber-900/20" : "bg-[#fbd69e53]"}`}>
            <h1 className="font-[font2] text-7xl text-orange-400
              max-md:text-5xl max-sm:text-4xl">
              Dashboard.
            </h1>
          </div>

          {/* ── Month selector row ── */}
          <div className="w-full h-15 mt-8 flex gap-2 max-md:mt-5">
            <MonthSelector
              selectedMonth={selectedPeriod.month}
              selectedYear={selectedPeriod.year}
              onMonthChange={setSelectedPeriod}
            />
            <div className={`w-40 h-12 rounded-full border flex items-center justify-center
              max-sm:w-32 transition-colors duration-300
              ${isDark ? "border-amber-700/40" : "border-[#fbd69e]"}`}>
              <h1 className={`text-xl font-[font2] max-sm:text-base
                ${isDark ? "text-amber-300" : "text-[#8f5b43]"}`}>
                {labelText}
              </h1>
            </div>
          </div>

          {/* ── Stats cards ── */}
          <div className="w-full px-2 py-1 max-md:px-0">
            <StatsCards />
          </div>

          {/* ── Charts row ── */}
          <div className="w-full mt-8 flex gap-2
            max-md:flex-col max-md:mt-5 max-md:gap-4">

            <div className={`w-[70%] p-2 border-2 rounded-3xl transition-colors duration-300
              max-md:w-full
              ${isDark ? "border-orange-700/40" : "border-[#f7962e98]"}`}>
              <BalanceChart />
            </div>

            <div className={`w-[30%] border-2 rounded-3xl overflow-hidden transition-colors duration-300
              max-md:w-full
              ${isDark ? "border-orange-700/40" : "border-[#f7962e98]"}`}>
              <StatisticsChart />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
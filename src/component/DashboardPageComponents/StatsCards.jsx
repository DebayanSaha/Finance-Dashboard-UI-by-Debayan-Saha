import React from "react";
import data from "../../data/dashboardData.json";
import { formatCurrency } from "../../utils/currency";
import { useTheme } from "../../context/Themecontext";

const Card = ({ title, value, trend, trendType, border, icon }) => {
  const { isDark } = useTheme();
  const isPositive = trendType === "up";

  return (
    <div
      className={`flex flex-col justify-between p-5 rounded-3xl w-full max-w-sm border-2 ${border}
        bg-transparent backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md dark:hover:shadow-black/30`}
    >
      <div className="flex items-center justify-between">
        <h3 className={`text-2xl font-[font3] transition-colors duration-300 ${isDark ? "text-gray-100" : "text-black"}`}>
          {title}
        </h3>
        <div className={`rounded-lg text-3xl transition-colors duration-300 ${isDark ? "text-gray-300" : "text-black"}`}>
          <i className={icon}></i>
        </div>
      </div>

      <div className="mt-3">
        <h2 className={`text-3xl max-md:text-2xl font-[font1] transition-colors duration-300 ${isDark ? "text-white" : "text-black"}`}>
          {value}
        </h2>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full font-[font3]
          ${isPositive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}
        >
          <i className={`${isPositive ? "ri-arrow-up-line" : "ri-arrow-down-line"}`}></i>
          {trend}%
        </div>

        <span className={`font-[font3] text-xs transition-colors duration-300 ${isDark ? "text-gray-500" : "text-black/50"}`}>
          vs last month
        </span>
      </div>
    </div>
  );
};

const StatsCards = () => {
  const { kpis } = data;

  const cardData = [
    {
      title: "Total Balance",
      value: formatCurrency(kpis.totalBalance.value, { type: "kpi" }),
      icon: "ri-safe-line",
      trend: kpis.totalBalance.changePercent,
      trendType: kpis.totalBalance.trend,
      border: "border-orange-400",
    },
    {
      title: "Total Income",
      value: formatCurrency(kpis.totalIncome.value, { type: "kpi" }),
      icon: "ri-funds-line",
      trend: kpis.totalIncome.changePercent,
      trendType: kpis.totalIncome.trend,
      border: "border-green-400",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(kpis.totalExpenses.value, { type: "kpi" }),
      icon: "ri-shopping-bag-3-line",
      trend: kpis.totalExpenses.changePercent,
      trendType: kpis.totalExpenses.trend,
      border: "border-red-400",
    },
    {
      title: "Savings %",
      value: `${kpis.savingsRate.value}%`,
      icon: "ri-shield-check-line",
      trend: kpis.savingsRate.changePercent,
      trendType: kpis.savingsRate.trend,
      border: "border-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardData.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </div>
  );
};

export default StatsCards;
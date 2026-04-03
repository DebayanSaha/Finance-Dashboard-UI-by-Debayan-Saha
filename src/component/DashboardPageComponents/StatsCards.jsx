import React from "react";

const cardData = [
  {
    title: "Total Balance",
    value: "$15,700",
    icon: "ri-wallet-3-line",
    trend: "12.1%",
    trendType: "positive",
    border: "border-orange-400",
  },
  {
    title: "Total Income",
    value: "$8,500",
    icon: "ri-arrow-up-circle-line",
    trend: "6.3%",
    trendType: "positive",
    border: "border-green-400",
  },
  {
    title: "Total Expenses",
    value: "$6,222",
    icon: "ri-arrow-down-circle-line",
    trend: "2.4%",
    trendType: "negative",
    border: "border-red-400",
  },
  {
    title: "Savings %",
    value: "27%",
    icon: "ri-bank-line",
    trend: "3.2%",
    trendType: "positive",
    border: "border-purple-400",
  },
];

const Card = ({
  title,
  value,
  icon,
  trend,
  trendType = "positive",
  border,
}) => {
  const isPositive = trendType === "positive";

  return (
    <div
      className={`
        flex flex-col justify-between
        p-5 rounded-3xl w-full max-w-sm
        border-2 ${border}
        bg-transparent
        backdrop-blur-md
        shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        hover:scale-[1.02] transition
      `}
    >
      {/* Top */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl text-black font-[font3]">{title}</h3>

        <div className="rounded-lg text-black text-3xl">
          <i className={icon}></i>
        </div>
      </div>

      {/* Value */}
      <div className="mt-3">
        <h2 className="text-3xl font-[font1] text-black">{value}</h2>
      </div>

      {/* Trend */}
      <div className="mt-4 flex items-center gap-2 text-sm">
        <div
          className={`
            flex items-center gap-1 px-2 py-1 rounded-full font-[font3]
            ${
              isPositive
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-500"
            }
          `}
        >
          <i
            className={`${
              isPositive ? "ri-arrow-up-line" : "ri-arrow-down-line"
            }`}
          ></i>
          {trend}
        </div>

        <span className="text-black/50 font-[font3] text-xs">vs last month</span>
      </div>
    </div>
  );
};

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardData.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </div>
  );
};

export default StatsCards;
import CountryCard from "../component/InsightPageCompponents/CountryCard";
import RevenueCard from "../component/InsightPageCompponents/RevenueCard";
import TransactionCard from "../component/InsightPageCompponents/TransactionCard";
import data from "../data/insightsData.json";
import InsightCards from "../component/InsightPageCompponents/InsightCards";

const { globalInsights, globalInsightsMeta } = data;

const Insights = () => {
  return (
    <div className="flex bg-white mt-20 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {/* Page heading — UNCHANGED */}
          <div className="flex items-end justify-between">
            <div className="w-72 mt-2 h-18 bg-[#fbd69e53] p-6 flex items-center justify-center rounded-xl">
              <h1 className="font-[font2] text-7xl text-orange-400">
                Insights.
              </h1>
            </div>
            <span className="text-[11px] text-gray-400">
              Last updated · 3 min ago
            </span>
          </div>

          {/* ─── GLOBAL INSIGHTS BANNER (NEW — no layout change below this) ─── */}
          <div className="mt-5 flex gap-2 flex-wrap">
            {globalInsightsMeta.map((insight, i) => (
              <span
                key={i}
                className="text-[11px] font-[font3] px-3 py-1.5 rounded-full border"
                style={{
                  backgroundColor: `${insight.color}20`, // light translucent background
                  borderColor: insight.color, // border matches color
                  color: insight.color, // text color matches
                }}
              >
                {insight.text}
              </span>
            ))}
          </div>

          {/* Top row — UNCHANGED */}

          <div className="grid grid-cols-2 gap-3 pb-5">
            <InsightCards />
            <TransactionCard />
          </div>

          {/* Bottom row — UNCHANGED */}
          <div className="grid grid-cols-[1fr_300px] gap-3">
            <RevenueCard />
            <CountryCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
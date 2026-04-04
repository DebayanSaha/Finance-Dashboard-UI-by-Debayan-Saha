import CountryCard from "../component/InsightPageCompponents/CountryCard";
import RevenueCard from "../component/InsightPageCompponents/RevenueCard";
import TransactionCard from "../component/InsightPageCompponents/TransactionCard";
import InsightCards from "../component/InsightPageCompponents/InsightCards";
import data from "../data/insightsData.json";
import useLoading from "../hooks/useLoading"; // ← ADD
import { InsightsSkeleton } from "../component/common/SkeletonLoader"; // ← ADD

const { globalInsightsMeta } = data;

const Insights = () => {
  const loading = useLoading(1200); // ← ADD

  if (loading) return <InsightsSkeleton />; // ← ADD

  return (
    <div className="flex bg-white mt-20 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
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

          <div className="mt-5 flex gap-2 flex-wrap">
            {globalInsightsMeta.map((insight, i) => (
              <span
                key={i}
                className="text-[11px] font-[font3] px-3 py-1.5 rounded-full border"
                style={{
                  backgroundColor: `${insight.color}20`,
                  borderColor: insight.color,
                  color: insight.color,
                }}
              >
                {insight.text}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pb-5">
            <InsightCards />
            <TransactionCard />
          </div>

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

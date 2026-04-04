import CountryCard from "../component/InsightPageCompponents/CountryCard";
import RevenueCard from "../component/InsightPageCompponents/RevenueCard";
import TransactionCard from "../component/InsightPageCompponents/TransactionCard";
import InsightCards from "../component/InsightPageCompponents/InsightCards";
import data from "../data/insightsData.json";
import useLoading from "../hooks/useLoading";
import { InsightsSkeleton } from "../component/common/SkeletonLoader";

const { globalInsightsMeta } = data;

const Insights = () => {
  const loading = useLoading(1200);

  if (loading) return <InsightsSkeleton />;

  return (
    <div className="flex bg-white mt-20 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4 max-sm:px-3 max-sm:py-3">

          {/* ── Header ── */}
          <div className="flex items-end justify-between max-sm:flex-col max-sm:items-start max-sm:gap-1">
            <div className="w-72 mt-2 h-18 bg-[#fbd69e53] p-6 flex items-center justify-center rounded-xl max-sm:w-full max-sm:p-4">
              <h1 className="font-[font2] text-7xl text-orange-400 max-sm:text-5xl">
                Insights.
              </h1>
            </div>
            <span className="text-[11px] text-gray-400 max-sm:pl-1">
              Last updated · 3 min ago
            </span>
          </div>

          {/* ── Meta pills ── */}
          <div className="mt-5 flex gap-2 flex-wrap max-sm:mt-2">
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

          {/* ── InsightCards + TransactionCard ──
               Desktop : 2-col grid (unchanged)
               Tablet  : 2-col grid (unchanged)
               Mobile  : single column stack            */}
          <div className="grid grid-cols-2 gap-3 pb-5 max-sm:grid-cols-1 max-sm:pb-2">
            <InsightCards />
            <TransactionCard />
          </div>

          {/* ── RevenueCard + CountryCard ──
               Desktop : [1fr_300px] (unchanged)
               Tablet  : [1fr_260px]
               Mobile  : single column stack            */}
          <div className="grid grid-cols-[1fr_300px] gap-3 max-md:grid-cols-[1fr_240px] max-sm:grid-cols-1">
            <RevenueCard />
            <CountryCard />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Insights;
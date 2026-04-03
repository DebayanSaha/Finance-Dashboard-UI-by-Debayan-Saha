import CountryCard from "../component/InsightPageCompponents/CountryCard";
import RevenueCard from "../component/InsightPageCompponents/RevenueCard";
import RegistrationCard from "../component/InsightPageCompponents/RegistrationCard";
import TransactionCard from "../component/InsightPageCompponents/TransactionCard";

const Insights = () => {
  return (
    <div className="flex bg-white mt-20  overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4 ">

          {/* Page heading */}
          <div className="flex items-end justify-between">
            <div className="w-72 mt-2 h-18 bg-[#fbd69e53] p-6 flex items-center justify-center rounded-xl">
               <h1 className="font-[font2] text-7xl text-orange-400">
                   Insights.
                 </h1>
              </div>
            <span className="text-[11px] text-gray-400">Last updated · 3 min ago</span>
          </div>

          {/* Top row — Revenue (wide) + Country (narrow) */}
          <div className="grid grid-cols-[1fr_300px] gap-3">
            <RevenueCard />
            <CountryCard />
          </div>

          {/* Bottom row — Registration + Transaction (equal halves) */}
          <div className="grid grid-cols-2 gap-3 pb-5">
            <RegistrationCard />
            <TransactionCard />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Insights;
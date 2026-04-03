import React from "react";
import Topbar from "../component/Topbar";
import Sidebar from "../component/Sidebar";
import StatsCards from "../component/StatsCards";
import BalanceChart from "../component/BalanceChart";
import StatisticsChart from "../component/Statisticschart";

const Dashboard = () => {
  return (
    <div className="flex bg-white h-screen p-1">
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="fixed top-0 left-64 right-0 h-22 flex items-center justify-center py-2 z-50">
          <Topbar />
        </div>
        {/* Page Content */}
        <div className="flex-1 p-6 mt-20">
          <div className="w-95 mt-2 h-18 bg-[#fbd69e53] p-6 flex items-center justify-center rounded-xl">
            <h1 className="font-[font2] text-7xl text-orange-400 ">
              Dashboard.
            </h1>
          </div>
          <div className="">
            <div className="w-full h-15 mt-8 flex gap-2 ">
              <div className="w-12 h-12 rounded-full border border-[#fbd69e] flex items-center justify-center">
                <i className="ri-calendar-2-line text-2xl text-[#ff7332]"></i>
              </div>
              <div className="w-35 h-12 rounded-full border border-[#fbd69e] flex items-center justify-center">
                <h1 className="text-xl font-[font2] text-[#8f5b43]">
                  This month
                </h1>
              </div>
            </div>
            <div className="w-full px-2 py-1 ">
              <StatsCards />
            </div>
          </div>
          <div className="w-full mt-8 p-2 ">
            <BalanceChart />
          </div>

          <div className="w-full mt-8  ">
            <StatisticsChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

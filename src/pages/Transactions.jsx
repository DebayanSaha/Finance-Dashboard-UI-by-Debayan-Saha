import React from "react";
import Sidebar from "../component/Sidebar";
import Topbar from "../component/Topbar";
import TransactionsTable from "../component/TransactionsTable";

const Transactions = () => {
  return (
    <div className="flex bg-white h-screen p-1">
      
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Topbar */}
      <div className="fixed top-0 left-64 right-0 h-22 flex items-center justify-center py-2 z-50">
        <Topbar />
      </div>

      {/* Content */}
      <div className="flex-1 p-6 mt-20">
        
        {/* Heading */}
        <div className="w-108 mt-2 h-18 bg-[#fbd69e53] p-6 flex items-center justify-center rounded-xl">
          <h1 className="font-[font2] text-7xl text-orange-400">
            Transactions.
          </h1>
        </div>

        {/* Table Component */}
        <TransactionsTable />

      </div>
    </div>
  );
};

export default Transactions;
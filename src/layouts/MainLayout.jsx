import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../component/common/Sidebar";
import Topbar from "../component/common/Topbar";
import { RoleProvider } from "../context/RoleContext";

const MainLayout = () => {
  return (
    <RoleProvider>
      <div className="flex h-screen">

        {/* Sidebar */}
        <div className="w-64 fixed h-full">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 flex flex-col">

          {/* Topbar */}
          <div className="fixed top-0 left-64 right-0 h-22 flex items-center justify-center py-2 z-50">
            <Topbar />
          </div>

          {/* Page Content */}
          <div className="p-2 overflow-y-auto">
            <Outlet />
          </div>

        </div>
      </div>
    </RoleProvider>
  );
};

export default MainLayout;
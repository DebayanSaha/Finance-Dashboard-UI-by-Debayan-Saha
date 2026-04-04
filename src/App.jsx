import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "remixicon/fonts/remixicon.css";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import FinanceDashboard from "./pages/FinanceDashboard";

import MainLayout from "./layouts/MainLayout";
import { RoleProvider } from "./context/RoleContext";

const App = () => {
  return (
    <RoleProvider>
      {/* ToastContainer renders all toasts — place once at root, outside Router */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      <Router>
        <Routes>
          {/* Layout Wrapper */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/3" element={<FinanceDashboard />} />
          </Route>
        </Routes>
      </Router>
    </RoleProvider>
  );
};

export default App;
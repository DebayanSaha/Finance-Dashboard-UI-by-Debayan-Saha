import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "remixicon/fonts/remixicon.css";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import FinanceDashboard from "./pages/FinanceDashboard";

import MainLayout from "./layouts/MainLayout";

const App = () => {
  return (
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
  );
};

export default App;
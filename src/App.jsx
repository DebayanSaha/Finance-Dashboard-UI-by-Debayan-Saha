import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "remixicon/fonts/remixicon.css";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import FinanceDashboard from "./pages/FinanceDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Dashboard />} />

        {/* Other routes */}
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/3" element={<FinanceDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
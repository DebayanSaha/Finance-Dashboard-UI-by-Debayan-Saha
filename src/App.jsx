import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "remixicon/fonts/remixicon.css";

import Dashboard        from "./pages/Dashboard";
import Transactions     from "./pages/Transactions";
import Insights         from "./pages/Insights";
import FinanceDashboard from "./pages/FinanceDashboard";
import MainLayout       from "./layouts/MainLayout";
import { RoleProvider } from "./context/RoleContext";

// ── Transition variant — fade + subtle upward slide ──────────────────────────
const pageVariants = {
  initial:  { opacity: 0, y: 10 },
  animate:  { opacity: 1, y: 0  },
  exit:     { opacity: 0, y: -6 },
};

const pageTransition = {
  duration: 0.3,
  ease: "easeInOut",
};

// ── Animated page wrapper ─────────────────────────────────────────────────────
export const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={pageTransition}
    // No width/height/overflow styles — zero layout impact
  >
    {children}
  </motion.div>
);

// ── Animated routes — must live inside <Router> to access useLocation ─────────
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
          <Route path="/"             element={<PageWrapper><Dashboard        /></PageWrapper>} />
          <Route path="/transactions" element={<PageWrapper><Transactions     /></PageWrapper>} />
          <Route path="/insights"     element={<PageWrapper><Insights         /></PageWrapper>} />
          <Route path="/3"            element={<PageWrapper><FinanceDashboard /></PageWrapper>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

// ── Root ──────────────────────────────────────────────────────────────────────
const App = () => (
  <RoleProvider>
    <ToastContainer
      position="top-right"
      autoClose={2500}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
    />
    <Router>
      <AnimatedRoutes />
    </Router>
  </RoleProvider>
);

export default App;
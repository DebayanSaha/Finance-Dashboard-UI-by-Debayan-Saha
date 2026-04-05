import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../component/common/Sidebar";
import Topbar from "../component/common/Topbar";
import { RoleProvider } from "../context/RoleContext";
import { useTheme } from "../context/Themecontext";

const ThemedLayout = () => {
  const { isDark } = useTheme();

  // ── Collapse lives HERE so MainLayout controls the sidebar width ───────────
  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  return (
    <div
      className={`flex h-screen overflow-hidden transition-colors duration-300
        ${isDark ? "bg-black" : "bg-white"}`}
    >
      {/* ── DESKTOP sidebar — in flex flow so content expands naturally ─────── */}
      <div
        className={`shrink-0 transition-all duration-300 ease-in-out h-full max-md:hidden
          ${collapsed ? "w-20" : "w-64"}`}
      >
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
          mobileOpen={false}
          onClose={() => {}}
        />
      </div>

      {/* ── MOBILE sidebar — fixed overlay, not in flow ──────────────────────── */}
      <div className="hidden max-md:block">
        <Sidebar
          collapsed={false}
          onToggleCollapse={() => {}}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
      </div>

      {/* ── MAIN CONTENT — flex-1 + min-w-0 so it fills remaining space ─────── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* Topbar — sticky so it stays at the top of the scroll column */}
        <div className="sticky top-0 z-50 flex items-center justify-center py-2 shrink-0">
          <Topbar />
        </div>

        {/* Page content scrolls independently */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>

      </div>

      {/* ── FLOATING HAMBURGER — mobile only ────────────────────────────────── */}
      <button
        onClick={() => setMobileOpen((o) => !o)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        className={`
          hidden max-md:flex
          fixed top-1/2 -translate-y-1/2 z-[110]
          items-center justify-center
          w-9 h-9 rounded-r-2xl
          bg-orange-500 hover:bg-orange-600
          shadow-[2px_0_12px_rgba(249,115,22,0.35)]
          transition-all duration-300
          ${mobileOpen ? "left-64" : "left-0"}
        `}
      >
        {mobileOpen
          ? <span className="text-white text-lg leading-none">✕</span>
          : <span className="text-white text-lg leading-none">☰</span>
        }
      </button>

    </div>
  );
};

const MainLayout = () => (
  <RoleProvider>
    <ThemedLayout />
  </RoleProvider>
);

export default MainLayout;
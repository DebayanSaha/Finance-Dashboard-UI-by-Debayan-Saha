import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "../component/common/Sidebar";
import Topbar from "../component/common/Topbar";
import { RoleProvider } from "../context/RoleContext";
import { ThemeProvider, useTheme } from "../context/Themecontext";

const ThemedLayout = () => {
  const { isDark } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={`flex h-screen ${isDark ? "dark" : ""}`}>

      {/* ── DESKTOP: sidebar in normal flow ── */}
      <div className="w-64 fixed h-full max-md:hidden">
        <Sidebar mobileOpen={false} onClose={() => {}} />
      </div>

      {/* ── MOBILE: sidebar as overlay, controlled by mobileOpen ── */}
      <div className="hidden max-md:block">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 ml-64 flex flex-col max-md:ml-0">

        {/* Topbar */}
        <div className="fixed top-0 left-64 right-0 h-22
          flex items-center justify-center py-2 z-50
          max-md:left-0">
          <Topbar />
        </div>

        {/* Page content */}
        <div className="p-2 overflow-y-auto">
          <Outlet />
        </div>

      </div>

      {/* ── FLOATING HAMBURGER BUTTON — mobile only ──────────────────────── */}
      <button
        onClick={() => setMobileOpen(o => !o)}
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
    <ThemeProvider>
      <ThemedLayout />
    </ThemeProvider>
  </RoleProvider>
);

export default MainLayout;
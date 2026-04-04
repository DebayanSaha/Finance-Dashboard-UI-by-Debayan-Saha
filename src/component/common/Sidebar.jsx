import React, { useState } from "react";
import {
  LayoutDashboard, ArrowLeftRight, FileText,
  ChevronLeft, HelpCircle, LogOut, ArrowUpRight, X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { id: "dashboard",    label: "Dashboard",    icon: LayoutDashboard, path: "/" },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight,  path: "/transactions" },
  { id: "insights",     label: "Insights",     icon: FileText,        path: "/insights" },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* ── MOBILE BACKDROP ──────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* ── SIDEBAR PANEL ────────────────────────────────────────────────── */}
      <div
        className={`
          relative flex flex-col h-screen bg-orange-50
          rounded-tr-3xl rounded-br-3xl
          transition-all duration-300
          shadow-sm border border-orange-100

          /* Desktop — collapsible as before */
          ${collapsed ? "w-20" : "w-64"}

          /* Mobile — fixed overlay, slides in/out */
          max-md:fixed max-md:top-0 max-md:left-0 max-md:z-[100]
          max-md:w-64 max-md:h-full
          max-md:transition-transform max-md:duration-300
          ${mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"}
        `}
      >
        {/* ── Desktop collapse toggle ── */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="cursor-pointer absolute -right-3 top-8 z-10 w-6 h-6
            rounded-full bg-white border border-orange-200
            flex items-center justify-center shadow-sm
            hover:bg-orange-50 transition-colors
            max-md:hidden"
        >
          <ChevronLeft
            size={13}
            className={`text-orange-400 transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* ── Mobile close button (inside panel) ── */}
        <button
          onClick={onClose}
          className="hidden max-md:flex absolute top-4 right-4 z-10
            w-7 h-7 items-center justify-center
            rounded-full bg-orange-100 hover:bg-orange-200
            transition-colors"
          aria-label="Close sidebar"
        >
          <X size={14} className="text-orange-500" />
        </button>

        {/* ── Logo ── */}
        <div className="flex items-center gap-3 px-5 pt-7 pb-8">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center
            justify-center shrink-0 shadow-md overflow-hidden">
            <img src="./img/logo.png" alt="logo" />
          </div>
          {!collapsed && (
            <span className="text-gray-800 font-[font2] text-lg">Zorvyn</span>
          )}
        </div>

        {/* ── Nav items ── */}
        <nav className="flex-1 flex flex-col gap-1 px-3">
          {navItems.map(({ id, label, icon: Icon, path }) => (
            <NavLink
              key={id}
              to={path}
              onClick={() => { if (mobileOpen) onClose(); }}
              className={({ isActive }) =>
                `cursor-pointer flex items-center gap-3 px-4 py-3 rounded-2xl
                w-full text-left transition-all duration-150
                ${isActive
                  ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                  : "text-gray-500 hover:bg-orange-100 hover:text-orange-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    className={`shrink-0 ${isActive ? "text-white" : "text-gray-400"}`}
                  />
                  {!collapsed && (
                    <span className="text-sm font-[font3]">{label}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Bottom section ── */}
        <div className="flex flex-col gap-1 px-3 pb-4">
          {[{ icon: HelpCircle, label: "Help" }, { icon: LogOut, label: "Log out" }].map(
            ({ icon: Icon, label }) => (
              <button
                key={label}
                className="cursor-pointer flex items-center gap-3 px-4 py-3 rounded-2xl
                  text-gray-400 hover:bg-orange-100 hover:text-orange-500
                  transition-colors w-full text-left"
              >
                <Icon size={20} className="shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-[font3]">{label}</span>
                )}
              </button>
            )
          )}

          <div className="mt-3 px-1">
            <a href="https://www.zorvyn.io/" target="_blank" rel="noopener noreferrer">
              <button className="cursor-pointer flex items-center gap-2 bg-orange-500
                hover:bg-orange-600 text-white rounded-2xl px-4 py-3 w-full
                transition-colors shadow-md shadow-orange-200">
                <ArrowUpRight size={18} className="shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-[font2]">Visit</span>
                )}
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
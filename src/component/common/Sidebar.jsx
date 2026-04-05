import React from "react";
import {
  Gauge, CreditCard, Lightbulb,
  ChevronLeft, LifeBuoy, Power, Rocket, X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/Themecontext";

const navItems = [
  { id: "dashboard",    label: "Dashboard",    icon: Gauge, path: "/" },
  { id: "transactions", label: "Transactions", icon: CreditCard,  path: "/transactions" },
  { id: "insights",     label: "Insights",     icon: Lightbulb,        path: "/insights" },
];

/**
 * Sidebar
 *
 * Props (all from MainLayout — collapse is lifted up):
 *   collapsed         {boolean}  — whether sidebar is narrow
 *   onToggleCollapse  {fn}       — toggle collapsed state
 *   mobileOpen        {boolean}  — mobile overlay visibility
 *   onClose           {fn}       — close mobile overlay
 */
const Sidebar = ({ collapsed, onToggleCollapse, mobileOpen, onClose }) => {
  const { isDark } = useTheme();

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
      {/*
          Desktop: width is controlled by the parent wrapper div in MainLayout.
          This div just fills 100% of that wrapper (w-full h-full).
          Mobile:  fixed overlay, slides in/out independently.
      */}
      <div
        className={`
          relative flex flex-col h-full w-full
          transition-colors duration-300
          rounded-tr-3xl rounded-br-3xl
          shadow-sm
          ${isDark
            ? "bg-gray-900 border border-gray-700"
            : "bg-orange-50 border border-orange-100"
          }

          /* Mobile — fixed overlay, slides in/out */
          max-md:fixed max-md:top-0 max-md:left-0 max-md:z-[100]
          max-md:w-64 max-md:h-full max-md:rounded-none
          max-md:transition-transform max-md:duration-300
          ${mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"}
        `}
      >
        {/* ── Desktop collapse toggle ── */}
        <button
          onClick={onToggleCollapse}
          className={`cursor-pointer absolute -right-3 top-8 z-10 w-6 h-6
            rounded-full flex items-center justify-center shadow-sm
            transition-colors max-md:hidden
            ${isDark
              ? "bg-gray-800 border border-gray-600 hover:bg-gray-700"
              : "bg-white border border-orange-200 hover:bg-orange-50"
            }`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            size={13}
            className={`transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            } ${isDark ? "text-gray-400" : "text-orange-400"}`}
          />
        </button>

        {/* ── Mobile close button (inside panel) ── */}
        <button
          onClick={onClose}
          className={`hidden max-md:flex absolute top-4 right-4 z-10
            w-7 h-7 items-center justify-center
            rounded-full transition-colors
            ${isDark
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-orange-100 hover:bg-orange-200"
            }`}
          aria-label="Close sidebar"
        >
          <X size={14} className={isDark ? "text-gray-300" : "text-orange-500"} />
        </button>

        {/* ── Logo ── */}
        <div className={`flex items-center px-5 pt-7 pb-8 transition-all duration-300
          ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center
            justify-center shrink-0 shadow-md overflow-hidden">
            <img src="./img/logo.png" alt="logo" />
          </div>
          {!collapsed && (
            <span className={`font-[font2] text-lg whitespace-nowrap overflow-hidden
              transition-colors duration-300 ${isDark ? "text-gray-100" : "text-gray-800"}`}>
              Zorvyn
            </span>
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
                w-full text-left transition-all duration-200 ease-in-out hover:scale-[1.02]
                ${collapsed ? "justify-center px-2" : ""}
                ${isActive
                  ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                  : isDark
                    ? "text-gray-400 hover:bg-gray-800 hover:text-orange-400"
                    : "text-gray-500 hover:bg-orange-100 hover:text-orange-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    className={`shrink-0 ${
                      isActive
                        ? "text-white"
                        : isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  {!collapsed && (
                    <span className="text-sm font-[font3] whitespace-nowrap overflow-hidden">
                      {label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Bottom section ── */}
        <div className="flex flex-col gap-1 px-3 pb-4">
          {[{ icon: LifeBuoy, label: "Help" }, { icon: Power, label: "Log out" }].map(
            ({ icon: Icon, label }) => (
              <button
                key={label}
                className={`cursor-pointer flex items-center gap-3 py-3 rounded-2xl
                  transition-all duration-200 ease-in-out hover:scale-[1.02] w-full text-left
                  ${collapsed ? "justify-center px-2" : "px-4"}
                  ${isDark
                    ? "text-gray-500 hover:bg-gray-800 hover:text-orange-400"
                    : "text-gray-400 hover:bg-orange-100 hover:text-orange-500"
                  }`}
              >
                <Icon size={20} className="shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-[font3] whitespace-nowrap">{label}</span>
                )}
              </button>
            )
          )}

          <div className="mt-3 px-1">
            <a href="https://www.zorvyn.io/" target="_blank" rel="noopener noreferrer">
              <button className={`cursor-pointer flex items-center gap-2 bg-orange-500
                hover:bg-orange-600 text-white rounded-2xl py-3 w-full
                transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95 shadow-md shadow-orange-200 hover:shadow-orange-500/20
                ${collapsed ? "justify-center px-2" : "px-4"}`}>
                <Rocket size={18} className="shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-[font2] whitespace-nowrap">Visit</span>
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
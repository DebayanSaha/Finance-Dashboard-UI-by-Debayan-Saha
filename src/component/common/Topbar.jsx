import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Sun, Moon, Menu } from "lucide-react";
import { useRole } from "../../context/RoleContext";
import { useTheme } from "../../context/Themecontext";

const Topbar = () => {
  const { role, setRole } = useRole();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close when clicking outside both the hamburger and the dropdown
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (
        hamburgerRef.current?.contains(e.target) ||
        dropdownRef.current?.contains(e.target)
      ) return;
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler, true);
    return () => document.removeEventListener("mousedown", handler, true);
  }, [menuOpen]);

  // Position the portal dropdown under the hamburger button
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  useEffect(() => {
    if (menuOpen && hamburgerRef.current) {
      const rect = hamburgerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [menuOpen]);

  // Dropdown content — rendered via portal
  const dropdown = (
    <div
      ref={dropdownRef}
      style={{ top: dropdownPos.top, right: dropdownPos.right }}
      className={`
        fixed z-[9999] w-72
        rounded-2xl shadow-xl overflow-hidden
        transition-all duration-200 origin-top-right
        ${isDark
          ? "bg-gray-900 border border-gray-700"
          : "bg-white border border-orange-100"
        }
        ${menuOpen
          ? "opacity-100 scale-100 pointer-events-auto"
          : "opacity-0 scale-95 pointer-events-none"
        }
      `}
    >
      {/* User row */}
      <div className={`flex items-center gap-3 px-4 py-4 border-b ${
        isDark
          ? "bg-gray-800 border-gray-700"
          : "bg-orange-50 border-orange-100"
      }`}>
        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className={`w-10 h-10 rounded-full border ${
            isDark ? "border-gray-600" : "border-orange-200"
          }`}
        />
        <div>
          <p className={`text-sm font-[font3] leading-tight ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>User</p>
          <p className={`text-[11px] font-[font3] ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}>user@zorvyn.io</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-full border ${
          isDark
            ? "bg-gray-800 border-gray-600"
            : "bg-orange-50 border-orange-200"
        }`}>
          <i className={`ri-search-line text-base ${isDark ? "text-gray-500" : "text-orange-400"}`} />
          <input
            type="text"
            placeholder="Search..."
            className={`bg-transparent outline-none w-full text-sm font-[font3] ${
              isDark
                ? "text-gray-300 placeholder-gray-600"
                : "text-gray-700 placeholder-orange-300"
            }`}
          />
        </div>
      </div>

      <div className={`h-px mx-4 my-2 ${isDark ? "bg-gray-700" : "bg-orange-100"}`} />

      {/* Role switch */}
      <div className="px-4 pb-3">
        <p className={`text-[10px] font-[font3] uppercase tracking-widest mb-2 ${
          isDark ? "text-gray-500" : "text-gray-400"
        }`}>
          Role
        </p>
        <div className="flex gap-2">
          {["Admin", "Viewer"].map(r => (
            <button
              key={r}
              onClick={() => { setRole(r); setMenuOpen(false); }}
              className={`flex-1 py-1.5 rounded-full text-sm font-[font3]
                transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95 cursor-pointer border
                ${role === r
                  ? "bg-orange-500 text-white border-orange-500"
                  : isDark
                    ? "text-gray-400 border-gray-600 hover:bg-gray-800"
                    : "text-gray-500 border-gray-200 hover:bg-orange-50"
                }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex justify-center font-[font2]">

      {/* DESKTOP TOPBAR */}
      <div
        className="
          w-[55%] max-w-6xl
          flex items-center justify-between
          px-4 py-2 rounded-full
          backdrop-blur-md bg-[#faa038]
          border border-white/20
          shadow-[0_8px_30px_rgba(255,140,0,0.25)]
          max-md:hidden
        "
      >
        {/* Role Switch */}
        <div className="flex items-center gap-2 bg-white/20 rounded-full p-1">
          <button
            onClick={() => setRole("Admin")}
            className={`px-4 py-1 rounded-full text-sm transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95 cursor-pointer ${
              role === "Admin" ? "bg-white text-black shadow" : "text-white/80"
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => setRole("Viewer")}
            className={`px-4 py-1 rounded-full text-sm transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95 cursor-pointer ${
              role === "Viewer" ? "bg-white text-black shadow" : "text-white/80"
            }`}
          >
            Viewer
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-white/10 border border-[#ffffff34] px-4 py-2 rounded-full w-[40%]">
          <i className="ri-search-line text-white text-lg" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-white placeholder-white/80 w-full text-sm"
          />
        </div>

        {/* Profile & Theme */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95"
            aria-label="Toggle theme"
          >
            {isDark
              ? <Sun size={16} className="text-white" />
              : <Moon size={16} className="text-white" />
            }
          </button>
          <span className="text-white/80 text-sm hidden sm:block">Hello, User</span>
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="w-10 h-10 rounded-full border border-white/30"
          />
        </div>
      </div>

      {/* MOBILE TOPBAR */}
      <div
        className="hidden max-md:flex w-[calc(100%-24px)] max-w-[480px]
          items-center justify-between
          px-4 py-2 rounded-full
          backdrop-blur-md bg-[#faa038]
          border border-white/20
          shadow-[0_8px_30px_rgba(255,140,0,0.25)]"
      >
        <span className="text-white font-[font2] text-base">Zorvyn</span>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-full
              bg-white/20 hover:bg-white/30 transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95"
            aria-label="Toggle theme"
          >
            {isDark
              ? <Sun size={15} className="text-white" />
              : <Moon size={15} className="text-white" />
            }
          </button>
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="w-8 h-8 rounded-full border-2 border-white/30 pointer-events-none select-none"
          />
          <button
            ref={hamburgerRef}
            onClick={() => setMenuOpen(o => !o)}
            className="w-9 h-9 flex items-center justify-center rounded-full
              bg-white/20 hover:bg-white/30 transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95"
            aria-label="Toggle menu"
          >
            <Menu size={18} className="text-white" />
          </button>
        </div>
      </div>

      {typeof document !== "undefined" && createPortal(dropdown, document.body)}
    </div>
  );
};

export default Topbar;
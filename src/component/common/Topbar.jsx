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
        bg-white rounded-2xl shadow-xl border border-orange-100
        overflow-hidden
        transition-all duration-200 origin-top-right
        ${menuOpen
          ? "opacity-100 scale-100 pointer-events-auto"
          : "opacity-0 scale-95 pointer-events-none"
        }
      `}
    >
      {/* User row */}
      <div className="flex items-center gap-3 px-4 py-4 bg-orange-50 border-b border-orange-100">
        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="w-10 h-10 rounded-full border border-orange-200"
        />
        <div>
          <p className="text-sm font-[font3] text-gray-800 leading-tight">User</p>
          <p className="text-[11px] font-[font3] text-gray-400">user@zorvyn.io</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-3 py-2 rounded-full">
          <i className="ri-search-line text-orange-400 text-base" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-gray-700
              placeholder-orange-300 w-full text-sm font-[font3]"
          />
        </div>
      </div>

      <div className="h-px bg-orange-100 mx-4 my-2" />

      {/* Role switch */}
      <div className="px-4 pb-3">
        <p className="text-[10px] font-[font3] uppercase tracking-widest text-gray-400 mb-2">
          Role
        </p>
        <div className="flex gap-2">
          {["Admin", "Viewer"].map(r => (
            <button
              key={r}
              onClick={() => { setRole(r); setMenuOpen(false); }}
              className={`flex-1 py-1.5 rounded-full text-sm font-[font3]
                transition cursor-pointer border
                ${role === r
                  ? "bg-orange-500 text-white border-orange-500"
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
            className={`px-4 py-1 rounded-full text-sm transition cursor-pointer ${
              role === "Admin" ? "bg-white text-black shadow" : "text-white/80"
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => setRole("Viewer")}
            className={`px-4 py-1 rounded-full text-sm transition cursor-pointer ${
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
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
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
              bg-white/20 hover:bg-white/30 transition-colors"
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
              bg-white/20 hover:bg-white/30 transition-colors"
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
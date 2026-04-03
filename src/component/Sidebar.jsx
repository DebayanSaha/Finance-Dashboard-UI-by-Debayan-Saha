import React, { useState } from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  FileText,
  ChevronLeft,
  HelpCircle,
  LogOut,
  ArrowUpRight,
} from "lucide-react";

const navItems = [
  { id: "dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight   },
  { id: "inside",       label: "Inside",       icon: FileText         },
];

const Sidebar = () => {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`relative flex flex-col h-screen bg-orange-50 rounded-tr-3xl rounded-br-3xl transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } shadow-sm border border-orange-100`}
    >
      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="cursor-pointer absolute -right-3 top-8 z-10 w-6 h-6 rounded-full bg-white border border-orange-200 flex items-center justify-center shadow-sm hover:bg-orange-50 transition-colors"
      >
        <ChevronLeft
          size={13}
          className={`text-orange-400 transition-transform duration-300 ${
            collapsed ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-5 pt-7 pb-8">
        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shrink-0 shadow-md overflow-hidden">
          <img src="./img/logo.png" alt="" />
        </div>
        {!collapsed && (
          <span className="text-gray-800 font-[font2] text-lg ">
            Zorvyn
          </span>
        )}
      </div>

      {/* ── Nav items ── */}
      <nav className="flex-1 flex flex-col gap-1 px-3">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`cursor-pointer flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-left transition-all duration-150 ${
                isActive
                  ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                  : "text-gray-500 hover:bg-orange-100 hover:text-orange-600"
              }`}
            >
              <Icon
                size={20}
                className={`shrink-0 ${isActive ? "text-white" : "text-gray-400"}`}
              />
              {!collapsed && (
                <span className="text-sm font-[font3]">{label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Bottom section ── */}
      <div className="flex flex-col gap-1 px-3 pb-4">
        {[
          { icon: HelpCircle, label: "Help" },
          { icon: LogOut,     label: "Log out" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="cursor-pointer flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:bg-orange-100 hover:text-orange-500 transition-colors w-full text-left"
          >
            <Icon size={20} className="shrink-0" />
            {!collapsed && <span className="text-sm font-[font3] ">{label}</span>}
          </button>
        ))}

        {/* Visit button */}
        <div className="mt-3 px-1">
          <a
            href="https://www.zorvyn.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="cursor-pointer flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-4 py-3 w-full transition-colors shadow-md shadow-orange-200">
              <ArrowUpRight size={18} className="shrink-0" />
              {!collapsed && <span className="text-sm font-[font2]">Visit</span>}
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
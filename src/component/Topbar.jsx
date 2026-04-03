import React, { useState } from "react";

const Topbar = () => {
  const [role, setRole] = useState("Admin");

  return (
    <div className="w-full flex justify-center font-[font2]">
      <div
        className="
          w-[55%] max-w-6xl
          flex items-center justify-between
          px-6 py-3
          rounded-full
          backdrop-blur-md
          bg-[#faa038]
          border border-white/20
          shadow-[0_8px_30px_rgba(255,140,0,0.25)]
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
          <i className="ri-search-line text-white text-lg"></i>

          <input
            type="text"
            placeholder="Search..."
            className="
              bg-transparent
              outline-none
              text-white
              placeholder-white/80
              w-full
              text-sm
            "
          />
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-3">
          <span className="text-white/80 text-sm hidden sm:block">
            Hello, User
          </span>

          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="w-10 h-10 rounded-full border border-white/30"
          />
        </div>
      </div>
    </div>
  );
};

export default Topbar;

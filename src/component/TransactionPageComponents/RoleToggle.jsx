// src/components/RoleToggle.jsx
import React from "react";

const RoleToggle = ({ role, onChange }) => (
  <select
    value={role}
    onChange={(e) => onChange(e.target.value)}
    className="h-8 px-3 text-xs border font-[font2] border-[#fdb74db7] rounded-full bg-white outline-none text-gray-700"
  >
    <option value="Viewer">👁 Viewer</option>
    <option value="Admin">🛠 Admin</option>
  </select>
);

export default RoleToggle;
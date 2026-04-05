import React from "react";
import { useTheme } from "../../context/Themecontext";

// ── Add Transaction Button ─────────────────────────────────────────────────────
export const AddTransactionButton = ({ role, onAdd }) => {
  const { isDark } = useTheme();
  const isAdmin = role === "Admin";

  return (
    <button
      onClick={isAdmin ? onAdd : undefined}
      disabled={!isAdmin}
      className={`h-8 px-3 text-xs font-[font2] border rounded-full outline-none
        transition-colors disabled:opacity-40 disabled:cursor-not-allowed
        ${isDark
          ? "border-amber-700/50 bg-gray-900 text-gray-300 hover:bg-gray-800 disabled:hover:bg-gray-900"
          : "border-[#fdb74db7] bg-white text-gray-700 hover:bg-amber-50 disabled:hover:bg-white"
        }`}
    >
      + Add Transaction
    </button>
  );
};

// ── Row-level Edit + Delete ───────────────────────────────────────────────────
export const RowActions = ({ role, tx, onEdit, onDelete, isEditing }) => {
  const { isDark } = useTheme();
  const isAdmin = role === "Admin";

  return (
    <div className="flex gap-1">
      {!isEditing && (
        <button
          onClick={isAdmin ? () => onEdit(tx) : undefined}
          disabled={!isAdmin}
          className={`h-6 px-2 text-xs font-[font2] border rounded-lg transition-colors
            disabled:opacity-40 disabled:cursor-not-allowed
            ${isDark
              ? "border-gray-600 bg-gray-900 text-gray-400 hover:bg-gray-800 disabled:hover:bg-gray-900"
              : "border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:hover:bg-white"
            }`}
        >
          Edit
        </button>
      )}
      <button
        onClick={isAdmin ? () => onDelete(tx) : undefined}
        disabled={!isAdmin}
        className={`h-6 px-2 text-xs font-[font2] border rounded-lg transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed
          ${isDark
            ? "border-red-900/50 bg-gray-900 text-red-400 hover:bg-red-900/20 disabled:hover:bg-gray-900"
            : "border-red-100 bg-white text-red-400 hover:bg-red-50 disabled:hover:bg-white"
          }`}
      >
        Delete
      </button>
    </div>
  );
};
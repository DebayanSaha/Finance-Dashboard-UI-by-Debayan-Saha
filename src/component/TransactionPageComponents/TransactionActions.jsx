import React from "react";

// ── Add Transaction Button (top-bar controls row) ─────────────────────────────
export const AddTransactionButton = ({ role, onAdd }) => {
  const isAdmin = role === "Admin";

  return (
    <button
      onClick={isAdmin ? onAdd : undefined}
      disabled={!isAdmin}
      className="h-8 px-3 text-xs font-[font2] border border-[#fdb74db7] rounded-full bg-white outline-none text-gray-700 hover:bg-amber-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
    >
      + Add Transaction
    </button>
  );
};

// ── Row-level Edit + Delete ───────────────────────────────────────────────────
export const RowActions = ({ role, tx, onEdit, onDelete, isEditing }) => {
  const isAdmin = role === "Admin";

  return (
    <div className="flex gap-1">
      {!isEditing && (
        <button
          onClick={isAdmin ? () => onEdit(tx) : undefined}
          disabled={!isAdmin}
          className="h-6 px-2 text-xs font-[font2] border border-gray-200 rounded-lg bg-white text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          Edit
        </button>
      )}
      <button
        onClick={isAdmin ? () => onDelete(tx) : undefined}
        disabled={!isAdmin}
        className="h-6 px-2 text-xs font-[font2] border border-red-100 rounded-lg bg-white text-red-400 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
      >
        Delete
      </button>
    </div>
  );
};
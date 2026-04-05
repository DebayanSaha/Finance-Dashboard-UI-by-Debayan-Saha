import { useEffect, useRef } from "react";
import { useTheme } from "../../context/Themecontext";

/**
 * ConfirmModal — reusable confirmation dialog.
 *
 * Props:
 *   isOpen      {boolean}  — controls visibility
 *   title       {string}   — modal heading
 *   message     {string}   — body copy
 *   confirmLabel{string}   — confirm button text (default "Delete")
 *   onConfirm   {fn}       — called when user confirms
 *   onCancel    {fn}       — called when user cancels / closes
 */
const ConfirmModal = ({
  isOpen,
  title       = "Are you sure?",
  message     = "This action cannot be undone.",
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}) => {
  const { isDark } = useTheme();
  const cancelBtnRef = useRef(null);

  // ── Close on ESC ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  // ── Auto-focus Cancel on open (accessibility) ─────────────────────────────
  useEffect(() => {
    if (isOpen) {
      // Small delay so the animation doesn't fight focus
      const t = setTimeout(() => cancelBtnRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // ── Backdrop ─────────────────────────────────────────────────────────────
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center
        bg-black/50 backdrop-blur-sm
        animate-[fadeIn_0.15s_ease-out]"
      onClick={onCancel}   // close on outside click
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      {/* ── Modal box ─────────────────────────────────────────────────────── */}
      <div
        className={`relative w-full max-w-sm mx-4 rounded-2xl shadow-2xl p-6
          transition-colors duration-300
          animate-[scaleIn_0.15s_ease-out]
          ${isDark ? "bg-gray-900 border border-gray-700" : "bg-white"}`}
        onClick={(e) => e.stopPropagation()} // prevent backdrop close
      >
        {/* Danger icon */}
        <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-4
          ${isDark ? "bg-red-900/40" : "bg-red-50"}`}>
          <i className="ri-delete-bin-line text-red-500 text-xl" />
        </div>

        {/* Title */}
        <h2
          id="confirm-modal-title"
          className={`text-base font-[font2] mb-1.5
            ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {title}
        </h2>

        {/* Message */}
        <p className={`text-sm font-[font3] mb-6
          ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          {/* Cancel */}
          <button
            ref={cancelBtnRef}
            onClick={onCancel}
            className={`flex-1 py-2 rounded-xl text-sm font-[font2] border
              transition-colors duration-150 cursor-pointer
              ${isDark
                ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
          >
            Cancel
          </button>

          {/* Confirm (destructive) */}
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-xl text-sm font-[font2]
              bg-red-500 hover:bg-red-600 active:bg-red-700
              text-white transition-colors duration-150 cursor-pointer
              shadow-sm"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

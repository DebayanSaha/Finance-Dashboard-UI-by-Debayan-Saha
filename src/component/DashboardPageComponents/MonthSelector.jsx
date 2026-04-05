import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/Themecontext";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_FULL = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const MonthSelector = ({ selectedMonth, selectedYear, onMonthChange }) => {
  const [isOpen,  setIsOpen]  = useState(false);
  const [navYear, setNavYear] = useState(selectedYear);
  const popupRef = useRef(null);
  const { isDark } = useTheme();

  const today        = new Date();
  const currentYear  = today.getFullYear();
  const currentMonth = today.getMonth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target))
        setIsOpen(false);
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleIconClick = () => {
    setNavYear(selectedYear);
    setIsOpen(prev => !prev);
  };

  const handleSelectMonth = (monthIndex) => {
    if (
      navYear > currentYear ||
      (navYear === currentYear && monthIndex > currentMonth)
    ) return;
    onMonthChange({ month: monthIndex, year: navYear });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={popupRef}>

      {/* Trigger */}
      <div
        className={`w-12 h-12 rounded-full border flex items-center justify-center cursor-pointer
          transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-95 max-sm:w-10 max-sm:h-10
          ${isDark ? "border-amber-700/40 hover:bg-gray-800" : "border-[#fbd69e] hover:bg-orange-50"}`}
        onClick={handleIconClick}
      >
        <i className="ri-calendar-2-line text-2xl text-[#ff7332] max-sm:text-xl" />
      </div>

      {/* Popup */}
      {isOpen && (
        <div
          className={`absolute top-14 left-0 z-50 rounded-xl p-4 w-72
            max-sm:w-64 max-sm:p-3 max-sm:left-0
            transition-colors duration-300
            ${isDark
              ? "bg-gray-900 border border-gray-700"
              : "bg-white border border-[#fbd69e]"
            }`}
          style={{ boxShadow: "0 8px 32px rgba(255,115,50,0.12)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              className={`text-[#ff7332] text-xl px-2 py-1 rounded-full cursor-pointer transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95
                ${isDark ? "hover:bg-gray-800" : "hover:bg-[#fff3ea]"}`}
              onClick={() => setNavYear(y => y - 1)}
            >
              ‹
            </button>
            <span className={`font-[font2] text-base ${isDark ? "text-amber-300" : "text-[#8f5b43]"}`}>
              {navYear}
            </span>
            <button
              className={`text-xl px-2 py-1 rounded-full cursor-pointer transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95
                ${navYear >= currentYear
                  ? "text-gray-400 cursor-not-allowed"
                  : isDark
                    ? "text-[#ff7332] hover:bg-gray-800"
                    : "text-[#ff7332] hover:bg-[#fff3ea]"
                }`}
              onClick={() => { if (navYear < currentYear) setNavYear(y => y + 1); }}
            >
              ›
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-4 gap-2 max-sm:gap-1.5">
            {MONTHS.map((month, index) => {
              const isSelected = index === selectedMonth && navYear === selectedYear;
              const isFuture   =
                navYear > currentYear ||
                (navYear === currentYear && index > currentMonth);

              return (
                <button
                  key={month}
                  onClick={() => handleSelectMonth(index)}
                  disabled={isFuture}
                  className={`
                    aspect-square flex items-center justify-center
                    text-sm font-[font2] rounded-3xl border transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95 cursor-pointer
                    max-sm:text-xs
                    ${isSelected
                      ? "bg-[#ff7332] text-white border-[#ff7332]"
                      : isFuture
                      ? `border-transparent cursor-not-allowed ${isDark ? "text-gray-600" : "text-gray-300"}`
                      : isDark
                        ? "text-amber-300 border-transparent hover:bg-gray-800 hover:text-[#ff7332]"
                        : "text-[#8f5b43] border-transparent hover:bg-[#fff3ea] hover:text-[#ff7332]"
                    }
                  `}
                >
                  {month}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <p className={`text-center text-xs mt-4 max-sm:text-[11px] ${isDark ? "text-gray-500" : "text-[#c4a08a]"}`}>
            {MONTHS_FULL[selectedMonth]} {selectedYear}
          </p>
        </div>
      )}
    </div>
  );
};

export default MonthSelector;
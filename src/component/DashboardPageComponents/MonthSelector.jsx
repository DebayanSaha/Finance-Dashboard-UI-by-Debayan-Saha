import { useState, useEffect, useRef } from "react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_FULL = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const MonthSelector = ({ selectedMonth, selectedYear, onMonthChange }) => {
  const [isOpen,  setIsOpen]  = useState(false);
  const [navYear, setNavYear] = useState(selectedYear);
  const popupRef = useRef(null);

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
        className="w-12 h-12 rounded-full border border-[#fbd69e]
          flex items-center justify-center cursor-pointer
          max-sm:w-10 max-sm:h-10"
        onClick={handleIconClick}
      >
        <i className="ri-calendar-2-line text-2xl text-[#ff7332] max-sm:text-xl" />
      </div>

      {/* Popup — repositions on mobile to stay within viewport */}
      {isOpen && (
        <div
          className="absolute top-14 left-0 z-50 bg-white rounded-xl
            border border-[#fbd69e] p-4 w-72
            max-sm:w-64 max-sm:p-3
            max-sm:left-0"
          style={{ boxShadow: "0 8px 32px rgba(255,115,50,0.12)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              className="text-[#ff7332] text-xl px-2 py-1 rounded-full
                hover:bg-[#fff3ea] cursor-pointer"
              onClick={() => setNavYear(y => y - 1)}
            >
              ‹
            </button>
            <span className="font-[font2] text-[#8f5b43] text-base">{navYear}</span>
            <button
              className={`text-xl px-2 py-1 rounded-full cursor-pointer
                ${navYear >= currentYear
                  ? "text-gray-300 cursor-not-allowed"
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
                    text-sm font-[font2] rounded-3xl border transition-all cursor-pointer
                    max-sm:text-xs
                    ${isSelected
                      ? "bg-[#ff7332] text-white border-[#ff7332]"
                      : isFuture
                      ? "text-gray-300 border-transparent cursor-not-allowed"
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
          <p className="text-center text-xs text-[#c4a08a] mt-4 max-sm:text-[11px]">
            {MONTHS_FULL[selectedMonth]} {selectedYear}
          </p>
        </div>
      )}
    </div>
  );
};

export default MonthSelector;
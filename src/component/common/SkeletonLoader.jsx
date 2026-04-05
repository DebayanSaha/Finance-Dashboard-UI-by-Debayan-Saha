import { useTheme } from "../../context/Themecontext";

// Reusable skeleton pulse block — matches any shape via className
export const SkeletonBlock = ({ className = "" }) => {
  const { isDark } = useTheme();
  return (
    <div
      className={`rounded-xl animate-pulse ${className} ${
        isDark ? "bg-gray-700/60" : "bg-gray-200"
      }`}
    />
  );
};

// ── Dashboard skeleton ────────────────────────────────────────────────────────
export const DashboardSkeleton = () => {
  const { isDark } = useTheme();
  return (
    <div className={`flex h-screen p-1 transition-colors duration-300 ${isDark ? "bg-gray-950" : "bg-white"}`}>
      <div className="flex-1 p-6 mt-20">
        <SkeletonBlock className="w-72 h-18 rounded-xl mb-8" />
        <div className="flex gap-2 mb-6">
          <SkeletonBlock className="w-12 h-12 rounded-full" />
          <SkeletonBlock className="w-40 h-12 rounded-full" />
        </div>
        <div className="grid grid-cols-4 gap-6 mb-8">
          {Array(4).fill(0).map((_, i) => (
            <SkeletonBlock key={i} className="h-36 rounded-3xl" />
          ))}
        </div>
        <div className="flex gap-2">
          <SkeletonBlock className="w-[70%] h-80 rounded-3xl" />
          <SkeletonBlock className="w-[30%] h-80 rounded-3xl" />
        </div>
      </div>
    </div>
  );
};

// ── Transactions skeleton ─────────────────────────────────────────────────────
export const TransactionsSkeleton = () => {
  const { isDark } = useTheme();
  return (
    <div className={`flex h-screen p-1 transition-colors duration-300 ${isDark ? "bg-gray-950" : "bg-white"}`}>
      <div className="flex-1 p-6 mt-20">
        <SkeletonBlock className="w-96 h-18 rounded-xl mb-8" />
        <div className="flex gap-3 mb-3">
          {Array(5).fill(0).map((_, i) => (
            <SkeletonBlock key={i} className="flex-1 h-4 rounded-md" />
          ))}
        </div>
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="flex gap-3 mb-3">
            {Array(5).fill(0).map((_, j) => (
              <SkeletonBlock
                key={j}
                className="flex-1 h-10 rounded-xl"
                style={{ opacity: 1 - i * 0.08 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Insights skeleton ─────────────────────────────────────────────────────────
export const InsightsSkeleton = () => {
  const { isDark } = useTheme();
  return (
    <div className={`flex mt-20 overflow-hidden transition-colors duration-300 ${isDark ? "bg-gray-950" : "bg-white"}`}>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 px-6 py-5 flex flex-col gap-4">
          <div className="flex items-end justify-between">
            <SkeletonBlock className="w-72 h-24 rounded-xl" />
            <SkeletonBlock className="w-32 h-4 rounded-full" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {Array(5).fill(0).map((_, i) => (
              <SkeletonBlock key={i} className="w-48 h-7 rounded-full" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid grid-cols-2 gap-3">
              {Array(4).fill(0).map((_, i) => (
                <SkeletonBlock key={i} className="h-40 rounded-3xl" />
              ))}
            </div>
            <SkeletonBlock className="h-80 rounded-2xl" />
          </div>
          <div className="grid grid-cols-[1fr_300px] gap-3 pb-5">
            <SkeletonBlock className="h-64 rounded-2xl" />
            <SkeletonBlock className="h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
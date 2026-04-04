// Reusable skeleton pulse block — matches any shape via className
export const SkeletonBlock = ({ className = "" }) => (
  <div
    className={`bg-gray-200 rounded-xl animate-pulse ${className}`}
  />
);

// ── Dashboard skeleton ────────────────────────────────────────────────────────
export const DashboardSkeleton = () => (
  <div className="flex bg-white h-screen p-1">
    <div className="flex-1 p-6 mt-20">

      {/* Heading block */}
      <SkeletonBlock className="w-72 h-18 rounded-xl mb-8" />

      {/* Month selector row */}
      <div className="flex gap-2 mb-6">
        <SkeletonBlock className="w-12 h-12 rounded-full" />
        <SkeletonBlock className="w-40 h-12 rounded-full" />
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {Array(4).fill(0).map((_, i) => (
          <SkeletonBlock key={i} className="h-36 rounded-3xl" />
        ))}
      </div>

      {/* Charts row */}
      <div className="flex gap-2">
        <SkeletonBlock className="w-[70%] h-80 rounded-3xl" />
        <SkeletonBlock className="w-[30%] h-80 rounded-3xl" />
      </div>
    </div>
  </div>
);

// ── Transactions skeleton ─────────────────────────────────────────────────────
export const TransactionsSkeleton = () => (
  <div className="flex bg-white h-screen p-1">
    <div className="flex-1 p-6 mt-20">

      {/* Heading */}
      <SkeletonBlock className="w-96 h-18 rounded-xl mb-8" />

      {/* Table header */}
      <div className="flex gap-3 mb-3">
        {Array(5).fill(0).map((_, i) => (
          <SkeletonBlock key={i} className="flex-1 h-4 rounded-md" />
        ))}
      </div>

      {/* Table rows */}
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

// ── Insights skeleton ─────────────────────────────────────────────────────────
export const InsightsSkeleton = () => (
  <div className="flex bg-white mt-20 overflow-hidden">
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 px-6 py-5 flex flex-col gap-4">

        {/* Heading row */}
        <div className="flex items-end justify-between">
          <SkeletonBlock className="w-72 h-24 rounded-xl" />
          <SkeletonBlock className="w-32 h-4 rounded-full" />
        </div>

        {/* Insight pills row */}
        <div className="flex gap-2 flex-wrap">
          {Array(5).fill(0).map((_, i) => (
            <SkeletonBlock key={i} className="w-48 h-7 rounded-full" />
          ))}
        </div>

        {/* 2-col top row: 4 metric cards + transaction card */}
        <div className="grid grid-cols-2 gap-3">
          {/* InsightCards 2×2 */}
          <div className="grid grid-cols-2 gap-3">
            {Array(4).fill(0).map((_, i) => (
              <SkeletonBlock key={i} className="h-40 rounded-3xl" />
            ))}
          </div>
          {/* TransactionCard */}
          <SkeletonBlock className="h-80 rounded-2xl" />
        </div>

        {/* Bottom row: Revenue + Country */}
        <div className="grid grid-cols-[1fr_300px] gap-3 pb-5">
          <SkeletonBlock className="h-64 rounded-2xl" />
          <SkeletonBlock className="h-64 rounded-2xl" />
        </div>

      </div>
    </div>
  </div>
);
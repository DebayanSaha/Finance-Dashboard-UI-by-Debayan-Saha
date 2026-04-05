import TransactionsTable from "../component/TransactionPageComponents/TransactionsTable";
import useLoading from "../hooks/useLoading";
import { TransactionsSkeleton } from "../component/common/SkeletonLoader";
import { useTheme } from "../context/Themecontext";

const Transactions = () => {
  const loading = useLoading(1200);
  const { isDark } = useTheme();

  if (loading) return <TransactionsSkeleton />;

  return (
    <div className={`flex min-h-screen max-md:h-auto p-1 transition-colors duration-300
      ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="flex-1 p-6 pt-2 max-md:p-3 max-sm:p-2">

        {/* Page heading */}
        <div className={`w-108 max-md:w-full mt-2 h-18 p-6
          flex items-center justify-center rounded-xl transition-colors duration-300
          ${isDark ? "bg-amber-900/20" : "bg-[#fbd69e53]"}`}>
          <h1 className="font-[font2] text-7xl max-md:text-5xl max-sm:text-4xl text-orange-400">
            Transactions.
          </h1>
        </div>

        <TransactionsTable />
      </div>
    </div>
  );
};

export default Transactions;
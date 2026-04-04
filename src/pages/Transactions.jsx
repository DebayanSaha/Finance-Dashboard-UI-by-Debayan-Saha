import TransactionsTable from "../component/TransactionPageComponents/TransactionsTable";
import useLoading from "../hooks/useLoading";
import { TransactionsSkeleton } from "../component/common/SkeletonLoader";

const Transactions = () => {
  const loading = useLoading(1200);
  if (loading) return <TransactionsSkeleton />;

  return (
    // min-h-screen (not h-screen) so content is never clipped on mobile.
    // Padding reduced on small screens; mt-20 preserved for topbar clearance.
    <div className="flex bg-white min-h-screen max-md:h-auto p-1">
      <div className="flex-1 p-6 mt-20 max-md:p-3 max-sm:p-2">

        {/* Page heading
            Desktop : fixed wide banner with large text    (unchanged)
            Mobile  : full-width, proportionally smaller text              */}
        <div className="w-108 max-md:w-full mt-2 h-18 bg-[#fbd69e53] p-6
          flex items-center justify-center rounded-xl">
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
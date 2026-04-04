import TransactionsTable from "../component/TransactionPageComponents/TransactionsTable";
import useLoading from "../hooks/useLoading";                             // ← ADD
import { TransactionsSkeleton } from "../component/common/SkeletonLoader"; // ← ADD

const Transactions = () => {
  const loading = useLoading(1200); // ← ADD

  if (loading) return <TransactionsSkeleton />; // ← ADD

  return (
    <div className="flex bg-white h-screen p-1">
      <div className="flex-1 p-6 mt-20">
        <div className="w-108 mt-2 h-18 bg-[#fbd69e53] p-6 flex items-center justify-center rounded-xl">
          <h1 className="font-[font2] text-7xl text-orange-400">Transactions.</h1>
        </div>
        <TransactionsTable />
      </div>
    </div>
  );
};

export default Transactions;
export const formatCurrency = (amount, options = { type: "kpi" }) => {
  if (amount == null) return "₹0";
  
  const num = Number(amount);
  if (isNaN(num)) return "₹0";

  if (options.type === "kpi") {
    // KPI/Dashboard: No decimals, fully rounded integer
    return `₹${Math.round(num).toLocaleString("en-IN")}`;
  }

  // Transactions: Preserve decimals if they exist, up to 2 places. No forced .00
  return `₹${num.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

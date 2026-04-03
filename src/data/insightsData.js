export const insightsData = {
  highestSpending: {
    category: "Food",
    amount: 6900,
    percentage: 28,
  },

  monthlyComparison: {
    current: { month: "Mar", amount: 13498 },
    previous: { month: "Feb", amount: 11200 },
    changePercent: 20.5,
  },

  topCategories: [
    { name: "Food",          amount: 6900, percent: 28 },
    { name: "Utilities",     amount: 4598, percent: 19 },
    { name: "Education",     amount: 4350, percent: 18 },
    { name: "Entertainment", amount: 649,  percent: 3  },
    { name: "Health",        amount: 1200, percent: 5  },
  ],

  observation: {
    text: "You spent 20.5% more this month compared to February. Food & Utilities together account for nearly half your expenses.",
    tip: "Consider setting a monthly cap on dining out.",
  },

  savingsRate: {
    income: 130400,
    expenses: 13498,
    rate: 89.6,
  },
};
import fs from "fs";

const categories = {
  Salary: ["Salary Credit", "Bonus Credit"],
  Freelance: ["Freelance Payment", "Consulting Fee", "Project Payment"],
  Food: ["Swiggy Order", "Zomato Dinner", "Restaurant Bill", "Groceries"],
  Utilities: [
    "Electricity Bill",
    "Water Bill",
    "Internet Bill",
    "Phone Recharge",
  ],
  Transport: ["Uber Ride", "Fuel Refill", "Taxi Ride"],
  Entertainment: ["Netflix", "Spotify", "Movie Tickets"],
  Investment: ["Stock Dividend", "Crypto Profit", "Mutual Fund SIP"],
  Health: ["Gym Membership", "Pharmacy Bill", "Doctor Visit"],
  Shopping: ["Amazon Purchase", "Clothing Purchase"],
  Education: ["Course Purchase", "Book Purchase"],
  Finance: ["Loan EMI", "Credit Card Payment"],
  Rent: ["Rental Income"],
};

const typeMap = {
  Salary: "Income",
  Freelance: "Income",
  Investment: "Income",
  Rent: "Income",
  Food: "Expense",
  Utilities: "Expense",
  Transport: "Expense",
  Entertainment: "Expense",
  Health: "Expense",
  Shopping: "Expense",
  Education: "Expense",
  Finance: "Expense",
};

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateAmount(category, type) {
  const ranges = {
    Salary: [70000, 100000],
    Freelance: [5000, 30000],
    Investment: [2000, 15000],
    Rent: [15000, 30000],
    Food: [200, 5000],
    Utilities: [300, 4000],
    Transport: [100, 3000],
    Entertainment: [100, 2000],
    Health: [200, 3000],
    Shopping: [500, 8000],
    Education: [500, 6000],
    Finance: [2000, 10000],
  };

  const [min, max] = ranges[category];
  return Math.floor(Math.random() * (max - min) + min);
}

function generateSpark(amount) {
  const base = Math.floor(amount / 1000);
  return Array.from({ length: 7 }, () =>
    Math.max(1, base + Math.floor(Math.random() * 10 - 5)),
  );
}

function generateTransactions(count = 100) {
  const data = [];
  const startDate = new Date("2024-01-01");

  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    const category = randomFrom(Object.keys(categories));
    const title = randomFrom(categories[category]);
    const type = typeMap[category];
    const amount = generateAmount(category, type);

    data.push({
      id: i + 1,
      transactionId: `TXN-2024-${String(i + 1).padStart(4, "0")}`,
      date: date.toISOString().split("T")[0],
      title,
      category,
      type,
      amount,
      spark: generateSpark(amount),
    });
  }

  return data.reverse(); // latest first (like real apps)
}

// Usage
const transactionsData = generateTransactions(200);

// If you want JSON output:
console.log(JSON.stringify(transactionsData, null, 2));



const data = generateTransactions(500); //  how much data you want

fs.writeFileSync("./src/data/transactionsData.json", JSON.stringify(data, null, 2));

console.log("✅ transactions.json generated!");

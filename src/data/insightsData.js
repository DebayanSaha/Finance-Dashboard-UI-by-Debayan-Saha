export const revenueData = {
  labels: ["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov"],
  values: [12,18,15,22,28,24,32,38,30,42,36,28,44,40,35,48,52,46,38,42,50,44,36,32,38,44,40,36],
  highlight: [10, 16],
  current: 4256,
  trend: 44,
};

export const countryData = [
  { name: "United States", value: 4250.32, flag: "🇺🇸", color: "#3b82f6", pct: 80 },
  { name: "Canada",        value: 3950.42, flag: "🇨🇦", color: "#f97316", pct: 74 },
  { name: "France",        value: 2832.05, flag: "🇫🇷", color: "#6366f1", pct: 53 },
  { name: "Denmark",       value: 2225.25, flag: "🇩🇰", color: "#10b981", pct: 42 },
];

export const transactionData = {
  total: 19700,
  trend: 44.81,
  thisWeek: { label: "$8.5k", values: [6.2,7.8,5.4,8.5,7.2,6.8,8.5] },
  forecast:  { label: "81.93%", values: [70,75,68,82,78,71,81] },
  categories: [
    { label: "Salary",    value: 35, color: "#10b981" },
    { label: "Freelance", value: 22, color: "#3b82f6" },
    { label: "Travel",    value: 28, color: "#6366f1" },
    { label: "Food",      value: 26, color: "#f97316" },
    { label: "Other",     value: 18, color: "#f59e0b" },
  ],
};

export const registrations = [
  { id:1, name:"Maria Joyce",   time:"Today, 12:00 AM", email:"mariajoyce@mail.com",   status:"Approved", initials:"MJ", bg:"#fde68a", fg:"#92400e" },
  { id:2, name:"Koen Chegg",    time:"Today, 01:00 AM", email:"koenchegg@mail.com",    status:"Pending",  initials:"KC", bg:"#dbeafe", fg:"#1e40af" },
  { id:3, name:"Richard Joseph",time:"Today, 02:00 AM", email:"richardjoseph@mail.com",status:"Declined", initials:"RJ", bg:"#fce7f3", fg:"#9d174d" },
  { id:4, name:"Sara Lin",      time:"Today, 03:00 AM", email:"saralin@mail.com",      status:"Approved", initials:"SL", bg:"#d1fae5", fg:"#065f46" },
];

export const activeCustomer = {
  current: 4056,
  target: 5280,
  weekLabel: "Week of Nov 10 vs Forecast",
  trend: [3200,3600,3900,3700,4056,4200,4100],
};

export const regSparkline = [15000,16200,14800,18000,20000,19000,22000,21500,23000,22500,24050,23000,24050,24050];

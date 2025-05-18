// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import { ChartSkeleton } from "./overview-chart/chart-skeleton";
// import { ChartError } from "./overview-chart/chart-error";
// import { ChartTooltip } from "./overview-chart/chart-tooltips";
// import { TimeframeDropdown } from "./overview-chart/timeframe-dropdown";
// import { formatCurrency } from "@/lib/utils";
// import { useTransactions } from "@/context/transaction-context";

// export type TimeframeOption = "daily" | "weekly" | "monthly" | "yearly";

// export interface ChartDataPoint {
//   date: string;
//   value: number;
//   rawDate?: Date;
// }

// interface TransactionsByDate {
//   [date: string]: number;
// }

// interface OverviewChartProps {
//   title?: string;
//   height?: number;
//   yAxisWidth?: number;
//   showTooltip?: boolean;
//   showGrid?: boolean;
//   areaColor?: string;
//   strokeColor?: string;
// }

// export function OverviewChart({
//   title = "Transaction Overview",
//   height = 240,
//   yAxisWidth = 60,
//   showTooltip = true,
//   showGrid = true,
//   areaColor = "#3b82f6",
//   strokeColor = "#3b82f6",
// }: OverviewChartProps) {
//   const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>("weekly");
//   const { transactions, loading, error } = useTransactions();
//   const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
//   const [totalValue, setTotalValue] = useState<number>(0);

//   // Helper date functions
//   const addDays = (date: Date, days: number): Date => {
//     const result = new Date(date);
//     result.setDate(result.getDate() + days);
//     return result;
//   };

//   const addMonths = (date: Date, months: number): Date => {
//     const result = new Date(date);
//     result.setMonth(result.getMonth() + months);
//     return result;
//   };

//   const subDays = (date: Date, days: number): Date => addDays(date, -days);
//   const subWeeks = (date: Date, weeks: number): Date => addDays(date, -weeks * 7);
//   const subMonths = (date: Date, months: number): Date => addMonths(date, -months);

//   const formatDate = (date: Date, format: string): string => {
//     const day = date.getDate().toString().padStart(2, "0");
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const year = date.getFullYear();
//     const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
//       date.getMonth()
//     ];
//     const weekNum = getWeekNumber(date);

//     return format
//       .replace("dd", day)
//       .replace("MM", month)
//       .replace("yyyy", year.toString())
//       .replace("MMM", monthName)
//       .replace("'Week' w", `Week ${weekNum}`);
//   };

//   const getWeekNumber = (date: Date): number => {
//     const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
//     const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
//     return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
//   };

//   // Process transaction data based on selected timeframe
//   useEffect(() => {
//     if (loading || error || !transactions.length) {
//       setChartData([]);
//       setTotalValue(0);
//       return;
//     }

//     const now = new Date();
//     let startDate: Date;
//     // let dateFormat: string;
//     // let groupingFormat: string;

//     // Set date range and format based on timeframe
//     switch (selectedTimeframe) {
//       case "daily":
//         startDate = subDays(now, 7); // Last 7 days
//         // dateFormat = "dd MMM";
//         // groupingFormat = "yyyy-MM-dd";
//         break;
//       case "weekly":
//         startDate = subWeeks(now, 4); // Last 4 weeks
//         // dateFormat = "'Week' w, MMM";
//         // groupingFormat = "yyyy-'W'w";
//         break;
//       case "monthly":
//         startDate = subMonths(now, 6); // Last 6 months
//         // dateFormat = "MMM yyyy";
//         // groupingFormat = "yyyy-MM";
//         break;
//       case "yearly":
//         startDate = subMonths(now, 12); // Last 12 months
//         // dateFormat = "MMM yyyy";
//         // groupingFormat = "yyyy-MM";
//         break;
//       default:
//         startDate = subDays(now, 7);
//     }

//     // Filter transactions by date range and status
//     const filteredTransactions = transactions.filter((tx) => {
//       const [day, month, year] = tx.date.split("/").map(Number);
//       const txDate = new Date(year, month - 1, day);
//       return txDate >= startDate && txDate <= now && tx.status === "completed";
//     });

//     // Group transactions by date and sum amounts
//     const transactionsByDate: TransactionsByDate = {};

//     filteredTransactions.forEach((tx) => {
//       const [day, month, year] = tx.date.split("/").map(Number);
//       const txDate = new Date(year, month - 1, day);

//       let groupKey: string;
//       switch (selectedTimeframe) {
//         case "daily":
//           groupKey = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
//           break;
//         case "weekly":
//           groupKey = `${year}-W${getWeekNumber(txDate)}`;
//           break;
//         case "monthly":
//         case "yearly":
//           groupKey = `${year}-${month.toString().padStart(2, "0")}`;
//           break;
//         default:
//           groupKey = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
//       }

//       if (!transactionsByDate[groupKey]) {
//         transactionsByDate[groupKey] = 0;
//       }
//       transactionsByDate[groupKey] += tx.amountInNaira;
//     });

//     // Generate date series for chart
//     const datePoints: ChartDataPoint[] = [];
//     let currentDate = new Date(startDate);

//     while (currentDate <= now) {
//       let groupKey: string;
//       let displayDate: string;

//       switch (selectedTimeframe) {
//         case "daily":
//           groupKey = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${currentDate
//             .getDate()
//             .toString()
//             .padStart(2, "0")}`;
//           displayDate = formatDate(currentDate, "dd MMM");
//           break;
//         case "weekly":
//           groupKey = `${currentDate.getFullYear()}-W${getWeekNumber(currentDate)}`;
//           displayDate = formatDate(currentDate, "'Week' w, MMM");
//           break;
//         case "monthly":
//         case "yearly":
//           groupKey = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}`;
//           displayDate = formatDate(currentDate, "MMM yyyy");
//           break;
//         default:
//           groupKey = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${currentDate
//             .getDate()
//             .toString()
//             .padStart(2, "0")}`;
//           displayDate = formatDate(currentDate, "dd MMM");
//       }

//       datePoints.push({
//         date: displayDate,
//         value: transactionsByDate[groupKey] || 0,
//         rawDate: new Date(currentDate),
//       });

//       // Increment date based on timeframe
//       switch (selectedTimeframe) {
//         case "daily":
//           currentDate = addDays(currentDate, 1);
//           break;
//         case "weekly":
//           currentDate = addDays(currentDate, 7);
//           break;
//         case "monthly":
//         case "yearly":
//           currentDate = addMonths(currentDate, 1);
//           break;
//       }
//     }

//     // Calculate total value
//     const total = filteredTransactions.reduce((acc, tx) => acc + tx.amountInNaira, 0);
//     setTotalValue(total);
//     setChartData(datePoints);
//   }, [transactions, selectedTimeframe, loading, error]);

//   // Format the domain for the Y axis
//   const getYAxisDomain = () => {
//     if (!chartData.length) return [0, 100];

//     const values = chartData.map((item) => item.value);
//     const min = Math.min(...values);
//     const max = Math.max(...values);

//     // Add some padding to the min and max values
//     const padding = (max - min) * 0.2;
//     return [Math.max(0, min - padding), max + padding];
//   };

//   const handleTimeframeChange = (newTimeframe: TimeframeOption) => {
//     setSelectedTimeframe(newTimeframe);
//   };

//   const chartTitle = useMemo(() => {
//     const timeframeMap = {
//       daily: "Daily Transactions",
//       weekly: "Weekly Transactions",
//       monthly: "Monthly Transactions",
//       yearly: "Yearly Transactions",
//     };
//     return timeframeMap[selectedTimeframe] || title;
//   }, [selectedTimeframe, title]);

//   return (
//     <Card className="border-slate-800 bg-slate-900/50 overflow-hidden">
//       <CardHeader className="flex flex-row items-center justify-between pb-2">
//         <div>
//           <CardTitle className="text-lg font-medium text-white">{chartTitle}</CardTitle>
//           <p className="text-sm text-slate-400 mt-1">
//             Total: {formatCurrency(totalValue)} NGN
//           </p>
//         </div>
//         <TimeframeDropdown value={selectedTimeframe} onChange={handleTimeframeChange} />
//       </CardHeader>
//       <CardContent className="p-0 pt-2">
//         {error ? (
//           <ChartError message={error} />
//         ) : loading ? (
//           <ChartSkeleton height={height} />
//         ) : chartData.length > 0 ? (
//           <div className={`h-[${height}px] w-full px-2`}>
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
//                 {showGrid && (
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" strokeOpacity={0.4} />
//                 )}
//                 <XAxis
//                   dataKey="date"
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fill: "#64748b", fontSize: 12 }}
//                   dy={10}
//                 />
//                 <YAxis
//                   width={yAxisWidth}
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fill: "#64748b", fontSize: 12 }}
//                   tickFormatter={(value) => formatCurrency(value)}
//                   domain={getYAxisDomain()}
//                 />
//                 {showTooltip && (
//                   <Tooltip
//                     content={<ChartTooltip />}
//                     cursor={{ stroke: "#475569", strokeWidth: 1, strokeDasharray: "3 3" }}
//                   />
//                 )}
//                 <defs>
//                   <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor={areaColor} stopOpacity={0.3} />
//                     <stop offset="95%" stopColor={areaColor} stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <Area
//                   type="monotone"
//                   dataKey="value"
//                   stroke={strokeColor}
//                   strokeWidth={2}
//                   fill="url(#colorValue)"
//                   dot={{
//                     r: 4,
//                     fill: "#0f172a",
//                     stroke: strokeColor,
//                     strokeWidth: 2,
//                   }}
//                   activeDot={{
//                     r: 6,
//                     fill: "#0f172a",
//                     stroke: strokeColor,
//                     strokeWidth: 2,
//                   }}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         ) : (
//           <div className={`h-[${height}px] w-full flex items-center justify-center`}>
//             <p className="text-slate-400">No transaction data available</p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartSkeleton } from "./overview-chart/chart-skeleton";
import { ChartError } from "./overview-chart/chart-error";
import { ChartTooltip } from "./overview-chart/chart-tooltips";
import { TimeframeDropdown } from "./overview-chart/timeframe-dropdown";
import { formatCurrency } from "@/lib/utils";
import { useTransactions } from "@/context/transaction-context";

export type TimeframeOption = "daily" | "weekly" | "monthly" | "yearly";

export interface ChartDataPoint {
  date: string;
  value: number;
  rawDate?: Date;
}

interface TransactionsByDate {
  [date: string]: number;
}

interface OverviewChartProps {
  title?: string;
  height?: number;
  yAxisWidth?: number;
  showTooltip?: boolean;
  showGrid?: boolean;
  areaColor?: string;
  strokeColor?: string;
}

// Helper date functions - moved outside the component
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

const subDays = (date: Date, days: number): Date => addDays(date, -days);
const subWeeks = (date: Date, weeks: number): Date => addDays(date, -weeks * 7);
const subMonths = (date: Date, months: number): Date => addMonths(date, -months);

const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const formatDate = (date: Date, format: string): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
    date.getMonth()
  ];
  const weekNum = getWeekNumber(date);

  return format
    .replace("dd", day)
    .replace("MM", month)
    .replace("yyyy", year.toString())
    .replace("MMM", monthName)
    .replace("'Week' w", `Week ${weekNum}`);
};

export function OverviewChart({
  title = "Transaction Overview",
  height = 240,
  yAxisWidth = 60,
  showTooltip = true,
  showGrid = true,
  areaColor = "#3b82f6",
  strokeColor = "#3b82f6",
}: OverviewChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>("weekly");
  const { transactions, loading, error } = useTransactions();
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);

  // Process transaction data based on selected timeframe
  useEffect(() => {
    if (loading || error || !transactions.length) {
      setChartData([]);
      setTotalValue(0);
      return;
    }

    const now = new Date();
    let startDate: Date;
    // let dateFormat: string;
    // let groupingFormat: string;

    // Set date range and format based on timeframe
    switch (selectedTimeframe) {
      case "daily":
        startDate = subDays(now, 7); // Last 7 days
        // dateFormat = "dd MMM";
        // groupingFormat = "yyyy-MM-dd";
        break;
      case "weekly":
        startDate = subWeeks(now, 4); // Last 4 weeks
        // dateFormat = "'Week' w, MMM";
        // groupingFormat = "yyyy-'W'w";
        break;
      case "monthly":
        startDate = subMonths(now, 6); // Last 6 months
        // dateFormat = "MMM yyyy";
        // groupingFormat = "yyyy-MM";
        break;
      case "yearly":
        startDate = subMonths(now, 12); // Last 12 months
        // dateFormat = "MMM yyyy";
        // groupingFormat = "yyyy-MM";
        break;
      default:
        startDate = subDays(now, 7);
    }

    // Filter transactions by date range and status
    const filteredTransactions = transactions.filter((tx) => {
      const [day, month, year] = tx.date.split("/").map(Number);
      const txDate = new Date(year, month - 1, day);
      return txDate >= startDate && txDate <= now && tx.status === "completed";
    });

    // Group transactions by date and sum amounts
    const transactionsByDate: TransactionsByDate = {};

    filteredTransactions.forEach((tx) => {
      const [day, month, year] = tx.date.split("/").map(Number);
      const txDate = new Date(year, month - 1, day);

      let groupKey: string;
      switch (selectedTimeframe) {
        case "daily":
          groupKey = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
          break;
        case "weekly":
          groupKey = `${year}-W${getWeekNumber(txDate)}`;
          break;
        case "monthly":
        case "yearly":
          groupKey = `${year}-${month.toString().padStart(2, "0")}`;
          break;
        default:
          groupKey = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      }

      if (!transactionsByDate[groupKey]) {
        transactionsByDate[groupKey] = 0;
      }
      transactionsByDate[groupKey] += tx.amountInNaira;
    });

    // Generate date series for chart
    const datePoints: ChartDataPoint[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= now) {
      let groupKey: string;
      let displayDate: string;

      switch (selectedTimeframe) {
        case "daily":
          groupKey = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${currentDate
            .getDate()
            .toString()
            .padStart(2, "0")}`;
          displayDate = formatDate(currentDate, "dd MMM");
          break;
        case "weekly":
          groupKey = `${currentDate.getFullYear()}-W${getWeekNumber(currentDate)}`;
          displayDate = formatDate(currentDate, "'Week' w, MMM");
          break;
        case "monthly":
        case "yearly":
          groupKey = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}`;
          displayDate = formatDate(currentDate, "MMM yyyy");
          break;
        default:
          groupKey = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${currentDate
            .getDate()
            .toString()
            .padStart(2, "0")}`;
          displayDate = formatDate(currentDate, "dd MMM");
      }

      datePoints.push({
        date: displayDate,
        value: transactionsByDate[groupKey] || 0,
        rawDate: new Date(currentDate),
      });

      // Increment date based on timeframe
      switch (selectedTimeframe) {
        case "daily":
          currentDate = addDays(currentDate, 1);
          break;
        case "weekly":
          currentDate = addDays(currentDate, 7);
          break;
        case "monthly":
        case "yearly":
          currentDate = addMonths(currentDate, 1);
          break;
      }
    }

    // Calculate total value
    const total = filteredTransactions.reduce((acc, tx) => acc + tx.amountInNaira, 0);
    setTotalValue(total);
    setChartData(datePoints);
  }, [transactions, selectedTimeframe, loading, error]);

  // Format the domain for the Y axis
  const getYAxisDomain = () => {
    if (!chartData.length) return [0, 100];

    const values = chartData.map((item) => item.value);
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Add some padding to the min and max values
    const padding = (max - min) * 0.2;
    return [Math.max(0, min - padding), max + padding];
  };

  const handleTimeframeChange = (newTimeframe: TimeframeOption) => {
    setSelectedTimeframe(newTimeframe);
  };

  const chartTitle = useMemo(() => {
    const timeframeMap = {
      daily: "Daily Transactions",
      weekly: "Weekly Transactions",
      monthly: "Monthly Transactions",
      yearly: "Yearly Transactions",
    };
    return timeframeMap[selectedTimeframe] || title;
  }, [selectedTimeframe, title]);

  return (
    <Card className="border-slate-800 bg-slate-900/50 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium text-white">{chartTitle}</CardTitle>
          <p className="text-sm text-slate-400 mt-1">
            Total: {formatCurrency(totalValue)} NGN
          </p>
        </div>
        <TimeframeDropdown value={selectedTimeframe} onChange={handleTimeframeChange} />
      </CardHeader>
      <CardContent className="p-0 pt-2">
        {error ? (
          <ChartError message={error} />
        ) : loading ? (
          <ChartSkeleton height={height} />
        ) : chartData.length > 0 ? (
          <div className={`h-[${height}px] w-full px-2`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                {showGrid && (
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" strokeOpacity={0.4} />
                )}
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  width={yAxisWidth}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(value)}
                  domain={getYAxisDomain()}
                />
                {showTooltip && (
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ stroke: "#475569", strokeWidth: 1, strokeDasharray: "3 3" }}
                  />
                )}
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={areaColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={areaColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={strokeColor}
                  strokeWidth={2}
                  fill="url(#colorValue)"
                  dot={{
                    r: 4,
                    fill: "#0f172a",
                    stroke: strokeColor,
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#0f172a",
                    stroke: strokeColor,
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className={`h-[${height}px] w-full flex items-center justify-center`}>
            <p className="text-slate-400">No transaction data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
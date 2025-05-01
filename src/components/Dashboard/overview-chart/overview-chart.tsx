"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTransactions } from "@/context/transaction-context";
import { Transaction } from "@/types/transaction";
import { TimeframeDropdown } from "./timeframe-dropdown";
import { ChartError } from "./chart-error";
import { ChartSkeleton } from "./chart-skeleton";
import { ChartTooltip } from "./chart-tooltips";

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

export function OverviewChart({
  title = "Transaction Overview",
  height = 240,
  yAxisWidth = 60,
  showTooltip = true,
  showGrid = true,
  areaColor = "#22c55e", // Green color
  strokeColor = "#22c55e", // Green color
}: OverviewChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>("daily"); // Default to daily
  const { transactions, loading, error } = useTransactions();
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);

  // Custom formatter for Naira with shortened format
  const formatNaira = (value: number): string => {
    if (value >= 1000) {
      const kValue = value / 1000;
      return `₦${kValue % 1 === 0 ? kValue : kValue.toFixed(1)}k`;
    } else if (value >= 100) {
      const hValue = value / 100;
      return `₦${hValue % 1 === 0 ? hValue : hValue.toFixed(1)}h`;
    } else {
      return `₦${value}`;
    }
  };

  // Helper date functions
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

  const formatDate = (date: Date, format: string): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
      date.getMonth()
    ];
    const weekNum = getWeekNumber(date);

    // Process replacements in order to avoid conflicts (MMM before MM)
    return format
      .replace("MMM", monthName) // Month name (e.g., "Apr")
      .replace("dd", day) // Day (e.g., "24")
      .replace("MM", month) // Month number (e.g., "04")
      .replace("yyyy", year.toString()) // Full year (e.g., "2025")
      .replace("'W'w", `W${weekNum}`) // Week number (e.g., "W18")
      .replace("yy", year.toString().slice(-2)); // Short year (e.g., "25")
  };

  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Process transaction data based on selected timeframe
  useEffect(() => {
    if (loading || error || !transactions) {
      setChartData([]);
      setTotalValue(0);
      return;
    }

    const now = new Date();
    let startDate: Date;
    let dateFormat: string;
    let groupingFormat: string;
    let endDate: Date;

    // Set date range and format based on timeframe
    switch (selectedTimeframe) {
      case "daily":
        startDate = subDays(now, 7); // Last 7 days, inclusive of today
        endDate = now; // Always include up to today
        dateFormat = "dd MMM"; // e.g., "24 Apr"
        groupingFormat = "yyyy-MM-dd";
        break;
      case "weekly":
        startDate = subWeeks(now, 4); // Last 4 weeks
        endDate = now;
        dateFormat = "'W'w yyyy"; // e.g., "W18 2025"
        groupingFormat = "yyyy-'W'w";
        break;
      case "monthly":
        startDate = subMonths(now, 6); // Last 6 months
        endDate = now;
        dateFormat = "MMM yyyy"; // e.g., "Apr 2025"
        groupingFormat = "yyyy-MM";
        break;
      case "yearly":
        startDate = subMonths(now, 12); // Last 12 months
        endDate = now;
        dateFormat = "MMM yyyy"; // e.g., "Apr 2025"
        groupingFormat = "yyyy-MM";
        break;
      default:
        startDate = subDays(now, 7);
        endDate = now;
        dateFormat = "dd MMM";
        groupingFormat = "yyyy-MM-dd";
    }

    // Filter transactions by date range and status
    const filteredTransactions = transactions.filter((tx) => {
      const dateParts = tx.date.split("/");
      if (dateParts.length !== 3) return false; // Validate date format
      const [day, month, year] = dateParts.map(Number);
      if (isNaN(day) || isNaN(month) || isNaN(year)) return false; // Validate numbers
      const txDate = new Date(year, month - 1, day);
      return txDate >= startDate && txDate <= endDate && tx.status === "completed" && !isNaN(txDate.getTime());
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

    while (currentDate <= endDate) {
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
          displayDate = formatDate(currentDate, "'W'w yyyy");
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
    const padding = (max - min) * 0.2 || 100; // Ensure non-zero padding
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
            Total: {formatNaira(totalValue)}
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
                  tickFormatter={formatNaira}
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
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartSkeleton } from "./chart-skeleton"
import { ChartError } from "./chart-error"
import { ChartTooltip } from "./chart-tooltips"
import { TimeframeDropdown } from "./timeframe-dropdown"
import { formatCurrency } from "@/lib/utils"

// Define the data structure for our chart
export interface ChartDataPoint {
  date: string
  value: number
}

export type TimeframeOption = "daily" | "weekly" | "monthly" | "yearly"

interface OverviewChartProps {
  title?: string
  data?: ChartDataPoint[]
  isLoading?: boolean
  error?: Error | null
  timeframe?: TimeframeOption
  onTimeframeChange?: (timeframe: TimeframeOption) => void
  height?: number
  yAxisWidth?: number
  showTooltip?: boolean
  showGrid?: boolean
  areaColor?: string
  strokeColor?: string
}

export function OverviewChart({
  title = "Overview",
  data,
  isLoading = false,
  error = null,
  timeframe = "weekly",
  onTimeframeChange,
  height = 240,
  yAxisWidth = 60,
  showTooltip = true,
  showGrid = true,
  areaColor = "#10b981",
  strokeColor = "#10b981",
}: OverviewChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>(timeframe)

  // If no data is provided, use mock data
  useEffect(() => {
    if (data) {
      setChartData(data)
    } else {
      // Mock data that resembles the chart in the image
      setChartData([
        { date: "3 April", value: 65 },
        { date: "4 April", value: 75 },
        { date: "5 April", value: 55 },
        { date: "6 April", value: 40 },
        { date: "7 April", value: 65 },
        { date: "8 April", value: 70 },
        { date: "9 April", value: 40 },
      ])
    }
  }, [data])

  const handleTimeframeChange = (newTimeframe: TimeframeOption) => {
    setSelectedTimeframe(newTimeframe)
    if (onTimeframeChange) {
      onTimeframeChange(newTimeframe)
    }
  }

  // Format the domain for the Y axis
  const getYAxisDomain = () => {
    if (!chartData.length) return [0, 100]

    const values = chartData.map((item) => item.value)
    const min = Math.min(...values)
    const max = Math.max(...values)

    // Add some padding to the min and max values
    const padding = (max - min) * 0.2
    return [Math.max(0, min - padding), max + padding]
  }

  return (
    <Card className="border-slate-800 bg-slate-900/50 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-white">{title}</CardTitle>
        <TimeframeDropdown value={selectedTimeframe} onChange={handleTimeframeChange} />
      </CardHeader>
      <CardContent className="p-0 pt-2">
        {error ? (
          <ChartError message={error.message} />
        ) : isLoading ? (
          <ChartSkeleton height={height} />
        ) : (
          <div className="h-[240px] w-full px-2">
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
        )}
      </CardContent>
    </Card>
  )
}

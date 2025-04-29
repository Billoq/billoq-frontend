"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useEffect, useRef } from "react"

export function OverviewChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const canvas = canvasRef.current
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Chart data points (approximated from the image)
    const dataPoints = [40, 60, 45, 70, 55, 35, 50, 65, 45]

    // Chart settings
    const padding = 20
    const chartHeight = canvas.height - padding * 2
    const chartWidth = canvas.width - padding * 2
    const pointSpacing = chartWidth / (dataPoints.length - 1)

    // Draw chart
    ctx.strokeStyle = "#10b981" // Teal color
    ctx.lineWidth = 2
    ctx.beginPath()

    dataPoints.forEach((point, index) => {
      const x = padding + index * pointSpacing
      const y = padding + chartHeight - (point / 80) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Draw point
      ctx.fillStyle = "#0f172a" // Background color
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#10b981" // Teal color
      ctx.beginPath()
      ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.stroke()

    // Draw gradient under the line
    const gradient = ctx.createLinearGradient(0, padding, 0, chartHeight + padding)
    gradient.addColorStop(0, "rgba(16, 185, 129, 0.2)")
    gradient.addColorStop(1, "rgba(16, 185, 129, 0)")

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(padding, chartHeight + padding)

    dataPoints.forEach((point, index) => {
      const x = padding + index * pointSpacing
      const y = padding + chartHeight - (point / 80) * chartHeight
      ctx.lineTo(x, y)
    })

    ctx.lineTo(padding + chartWidth, chartHeight + padding)
    ctx.closePath()
    ctx.fill()
  }, [])

  return (
    <Card className="border-slate-800 bg-slate-900/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Overview</CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
        >
          Weekly
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[180px] w-full">
          <canvas ref={canvasRef} className="h-full w-full"></canvas>
          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>3 April</span>
            <span>4 April</span>
            <span>5 April</span>
            <span>6 April</span>
            <span>7 April</span>
            <span>8 April</span>
            <span>9 April</span>
          </div>
          <div className="mt-1 flex flex-col gap-1 text-xs text-slate-500">
            <span>$80.00</span>
            <span>$60.00</span>
            <span>$40.00</span>
            <span>$20.00</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

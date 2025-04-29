import { formatCurrency } from "@/lib/utils"

interface ChartTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null
  }

  return (
    <div className="rounded-md border border-slate-700 bg-slate-800 p-2 shadow-md">
      <p className="text-xs font-medium text-slate-300">{label}</p>
      <p className="text-sm font-bold text-white">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

import { AlertCircle } from "lucide-react"

interface ChartErrorProps {
  message?: string
}

export function ChartError({ message = "Failed to load chart data" }: ChartErrorProps) {
  return (
    <div className="flex h-[240px] flex-col items-center justify-center gap-2 p-4 text-center">
      <AlertCircle className="h-10 w-10 text-red-500" />
      <p className="text-sm font-medium text-white">{message}</p>
      <p className="text-xs text-slate-400">Please try again later</p>
    </div>
  )
}

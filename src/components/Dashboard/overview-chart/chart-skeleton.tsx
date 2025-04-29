import { Skeleton } from "@/components/ui/skeleton"

interface ChartSkeletonProps {
  height?: number
}

export function ChartSkeleton({ height = 240 }: ChartSkeletonProps) {
  return (
    <div className="p-4" style={{ height: `${height}px` }}>
      <div className="flex h-full flex-col justify-between">
        <Skeleton className="h-[1px] w-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-[1px] flex-1" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-[1px] flex-1" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-[1px] flex-1" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-[1px] flex-1" />
        </div>
        <div className="flex justify-between pt-2">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>
    </div>
  )
}

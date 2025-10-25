import type { LucideIcon } from "lucide-react"

interface FeatureBadgeProps {
  icon: LucideIcon
  title: string
  description: string
  iconColor?: string
}

export function FeatureBadge({ icon: Icon, title, description, iconColor = "text-[#1B89A4]" }: FeatureBadgeProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className={`${iconColor} p-1 rounded-full`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-white font-medium">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { TimeframeOption } from "./overview-chart"

interface TimeframeDropdownProps {
  value: TimeframeOption
  onChange: (value: TimeframeOption) => void
}

const timeframeOptions: { value: TimeframeOption; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
]

export function TimeframeDropdown({ value, onChange }: TimeframeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = timeframeOptions.find((option) => option.value === value) || timeframeOptions[1]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
        >
          {selectedOption.label}
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32 bg-slate-800 border-slate-700">
        {timeframeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className={`hover:bg-slate-700 ${value === option.value ? "bg-slate-700 font-medium" : ""}`}
            onClick={() => {
              onChange(option.value)
              setIsOpen(false)
            }}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

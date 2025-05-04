"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"

interface SearchInputProps {
  onSearch?: (query: string) => void
  placeholder?: string
  autoFocus?: boolean
  onBlur?: () => void
}

export function SearchInput({ 
  onSearch, 
  placeholder = "Search for...", 
  autoFocus, 
  onBlur 
}: SearchInputProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={onBlur}
        autoFocus={autoFocus}
        className="h-10 w-full rounded-full bg-slate-800 pl-10 pr-4 text-sm text-white placeholder-slate-400 outline-none ring-slate-700 transition-all focus:ring-1"
      />
    </form>
  )
}
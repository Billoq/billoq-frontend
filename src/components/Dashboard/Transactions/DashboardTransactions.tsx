"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, XCircle, Clock, Calendar } from "lucide-react";
import { LuArrowDownUp } from "react-icons/lu";
import { GiSettingsKnobs } from "react-icons/gi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useTransactions } from "@/context/transaction-context";
import { Transaction } from "@/types/transaction";

type TransactionDisplay = {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: "Successful" | "Failed" | "Pending";
  transactionId: string;
  explorerUrl: string;
};

type SortDirection = "asc" | "desc";
type StatusFilter = "All" | "Successful" | "Failed" | "Pending";
type DateRange = "All" | "Weekly" | "Monthly" | "Yearly" | "Custom";

const mapToDisplayFormat = (tx: Transaction): TransactionDisplay => {
  return {
    id: tx.id,
    date: tx.date, // Already formatted in your context
    description: tx.description,
    amount: `${tx.amountInNaira.toFixed(2)}NGN`,
    status: tx.status === "completed" ? "Successful" : 
           tx.status === "failed" ? "Failed" : "Pending",
    transactionId: tx.hash,
    explorerUrl: tx.explorerUrl
  };
};

const ITEMS_PER_PAGE = 10;

export default function DashboardTransactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRange>("All");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDateRangeMenu, setShowDateRangeMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState<Date | undefined>(new Date());
  const [year, setYear] = useState<Date | undefined>(new Date());
  const { transactions, loading: contextLoading } = useTransactions();
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionDisplay[]>([]);
  const [displayTransactions, setDisplayTransactions] = useState<TransactionDisplay[]>([]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactionDisplays = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (transactions.length > 0) {
      const formatted = transactions.map(mapToDisplayFormat);
      setFilteredTransactions(formatted);
      setDisplayTransactions(formatted);
    }
  }, [transactions]);

  console.log("Formatted User Transactions:", transactions);

  const getStatusIcon = (status: StatusFilter) => {
    switch (status) {
      case "Successful":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "Failed":
        return <XCircle className="h-4 w-4 text-red-400" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "Successful":
        return "text-green-500";
      case "Failed":
        return "text-red-500";
      case "Pending":
        return "text-yellow-500";
      default:
        return "text-white";
    }
  };

  const handleSortByDate = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: StatusFilter) => {
    setStatusFilter(status);
    setShowStatusMenu(false);
    setCurrentPage(1);
  };

  const handleDateRangeFilter = (range: DateRange) => {
    setDateRangeFilter(range);
    if (range !== "Custom") {
      setCustomStartDate(undefined);
      setCustomEndDate(undefined);
    }
    setShowDateRangeMenu(false);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      applyFilters(statusFilter, sortDirection, dateRangeFilter);
      return;
    }
    const query = searchQuery.toLowerCase();
    const results = displayTransactions.filter((tx) =>
      Object.values(tx).some(
        (value) => typeof value === "string" && value.toLowerCase().includes(query)
      )
    );

    // Apply status filter
    let filteredResults: TransactionDisplay[] =
      statusFilter === "All" ? results : results.filter((tx) => tx.status === statusFilter);

    // Apply date range filter
    filteredResults = applyDateRangeFilter(filteredResults, dateRangeFilter);

    setFilteredTransactions(filteredResults);
    setCurrentPage(1);
  };

  const applyDateRangeFilter = (data: TransactionDisplay[], range: DateRange) => {
    if (range === "All") return data;

    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    return data.filter((tx) => {
      const [day, month, year] = tx.date.split("/").map(Number);
      const txDate = new Date(year, month - 1, day);

      switch (range) {
        case "Weekly":
          // Get transactions from the past 7 days
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return txDate >= weekAgo && txDate <= today;

        case "Monthly":
          // Get transactions from the selected month
          const parsedMonth = month; // Use the extracted year directly
          if (!isNaN(parsedMonth)) {
            const startOfMonth = new Date(parsedMonth, 0, 1);
            const endOfMonth = new Date(parsedMonth, 1, 0);
            return txDate >= startOfMonth && txDate <= endOfMonth;
          }
          return false;

        case "Yearly":
          // Get transactions from the selected year
          const parsedYear = year; // Use the extracted year directly
          if (!isNaN(parsedYear)) {
            const startOfYear = new Date(parsedYear, 0, 1);
            const endOfYear = new Date(parsedYear, 11, 31);
            return txDate >= startOfYear && txDate <= endOfYear;
          }
          return false;

        case "Custom":
          // Get transactions between start and end dates
          if (
            customStartDate instanceof Date &&
            !isNaN(customStartDate.getTime()) &&
            customEndDate instanceof Date &&
            !isNaN(customEndDate.getTime())
          ) {
            return txDate >= customStartDate && txDate <= customEndDate;
          }
          return false;

        default:
          return true;
      }
    });
  };

  const applyFilters = (status: StatusFilter, direction: SortDirection, dateRange: DateRange) => {
    let results: TransactionDisplay[] = [...displayTransactions];

    // Apply status filter
    if (status !== "All") {
      results = results.filter((tx) => tx.status === status);
    }

    // Apply date range filter
    results = applyDateRangeFilter(results, dateRange);

    // Apply sorting
    results.sort((a, b) => {
      const dateA = new Date(a.date.split("/").reverse().join("/"));
      const dateB = new Date(b.date.split("/").reverse().join("/"));
      return direction === "desc"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

    setFilteredTransactions(results);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    applyFilters(statusFilter, sortDirection, dateRangeFilter);
  }, [statusFilter, sortDirection, dateRangeFilter, customStartDate, customEndDate, month, year]);

  return (
    <div className="flex flex-col h-full w-full mx-auto bg-[#0f172a] min-h-0">
      <div className="flex-1 flex flex-col p-4 sm:p-6 gap-4 font-sans">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm text-[#94A3B8] mt-1">
              View all your processed transactions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-lg bg-[#1E293B] text-white hover:bg-gradient-to-r hover:from-[#1E293B] hover:to-[#111C2F] transition-all duration-200"
              onClick={handleSortByDate}
              title={`Sort by date (${sortDirection === "asc" ? "oldest first" : "newest first"})`}
            >
              <LuArrowDownUp className="h-5 w-5" />
            </button>

            {/* Date Range Filter */}
            <div className="relative">
              <button
                className="p-2 rounded-lg bg-[#1E293B] text-white hover:bg-gradient-to-r hover:from-[#1E293B] hover:to-[#111C2F] transition-all duration-200"
                onClick={() => setShowDateRangeMenu(!showDateRangeMenu)}
                title="Filter by date range"
              >
                <Calendar className="h-5 w-5" />
              </button>
              {showDateRangeMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#111C2F]/90 backdrop-blur-lg rounded-lg shadow-xl z-20 border border-[#1E293B]">
                  {(["All", "Weekly", "Monthly", "Yearly", "Custom"] as DateRange[]).map((range) => (
                    <div key={range} className="border-b border-[#1E293B] last:border-0">
                      <button
                        className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left text-[#94A3B8] hover:bg-[#1E293B] hover:text-white transition-colors ${
                          dateRangeFilter === range ? "bg-[#1E293B] text-white" : ""
                        }`}
                        onClick={() => handleDateRangeFilter(range)}
                      >
                        {range}
                      </button>

                      {range === "Custom" && dateRangeFilter === "Custom" && (
                        <div className="p-3 bg-[#182235] flex flex-col gap-3">
                          <div>
                            <label className="text-sm text-[#94A3B8]">Start Date</label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B]"
                                >
                                  {customStartDate instanceof Date && !isNaN(customStartDate.getTime()) ? (
                                    format(customStartDate, "PPP")
                                  ) : (
                                    <span>Pick start date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 bg-[#111C2F] border-[#1E293B]">
                                <CalendarComponent
                                  mode="single"
                                  selected={customStartDate}
                                  onSelect={(newDate) =>
                                    setCustomStartDate(newDate instanceof Date ? newDate : undefined)
                                  }
                                  className="bg-[#111C2F] text-white border-[#1E293B]"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div>
                            <label className="text-sm text-[#94A3B8]">End Date</label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B]"
                                >
                                  {customEndDate instanceof Date && !isNaN(customEndDate.getTime()) ? (
                                    format(customEndDate, "PPP")
                                  ) : (
                                    <span>Pick end date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 bg-[#111C2F] border-[#1E293B]">
                                <CalendarComponent
                                  mode="single"
                                  selected={customEndDate}
                                  onSelect={(newDate) =>
                                    setCustomEndDate(newDate instanceof Date ? newDate : undefined)
                                  }
                                  className="bg-[#111C2F] text-white border-[#1E293B]"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <Button
                            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                            onClick={() => setShowDateRangeMenu(false)}
                          >
                            Apply
                          </Button>
                        </div>
                      )}

                      {range === "Monthly" && dateRangeFilter === "Monthly" && (
                        <div className="p-3 bg-[#182235]">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B]"
                              >
                                {month instanceof Date && !isNaN(month.getTime()) ? (
                                  format(month, "MMMM yyyy")
                                ) : (
                                  <span>Select month</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-[#111C2F] border-[#1E293B]">
                              <CalendarComponent
                                mode="single"
                                selected={month}
                                onSelect={(newMonth) =>
                                  setMonth(newMonth instanceof Date ? newMonth : undefined)
                                }
                                className="bg-[#111C2F] text-white border-[#1E293B]"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}

                      {range === "Yearly" && dateRangeFilter === "Yearly" && (
                        <div className="p-3 bg-[#182235]">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B]"
                              >
                                {year instanceof Date && !isNaN(year.getTime()) ? (
                                  format(year, "yyyy")
                                ) : (
                                  <span>Select year</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-[#111C2F] border-[#1E293B]">
                              <CalendarComponent
                                mode="single"
                                selected={year}
                                onSelect={(newYear) =>
                                  setYear(newYear instanceof Date ? newYear : undefined)
                                }
                                className="bg-[#111C2F] text-white border-[#1E293B]"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                className="p-2 rounded-lg bg-[#1E293B] text-white hover:bg-gradient-to-r hover:from-[#1E293B] hover:to-[#111C2F] transition-all duration-200"
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                title="Filter by status"
              >
                <GiSettingsKnobs className="h-5 w-5" />
              </button>
              {showStatusMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#111C2F]/90 backdrop-blur-lg rounded-lg shadow-xl z-10 border border-[#1E293B]">
                  {(["All", "Successful", "Failed", "Pending"] as StatusFilter[]).map((status) => (
                    <button
                      key={status}
                      className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left text-[#94A3B8] hover:bg-[#1E293B] hover:text-white transition-colors ${
                        statusFilter === status ? "bg-[#1E293B] text-white" : ""
                      }`}
                      onClick={() => handleStatusFilter(status)}
                    >
                      {status !== "All" && getStatusIcon(status)}
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <Input
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#111C2F]/90 backdrop-blur-md border border-[#1E293B] text-white placeholder-[#94A3B8] focus:ring-2 focus:ring-[#1E293B] transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button
            className="bg-gradient-to-r from-[#1E293B] to-[#111C2F] text-white hover:from-[#111C2F] hover:to-[#1E293B] w-full sm:w-auto transition-all duration-200 transform hover:scale-105"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>

        {/* Current Filters */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-[#94A3B8]">
          {statusFilter !== "All" && (
            <div className="flex items-center gap-1">
              <span>Status:</span>
              <span
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusTextColor(
                  statusFilter
                )}`}
              >
                {getStatusIcon(statusFilter)}
                {statusFilter}
              </span>
            </div>
          )}

          {dateRangeFilter !== "All" && (
            <div className="flex items-center gap-1">
              <span>Date Range:</span>
              <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border text-blue-500">
                <Calendar className="h-3 w-3" />
                {dateRangeFilter}
                {dateRangeFilter === "Custom" &&
                  customStartDate instanceof Date &&
                  !isNaN(customStartDate.getTime()) &&
                  customEndDate instanceof Date &&
                  !isNaN(customEndDate.getTime()) &&
                  `: ${format(customStartDate, "dd/MM/yyyy")} - ${format(customEndDate, "dd/MM/yyyy")}`}
                {dateRangeFilter === "Monthly" &&
                  month instanceof Date &&
                  !isNaN(month.getTime()) &&
                  `: ${format(month, "MMM yyyy")}`}
                {dateRangeFilter === "Yearly" &&
                  year instanceof Date &&
                  !isNaN(year.getTime()) &&
                  `: ${format(year, "yyyy")}`}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <span>Order:</span>
            <span>{sortDirection === "asc" ? "Oldest first" : "Newest first"}</span>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 min-h-0 overflow-auto border border-[#1E293B] rounded-lg">
          <Table className="w-full">
            <TableHeader className="bg-[#0A1525] sticky top-0 z-10">
              <TableRow className="border-b border-[#1E293B]">
                <TableHead className="w-[120px] text-white font-semibold py-3">Date</TableHead>
                <TableHead className="text-white font-semibold py-3">Description</TableHead>
                <TableHead className="text-white font-semibold py-3">Amount</TableHead>
                <TableHead className="text-white font-semibold py-3">Status</TableHead>
                <TableHead className="hidden md:table-cell text-white font-semibold py-3">
                  Transaction ID
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactionDisplays.length > 0 ? (
                paginatedTransactionDisplays.map((tx: TransactionDisplay, index: number) => (
                  <TableRow
                    key={index}
                    className="bg-[#111C2F] hover:bg-[#1E293B] transition-colors border-b border-[#1E293B]"
                  >
                    <TableCell className="font-medium text-white py-3">{tx.date}</TableCell>
                    <TableCell className="text-[#94A3B8] py-3">{tx.description}</TableCell>
                    <TableCell className="text-white font-medium py-3">{tx.amount}</TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-2 ${getStatusTextColor(tx.status)}`}>
                        {getStatusIcon(tx.status as StatusFilter)}
                        <span>{tx.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-[#94A3B8] truncate max-w-[150px] group relative py-3">
                      <span className="cursor-pointer">{tx.transactionId}</span>
                      <div className="absolute hidden group-hover:block bg-[#111C2F] text-white text-xs rounded p-2 shadow-lg z-10">
                        {tx.transactionId}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="bg-[#111C2F] hover:bg-[#111C2F]">
                  <TableCell colSpan={5} className="py-8 text-center text-[#94A3B8]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="h-8 w-8 opacity-50" />
                      <p className="text-lg font-medium">No transactions found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination (Footer-like) */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 sm:px-6 bg-[#0A1525] border-t border-[#1E293B] rounded-b-lg shadow-lg">
        <div className="text-sm text-[#94A3B8]">
          {filteredTransactions.length > 0
            ? `Page ${currentPage} of ${totalPages} (${filteredTransactions.length} transactions total)`
            : "No transactions found"}
        </div>
        {filteredTransactions.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="bg-[#1E293B] border border-[#1E293B] text-white hover:bg-[#111C2F] disabled:opacity-50"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
            <Button
              variant="outline"
              className="bg-[#1E293B] border border-[#1E293B] text-white hover:bg-[#111C2F] disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 3) {
                  pageNum = i + 1;
                } else if (currentPage <= 2) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 1) {
                  pageNum = totalPages - 2 + i;
                } else {
                  pageNum = currentPage - 1 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    className={`min-w-[40px] ${
                      currentPage === pageNum
                        ? "bg-[#3B82F6] text-white"
                        : "bg-[#1E293B] border border-[#1E293B] text-white hover:bg-[#111C2F]"
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              className="bg-[#1E293B] border border-[#1E293B] text-white hover:bg-[#111C2F] disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
            <Button
              variant="outline"
              className="bg-[#1E293B] border border-[#1E293B] text-white hover:bg-[#111C2F] disabled:opacity-50"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Last
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
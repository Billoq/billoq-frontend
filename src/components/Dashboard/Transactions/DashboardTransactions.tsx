// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { Input } from "@/components/ui/input";
// import { Search, CheckCircle, XCircle, Clock, Calendar, Loader2, AlertCircle, Copy, RefreshCw } from "lucide-react";
// import { LuArrowDownUp } from "react-icons/lu";
// import { GiSettingsKnobs } from "react-icons/gi";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Calendar as CalendarComponent } from "@/components/ui/calendar";
// import { format, parse } from "date-fns";
// import { useTransactions } from "@/context/transaction-context";
// import { Transaction } from "@/types/transaction";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "react-toastify";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// type TransactionDisplay = {
//   id: string;
//   date: string;
//   description: string;
//   amount: string;
//   status: "Successful" | "Failed" | "Pending";
//   transactionId: string;
//   explorerUrl: string;
// };

// type SortDirection = "asc" | "desc";
// type StatusFilter = "All" | "Successful" | "Failed" | "Pending";
// type DateRange = "All" | "Weekly" | "Monthly" | "Yearly" | "Custom";

// const ITEMS_PER_PAGE = 10;

// const mapToDisplayFormat = (tx: Transaction): TransactionDisplay => ({
//   id: tx.id,
//   date: tx.date,
//   description: tx.description,
//   amount: `${tx.amountInNaira.toFixed(2)}NGN`,
//   status: tx.status === "completed" ? "Successful" : tx.status === "failed" ? "Failed" : "Pending",
//   transactionId: tx.hash,
//   explorerUrl: tx.explorerUrl,
// });

// const truncateTransactionId = (id: string): string => {
//   if (id.length <= 10) return id;
//   return `${id.slice(0, 6)}...${id.slice(-4)}`;
// };

// const FilterControls = ({
//   searchQuery,
//   setSearchQuery,
//   sortDirection,
//   handleSortByDate,
//   statusFilter,
//   setStatusFilter,
//   dateRangeFilter,
//   handleDateRangeFilter,
//   showStatusMenu,
//   setShowStatusMenu,
//   showDateRangeMenu,
//   setShowDateRangeMenu,
//   customStartDate,
//   setCustomStartDate,
//   customEndDate,
//   setCustomEndDate,
//   month,
//   setMonth,
//   year,
//   setYear,
//   isSearching,
//   contextLoading,
//   handleSearch,
//   handleRefresh,
// }: {
//   searchQuery: string;
//   setSearchQuery: (value: string) => void;
//   sortDirection: SortDirection;
//   handleSortByDate: () => void;
//   statusFilter: StatusFilter;
//   setStatusFilter: (status: StatusFilter) => void;
//   dateRangeFilter: DateRange;
//   handleDateRangeFilter: (range: DateRange) => void;
//   showStatusMenu: boolean;
//   setShowStatusMenu: (value: boolean) => void;
//   showDateRangeMenu: boolean;
//   setShowDateRangeMenu: (value: boolean) => void;
//   customStartDate: Date | undefined;
//   setCustomStartDate: (date: Date | undefined) => void;
//   customEndDate: Date | undefined;
//   setCustomEndDate: (date: Date | undefined) => void;
//   month: Date | undefined;
//   setMonth: (date: Date | undefined) => void;
//   year: Date | undefined;
//   setYear: (date: Date | undefined) => void;
//   isSearching: boolean;
//   contextLoading: boolean;
//   handleSearch: () => void;
//   handleRefresh: () => void;
// }) => {
//   const getStatusIcon = (status: StatusFilter) => {
//     switch (status) {
//       case "Successful":
//         return <CheckCircle className="h-4 w-4 text-green-400" />;
//       case "Failed":
//         return <XCircle className="h-4 w-4 text-red-400" />;
//       case "Pending":
//         return <Clock className="h-4 w-4 text-yellow-400" />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div className="flex flex-col">
//           <h1 className="text-xl font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text">
//             Transaction History
//           </h1>
//           <p className="text-sm text-[#94A3B8] mt-1">View all your processed transactions</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <button
//                   className="p-2 rounded-lg bg-[#1E293B] text-white hover:bg-gradient-to-r hover:from-[#1E293B] hover:to-[#111C2F] transition-all duration-200 shadow-lg shadow-blue-900/10 transform hover:scale-105"
//                   onClick={handleSortByDate}
//                   disabled={contextLoading}
//                   aria-label="Sort by date"
//                 >
//                   <LuArrowDownUp className="h-5 w-5" />
//                 </button>
//               </TooltipTrigger>
//               <TooltipContent className="bg-[#111C2F] text-white border-[#1E293B]">
//                 Sort by date ({sortDirection === "asc" ? "oldest first" : "newest first"})
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//           <div className="relative">
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <button
//                     className="p-2 rounded-lg bg-[#1E293B] text-white hover:bg-gradient-to-r hover:from-[#1E293B] hover:to-[#111C2F] transition-all duration-200 shadow-lg shadow-blue-900/10 transform hover:scale-105"
//                     onClick={() => setShowDateRangeMenu(!showDateRangeMenu)}
//                     disabled={contextLoading}
//                     aria-label="Filter by date range"
//                   >
//                     <Calendar className="h-5 w-5" />
//                   </button>
//                 </TooltipTrigger>
//                 <TooltipContent className="bg-[#111C2F] text-white border-[#1E293B]">
//                   Filter by date range
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//             {showDateRangeMenu && (
//               <div className="absolute lg:right-0 right-[-50px] mt-2 lg:w-64 bg-[#111C2F]/95 backdrop-blur-lg rounded-lg shadow-xl z-20 border border-[#1E293B]">
//                 {(["All", "Weekly", "Monthly", "Yearly", "Custom"] as DateRange[]).map((range) => (
//                   <div key={range} className="border-b border-[#1E293B] last:border-0">
//                     <button
//                       className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left text-[#94A3B8] hover:bg-[#1E293B] hover:text-white transition-colors ${
//                         dateRangeFilter === range ? "bg-[#1E293B] text-white" : ""
//                       }`}
//                       onClick={() => handleDateRangeFilter(range)}
//                     >
//                       {range}
//                     </button>
//                     {range === "Custom" && dateRangeFilter === "Custom" && (
//                       <div className="mx-auto p-3 bg-[#182235] flex flex-col gap-3">
//                         <div>
//                           <label className="text-sm text-[#94A3B8]">Start Date</label>
//                           <Popover>
//                             <PopoverTrigger asChild>
//                               <Button
//                                 variant="outline"
//                                 className="w-full justify-center text-left bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B]"
//                               >
//                                 {customStartDate instanceof Date && !isNaN(customStartDate.getTime()) ? (
//                                   format(customStartDate, "PPP")
//                                 ) : (
//                                   <span>Pick start date</span>
//                                 )}
//                               </Button>
//                             </PopoverTrigger>
//                             <PopoverContent className="w-auto p-0 bg-[#111C2F] border-[#1E293B]">
//                               <CalendarComponent
//                                 mode="single"
//                                 selected={customStartDate}
//                                 onSelect={setCustomStartDate}
//                                 className="bg-[#111C2F] text-white border-[#1E293B]"
//                               />
//                             </PopoverContent>
//                           </Popover>
//                         </div>
//                         <div>
//                           <label className="text-sm text-[#94A3B8]">End Date</label>
//                           <Popover>
//                             <PopoverTrigger asChild>
//                               <Button
//                                 variant="outline"
//                                 className="lg:w-full justify-start text-left bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B]"
//                               >
//                                 {customEndDate instanceof Date && !isNaN(customEndDate.getTime()) ? (
//                                   format(customEndDate, "PPP")
//                                 ) : (
//                                   <span>Pick end date</span>
//                                 )}
//                               </Button>
//                             </PopoverTrigger>
//                             <PopoverContent className="w-auto p-0 bg-[#111C2F] border-[#1E293B]">
//                               <CalendarComponent
//                                 mode="single"
//                                 selected={customEndDate}
//                                 onSelect={setCustomEndDate}
//                                 className="bg-[#111C2F] text-white border-[#1E293B]"
//                               />
//                             </PopoverContent>
//                           </Popover>
//                         </div>
//                         <Button
//                           className="bg-gradient-to-r from-blue-500 hover:from-blue-600 hover:to-indigo-700 text-white border-none shadow-lg shadow-blue-900/20 transform hover:scale-105"
//                           onClick={() => setShowDateRangeMenu(false)}
//                         >
//                           Apply
//                         </Button>
//                       </div>
//                     )}
//                     {range === "Monthly" && dateRangeFilter === "Monthly" && (
//                       <div className="p-3 bg-[#182235]">
//                         <Popover>
//                           <PopoverTrigger asChild>
//                             <Button
//                               variant="outline"
//                               className="w-full justify-start text-left bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B]"
//                             >
//                               {month instanceof Date && !isNaN(month.getTime()) ? (
//                                 format(month, "MMMM yyyy")
//                               ) : (
//                                 <span>Select month</span>
//                               )}
//                             </Button>
//                           </PopoverTrigger>
//                           <PopoverContent className="w-auto p-0 bg-[#111C2F] border-[#1E293B]">
//                             <CalendarComponent
//                               mode="single"
//                               selected={month}
//                               onSelect={setMonth}
//                               className="bg-[#111C2F] text-white border-[#1E293B]"
//                             />
//                           </PopoverContent>
//                         </Popover>
//                       </div>
//                     )}
//                     {range === "Yearly" && dateRangeFilter === "Yearly" && (
//                       <div className="p-3 bg-[#182235]">
//                         <Popover>
//                           <PopoverTrigger asChild>
//                             <Button
//                               variant="outline"
//                               className="w-full justify-start text-left bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B]"
//                             >
//                               {year instanceof Date && !isNaN(year.getTime()) ? (
//                                 format(year, "yyyy")
//                               ) : (
//                                 <span>Select year</span>
//                               )}
//                             </Button>
//                           </PopoverTrigger>
//                           <PopoverContent className="w-auto p-0 bg-[#111C2F] border-[#1E293B]">
//                             <CalendarComponent
//                               mode="single"
//                               selected={year}
//                               onSelect={setYear}
//                               className="bg-[#111C2F] text-white border-[#1E293B]"
//                             />
//                           </PopoverContent>
//                         </Popover>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//           <div className="relative">
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <button
//                     className="p-2 rounded-lg bg-[#1E293B] text-white hover:bg-gradient-to-r hover:from-[#1E293B] hover:to-[#111C2F] transition-all duration-200 shadow-lg shadow-blue-900/10 transform hover:scale-105"
//                     onClick={() => setShowStatusMenu(!showStatusMenu)}
//                     disabled={contextLoading}
//                     aria-label="Filter by status"
//                   >
//                     <GiSettingsKnobs className="h-5 w-5" />
//                   </button>
//                 </TooltipTrigger>
//                 <TooltipContent className="bg-[#111C2F] text-white border-[#1E293B]">
//                   Filter by status
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//             {showStatusMenu && (
//               <div className="absolute right-[0px] lg:right-0 mt-2 lg:w-48 bg-[#111C2F]/95 backdrop-blur-lg rounded-lg shadow-xl z-10 border border-[#1E293B]">
//                 {(["All", "Successful", "Failed", "Pending"] as StatusFilter[]).map((status) => (
//                   <button
//                     key={status}
//                     className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left text-[#94A3B8] hover:bg-[#1E293B] hover:text-white transition-colors ${
//                       statusFilter === status ? "bg-[#1E293B] text-white" : ""
//                     }`}
//                     onClick={() => {
//                       setStatusFilter(status);
//                       setShowStatusMenu(false);
//                     }}
//                   >
//                     {status !== "All" && getStatusIcon(status)}
//                     {status}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <button
//                   className="p-2 rounded-lg bg-[#1E293B] text-white hover:bg-gradient-to-r hover:from-[#1E293B] hover:to-[#111C2F] transition-all duration-200 shadow-lg shadow-blue-900/10 transform hover:scale-105"
//                   onClick={handleRefresh}
//                   disabled={contextLoading}
//                   aria-label="Refresh transactions"
//                 >
//                   <RefreshCw className="h-5 w-5" />
//                 </button>
//               </TooltipTrigger>
//               <TooltipContent className="bg-[#111C2F] text-white border-[#1E293B]">
//                 Refresh transactions
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         </div>
//       </div>
//       <div className="flex flex-col sm:flex-row items-center gap-3">
//         <div className="relative w-full">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
//           <Input
//             placeholder="Search transactions..."
//             className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#111C2F]/90 backdrop-blur-md border border-[#1E293B] text-white placeholder-[#94A3B8] focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 shadow-lg shadow-blue-900/5"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//             disabled={contextLoading}
//           />
//         </div>
//         <Button
//           className="bg-[#1D4ED8] hover:bg-blue-600 text-white w-full sm:w-auto transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-900/20 font-medium"
//           onClick={handleSearch}
//           disabled={isSearching || contextLoading}
//         >
//           {isSearching ? (
//             <div className="flex items-center gap-2">
//               <Loader2 className="h-4 w-4 animate-spin" />
//               <span>Searching...</span>
//             </div>
//           ) : (
//             "Search"
//           )}
//         </Button>
//       </div>
//     </>
//   );
// };

// const TransactionTable = ({
//   contextLoading,
//   contextError,
//   refetch,
//   isSearching,
//   paginatedTransactionDisplays,
//   hasRealError,
// }: {
//   contextLoading: boolean;
//   contextError: string | null;
//   refetch: () => void;
//   isSearching: boolean;
//   paginatedTransactionDisplays: TransactionDisplay[];
//   hasRealError: boolean;
// }) => {
//   const getStatusIcon = (status: StatusFilter) => {
//     switch (status) {
//       case "Successful":
//         return <CheckCircle className="h-4 w-4 text-green-400" />;
//       case "Failed":
//         return <XCircle className="h-4 w-4 text-red-400" />;
//       case "Pending":
//         return <Clock className="h-4 w-4 text-yellow-400" />;
//       default:
//         return null;
//     }
//   };

//   const getStatusTextColor = (status: string) => {
//     switch (status) {
//       case "Successful":
//         return "text-green-400";
//       case "Failed":
//         return "text-red-400";
//       case "Pending":
//         return "text-yellow-400";
//       default:
//         return "text-white";
//     }
//   };

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text).then(() => {
//       toast.success("Transaction ID copied to clipboard!", {
//         position: "bottom-right",
//         autoClose: 2000,
//         hideProgressBar: true,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         theme: "dark",
//       });
//     });
//   };

//   const TableRowSkeleton = () => (
//     <TableRow className="bg-[#111C2F] border-b border-[#1E293B] animate-pulse">
//       <TableCell className="py-4">
//         <Skeleton className="h-4 w-20 bg-[#1E293B]" />
//       </TableCell>
//       <TableCell className="py-4">
//         <Skeleton className="h-4 w-32 bg-[#1E293B]" />
//       </TableCell>
//       <TableCell className="py-4">
//         <Skeleton className="h-4 w-24 bg-[#1E293B]" />
//       </TableCell>
//       <TableCell className="py-4">
//         <div className="flex items-center gap-2">
//           <Skeleton className="h-4 w-4 rounded-full bg-[#1E293B]" />
//           <Skeleton className="h-4 w-16 bg-[#1E293B]" />
//         </div>
//       </TableCell>
//       <TableCell className="py-4">
//         <Skeleton className="h-4 w-32 bg-[#1E293B]" />
//       </TableCell>
//     </TableRow>
//   );

//   console.log("TransactionTable: contextLoading =", contextLoading);

//   return (
//     <div className="relative flex-1 min-h-0 overflow-x-hidden hover:overflow-x-visible overflow-y-auto border border-[#1E293B] rounded-lg bg-[#0A1525]/60 backdrop-blur-sm table-container shadow-xl shadow-blue-900/5 transition-all duration-300">
//       {contextLoading && (
//         <div className="absolute inset-0 bg-[#0A1525]/90 backdrop-blur-md flex items-center justify-center z-50">
//           <div className="flex flex-col items-center gap-4 p-6 bg-[#111C2F]/80 rounded-lg shadow-2xl shadow-blue-900/20">
//             <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
//             <p className="text-xl font-semibold text-white">Fetching transactions...</p>
//           </div>
//         </div>
//       )}
//       <Table className="w-full">
//         <TableHeader className="bg-[#0A1525] sticky top-0 z-10 border-b border-[#1E293B]">
//           <TableRow className="hover:bg-[#0A1525]">
//             <TableHead className="w-[120px] text-white font-semibold py-4 text-sm">Date</TableHead>
//             <TableHead className="text-white font-semibold py-4 text-sm">Description</TableHead>
//             <TableHead className="text-white font-semibold py-4 text-sm">Amount</TableHead>
//             <TableHead className="text-white font-semibold py-4 text-sm">Status</TableHead>
//             <TableHead className="text-white font-semibold py-4 text-sm">Transaction ID</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {hasRealError ? (
//             <TableRow className="bg-[#111C2F] hover:bg-[#111C2F]">
//               <TableCell colSpan={5} className="py-8 text-center text-[#94A3B8]">
//                 <div className="flex flex-col items-center justify-center gap-4">
//                   <AlertCircle className="h-10 w-10 text-red-400" />
//                   <p className="text-lg font-medium text-white">Failed to load transactions</p>
//                   <p className="text-sm text-[#94A3B8]">{contextError}</p>
//                   <Button
//                     className="bg-[#1D4ED8] hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-900/20 font-medium"
//                     onClick={() => {
//                       refetch();
//                       toast.info("Retrying to fetch transactions...", {
//                         position: "bottom-right",
//                         autoClose: 3000,
//                         hideProgressBar: false,
//                         closeOnClick: true,
//                         pauseOnHover: true,
//                         draggable: true,
//                         theme: "dark",
//                       });
//                     }}
//                   >
//                     Retry
//                   </Button>
//                 </div>
//               </TableCell>
//             </TableRow>
//           ) : contextLoading ? (
//             Array(5)
//               .fill(0)
//               .map((_, index) => <TableRowSkeleton key={index} />)
//           ) : isSearching ? (
//             <TableRow className="bg-[#111C2F] hover:bg-[#111C2F]">
//               <TableCell colSpan={5} className="py-8 text-center text-[#94A3B8]">
//                 <div className="flex flex-col items-center justify-center gap-3">
//                   <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
//                   <p className="text-lg font-medium">Searching transactions...</p>
//                 </div>
//               </TableCell>
//             </TableRow>
//           ) : paginatedTransactionDisplays.length > 0 ? (
//             paginatedTransactionDisplays.map((tx, index) => (
//               <TableRow
//                 key={index}
//                 className="bg-[#111C2F] border-b border-[#1E293B] hover:bg-[#1E293B]/80 duration-200"
//               >
//                 <TableCell className="font-medium text-white py-4 text-sm">{tx.date}</TableCell>
//                 <TableCell className="text-[#94A3B8] py-4 text-sm">{tx.description}</TableCell>
//                 <TableCell className="text-white font-medium py-4 text-sm">{tx.amount}</TableCell>
//                 <TableCell className="py-4">
//                   <div className={`flex items-center gap-2 ${getStatusTextColor(tx.status)} text-sm`}>
//                     {getStatusIcon(tx.status as StatusFilter)}
//                     <span>{tx.status}</span>
//                   </div>
//                 </TableCell>
//                 <TableCell className="py-4">
//                   <div className="flex items-center">
//                     <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <a
//                             href={tx.explorerUrl}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-400 hover:text-blue-300 underline-offset-4 transition-colors font-mono text-sm"
//                             onClick={() => {
//                               toast.info("Opening transaction in explorer", {
//                                 position: "bottom-right",
//                                 autoClose: 2000,
//                                 hideProgressBar: true,
//                                 closeOnClick: true,
//                                 pauseOnHover: true,
//                                 theme: "dark",
//                               });
//                             }}
//                           >
//                             {truncateTransactionId(tx.transactionId)}
//                           </a>
//                         </TooltipTrigger>
//                         <TooltipContent className="bg-[#111C2F] text-white border-[#1E293B] max-w-xs break-all font-mono">
//                           {tx.transactionId}
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                     <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <button
//                             className="p-1 rounded-full bg-[#1E293B] text-white hover:bg-blue-500/50 transition-colors"
//                             onClick={() => copyToClipboard(tx.transactionId)}
//                           >
//                             <Copy className="h-4 w-4" />
//                           </button>
//                         </TooltipTrigger>
//                         <TooltipContent className="bg-[#111C2F] text-white border-[#1E293B]">
//                           Copy Transaction ID
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow className="bg-[#111C2F] hover:bg-[#111C2F]">
//               <TableCell colSpan={5} className="py-8 text-center text-[#94A3B8]">
//                 <div className="flex flex-col items-center justify-center gap-2">
//                   <Search className="h-8 w-8 opacity-50" />
//                   <p className="text-lg font-medium">No transactions found</p>
//                   <p className="text-sm">Try adjusting your search or filters</p>
//                 </div>
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// const Pagination = ({
//   contextLoading,
//   contextError,
//   filteredTransactions,
//   currentPage,
//   totalPages,
//   handlePageChange,
// }: {
//   contextLoading: boolean;
//   contextError: string | null;
//   filteredTransactions: TransactionDisplay[];
//   currentPage: number;
//   totalPages: number;
//   handlePageChange: (page: number) => void;
// }) => (
//   <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 sm:px-6 bg-[#0A1525] border-t border-[#1E293B] rounded-b-lg shadow-lg">
//     <div className="text-sm text-[#94A3B8]">
//       {contextLoading ? (
//         <div className="flex items-center gap-2">
//           <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
//           <span>Loading transactions...</span>
//         </div>
//       ) : contextError ? (
//         "Error loading transactions"
//       ) : filteredTransactions.length > 0 ? (
//         `Page ${currentPage} of ${totalPages} (${filteredTransactions.length} transactions total)`
//       ) : (
//         "No transactions found"
//       )}
//     </div>
//     {!contextLoading && !contextError && filteredTransactions.length > 0 && (
//       <div className="flex items-center gap-2">
//         <Button
//           variant="outline"
//           size="sm"
//           className="bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B] disabled:opacity-50 transform hover:scale-105 transition-all"
//           onClick={() => handlePageChange(1)}
//           disabled={currentPage === 1}
//           aria-label="First page"
//         >
//           First
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           className="bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B] disabled:opacity-50 transform hover:scale-105 transition-all"
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           aria-label="Previous page"
//         >
//           Prev
//         </Button>
//         <div className="flex items-center gap-1">
//           {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//             const page = i + Math.max(1, currentPage - 2);
//             if (page > totalPages) return null;
//             return (
//               <Button
//                 key={page}
//                 variant={currentPage === page ? "default" : "outline"}
//                 size="sm"
//                 className={`${
//                   currentPage === page
//                     ? "bg-[#1D4ED8] text-white"
//                     : "bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B]"
//                 } transform hover:scale-105 transition-all`}
//                 onClick={() => handlePageChange(page)}
//                 aria-label={`Page ${page}`}
//               >
//                 {page}
//               </Button>
//             );
//           })}
//         </div>
//         <Button
//           variant="outline"
//           size="sm"
//           className="bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B] disabled:opacity-50 transform hover:scale-105 transition-all"
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           aria-label="Next page"
//         >
//           Next
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           className="bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B] disabled:opacity-50 transform hover:scale-105 transition-all"
//           onClick={() => handlePageChange(totalPages)}
//           disabled={currentPage === totalPages}
//           aria-label="Last page"
//         >
//           Last
//         </Button>
//       </div>
//     )}
//   </div>
// );

// export default function DashboardTransactions() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
//   const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
//   const [dateRangeFilter, setDateRangeFilter] = useState<DateRange>("All");
//   const [showStatusMenu, setShowStatusMenu] = useState(false);
//   const [showDateRangeMenu, setShowDateRangeMenu] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
//   const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
//   const [month, setMonth] = useState<Date | undefined>(new Date());
//   const [year, setYear] = useState<Date | undefined>(new Date());
//   const { transactions, loading: contextLoading, error: contextError, refetch } = useTransactions();
//   const [filteredTransactions, setFilteredTransactions] = useState<TransactionDisplay[]>([]);
//   const [displayTransactions, setDisplayTransactions] = useState<TransactionDisplay[]>([]);
//   const [isSearching, setIsSearching] = useState(false);

//   const hasRealError = useMemo(() => {
//     return !!(contextError && !contextError.toLowerCase().includes("no transactions"));
//   }, [contextError]);

//   useEffect(() => {
//     console.log("DashboardTransactions: contextLoading =", contextLoading, "contextError =", contextError, "transactions =", transactions.length);
//     if (contextLoading) {
//       console.log("Loading state is active, should see overlay in TransactionTable");
//     }
//     if (hasRealError) {
//       toast.error(`Failed to load transactions: ${contextError}`, {
//         position: "bottom-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         theme: "dark",
//       });
//     }
//     if (!contextLoading && !contextError && transactions.length === 0) {
//       console.log("No transactions found, should render empty state");
//     }
//   }, [contextLoading, contextError, hasRealError, transactions.length]);

//   useEffect(() => {
//     if (transactions.length > 0) {
//       const formatted = transactions.map(mapToDisplayFormat);
//       setFilteredTransactions(formatted);
//       setDisplayTransactions(formatted);
//       console.log("Transactions loaded:", transactions.length);
//     } else {
//       setFilteredTransactions([]);
//       setDisplayTransactions([]);
//       console.log("No transactions available");
//     }
//   }, [transactions]);

//   const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
//   const paginatedTransactionDisplays = useMemo(
//     () => filteredTransactions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
//     [filteredTransactions, currentPage]
//   );

//   const applyDateRangeFilter = useCallback(
//     (data: TransactionDisplay[], range: DateRange) => {
//       if (range === "All") return data;

//       const currentDate = new Date();
//       const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

//       return data.filter((tx) => {
//         const [day, txMonth, txYear] = tx.date.split("/").map(Number);
//         const txDate = new Date(txYear, txMonth - 1, day);

//         switch (range) {
//           case "Weekly":
//             const weekAgo = new Date(today);
//             weekAgo.setDate(weekAgo.getDate() - 7);
//             return txDate >= weekAgo && txDate <= today;

//           case "Monthly":
//             if (month instanceof Date && !isNaN(month.getTime())) {
//               const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
//               const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0); // Last day of the month
//               return txDate >= startOfMonth && txDate <= endOfMonth;
//             }
//             return false;

//           case "Yearly":
//             if (year instanceof Date && !isNaN(year.getTime())) {
//               const startOfYear = new Date(year.getFullYear(), 0, 1);
//               const endOfYear = new Date(year.getFullYear(), 11, 31);
//               return txDate >= startOfYear && txDate <= endOfYear;
//             }
//             return false;

//           case "Custom":
//             if (
//               customStartDate instanceof Date &&
//               !isNaN(customStartDate.getTime()) &&
//               customEndDate instanceof Date &&
//               !isNaN(customEndDate.getTime())
//             ) {
//               return txDate >= customStartDate && txDate <= customEndDate;
//             }
//             return false;

//           default:
//             return true;
//         }
//       });
//     },
//     [customStartDate, customEndDate, month, year]
//   );

//   const applyFilters = useCallback(
//     (status: StatusFilter, direction: SortDirection, dateRange: DateRange) => {
//       let results: TransactionDisplay[] = [...displayTransactions];

//       if (status !== "All") {
//         results = results.filter((tx) => tx.status === status);
//       }

//       results = applyDateRangeFilter(results, dateRange);

//       results.sort((a, b) => {
//         const parseDate = (dateStr: string): Date => {
//           try {
//             const parts = dateStr.split("/");
//             if (parts.length !== 3) throw new Error("Invalid date format");
//             const day = parts[0].padStart(2, "0");
//             const month = parts[1].padStart(2, "0");
//             const year = parts[2];
//             const normalizedDate = `${day}/${month}/${year}`;
//             const date = parse(normalizedDate, "dd/MM/yyyy", new Date());
//             if (isNaN(date.getTime())) {
//               console.warn(`Invalid date parsed: ${dateStr} -> ${normalizedDate}`);
//               return new Date(0);
//             }
//             return date;
//           } catch (error) {
//             console.warn(`Failed to parse date: ${dateStr}`, error);
//             return new Date(0);
//           }
//         };

//         const dateA = parseDate(a.date);
//         const dateB = parseDate(b.date);

//         const dateDiff = direction === "desc" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
//         if (dateDiff !== 0) return dateDiff;

//         const amountA = parseFloat(a.amount.replace("NGN", ""));
//         const amountB = parseFloat(b.amount.replace("NGN", ""));
//         return direction === "desc" ? amountB - amountA : amountA - amountB;
//       });

//       setFilteredTransactions(results);
//       setCurrentPage(1);
//     },
//     [displayTransactions, applyDateRangeFilter]
//   );

//   const handleSortByDate = useCallback(() => {
//     const newDirection = sortDirection === "asc" ? "desc" : "asc";
//     setSortDirection(newDirection);
//     setCurrentPage(1);
//   }, [sortDirection]);

//   const handleDateRangeFilter = useCallback(
//     (range: DateRange) => {
//       setDateRangeFilter(range);
//       if (range !== "Custom") {
//         setCustomStartDate(undefined);
//         setCustomEndDate(undefined);
//       }
//       setShowDateRangeMenu(false);
//       setCurrentPage(1);
//     },
//     []
//   );

//   const handleSearch = useCallback(() => {
//     setIsSearching(true);
//     setTimeout(() => {
//       if (!searchQuery.trim()) {
//         applyFilters(statusFilter, sortDirection, dateRangeFilter);
//         setIsSearching(false);
//         return;
//       }

//       const query = searchQuery.toLowerCase();
//       const results = displayTransactions.filter((tx) =>
//         Object.values(tx).some((value) => typeof value === "string" && value.toLowerCase().includes(query))
//       );

//       let filteredResults: TransactionDisplay[] =
//         statusFilter === "All" ? results : results.filter((tx) => tx.status === statusFilter);

//       filteredResults = applyDateRangeFilter(filteredResults, dateRangeFilter);

//       setFilteredTransactions(filteredResults);
//       setCurrentPage(1);
//       setIsSearching(false);
//     }, 500);
//   }, [searchQuery, displayTransactions, statusFilter, dateRangeFilter, applyDateRangeFilter, applyFilters, sortDirection]);

//   const handlePageChange = useCallback(
//     (page: number) => {
//       if (page >= 1 && page <= totalPages) {
//         setCurrentPage(page);
//         document.querySelector(".table-container")?.scrollTo(0, 0);
//       }
//     },
//     [totalPages]
//   );

//   const handleRefresh = useCallback(() => {
//     refetch();
//     toast.info("Retrying to fetch transactions...", {
//       position: "bottom-right",
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       theme: "dark",
//     });
//   }, [refetch]);

//   useEffect(() => {
//     applyFilters(statusFilter, sortDirection, dateRangeFilter);
//   }, [statusFilter, sortDirection, dateRangeFilter, customStartDate, customEndDate, month, year, applyFilters]);

//   const getStatusTextColor = (status: string) => {
//     switch (status) {
//       case "Successful":
//         return "text-green-400";
//       case "Failed":
//         return "text-red-400";
//       case "Pending":
//         return "text-yellow-400";
//       default:
//         return "text-white";
//     }
//   };

//   return (
//     <div className="flex flex-col h-full w-full mx-auto bg-[#0f172a] min-h-0 overflow-hidden">
//       <div className="flex-1 flex flex-col p-4 sm:p-6 gap-4 font-sans overflow-hidden">
//         <FilterControls
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           sortDirection={sortDirection}
//           handleSortByDate={handleSortByDate}
//           statusFilter={statusFilter}
//           setStatusFilter={setStatusFilter}
//           dateRangeFilter={dateRangeFilter}
//           handleDateRangeFilter={handleDateRangeFilter}
//           showStatusMenu={showStatusMenu}
//           setShowStatusMenu={setShowStatusMenu}
//           showDateRangeMenu={showDateRangeMenu}
//           setShowDateRangeMenu={setShowDateRangeMenu}
//           customStartDate={customStartDate}
//           setCustomStartDate={setCustomStartDate}
//           customEndDate={customEndDate}
//           setCustomEndDate={setCustomEndDate}
//           month={month}
//           setMonth={setMonth}
//           year={year}
//           setYear={setYear}
//           isSearching={isSearching}
//           contextLoading={contextLoading}
//           handleSearch={handleSearch}
//           handleRefresh={handleRefresh}
//         />
//         <div className="flex flex-wrap items-center gap-3 text-sm text-[#94A3B8]">
//           {statusFilter !== "All" && (
//             <div className="flex items-center gap-1">
//               <span>Status:</span>
//               <span
//                 className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusTextColor(
//                   statusFilter
//                 )} bg-[#111C2F]/80 backdrop-blur-md shadow-sm`}
//               >
//                 {statusFilter === "Successful" && <CheckCircle className="h-3 w-3 text-green-400" />}
//                 {statusFilter === "Failed" && <XCircle className="h-3 w-3 text-red-400" />}
//                 {statusFilter === "Pending" && <Clock className="h-3 w-3 text-yellow-400" />}
//                 {statusFilter}
//               </span>
//             </div>
//           )}
//           {dateRangeFilter !== "All" && (
//             <div className="flex items-center gap-1">
//               <span>Date Range:</span>
//               <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border border-blue-500/40 text-blue-400 bg-[#111C2F]/80 backdrop-blur-md shadow-sm">
//                 <Calendar className="h-3 w-3" />
//                 {dateRangeFilter}
//                 {dateRangeFilter === "Custom" &&
//                   customStartDate instanceof Date &&
//                   !isNaN(customStartDate.getTime()) &&
//                   customEndDate instanceof Date &&
//                   !isNaN(customEndDate.getTime()) &&
//                   `: ${format(customStartDate, "dd/MM/yyyy")} - ${format(customEndDate, "dd/MM/yyyy")}`}
//                 {dateRangeFilter === "Monthly" &&
//                   month instanceof Date &&
//                   !isNaN(month.getTime()) &&
//                   `: ${format(month, "MMM yyyy")}`}
//                 {dateRangeFilter === "Yearly" &&
//                   year instanceof Date &&
//                   !isNaN(year.getTime()) &&
//                   `: ${format(year, "yyyy")}`}
//               </span>
//             </div>
//           )}
//           <div className="flex items-center gap-1">
//             <span>Order:</span>
//             <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#111C2F]/80 backdrop-blur-md shadow-sm border border-[#1E293B]">
//               {sortDirection === "asc" ? "Oldest first" : "Newest first"}
//             </span>
//           </div>
//         </div>
//         <TransactionTable
//           contextLoading={contextLoading}
//           contextError={contextError}
//           refetch={refetch}
//           isSearching={isSearching}
//           paginatedTransactionDisplays={paginatedTransactionDisplays}
//           hasRealError={hasRealError}
//         />
//         <Pagination
//           contextLoading={contextLoading}
//           contextError={contextError}
//           filteredTransactions={filteredTransactions}
//           currentPage={currentPage}
//           totalPages={totalPages}
//           handlePageChange={handlePageChange}
//         />
//       </div>
//     </div>
//   );
// }


// "use client"

// import { useState, useEffect, useMemo, useCallback } from "react"
// import { Input } from "@/components/ui/input"
// import { Search, CheckCircle, XCircle, Clock, Calendar, Loader2, AlertCircle, Copy, RefreshCw, X } from "lucide-react"
// import { LuArrowDownUp } from "react-icons/lu"
// import { GiSettingsKnobs } from "react-icons/gi"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Calendar as CalendarComponent } from "@/components/ui/calendar"
// import { format, parse } from "date-fns"
// import { useTransactions } from "@/context/transaction-context"
// import type { Transaction } from "@/types/transaction"
// import { Skeleton } from "@/components/ui/skeleton"
// import { toast } from "react-toastify"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { TransactionSuccessCard } from "../../TransactionSuccessCard"

// type TransactionDisplay = {
//   id: string
//   date: string
//   description: string
//   amount: string
//   status: "Successful" | "Failed" | "Pending"
//   transactionId: string
//   explorerUrl: string
// }

// type SortDirection = "asc" | "desc"
// type StatusFilter = "All" | "Successful" | "Failed" | "Pending"
// type DateRange = "All" | "Weekly" | "Monthly" | "Yearly" | "Custom"

// const ITEMS_PER_PAGE = 10

// const mapToDisplayFormat = (tx: Transaction): TransactionDisplay => ({
//   id: tx.id,
//   date: tx.date,
//   description: tx.description,
//   amount: `${tx.amountInNaira.toFixed(2)}NGN`,
//   status: tx.status === "completed" ? "Successful" : tx.status === "failed" ? "Failed" : "Pending",
//   transactionId: tx.hash,
//   explorerUrl: tx.explorerUrl,
// })

// // Map TransactionDisplay to TransactionSuccessCard format
// const mapToSuccessCardFormat = (tx: TransactionDisplay, originalTx: Transaction) => ({
//   id: tx.transactionId,
//   billType: originalTx.billType || "Utility Bill",
//   amountInNaira: originalTx.amountInNaira,
//   amountInUSDT: originalTx.amountInUSDT || 0,
//   paymentMethod: originalTx.paymentMethod || "USDC/USDT",
//   date: tx.date,
//   hash: tx.transactionId,
//   gasFee: originalTx.gasFee || "2999Gwei",
//   explorerUrl: tx.explorerUrl,
// })

// const truncateTransactionId = (id: string): string => {
//   if (id.length <= 10) return id
//   return `${id.slice(0, 6)}...${id.slice(-4)}`
// }

// const FilterControls = ({
//   searchQuery,
//   setSearchQuery,
//   sortDirection,
//   handleSortByDate,
//   statusFilter,
//   setStatusFilter,
//   dateRangeFilter,
//   handleDateRangeFilter,
//   showStatusMenu,
//   setShowStatusMenu,
//   showDateRangeMenu,
//   setShowDateRangeMenu,
//   customStartDate,
//   setCustomStartDate,
//   customEndDate,
//   setCustomEndDate,
//   month,
//   setMonth,
//   year,
//   setYear,
//   isSearching,
//   contextLoading,
//   handleSearch,
//   handleRefresh,
// }: {
//   searchQuery: string
//   setSearchQuery: (value: string) => void
//   sortDirection: SortDirection
//   handleSortByDate: () => void
//   statusFilter: StatusFilter
//   setStatusFilter: (status: StatusFilter) => void
//   dateRangeFilter: DateRange
//   handleDateRangeFilter: (range: DateRange) => void
//   showStatusMenu: boolean
//   setShowStatusMenu: (value: boolean) => void
//   showDateRangeMenu: boolean
//   setShowDateRangeMenu: (value: boolean) => void
//   customStartDate: Date | undefined
//   setCustomStartDate: (date: Date | undefined) => void
//   customEndDate: Date | undefined
//   setCustomEndDate: (date: Date | undefined) => void
//   month: Date | undefined
//   setMonth: (date: Date | undefined) => void
//   year: Date | undefined
//   setYear: (date: Date | undefined) => void
//   isSearching: boolean
//   contextLoading: boolean
//   handleSearch: () => void
//   handleRefresh: () => void
// }) => {
//   const getStatusIcon = (status: StatusFilter) => {
//     switch (status) {
//       case "Successful":
//         return <CheckCircle className="h-4 w-4 text-green-400" />
//       case "Failed":
//         return <XCircle className="h-4 w-4 text-red-400" />
//       case "Pending":
//         return <Clock className="h-4 w-4 text-yellow-400" />
//       default:
//         return null
//     }
//   }

//   return (
//     <>
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div className="flex flex-col">
//           <h1 className="text-xl font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text">
//             Transaction History
//           </h1>
//           <p className="text-sm text-[#94A3B8] mt-1">View all your processed transactions</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <button
//                   className="p-2 rounded-lg bg-[#1E293B] text-white hover:bg-gradient-to-r hover:from-[#1E293B] hover:to-[#111C2F] transition-all duration-200 shadow-lg shadow-blue-900/10 transform hover:scale-105"
//                   onClick={handleSortByDate}
//                   disabled={contextLoading}
//                   aria-label="Sort by date"
//                 >
//                   <LuArrowDownUp className="h-5 w-5" />
//                 </button>
//               </TooltipTrigger>
//               <TooltipContent className="bg-[#111C2F] text-white border-[#1E293B]">
//                 Sort by date ({sortDirection === "asc" ? "oldest first" : "newest first"})
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//           <div className="relative">
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <button
//                     className="p-2 rounded-lg bg-[#1E293B] text-white hover:bg-gradient-to-r hover:from-[#1E293B] hover:to-[#111C2F] transition-all duration-200 shadow-lg shadow-blue-900/10 transform hover:scale-105"
//                     onClick={() => setShowDateRangeMenu(!showDateRangeMenu)}
//                     disabled={contextLoading}
//                     aria-label="Filter by date range"
//                   >
//                     <Calendar className="h-5 w-5" />
//                   </button>
//                 </TooltipTrigger>
//                 <TooltipContent className="bg-[#111C2F] text-white border-[#1E293B]">
//                   Filter by date range
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//             {showDateRangeMenu && (
//               <div className="absolute lg:right-0 right-[-50px] mt-2 lg:w-64 bg-[#111C2F]/95 backdrop-blur-lg rounded-lg shadow-xl z-20 border border-[#1E293B]">
//                 {(["All", "Weekly", "Monthly", "Yearly", "Custom"] as DateRange[]).map((range) => (
//                   <div key={range} className="border-b border-[#1E293B] last:border-0">
//                     <button
//                       className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left text-[#94A3B8] hover:bg-[#1E293B] hover:text-white transition-colors ${
//                         dateRangeFilter === range ? "bg-[#1E293B] text-white" : ""
//                       }`}
//                       onClick={() => handleDateRangeFilter(range)}
//                     >
//                       {range}
//                     </button>
//                     {range === "Custom" && dateRangeFilter === "Custom" && (
//                       <div className="mx-auto p-3 bg-[#182235] flex flex-col gap-3">
//                         <div>
//                           <label className="text-sm text-[#94A3B8]">Start Date</label>
//                           <Popover>
//                             <PopoverTrigger asChild>
//                               <Button
//                                 variant="outline"
//                                 className="w-full justify-center text-left bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B]"
//                               >
//                                 {customStartDate instanceof Date && !isNaN(customStartDate.getTime()) ? (
//                                   format(customStartDate, "PPP")
//                                 ) : (
//                                   <span>Pick start date</span>
//                                 )}
//                               </Button>
//                             </PopoverTrigger>
//                             <PopoverContent className="w-auto p-0 bg-[#111C2F] border-[#1E293B]">
//                               <CalendarComponent
//                                 mode="single"
//                                 selected={customStartDate}
//                                 onSelect={setCustomStartDate}
//                                 className="bg-[#111C2F] text-white border-[#1E293B]"
//                               />
//                             </PopoverContent>
//                           </Popover>
//                         </div>
//                         <div>
//                           <label className="text-sm text-[#94A3B8]">End Date</label>
//                           <Popover>
//                             <PopoverTrigger asChild>
//                               <Button
//                                 variant="outline"
//                                 className="lg:w-full justify-start text-left bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B]"
//                               >
//                                 {customEndDate instanceof Date && !isNaN(customEndDate.getTime()) ? (
//                                   format(customEndDate, "PPP")
//                                 ) : (
//                                   <span>Pick end date</span>
//                                 )}
//                               </Button>
//                             </PopoverTrigger>
//                             <PopoverContent className="w-auto p-0 bg-[#111C2F] border-[#1E293B]">
//                               <CalendarComponent
//                                 mode="single"
//                                 selected={customEndDate}
//                                 onSelect={setCustomEndDate}
//                                 className="bg-[#111C2F] text-white border-[#1E293B]"
//                               />
//                             </PopoverContent>
//                           </Popover>
//                         </div>
//                         <Button
//                           className="bg-gradient-to-r from-blue-500 hover:from-blue-600 hover:to-indigo-700 text-white border-none shadow-lg shadow-blue-900/20 transform hover:scale-105"
//                           onClick={() => setShowDateRangeMenu(false)}
//                         >
//                           Apply
//                         </Button>
//                       </div>
//                     )}
//                     {range === "Monthly" && dateRangeFilter === "Monthly" && (
//                       <div className="p-3 bg-[#182235]">
//                         <Popover>
//                           <PopoverTrigger asChild>
//                             <Button
//                               variant="outline"
//                               className="w-full justify-start text-left bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B]"
//                             >
//                               {month instanceof Date && !isNaN(month.getTime()) ? (
//                                 format(month, "MMMM yyyy")
//                               ) : (
//                                 <span>Select month</span>
//                               )}
//                             </Button>
//                           </PopoverTrigger>
//                           <PopoverContent className="w-auto p-0 bg-[#111C2F] border-[#1E293B]">
//                             <CalendarComponent
//                               mode="single"
//                               selected={month}
//                               onSelect={setMonth}
//                               className="bg-[#111C2F] text-white border-[#1E293B]"
//                             />
//                           </PopoverContent>
//                         </Popover>
//                       </div>
//                     )}
//                     {range === "Yearly" && dateRangeFilter === "Yearly" && (
//                       <div className="p-3 bg-[#182235]">
//                         <Popover>
//                           <PopoverTrigger asChild>
//                             <Button
//                               variant="outline"
//                               className="w-full justify-start text-left bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B]"
//                             >
//                               {year instanceof Date && !isNaN(year.getTime()) ? (
//                                 format(year, "yyyy")
//                               ) : (
//                                 <span>Select year</span>
//                               )}
//                             </Button>
//                           </PopoverTrigger>
//                           <PopoverContent className="w-auto p-0 bg-[#111C2F] border-[#1E293B]">
//                             <CalendarComponent
//                               mode="single"
//                               selected={year}
//                               onSelect={setYear}
//                               className="bg-[#111C2F] text-white border-[#1E293B]"
//                             />
//                           </PopoverContent>
//                         </Popover>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//           <div className="relative">
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <button
//                     className="p-2 rounded-lg bg-[#1E293B] text-white hover:bg-gradient-to-r hover:from-[#1E293B] hover:to-[#111C2F] transition-all duration-200 shadow-lg shadow-blue-900/10 transform hover:scale-105"
//                     onClick={() => setShowStatusMenu(!showStatusMenu)}
//                     disabled={contextLoading}
//                     aria-label="Filter by status"
//                   >
//                     <GiSettingsKnobs className="h-5 w-5" />
//                   </button>
//                 </TooltipTrigger>
//                 <TooltipContent className="bg-[#111C2F] text-white border-[#1E293B]">Filter by status</TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//             {showStatusMenu && (
//               <div className="absolute right-[0px] lg:right-0 mt-2 lg:w-48 bg-[#111C2F]/95 backdrop-blur-lg rounded-lg shadow-xl z-10 border border-[#1E293B]">
//                 {(["All", "Successful", "Failed", "Pending"] as StatusFilter[]).map((status) => (
//                   <button
//                     key={status}
//                     className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left text-[#94A3B8] hover:bg-[#1E293B] hover:text-white transition-colors ${
//                       statusFilter === status ? "bg-[#1E293B] text-white" : ""
//                     }`}
//                     onClick={() => {
//                       setStatusFilter(status)
//                       setShowStatusMenu(false)
//                     }}
//                   >
//                     {status !== "All" && getStatusIcon(status)}
//                     {status}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <button
//                   className="p-2 rounded-lg bg-[#1E293B] text-white hover:bg-gradient-to-r hover:from-[#1E293B] hover:to-[#111C2F] transition-all duration-200 shadow-lg shadow-blue-900/10 transform hover:scale-105"
//                   onClick={handleRefresh}
//                   disabled={contextLoading}
//                   aria-label="Refresh transactions"
//                 >
//                   <RefreshCw className="h-5 w-5" />
//                 </button>
//               </TooltipTrigger>
//               <TooltipContent className="bg-[#111C2F] text-white border-[#1E293B]">Refresh transactions</TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         </div>
//       </div>
//       <div className="flex flex-col sm:flex-row items-center gap-3">
//         <div className="relative w-full">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
//           <Input
//             placeholder="Search transactions..."
//             className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#111C2F]/90 backdrop-blur-md border border-[#1E293B] text-white placeholder-[#94A3B8] focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 shadow-lg shadow-blue-900/5"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//             disabled={contextLoading}
//           />
//         </div>
//         <Button
//           className="bg-[#1D4ED8] hover:bg-blue-600 text-white w-full sm:w-auto transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-900/20 font-medium"
//           onClick={handleSearch}
//           disabled={isSearching || contextLoading}
//         >
//           {isSearching ? (
//             <div className="flex items-center gap-2">
//               <Loader2 className="h-4 w-4 animate-spin" />
//               <span>Searching...</span>
//             </div>
//           ) : (
//             "Search"
//           )}
//         </Button>
//       </div>
//     </>
//   )
// }

// const TransactionTable = ({
//   contextLoading,
//   contextError,
//   refetch,
//   isSearching,
//   paginatedTransactionDisplays,
//   hasRealError,
//   onTransactionClick,
// }: {
//   contextLoading: boolean
//   contextError: string | null
//   refetch: () => void
//   isSearching: boolean
//   paginatedTransactionDisplays: TransactionDisplay[]
//   hasRealError: boolean
//   onTransactionClick: (transaction: TransactionDisplay) => void
// }) => {
//   const getStatusIcon = (status: StatusFilter) => {
//     switch (status) {
//       case "Successful":
//         return <CheckCircle className="h-4 w-4 text-green-400" />
//       case "Failed":
//         return <XCircle className="h-4 w-4 text-red-400" />
//       case "Pending":
//         return <Clock className="h-4 w-4 text-yellow-400" />
//       default:
//         return null
//     }
//   }

//   const getStatusTextColor = (status: string) => {
//     switch (status) {
//       case "Successful":
//         return "text-green-400"
//       case "Failed":
//         return "text-red-400"
//       case "Pending":
//         return "text-yellow-400"
//       default:
//         return "text-white"
//     }
//   }

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text).then(() => {
//       toast.success("Transaction ID copied to clipboard!", {
//         position: "bottom-right",
//         autoClose: 2000,
//         hideProgressBar: true,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         theme: "dark",
//       })
//     })
//   }

//   const TableRowSkeleton = () => (
//     <TableRow className="bg-[#111C2F] border-b border-[#1E293B] animate-pulse">
//       <TableCell className="py-4">
//         <Skeleton className="h-4 w-20 bg-[#1E293B]" />
//       </TableCell>
//       <TableCell className="py-4">
//         <Skeleton className="h-4 w-32 bg-[#1E293B]" />
//       </TableCell>
//       <TableCell className="py-4">
//         <Skeleton className="h-4 w-24 bg-[#1E293B]" />
//       </TableCell>
//       <TableCell className="py-4">
//         <div className="flex items-center gap-2">
//           <Skeleton className="h-4 w-4 rounded-full bg-[#1E293B]" />
//           <Skeleton className="h-4 w-16 bg-[#1E293B]" />
//         </div>
//       </TableCell>
//       <TableCell className="py-4">
//         <Skeleton className="h-4 w-32 bg-[#1E293B]" />
//       </TableCell>
//     </TableRow>
//   )

//   console.log("TransactionTable: contextLoading =", contextLoading)

//   return (
//     <div className="relative flex-1 min-h-0 overflow-x-hidden hover:overflow-x-visible overflow-y-auto border border-[#1E293B] rounded-lg bg-[#0A1525]/60 backdrop-blur-sm table-container shadow-xl shadow-blue-900/5 transition-all duration-300">
//       {contextLoading && (
//         <div className="absolute inset-0 bg-[#0A1525]/90 backdrop-blur-md flex items-center justify-center z-50">
//           <div className="flex flex-col items-center gap-4 p-6 bg-[#111C2F]/80 rounded-lg shadow-2xl shadow-blue-900/20">
//             <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
//             <p className="text-xl font-semibold text-white">Fetching transactions...</p>
//           </div>
//         </div>
//       )}
//       <Table className="w-full">
//         <TableHeader className="bg-[#0A1525] sticky top-0 z-10 border-b border-[#1E293B]">
//           <TableRow className="hover:bg-[#0A1525]">
//             <TableHead className="w-[120px] text-white font-semibold py-4 text-sm">Date</TableHead>
//             <TableHead className="text-white font-semibold py-4 text-sm">Description</TableHead>
//             <TableHead className="text-white font-semibold py-4 text-sm">Amount</TableHead>
//             <TableHead className="text-white font-semibold py-4 text-sm">Status</TableHead>
//             <TableHead className="text-white font-semibold py-4 text-sm">Transaction ID</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {hasRealError ? (
//             <TableRow className="bg-[#111C2F] hover:bg-[#111C2F]">
//               <TableCell colSpan={5} className="py-8 text-center text-[#94A3B8]">
//                 <div className="flex flex-col items-center justify-center gap-4">
//                   <AlertCircle className="h-10 w-10 text-red-400" />
//                   <p className="text-lg font-medium text-white">Failed to load transactions</p>
//                   <p className="text-sm text-[#94A3B8]">{contextError}</p>
//                   <Button
//                     className="bg-[#1D4ED8] hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-900/20 font-medium"
//                     onClick={() => {
//                       refetch()
//                       toast.info("Retrying to fetch transactions...", {
//                         position: "bottom-right",
//                         autoClose: 3000,
//                         hideProgressBar: false,
//                         closeOnClick: true,
//                         pauseOnHover: true,
//                         draggable: true,
//                         theme: "dark",
//                       })
//                     }}
//                   >
//                     Retry
//                   </Button>
//                 </div>
//               </TableCell>
//             </TableRow>
//           ) : contextLoading ? (
//             Array(5)
//               .fill(0)
//               .map((_, index) => <TableRowSkeleton key={index} />)
//           ) : isSearching ? (
//             <TableRow className="bg-[#111C2F] hover:bg-[#111C2F]">
//               <TableCell colSpan={5} className="py-8 text-center text-[#94A3B8]">
//                 <div className="flex flex-col items-center justify-center gap-3">
//                   <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
//                   <p className="text-lg font-medium">Searching transactions...</p>
//                 </div>
//               </TableCell>
//             </TableRow>
//           ) : paginatedTransactionDisplays.length > 0 ? (
//             paginatedTransactionDisplays.map((tx, index) => (
//               <TableRow
//                 key={index}
//                 className="bg-[#111C2F] border-b border-[#1E293B] hover:bg-[#1E293B]/80 duration-200 cursor-pointer"
//                 onClick={() => onTransactionClick(tx)}
//               >
//                 <TableCell className="font-medium text-white py-4 text-sm">{tx.date}</TableCell>
//                 <TableCell className="text-[#94A3B8] py-4 text-sm">{tx.description}</TableCell>
//                 <TableCell className="text-white font-medium py-4 text-sm">{tx.amount}</TableCell>
//                 <TableCell className="py-4">
//                   <div className={`flex items-center gap-2 ${getStatusTextColor(tx.status)} text-sm`}>
//                     {getStatusIcon(tx.status as StatusFilter)}
//                     <span>{tx.status}</span>
//                   </div>
//                 </TableCell>
//                 <TableCell className="py-4">
//                   <div className="flex items-center">
//                     <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <a
//                             href={tx.explorerUrl}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-400 hover:text-blue-300 underline-offset-4 transition-colors font-mono text-sm"
//                             onClick={(e) => {
//                               e.stopPropagation()
//                               toast.info("Opening transaction in explorer", {
//                                 position: "bottom-right",
//                                 autoClose: 2000,
//                                 hideProgressBar: true,
//                                 closeOnClick: true,
//                                 pauseOnHover: true,
//                                 theme: "dark",
//                               })
//                             }}
//                           >
//                             {truncateTransactionId(tx.transactionId)}
//                           </a>
//                         </TooltipTrigger>
//                         <TooltipContent className="bg-[#111C2F] text-white border-[#1E293B] max-w-xs break-all font-mono">
//                           {tx.transactionId}
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                     <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <button
//                             className="p-1 rounded-full bg-[#1E293B] text-white hover:bg-blue-500/50 transition-colors"
//                             onClick={(e) => {
//                               e.stopPropagation()
//                               copyToClipboard(tx.transactionId)
//                             }}
//                           >
//                             <Copy className="h-4 w-4" />
//                           </button>
//                         </TooltipTrigger>
//                         <TooltipContent className="bg-[#111C2F] text-white border-[#1E293B]">
//                           Copy Transaction ID
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow className="bg-[#111C2F] hover:bg-[#111C2F]">
//               <TableCell colSpan={5} className="py-8 text-center text-[#94A3B8]">
//                 <div className="flex flex-col items-center justify-center gap-2">
//                   <Search className="h-8 w-8 opacity-50" />
//                   <p className="text-lg font-medium">No transactions found</p>
//                   <p className="text-sm">Try adjusting your search or filters</p>
//                 </div>
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   )
// }

// const Pagination = ({
//   contextLoading,
//   contextError,
//   filteredTransactions,
//   currentPage,
//   totalPages,
//   handlePageChange,
// }: {
//   contextLoading: boolean
//   contextError: string | null
//   filteredTransactions: TransactionDisplay[]
//   currentPage: number
//   totalPages: number
//   handlePageChange: (page: number) => void
// }) => (
//   <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 sm:px-6 bg-[#0A1525] border-t border-[#1E293B] rounded-b-lg shadow-lg">
//     <div className="text-sm text-[#94A3B8]">
//       {contextLoading ? (
//         <div className="flex items-center gap-2">
//           <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
//           <span>Loading transactions...</span>
//         </div>
//       ) : contextError ? (
//         "Error loading transactions"
//       ) : filteredTransactions.length > 0 ? (
//         `Page ${currentPage} of ${totalPages} (${filteredTransactions.length} transactions total)`
//       ) : (
//         "No transactions found"
//       )}
//     </div>
//     {!contextLoading && !contextError && filteredTransactions.length > 0 && (
//       <div className="flex items-center gap-2">
//         <Button
//           variant="outline"
//           size="sm"
//           className="bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B] disabled:opacity-50 transform hover:scale-105 transition-all"
//           onClick={() => handlePageChange(1)}
//           disabled={currentPage === 1}
//           aria-label="First page"
//         >
//           First
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           className="bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B] disabled:opacity-50 transform hover:scale-105 transition-all"
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           aria-label="Previous page"
//         >
//           Prev
//         </Button>
//         <div className="flex items-center gap-1">
//           {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//             const page = i + Math.max(1, currentPage - 2)
//             if (page > totalPages) return null
//             return (
//               <Button
//                 key={page}
//                 variant={currentPage === page ? "default" : "outline"}
//                 size="sm"
//                 className={`${
//                   currentPage === page
//                     ? "bg-[#1D4ED8] text-white"
//                     : "bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B]"
//                 } transform hover:scale-105 transition-all`}
//                 onClick={() => handlePageChange(page)}
//                 aria-label={`Page ${page}`}
//               >
//                 {page}
//               </Button>
//             )
//           })}
//         </div>
//         <Button
//           variant="outline"
//           size="sm"
//           className="bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B] disabled:opacity-50 transform hover:scale-105 transition-all"
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           aria-label="Next page"
//         >
//           Next
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           className="bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B] disabled:opacity-50 transform hover:scale-105 transition-all"
//           onClick={() => handlePageChange(totalPages)}
//           disabled={currentPage === totalPages}
//           aria-label="Last page"
//         >
//           Last
//         </Button>
//       </div>
//     )}
//   </div>
// )

// export default function DashboardTransactions() {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
//   const [statusFilter, setStatusFilter] = useState<StatusFilter>("All")
//   const [dateRangeFilter, setDateRangeFilter] = useState<DateRange>("All")
//   const [showStatusMenu, setShowStatusMenu] = useState(false)
//   const [showDateRangeMenu, setShowDateRangeMenu] = useState(false)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined)
//   const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined)
//   const [month, setMonth] = useState<Date | undefined>(new Date())
//   const [year, setYear] = useState<Date | undefined>(new Date())
//   const { transactions, loading: contextLoading, error: contextError, refetch } = useTransactions()
//   const [filteredTransactions, setFilteredTransactions] = useState<TransactionDisplay[]>([])
//   const [displayTransactions, setDisplayTransactions] = useState<TransactionDisplay[]>([])
//   const [isSearching, setIsSearching] = useState(false)

//   // Modal state
//   const [selectedTransaction, setSelectedTransaction] = useState<TransactionDisplay | null>(null)
//   const [showModal, setShowModal] = useState(false)

//   const hasRealError = useMemo(() => {
//     return !!(contextError && !contextError.toLowerCase().includes("no transactions"))
//   }, [contextError])

//   useEffect(() => {
//     console.log(
//       "DashboardTransactions: contextLoading =",
//       contextLoading,
//       "contextError =",
//       contextError,
//       "transactions =",
//       transactions.length,
//     )
//     if (contextLoading) {
//       console.log("Loading state is active, should see overlay in TransactionTable")
//     }
//     if (hasRealError) {
//       toast.error(`Failed to load transactions: ${contextError}`, {
//         position: "bottom-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         theme: "dark",
//       })
//     }
//     if (!contextLoading && !contextError && transactions.length === 0) {
//       console.log("No transactions found, should render empty state")
//     }
//   }, [contextLoading, contextError, hasRealError, transactions.length])

//   useEffect(() => {
//     if (transactions.length > 0) {
//       const formatted = transactions.map(mapToDisplayFormat)
//       setFilteredTransactions(formatted)
//       setDisplayTransactions(formatted)
//       console.log("Transactions loaded:", transactions.length)
//     } else {
//       setFilteredTransactions([])
//       setDisplayTransactions([])
//       console.log("No transactions available")
//     }
//   }, [transactions])

//   const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
//   const paginatedTransactionDisplays = useMemo(
//     () => filteredTransactions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
//     [filteredTransactions, currentPage],
//   )

//   const applyDateRangeFilter = useCallback(
//     (data: TransactionDisplay[], range: DateRange) => {
//       if (range === "All") return data

//       const currentDate = new Date()
//       const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())

//       return data.filter((tx) => {
//         const [day, txMonth, txYear] = tx.date.split("/").map(Number)
//         const txDate = new Date(txYear, txMonth - 1, day)

//         switch (range) {
//           case "Weekly":
//             const weekAgo = new Date(today)
//             weekAgo.setDate(weekAgo.getDate() - 7)
//             return txDate >= weekAgo && txDate <= today

//           case "Monthly":
//             if (month instanceof Date && !isNaN(month.getTime())) {
//               const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
//               const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0) // Last day of the month
//               return txDate >= startOfMonth && txDate <= endOfMonth
//             }
//             return false

//           case "Yearly":
//             if (year instanceof Date && !isNaN(year.getTime())) {
//               const startOfYear = new Date(year.getFullYear(), 0, 1)
//               const endOfYear = new Date(year.getFullYear(), 11, 31)
//               return txDate >= startOfYear && txDate <= endOfYear
//             }
//             return false

//           case "Custom":
//             if (
//               customStartDate instanceof Date &&
//               !isNaN(customStartDate.getTime()) &&
//               customEndDate instanceof Date &&
//               !isNaN(customEndDate.getTime())
//             ) {
//               return txDate >= customStartDate && txDate <= customEndDate
//             }
//             return false

//           default:
//             return true
//         }
//       })
//     },
//     [customStartDate, customEndDate, month, year],
//   )

//   const applyFilters = useCallback(
//     (status: StatusFilter, direction: SortDirection, dateRange: DateRange) => {
//       let results: TransactionDisplay[] = [...displayTransactions]

//       if (status !== "All") {
//         results = results.filter((tx) => tx.status === status)
//       }

//       results = applyDateRangeFilter(results, dateRange)

//       results.sort((a, b) => {
//         const parseDate = (dateStr: string): Date => {
//           try {
//             const parts = dateStr.split("/")
//             if (parts.length !== 3) throw new Error("Invalid date format")
//             const day = parts[0].padStart(2, "0")
//             const month = parts[1].padStart(2, "0")
//             const year = parts[2]
//             const normalizedDate = `${day}/${month}/${year}`
//             const date = parse(normalizedDate, "dd/MM/yyyy", new Date())
//             if (isNaN(date.getTime())) {
//               console.warn(`Invalid date parsed: ${dateStr} -> ${normalizedDate}`)
//               return new Date(0)
//             }
//             return date
//           } catch (error) {
//             console.warn(`Failed to parse date: ${dateStr}`, error)
//             return new Date(0)
//           }
//         }

//         const dateA = parseDate(a.date)
//         const dateB = parseDate(b.date)

//         const dateDiff = direction === "desc" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
//         if (dateDiff !== 0) return dateDiff

//         const amountA = Number.parseFloat(a.amount.replace("NGN", ""))
//         const amountB = Number.parseFloat(b.amount.replace("NGN", ""))
//         return direction === "desc" ? amountB - amountA : amountA - amountB
//       })

//       setFilteredTransactions(results)
//       setCurrentPage(1)
//     },
//     [displayTransactions, applyDateRangeFilter],
//   )

//   const handleSortByDate = useCallback(() => {
//     const newDirection = sortDirection === "asc" ? "desc" : "asc"
//     setSortDirection(newDirection)
//     setCurrentPage(1)
//   }, [sortDirection])

//   const handleDateRangeFilter = useCallback((range: DateRange) => {
//     setDateRangeFilter(range)
//     if (range !== "Custom") {
//       setCustomStartDate(undefined)
//       setCustomEndDate(undefined)
//     }
//     setShowDateRangeMenu(false)
//     setCurrentPage(1)
//   }, [])

//   const handleSearch = useCallback(() => {
//     setIsSearching(true)
//     setTimeout(() => {
//       if (!searchQuery.trim()) {
//         applyFilters(statusFilter, sortDirection, dateRangeFilter)
//         setIsSearching(false)
//         return
//       }

//       const query = searchQuery.toLowerCase()
//       const results = displayTransactions.filter((tx) =>
//         Object.values(tx).some((value) => typeof value === "string" && value.toLowerCase().includes(query)),
//       )

//       let filteredResults: TransactionDisplay[] =
//         statusFilter === "All" ? results : results.filter((tx) => tx.status === statusFilter)

//       filteredResults = applyDateRangeFilter(filteredResults, dateRangeFilter)

//       setFilteredTransactions(filteredResults)
//       setCurrentPage(1)
//       setIsSearching(false)
//     }, 500)
//   }, [
//     searchQuery,
//     displayTransactions,
//     statusFilter,
//     dateRangeFilter,
//     applyDateRangeFilter,
//     applyFilters,
//     sortDirection,
//   ])

//   const handlePageChange = useCallback(
//     (page: number) => {
//       if (page >= 1 && page <= totalPages) {
//         setCurrentPage(page)
//         document.querySelector(".table-container")?.scrollTo(0, 0)
//       }
//     },
//     [totalPages],
//   )

//   const handleRefresh = useCallback(() => {
//     refetch()
//     toast.info("Retrying to fetch transactions...", {
//       position: "bottom-right",
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       theme: "dark",
//     })
//   }, [refetch])

//   // Handle transaction click
//   const handleTransactionClick = useCallback((transaction: TransactionDisplay) => {
//     setSelectedTransaction(transaction)
//     setShowModal(true)
//   }, [])

//   // Handle modal close
//   const handleCloseModal = useCallback(() => {
//     setShowModal(false)
//     setSelectedTransaction(null)
//   }, [])

//   useEffect(() => {
//     applyFilters(statusFilter, sortDirection, dateRangeFilter)
//   }, [statusFilter, sortDirection, dateRangeFilter, customStartDate, customEndDate, month, year, applyFilters])

//   const getStatusTextColor = (status: string) => {
//     switch (status) {
//       case "Successful":
//         return "text-green-400"
//       case "Failed":
//         return "text-red-400"
//       case "Pending":
//         return "text-yellow-400"
//       default:
//         return "text-white"
//     }
//   }

//   // Get the original transaction for the success card
//   const getOriginalTransaction = (transactionDisplay: TransactionDisplay) => {
//     return transactions.find((tx) => tx.hash === transactionDisplay.transactionId)
//   }

//   return (
//     <div className="flex flex-col h-full w-full mx-auto bg-[#0f172a] min-h-0 overflow-hidden">
//       <div className="flex-1 flex flex-col p-4 sm:p-6 gap-4 font-sans overflow-hidden">
//         <FilterControls
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           sortDirection={sortDirection}
//           handleSortByDate={handleSortByDate}
//           statusFilter={statusFilter}
//           setStatusFilter={setStatusFilter}
//           dateRangeFilter={dateRangeFilter}
//           handleDateRangeFilter={handleDateRangeFilter}
//           showStatusMenu={showStatusMenu}
//           setShowStatusMenu={setShowStatusMenu}
//           showDateRangeMenu={showDateRangeMenu}
//           setShowDateRangeMenu={setShowDateRangeMenu}
//           customStartDate={customStartDate}
//           setCustomStartDate={setCustomStartDate}
//           customEndDate={customEndDate}
//           setCustomEndDate={setCustomEndDate}
//           month={month}
//           setMonth={setMonth}
//           year={year}
//           setYear={setYear}
//           isSearching={isSearching}
//           contextLoading={contextLoading}
//           handleSearch={handleSearch}
//           handleRefresh={handleRefresh}
//         />
//         <div className="flex flex-wrap items-center gap-3 text-sm text-[#94A3B8]">
//           {statusFilter !== "All" && (
//             <div className="flex items-center gap-1">
//               <span>Status:</span>
//               <span
//                 className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusTextColor(
//                   statusFilter,
//                 )} bg-[#111C2F]/80 backdrop-blur-md shadow-sm`}
//               >
//                 {statusFilter === "Successful" && <CheckCircle className="h-3 w-3 text-green-400" />}
//                 {statusFilter === "Failed" && <XCircle className="h-3 w-3 text-red-400" />}
//                 {statusFilter === "Pending" && <Clock className="h-3 w-3 text-yellow-400" />}
//                 {statusFilter}
//               </span>
//             </div>
//           )}
//           {dateRangeFilter !== "All" && (
//             <div className="flex items-center gap-1">
//               <span>Date Range:</span>
//               <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border border-blue-500/40 text-blue-400 bg-[#111C2F]/80 backdrop-blur-md shadow-sm">
//                 <Calendar className="h-3 w-3" />
//                 {dateRangeFilter}
//                 {dateRangeFilter === "Custom" &&
//                   customStartDate instanceof Date &&
//                   !isNaN(customStartDate.getTime()) &&
//                   customEndDate instanceof Date &&
//                   !isNaN(customEndDate.getTime()) &&
//                   `: ${format(customStartDate, "dd/MM/yyyy")} - ${format(customEndDate, "dd/MM/yyyy")}`}
//                 {dateRangeFilter === "Monthly" &&
//                   month instanceof Date &&
//                   !isNaN(month.getTime()) &&
//                   `: ${format(month, "MMM yyyy")}`}
//                 {dateRangeFilter === "Yearly" &&
//                   year instanceof Date &&
//                   !isNaN(year.getTime()) &&
//                   `: ${format(year, "yyyy")}`}
//               </span>
//             </div>
//           )}
//           <div className="flex items-center gap-1">
//             <span>Order:</span>
//             <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#111C2F]/80 backdrop-blur-md shadow-sm border border-[#1E293B]">
//               {sortDirection === "asc" ? "Oldest first" : "Newest first"}
//             </span>
//           </div>
//         </div>
//         <TransactionTable
//           contextLoading={contextLoading}
//           contextError={contextError}
//           refetch={refetch}
//           isSearching={isSearching}
//           paginatedTransactionDisplays={paginatedTransactionDisplays}
//           hasRealError={hasRealError}
//           onTransactionClick={handleTransactionClick}
//         />
//         <Pagination
//           contextLoading={contextLoading}
//           contextError={contextError}
//           filteredTransactions={filteredTransactions}
//           currentPage={currentPage}
//           totalPages={totalPages}
//           handlePageChange={handlePageChange}
//         />
//       </div>

//       {/* Transaction Success Card Modal */}
//       {showModal && selectedTransaction && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="relative max-w-sm w-full">
//             <button
//               onClick={handleCloseModal}
//               className="absolute -top-2 -right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
//               aria-label="Close modal"
//             >
//               <X className="h-4 w-4" />
//             </button>
//             <TransactionSuccessCard
//               transaction={mapToSuccessCardFormat(
//                 selectedTransaction,
//                 getOriginalTransaction(selectedTransaction) || ({} as Transaction),
//               )}
//               onDownload={() => {
//                 console.log("Download receipt for transaction:", selectedTransaction.id)
//                 toast.success("Receipt download started!", {
//                   position: "bottom-right",
//                   autoClose: 2000,
//                   theme: "dark",
//                 })
//               }}
//               onReturn={handleCloseModal}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


"use client"

import type React from "react"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Search, CheckCircle, XCircle, Clock, Calendar, Loader2, AlertCircle, Copy, RefreshCw } from "lucide-react"
import { LuArrowDownUp } from "react-icons/lu"
import { GiSettingsKnobs } from "react-icons/gi"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, parse } from "date-fns"
import { useTransactions } from "@/context/transaction-context"
import type { Transaction } from "@/types/transaction"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "react-toastify"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TransactionSuccessCard } from "../../TransactionSuccessCard"

type TransactionDisplay = {
  id: string
  date: string
  description: string
  amount: string
  status: "Successful" | "Failed" | "Pending"
  transactionId: string
  explorerUrl: string
}

type SortDirection = "asc" | "desc"
type StatusFilter = "All" | "Successful" | "Failed" | "Pending"
type DateRange = "All" | "Weekly" | "Monthly" | "Yearly" | "Custom"

const ITEMS_PER_PAGE = 10

const mapToDisplayFormat = (tx: Transaction): TransactionDisplay => ({
  id: tx.id,
  date: tx.date,
  description: tx.description,
  amount: `${tx.amountInNaira.toFixed(2)}NGN`,
  status: tx.status === "completed" ? "Successful" : tx.status === "failed" ? "Failed" : "Pending",
  transactionId: tx.hash,
  explorerUrl: tx.explorerUrl,
})

// Map TransactionDisplay to TransactionSuccessCard format
const mapToSuccessCardFormat = (tx: TransactionDisplay, originalTx: Transaction) => ({
  id: tx.transactionId, // Use the full transaction hash as ID
  billType: originalTx.billType || "Utility Bill",
  amountInNaira: originalTx.amountInNaira,
  amountInUSDT: originalTx.amountInUSDT || 0,
  paymentMethod: originalTx.paymentMethod || "USDC/USDT",
  date: tx.date,
  hash: tx.transactionId, // Use the full transaction hash
  gasFee: originalTx.gasFee || "2999Gwei",
  explorerUrl: tx.explorerUrl,
})

const truncateTransactionId = (id: string): string => {
  if (id.length <= 10) return id
  return `${id.slice(0, 6)}...${id.slice(-4)}`
}

const FilterControls = ({
  searchQuery,
  setSearchQuery,
  sortDirection,
  handleSortByDate,
  statusFilter,
  setStatusFilter,
  dateRangeFilter,
  handleDateRangeFilter,
  showStatusMenu,
  setShowStatusMenu,
  showDateRangeMenu,
  setShowDateRangeMenu,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  month,
  setMonth,
  year,
  setYear,
  isSearching,
  contextLoading,
  handleSearch,
  handleRefresh,
}: {
  searchQuery: string
  setSearchQuery: (value: string) => void
  sortDirection: SortDirection
  handleSortByDate: () => void
  statusFilter: StatusFilter
  setStatusFilter: (status: StatusFilter) => void
  dateRangeFilter: DateRange
  handleDateRangeFilter: (range: DateRange) => void
  showStatusMenu: boolean
  setShowStatusMenu: (value: boolean) => void
  showDateRangeMenu: boolean
  setShowDateRangeMenu: (value: boolean) => void
  customStartDate: Date | undefined
  setCustomStartDate: (date: Date | undefined) => void
  customEndDate: Date | undefined
  setCustomEndDate: (date: Date | undefined) => void
  month: Date | undefined
  setMonth: (date: Date | undefined) => void
  year: Date | undefined
  setYear: (date: Date | undefined) => void
  isSearching: boolean
  contextLoading: boolean
  handleSearch: () => void
  handleRefresh: () => void
}) => {
  const getStatusIcon = (status: StatusFilter) => {
    switch (status) {
      case "Successful":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "Failed":
        return <XCircle className="h-4 w-4 text-red-400" />
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-400" />
      default:
        return null
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text">
            Transaction History
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">View all your processed transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-2 rounded-lg bg-[#1E293B] text-white hover:bg-gradient-to-r hover:from-[#1E293B] hover:to-[#111C2F] transition-all duration-200 shadow-lg shadow-blue-900/10 transform hover:scale-105"
                  onClick={handleSortByDate}
                  disabled={contextLoading}
                  aria-label="Sort by date"
                >
                  <LuArrowDownUp className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#111C2F] text-white border-[#1E293B]">
                Sort by date ({sortDirection === "asc" ? "oldest first" : "newest first"})
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="p-2 rounded-lg bg-[#1E293B] text-white hover:bg-gradient-to-r hover:from-[#1E293B] hover:to-[#111C2F] transition-all duration-200 shadow-lg shadow-blue-900/10 transform hover:scale-105"
                    onClick={() => setShowDateRangeMenu(!showDateRangeMenu)}
                    disabled={contextLoading}
                    aria-label="Filter by date range"
                  >
                    <Calendar className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#111C2F] text-white border-[#1E293B]">
                  Filter by date range
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {showDateRangeMenu && (
              <div className="absolute lg:right-0 right-[-50px] mt-2 lg:w-64 bg-[#111C2F]/95 backdrop-blur-lg rounded-lg shadow-xl z-20 border border-[#1E293B]">
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
                      <div className="mx-auto p-3 bg-[#182235] flex flex-col gap-3">
                        <div>
                          <label className="text-sm text-[#94A3B8]">Start Date</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-center text-left bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B]"
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
                                onSelect={setCustomStartDate}
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
                                className="lg:w-full justify-start text-left bg-[#111C2F] border-[#1E293B] text-white hover:bg-[#1E293B]"
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
                                onSelect={setCustomEndDate}
                                className="bg-[#111C2F] text-white border-[#1E293B]"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <Button
                          className="bg-gradient-to-r from-blue-500 hover:from-blue-600 hover:to-indigo-700 text-white border-none shadow-lg shadow-blue-900/20 transform hover:scale-105"
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
                              onSelect={setMonth}
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
                              onSelect={setYear}
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
          <div className="relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="p-2 rounded-lg bg-[#1E293B] text-white hover:bg-gradient-to-r hover:from-[#1E293B] hover:to-[#111C2F] transition-all duration-200 shadow-lg shadow-blue-900/10 transform hover:scale-105"
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                    disabled={contextLoading}
                    aria-label="Filter by status"
                  >
                    <GiSettingsKnobs className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#111C2F] text-white border-[#1E293B]">Filter by status</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {showStatusMenu && (
              <div className="absolute right-[0px] lg:right-0 mt-2 lg:w-48 bg-[#111C2F]/95 backdrop-blur-lg rounded-lg shadow-xl z-10 border border-[#1E293B]">
                {(["All", "Successful", "Failed", "Pending"] as StatusFilter[]).map((status) => (
                  <button
                    key={status}
                    className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left text-[#94A3B8] hover:bg-[#1E293B] hover:text-white transition-colors ${
                      statusFilter === status ? "bg-[#1E293B] text-white" : ""
                    }`}
                    onClick={() => {
                      setStatusFilter(status)
                      setShowStatusMenu(false)
                    }}
                  >
                    {status !== "All" && getStatusIcon(status)}
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-2 rounded-lg bg-[#1E293B] text-white hover:bg-gradient-to-r hover:from-[#1E293B] hover:to-[#111C2F] transition-all duration-200 shadow-lg shadow-blue-900/10 transform hover:scale-105"
                  onClick={handleRefresh}
                  disabled={contextLoading}
                  aria-label="Refresh transactions"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#111C2F] text-white border-[#1E293B]">Refresh transactions</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <Input
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#111C2F]/90 backdrop-blur-md border border-[#1E293B] text-white placeholder-[#94A3B8] focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 shadow-lg shadow-blue-900/5"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            disabled={contextLoading}
          />
        </div>
        <Button
          className="bg-[#1B89A4] text-white w-full sm:w-auto transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-900/20 font-medium cursor-pointer"
          onClick={handleSearch}
          disabled={isSearching || contextLoading}
        >
          {isSearching ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Searching...</span>
            </div>
          ) : (
            "Search"
          )}
        </Button>
      </div>
    </>
  )
}

const TransactionTable = ({
  contextLoading,
  contextError,
  refetch,
  isSearching,
  paginatedTransactionDisplays,
  hasRealError,
  onTransactionClick,
}: {
  contextLoading: boolean
  contextError: string | null
  refetch: () => void
  isSearching: boolean
  paginatedTransactionDisplays: TransactionDisplay[]
  hasRealError: boolean
  onTransactionClick: (transaction: TransactionDisplay) => void
}) => {
  const getStatusIcon = (status: StatusFilter) => {
    switch (status) {
      case "Successful":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "Failed":
        return <XCircle className="h-4 w-4 text-red-400" />
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-400" />
      default:
        return null
    }
  }

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "Successful":
        return "text-green-400"
      case "Failed":
        return "text-red-400"
      case "Pending":
        return "text-yellow-400"
      default:
        return "text-white"
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Transaction ID copied to clipboard!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      })
    })
  }

  const TableRowSkeleton = () => (
    <TableRow className="bg-[#111C2F] border-b border-[#1E293B] animate-pulse">
      <TableCell className="py-4">
        <Skeleton className="h-4 w-20 bg-[#1E293B]" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-32 bg-[#1E293B]" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-24 bg-[#1E293B]" />
      </TableCell>
      <TableCell className="py-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full bg-[#1E293B]" />
          <Skeleton className="h-4 w-16 bg-[#1E293B]" />
        </div>
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-32 bg-[#1E293B]" />
      </TableCell>
    </TableRow>
  )

  console.log("TransactionTable: contextLoading =", contextLoading)

  return (
    <div className="relative flex-1 min-h-0 overflow-x-hidden hover:overflow-x-visible overflow-y-auto border border-[#1E293B] rounded-lg bg-[#0A1525]/60 backdrop-blur-sm table-container shadow-xl shadow-blue-900/5 transition-all duration-300">
      {contextLoading && (
        <div className="absolute inset-0 bg-[#0A1525]/90 backdrop-blur-md flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4 p-6 bg-[#111C2F]/80 rounded-lg shadow-2xl shadow-blue-900/20">
            <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
            <p className="text-xl font-semibold text-white">Fetching transactions...</p>
          </div>
        </div>
      )}
      <Table className="w-full">
        <TableHeader className="bg-[#0A1525] sticky top-0 z-10 border-b border-[#1E293B]">
          <TableRow className="hover:bg-[#0A1525]">
            <TableHead className="w-[120px] text-white font-semibold py-4 text-sm">Date</TableHead>
            <TableHead className="text-white font-semibold py-4 text-sm">Description</TableHead>
            <TableHead className="text-white font-semibold py-4 text-sm">Amount</TableHead>
            <TableHead className="text-white font-semibold py-4 text-sm">Status</TableHead>
            <TableHead className="text-white font-semibold py-4 text-sm">Transaction ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hasRealError ? (
            <TableRow className="bg-[#111C2F] hover:bg-[#111C2F]">
              <TableCell colSpan={5} className="py-8 text-center text-[#94A3B8]">
                <div className="flex flex-col items-center justify-center gap-4">
                  <AlertCircle className="h-10 w-10 text-red-400" />
                  <p className="text-lg font-medium text-white">Failed to load transactions</p>
                  <p className="text-sm text-[#94A3B8]">{contextError}</p>
                  <Button
                    className="bg-[#1D4ED8] hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-900/20 font-medium"
                    onClick={() => {
                      refetch()
                      toast.info("Retrying to fetch transactions...", {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "dark",
                      })
                    }}
                  >
                    Retry
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : contextLoading ? (
            Array(5)
              .fill(0)
              .map((_, index) => <TableRowSkeleton key={index} />)
          ) : isSearching ? (
            <TableRow className="bg-[#111C2F] hover:bg-[#111C2F]">
              <TableCell colSpan={5} className="py-8 text-center text-[#94A3B8]">
                <div className="flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <p className="text-lg font-medium">Searching transactions...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : paginatedTransactionDisplays.length > 0 ? (
            paginatedTransactionDisplays.map((tx, index) => (
              <TableRow
                key={index}
                className="bg-[#111C2F] border-b border-[#1E293B] hover:bg-[#1E293B]/80 duration-200 cursor-pointer"
                onClick={() => onTransactionClick(tx)}
              >
                <TableCell className="font-medium text-white py-4 text-sm">{tx.date}</TableCell>
                <TableCell className="text-[#94A3B8] py-4 text-sm">{tx.description}</TableCell>
                <TableCell className="text-white font-medium py-4 text-sm">{tx.amount}</TableCell>
                <TableCell className="py-4">
                  <div className={`flex items-center gap-2 ${getStatusTextColor(tx.status)} text-sm`}>
                    {getStatusIcon(tx.status as StatusFilter)}
                    <span>{tx.status}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={tx.explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline-offset-4 transition-colors font-mono text-sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toast.info("Opening transaction in explorer", {
                                position: "bottom-right",
                                autoClose: 2000,
                                hideProgressBar: true,
                                closeOnClick: true,
                                pauseOnHover: true,
                                theme: "dark",
                              })
                            }}
                          >
                            {truncateTransactionId(tx.transactionId)}
                          </a>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#111C2F] text-white border-[#1E293B] max-w-xs break-all font-mono">
                          {tx.transactionId}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="p-1 rounded-full bg-[#1E293B] text-white hover:bg-blue-500/50 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              copyToClipboard(tx.transactionId)
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#111C2F] text-white border-[#1E293B]">
                          Copy Transaction ID
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
  )
}

const Pagination = ({
  contextLoading,
  contextError,
  filteredTransactions,
  currentPage,
  totalPages,
  handlePageChange,
}: {
  contextLoading: boolean
  contextError: string | null
  filteredTransactions: TransactionDisplay[]
  currentPage: number
  totalPages: number
  handlePageChange: (page: number) => void
}) => (
  <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 sm:px-6 bg-[#0A1525] border-t border-[#1E293B] rounded-b-lg shadow-lg">
    <div className="text-sm text-[#94A3B8]">
      {contextLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <span>Loading transactions...</span>
        </div>
      ) : contextError ? (
        "Error loading transactions"
      ) : filteredTransactions.length > 0 ? (
        `Page ${currentPage} of ${totalPages} (${filteredTransactions.length} transactions total)`
      ) : (
        "No transactions found"
      )}
    </div>
    {!contextLoading && !contextError && filteredTransactions.length > 0 && (
      <div className="flex items-center gap-2 cursor-pointer">
        <Button
          variant="outline"
          size="sm"
          className="bg-[#1B89A4] border-[#1B89A4] text-white hover:bg-[#1B89A4]/5 disabled:opacity-50 transform hover:scale-105 transition-all cursor-pointer"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          First
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-[#1B89A4] border-[#1B89A4] text-white hover:bg-[#1B89A4]/5 disabled:opacity-50 transform hover:scale-105 transition-all"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          Prev
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + Math.max(1, currentPage - 2)
            if (page > totalPages) return null
            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className={`${
                  currentPage === page
                    ? "bg-[#1B89A4] text-white"
                    : "bg-[#1B89A4] border-[#1B89A4] text-white hover:bg-[#1B89A4]/5"
                } transform hover:scale-105 transition-all`}
                onClick={() => handlePageChange(page)}
                aria-label={`Page ${page}`}
              >
                {page}
              </Button>
            )
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-[#1B89A4] border-[#1B89A4] text-white hover:bg-[#1B89A4]/5 disabled:opacity-50 transform hover:scale-105 transition-all"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          Next
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-[#1B89A4] border-[#1B89A4] text-white hover:bg-[#1B89A4]/5 disabled:opacity-50 transform hover:scale-105 transition-all cursor-pointer"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
        >
          Last
        </Button>
      </div>
    )}
  </div>
)

export default function DashboardTransactions() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All")
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRange>("All")
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [showDateRangeMenu, setShowDateRangeMenu] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined)
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined)
  const [month, setMonth] = useState<Date | undefined>(new Date())
  const [year, setYear] = useState<Date | undefined>(new Date())
  const { transactions, loading: contextLoading, error: contextError, refetch } = useTransactions()
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionDisplay[]>([])
  const [displayTransactions, setDisplayTransactions] = useState<TransactionDisplay[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Modal state
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDisplay | null>(null)
  const [showModal, setShowModal] = useState(false)

  const hasRealError = useMemo(() => {
    return !!(contextError && !contextError.toLowerCase().includes("no transactions"))
  }, [contextError])

  useEffect(() => {
    console.log(
      "DashboardTransactions: contextLoading =",
      contextLoading,
      "contextError =",
      contextError,
      "transactions =",
      transactions.length,
    )
    if (contextLoading) {
      console.log("Loading state is active, should see overlay in TransactionTable")
    }
    if (hasRealError) {
      toast.error(`Failed to load transactions: ${contextError}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      })
    }
    if (!contextLoading && !contextError && transactions.length === 0) {
      console.log("No transactions found, should render empty state")
    }
  }, [contextLoading, contextError, hasRealError, transactions.length])

  useEffect(() => {
    if (transactions.length > 0) {
      const formatted = transactions.map(mapToDisplayFormat)
      setFilteredTransactions(formatted)
      setDisplayTransactions(formatted)
      console.log("Transactions loaded:", transactions.length)
    } else {
      setFilteredTransactions([])
      setDisplayTransactions([])
      console.log("No transactions available")
    }
  }, [transactions])

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  const paginatedTransactionDisplays = useMemo(
    () => filteredTransactions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filteredTransactions, currentPage],
  )

  const applyDateRangeFilter = useCallback(
    (data: TransactionDisplay[], range: DateRange) => {
      if (range === "All") return data

      const currentDate = new Date()
      const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())

      return data.filter((tx) => {
        const [day, txMonth, txYear] = tx.date.split("/").map(Number)
        const txDate = new Date(txYear, txMonth - 1, day)

        switch (range) {
          case "Weekly":
            const weekAgo = new Date(today)
            weekAgo.setDate(weekAgo.getDate() - 7)
            return txDate >= weekAgo && txDate <= today

          case "Monthly":
            if (month instanceof Date && !isNaN(month.getTime())) {
              const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
              const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0) // Last day of the month
              return txDate >= startOfMonth && txDate <= endOfMonth
            }
            return false

          case "Yearly":
            if (year instanceof Date && !isNaN(year.getTime())) {
              const startOfYear = new Date(year.getFullYear(), 0, 1)
              const endOfYear = new Date(year.getFullYear(), 11, 31)
              return txDate >= startOfYear && txDate <= endOfYear
            }
            return false

          case "Custom":
            if (
              customStartDate instanceof Date &&
              !isNaN(customStartDate.getTime()) &&
              customEndDate instanceof Date &&
              !isNaN(customEndDate.getTime())
            ) {
              return txDate >= customStartDate && txDate <= customEndDate
            }
            return false

          default:
            return true
        }
      })
    },
    [customStartDate, customEndDate, month, year],
  )

  const applyFilters = useCallback(
    (status: StatusFilter, direction: SortDirection, dateRange: DateRange) => {
      let results: TransactionDisplay[] = [...displayTransactions]

      if (status !== "All") {
        results = results.filter((tx) => tx.status === status)
      }

      results = applyDateRangeFilter(results, dateRange)

      results.sort((a, b) => {
        const parseDate = (dateStr: string): Date => {
          try {
            const parts = dateStr.split("/")
            if (parts.length !== 3) throw new Error("Invalid date format")
            const day = parts[0].padStart(2, "0")
            const month = parts[1].padStart(2, "0")
            const year = parts[2]
            const normalizedDate = `${day}/${month}/${year}`
            const date = parse(normalizedDate, "dd/MM/yyyy", new Date())
            if (isNaN(date.getTime())) {
              console.warn(`Invalid date parsed: ${dateStr} -> ${normalizedDate}`)
              return new Date(0)
            }
            return date
          } catch (error) {
            console.warn(`Failed to parse date: ${dateStr}`, error)
            return new Date(0)
          }
        }

        const dateA = parseDate(a.date)
        const dateB = parseDate(b.date)

        const dateDiff = direction === "desc" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
        if (dateDiff !== 0) return dateDiff

        const amountA = Number.parseFloat(a.amount.replace("NGN", ""))
        const amountB = Number.parseFloat(b.amount.replace("NGN", ""))
        return direction === "desc" ? amountB - amountA : amountA - amountB
      })

      setFilteredTransactions(results)
      setCurrentPage(1)
    },
    [displayTransactions, applyDateRangeFilter],
  )

  const handleSortByDate = useCallback(() => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc"
    setSortDirection(newDirection)
    setCurrentPage(1)
  }, [sortDirection])

  const handleDateRangeFilter = useCallback((range: DateRange) => {
    setDateRangeFilter(range)
    if (range !== "Custom") {
      setCustomStartDate(undefined)
      setCustomEndDate(undefined)
    }
    setShowDateRangeMenu(false)
    setCurrentPage(1)
  }, [])

  const handleSearch = useCallback(() => {
    setIsSearching(true)
    setTimeout(() => {
      if (!searchQuery.trim()) {
        applyFilters(statusFilter, sortDirection, dateRangeFilter)
        setIsSearching(false)
        return
      }

      const query = searchQuery.toLowerCase()
      const results = displayTransactions.filter((tx) =>
        Object.values(tx).some((value) => typeof value === "string" && value.toLowerCase().includes(query)),
      )

      let filteredResults: TransactionDisplay[] =
        statusFilter === "All" ? results : results.filter((tx) => tx.status === statusFilter)

      filteredResults = applyDateRangeFilter(filteredResults, dateRangeFilter)

      setFilteredTransactions(filteredResults)
      setCurrentPage(1)
      setIsSearching(false)
    }, 500)
  }, [
    searchQuery,
    displayTransactions,
    statusFilter,
    dateRangeFilter,
    applyDateRangeFilter,
    applyFilters,
    sortDirection,
  ])

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page)
        document.querySelector(".table-container")?.scrollTo(0, 0)
      }
    },
    [totalPages],
  )

  const handleRefresh = useCallback(() => {
    refetch()
    toast.info("Retrying to fetch transactions...", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    })
  }, [refetch])

  // Handle transaction click
  const handleTransactionClick = useCallback((transaction: TransactionDisplay) => {
    setSelectedTransaction(transaction)
    setShowModal(true)
  }, [])

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setShowModal(false)
    setSelectedTransaction(null)
  }, [])

  // Handle click outside modal to close
  const handleModalBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleCloseModal()
      }
    },
    [handleCloseModal],
  )

  useEffect(() => {
    applyFilters(statusFilter, sortDirection, dateRangeFilter)
  }, [statusFilter, sortDirection, dateRangeFilter, customStartDate, customEndDate, month, year, applyFilters])

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "Successful":
        return "text-green-400"
      case "Failed":
        return "text-red-400"
      case "Pending":
        return "text-yellow-400"
      default:
        return "text-white"
    }
  }

  // Get the original transaction for the success card
  const getOriginalTransaction = (transactionDisplay: TransactionDisplay) => {
    return transactions.find((tx) => tx.hash === transactionDisplay.transactionId)
  }

  return (
    <div className="flex flex-col h-full w-full mx-auto bg-[#0f172a] min-h-0 overflow-hidden">
      <div className="flex-1 flex flex-col p-4 sm:p-6 gap-4 font-sans overflow-hidden">
        <FilterControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortDirection={sortDirection}
          handleSortByDate={handleSortByDate}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateRangeFilter={dateRangeFilter}
          handleDateRangeFilter={handleDateRangeFilter}
          showStatusMenu={showStatusMenu}
          setShowStatusMenu={setShowStatusMenu}
          showDateRangeMenu={showDateRangeMenu}
          setShowDateRangeMenu={setShowDateRangeMenu}
          customStartDate={customStartDate}
          setCustomStartDate={setCustomStartDate}
          customEndDate={customEndDate}
          setCustomEndDate={setCustomEndDate}
          month={month}
          setMonth={setMonth}
          year={year}
          setYear={setYear}
          isSearching={isSearching}
          contextLoading={contextLoading}
          handleSearch={handleSearch}
          handleRefresh={handleRefresh}
        />
        <div className="flex flex-wrap items-center gap-3 text-sm text-[#94A3B8]">
          {statusFilter !== "All" && (
            <div className="flex items-center gap-1">
              <span>Status:</span>
              <span
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusTextColor(
                  statusFilter,
                )} bg-[#111C2F]/80 backdrop-blur-md shadow-sm`}
              >
                {statusFilter === "Successful" && <CheckCircle className="h-3 w-3 text-green-400" />}
                {statusFilter === "Failed" && <XCircle className="h-3 w-3 text-red-400" />}
                {statusFilter === "Pending" && <Clock className="h-3 w-3 text-yellow-400" />}
                {statusFilter}
              </span>
            </div>
          )}
          {dateRangeFilter !== "All" && (
            <div className="flex items-center gap-1">
              <span>Date Range:</span>
              <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border border-blue-500/40 text-blue-400 bg-[#111C2F]/80 backdrop-blur-md shadow-sm">
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
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#111C2F]/80 backdrop-blur-md shadow-sm border border-[#1E293B]">
              {sortDirection === "asc" ? "Oldest first" : "Newest first"}
            </span>
          </div>
        </div>
        <TransactionTable
          contextLoading={contextLoading}
          contextError={contextError}
          refetch={refetch}
          isSearching={isSearching}
          paginatedTransactionDisplays={paginatedTransactionDisplays}
          hasRealError={hasRealError}
          onTransactionClick={handleTransactionClick}
        />
        <Pagination
          contextLoading={contextLoading}
          contextError={contextError}
          filteredTransactions={filteredTransactions}
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>

      {/* Transaction Success Card Modal */}
      {showModal && selectedTransaction && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleModalBackdropClick}
        >
          <div className="relative max-w-sm w-full">
            <TransactionSuccessCard
              transaction={mapToSuccessCardFormat(
                selectedTransaction,
                getOriginalTransaction(selectedTransaction) || ({} as Transaction),
              )}
              onDownload={() => {
                console.log("Download receipt for transaction:", selectedTransaction.id)
                toast.success("Receipt download started!", {
                  position: "bottom-right",
                  autoClose: 2000,
                  theme: "dark",
                })
              }}
              onReturn={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  )
}


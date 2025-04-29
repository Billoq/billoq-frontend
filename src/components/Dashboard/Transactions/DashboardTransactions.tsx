
"use client"
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { LuArrowDownUp } from "react-icons/lu";
import { GiSettingsKnobs } from "react-icons/gi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const invoices = [
  {
    Date: "29/04/2025",
    Description: "Internet Bill",
    Amount: "4000NG",
    Status: "Successful",
    TransactionID: "0x98a7f3c2...d4b9",
  },
  {
    Date: "29/04/2025",
    Description: "Electricity Payment",
    Amount: "5000NG",
    Status: "Successful",
    TransactionID: "0x98a7f3c2...d4b9",
  },
  {
    Date: "22/04/2025",
    Description: "Internet Bill",
    Amount: "5000NG",
    Status: "Failed",
    TransactionID: "N/A",
  },
  {
    Date: "29/04/2025",
    Description: "Internet Bill",
    Amount: "6000NG",
    Status: "Successful",
    TransactionID: "0x98a7f3c2...d4b9",
  },
  {
    Date: "23/04/2025",
    Description: "Subscription Renewal",
    Amount: "3000NG",
    Status: "Pending",
    TransactionID: "0x98a7f3c2...d4b9",
  },
  {
    Date: "29/04/2025",
    Description: "Internet Bill",
    Amount: "3000NG",
    Status: "Failed",
    TransactionID: "N/A",
  },
  {
    Date: "24/04/2025",
    Description: "Mobile Recharge",
    Amount: "3000NG",
    Status: "Successful",
    TransactionID: "0x98a7f3c2...d4b9",
  },
  {
    Date: "20/04/2025",
    Description: "Subscription Renewal",
    Amount: "3000NG",
    Status: "Pending",
    TransactionID: "0x98a7f3c2...d4b9",
  },
  {
    Date: "29/04/2025",
    Description: "Internet Bill",
    Amount: "6000NG",
    Status: "Successful",
    TransactionID: "0x98a7f3c2...d4b9",
  },
];

function DashboardTransactions() {
  const [filteredInvoices, setFilteredInvoices] = useState(invoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc"); // asc or desc
  const [statusFilter, setStatusFilter] = useState("All");
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  // Function to get appropriate style for each status
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Successful":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Handle date sorting
  const handleSortByDate = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
  };

  // Handle status filtering
  const handleStatusFilter = (status: React.SetStateAction<string>) => {
    setStatusFilter(status);
    setShowStatusMenu(false);
  };

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      // If search query is empty, reset filters but keep status filter
      applyFilters(statusFilter, sortDirection);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = invoices.filter(invoice => {
      return (
        invoice.TransactionID.toLowerCase().includes(query) ||
        invoice.Description.toLowerCase().includes(query) ||
        invoice.Amount.toLowerCase().includes(query) ||
        invoice.Status.toLowerCase().includes(query) ||
        invoice.Date.toLowerCase().includes(query)
      );
    });

    // Apply current status filter to search results if not "All"
    const statusFiltered = statusFilter === "All" 
      ? results
      : results.filter(invoice => invoice.Status === statusFilter);

    setFilteredInvoices(statusFiltered);
  };

  const applyFilters = (status: string, direction: string) => {
    let results = [...invoices];
    
    // Apply status filter if not "All"
    if (status !== "All") {
      results = results.filter(invoice => invoice.Status === status);
    }
    
    // Apply sort direction
    if (direction === "desc") {
      results.sort((a, b) => {
        const dateA = new Date(a.Date.split('/').reverse().join('/'));
        const dateB = new Date(b.Date.split('/').reverse().join('/'));
        return dateB.getTime() - dateA.getTime();
      });
    } else {
      results.sort((a, b) => {
        const dateA = new Date(a.Date.split('/').reverse().join('/'));
        const dateB = new Date(b.Date.split('/').reverse().join('/'));
        return dateA.getTime() - dateB.getTime();
      });
    }
    
    setFilteredInvoices(results);
  };

  // Effect to re-apply filters when status filter or sort direction changes
  useEffect(() => {
    applyFilters(statusFilter, sortDirection);
  }, [statusFilter, sortDirection]);

  return (
    <div className="p-4 w-full max-w-7xl mx-auto space-y-6">
      {/* Header section with description and icons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-medium text-white">
          You can view all the transactions and services which you have processed
        </h3>
        
        <div className="flex items-center gap-4">
          <button 
            className="p-2 rounded-full text-white hover:bg-gray-200 transition-colors"
            onClick={handleSortByDate}
            title={`Sort by date (${sortDirection === "asc" ? "oldest first" : "newest first"})`}
          >
            <LuArrowDownUp className="h-5 w-5 bg-white text-gray-600 dark:text-gray-300" />
          </button>
          
          <div className="relative">
            <button 
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              title="Filter by status"
            >
              <GiSettingsKnobs className="h-5 w-5 bg-white text-gray-600 dark:text-gray-300" />
            </button>
            
            {showStatusMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                <div className="py-1">
                  <button 
                    className={`block px-4 py-2 text-sm w-full text-left ${statusFilter === "All" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                    onClick={() => handleStatusFilter("All")}
                  >
                    All
                  </button>
                  <button 
                    className={`block px-4 py-2 text-sm w-full text-left ${statusFilter === "Successful" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                    onClick={() => handleStatusFilter("Successful")}
                  >
                    Successful
                  </button>
                  <button 
                    className={`block px-4 py-2 text-sm w-full text-left ${statusFilter === "Failed" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                    onClick={() => handleStatusFilter("Failed")}
                  >
                    Failed
                  </button>
                  <button 
                    className={`block px-4 py-2 text-sm w-full text-left ${statusFilter === "Pending" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                    onClick={() => handleStatusFilter("Pending")}
                  >
                    Pending
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search bar section */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-auto flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-400" />
          <Input
            placeholder="Search for Transactions..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:focus-visible:ring-slate-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button 
          className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto cursor-pointer"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      {/* Current filters display */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        {statusFilter !== "All" && (
          <div className="flex items-center gap-1">
            <span>Status: </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(statusFilter)}`}>
              {statusFilter}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <span className='text-white'>Order: </span>
          <span className='text-white'>{sortDirection === "asc" ? "Oldest first" : "Newest first"}</span>
        </div>
      </div>

      {/* Transactions table */}
      <div className="overflow-x-auto rounded-lg">
      <Table className="border-collapse border-gray-300">
          <TableHeader>
          <TableRow className="bg-[#111C2F] border-gray-300">
            <TableHead className="w-[120px] text-white border-gray-300">Date</TableHead>
            <TableHead className="text-white border-gray-300">Description</TableHead>
            <TableHead className="text-white border-gray-300">Amount</TableHead>
            <TableHead className="text-white border-gray-300">Status</TableHead>
            <TableHead className="hidden md:table-cell text-white border-gray-300">Transaction ID</TableHead>
          </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice, index) => (
              <TableRow 
                key={index}
                className="dark:hover:bg-gray-800/60"
              >
                <TableCell className="font-bold text-slate-300 border-gray-300">{invoice.Date}</TableCell>
                <TableCell className='text-slate-300 border-gray-300'>{invoice.Description}</TableCell>
                <TableCell className='text-slate-300 border-gray-300'>{invoice.Amount}</TableCell>
                <TableCell className="border-gray-300">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusStyle(invoice.Status)}`}>
                    {invoice.Status}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell text-slate-300 border-gray-300">
                  {invoice.TransactionID}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default DashboardTransactions;


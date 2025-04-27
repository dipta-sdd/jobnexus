"use client";

import {
  Plus,
  Search,
  Calendar,
  LayoutGrid,
  List,
  ArrowDownUp,
} from "lucide-react";
import { useState } from "react";

interface SortOption {
  label: string;
  field: string;
  order: string;
}
type SortOrder = "asc" | "desc";
interface HeaderProps {
  title: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  view: string;
  setView: (view: "grid" | "list") => void;
  setIsModalOpen: (isOpen: boolean) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  addButtonText?: string;
  // New props for sorting
  sortField: string;
  setSortField: (field: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  sortOptions: SortOption[];
  resultsCount?: number;
}

export default function Header({
  title,
  searchQuery,
  setSearchQuery,
  view,
  setView,
  setIsModalOpen,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  addButtonText = `Add ${title.slice(0, -1)}`, // Remove 's' from end
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  sortOptions = [],
  resultsCount,
}: HeaderProps) {
  const [showDateFilter, setShowDateFilter] = useState(false);


  const currentSortOption = sortOptions.find(
    (option) => option.field === sortField && option.order === sortOrder
  ) || {
    label: "Sort",
    field: "",
    order: "",
  };

  const handleSortChange = (field: string, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xs shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Main header with search and actions */}
      <div className="p-5">
        <div className="flex flex-col space-y-5">
          {/* Title and add button */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-emerald-500 rounded-full"></div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              {addButtonText}
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
            />
          </div>
        </div>
      </div>

      {/* Controls bar */}
      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-white dark:bg-gray-700 rounded-lg p-1 border border-gray-200 dark:border-gray-600">
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 rounded-md ${
                view === "grid"
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-1.5 rounded-md ${
                view === "list"
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="relative group">
            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
              <ArrowDownUp className="h-4 w-4 mr-2" />
              <span>{currentSortOption.label}</span>
            </button>

            {/* Dropdown menu */}
            <div className="absolute left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 hidden group-hover:block">
              <div className="py-1">
                {sortOptions.map((option) => (
                  <button
                    key={`${option.field}-${option.order}`}
                    onClick={() => handleSortChange(option.field, option.order as SortOrder)}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      sortField === option.field && sortOrder === option.order
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Date filter button */}
          <button
            onClick={() => setShowDateFilter(!showDateFilter)}
            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border ${
              showDateFilter || startDate || endDate
                ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            } hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors`}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </button>
        </div>

        {/* Results count */}
        {resultsCount ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-medium text-gray-900 dark:text-white">{resultsCount}</span>{" "}
            results
          </div>
        ): null}
      </div>

      {/* Date filter section */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showDateFilter ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="p-5 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date
              </label>
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
                onChange={(e) => setStartDate(e.target.value)}
                value={startDate}
              />
            </div>

            <div className="flex-1 space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date
              </label>
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
                onChange={(e) => setEndDate(e.target.value)}
                value={endDate}
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="flex-1 sm:flex-initial px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Clear
              </button>
              <button
                onClick={() => setShowDateFilter(false)}
                className="flex-1 sm:flex-initial px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active filters display */}
      {(startDate || endDate) && !showDateFilter && (
        <div className="px-5 py-3 flex flex-wrap items-center gap-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Filtered by:
          </span>
          {(startDate || endDate) && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-sm text-emerald-700 dark:text-emerald-400">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>
                {startDate || "Any"} - {endDate || "Any"}
              </span>
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="ml-1.5 p-0.5 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-800/30"
                aria-label="Clear date filter"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

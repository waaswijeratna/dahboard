"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { useSearchFilters } from "../SearchFilterContext";

export default function Filters() {
  const { tempFilters, setTempFilters, applyFilters, clearFilters } = useSearchFilters();
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    applyFilters();
    setIsOpen(false);
  };

  const handleClear = () => {
    clearFilters();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Filter Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
      >
        <Filter className="w-5 h-5 text-gray-700" />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg border border-gray-200 rounded-xl z-50 p-4 space-y-5">
          {/* Sort By Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Sort By</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setTempFilters({ ...tempFilters, sortBy: "time", order: tempFilters.order || "asc" })}
                className={`flex-1 px-3 py-1 rounded-lg border transition ${
                  tempFilters.sortBy === "time"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                Time
              </button>
              <button
                onClick={() => setTempFilters({ ...tempFilters, sortBy: "name", order: tempFilters.order || "asc" })}
                className={`flex-1 px-3 py-1 rounded-lg border transition ${
                  tempFilters.sortBy === "name"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                Name
              </button>
            </div>
          </div>

          {/* Order Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Order</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setTempFilters({ ...tempFilters, order: "asc" })}
                disabled={!tempFilters.sortBy}
                className={`flex-1 px-3 py-1 rounded-lg border transition ${
                  tempFilters.order === "asc"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-300 hover:bg-gray-100"
                } ${!tempFilters.sortBy ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Asc
              </button>
              <button
                onClick={() => setTempFilters({ ...tempFilters, order: "desc" })}
                disabled={!tempFilters.sortBy}
                className={`flex-1 px-3 py-1 rounded-lg border transition ${
                  tempFilters.order === "desc"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-300 hover:bg-gray-100"
                } ${!tempFilters.sortBy ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Desc
              </button>
            </div>
          </div>

          {/* User Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">User</h3>
            <input
              type="text"
              value={tempFilters.sortUser}
              onChange={(e) => setTempFilters({ ...tempFilters, sortUser: e.target.value })}
              placeholder="Type sortUser"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Apply
            </button>
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
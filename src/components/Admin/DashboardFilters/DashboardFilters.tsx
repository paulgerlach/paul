"use client";

import { useState, useEffect } from 'react';
import { useChartStore } from '@/store/useChartStore';
import { Calendar, Filter, X } from 'lucide-react';

export default function DashboardFilters() {
  const { startDate, endDate, meterIds, setDates, setMeterIds } = useChartStore();
  const [showFilters, setShowFilters] = useState(false);
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');
  
  useEffect(() => {
    if (startDate) setTempStartDate(startDate.toISOString().split('T')[0]);
    if (endDate) setTempEndDate(endDate.toISOString().split('T')[0]);
  }, [startDate, endDate]);

  const applyDateFilter = () => {
    if (tempStartDate && tempEndDate) {
      setDates(new Date(tempStartDate), new Date(tempEndDate));
    }
    setShowFilters(false);
  };

  const clearFilters = () => {
    setDates(null as any, null as any);
    setMeterIds([]);
    setTempStartDate('');
    setTempEndDate('');
    setShowFilters(false);
  };

  const setQuickFilter = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setDates(start, end);
    setShowFilters(false);
  };

  const hasActiveFilters = startDate || endDate || meterIds.length > 0;

  return (
    <div className="relative">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
          ${hasActiveFilters 
            ? 'bg-blue-600 text-white' 
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }
        `}
      >
        <Filter size={16} />
        Filters
        {hasActiveFilters && (
          <span className="bg-white text-blue-600 text-xs rounded-full px-2 py-0.5 ml-1">
            {(startDate || endDate ? 1 : 0) + (meterIds.length > 0 ? 1 : 0)}
          </span>
        )}
      </button>

      {showFilters && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Dashboard Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>

          {/* Date Range Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={14} className="inline mr-1" />
              Date Range
            </label>
            
            {/* Quick Filters */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                onClick={() => setQuickFilter(7)}
                className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
              >
                Last 7 days
              </button>
              <button
                onClick={() => setQuickFilter(30)}
                className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
              >
                Last 30 days
              </button>
              <button
                onClick={() => setQuickFilter(90)}
                className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
              >
                Last 90 days
              </button>
            </div>
            
            {/* Custom Date Range */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={tempStartDate}
                  onChange={(e) => setTempStartDate(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={tempEndDate}
                  onChange={(e) => setTempEndDate(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Current Filters Display */}
          {hasActiveFilters && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Active Filters:</h4>
              <div className="text-xs text-blue-600 space-y-1">
                {startDate && endDate && (
                  <div>📅 {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</div>
                )}
                {meterIds.length > 0 && (
                  <div>📊 {meterIds.length} meter(s) selected</div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={applyDateFilter}
              disabled={!tempStartDate || !tempEndDate}
              className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Apply
            </button>
            <button
              onClick={clearFilters}
              className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


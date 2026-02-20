'use client'

import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

interface GatewayDevice {
  id: string;
  eui: string;
  imei: string;
  imsi: string;
  iccid: string;
  model: string;
  firmware: string;
  boot_version: string;
  last_seen: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface DevicesResponse {
  data: GatewayDevice[];
  pagination: Pagination;
}

export default function Devices() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useQuery<DevicesResponse>({
    queryKey: ["gateway-devices", page, pageSize, sortBy, sortOrder, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortBy,
        sortOrder,
        search,
      });
      const response = await fetch(`/api/mqtt-gateway/gateway-devices?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch gateway devices");
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value));
    setPage(1);
  };

  return (
    <div className="border rounded-lg bg-white">
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        type="button"
        aria-expanded={!isCollapsed ? 'true' : 'false'}
      >
        <h2 className="font-semibold text-lg">Geräte</h2>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${
            isCollapsed ? 'rotate-0' : 'rotate-180'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Content */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-gray-500">Loading gateway devices...</p>
            </div>
          ) : error ? (
            <div className="py-4 text-red-500 bg-red-50 rounded-lg px-4">
              Error loading devices: {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search and Page Size Controls */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search devices..."
                    value={search}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Show:</label>
                  <select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    aria-label="Items per page"
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <p className="text-sm text-gray-600">
                Showing {data?.data.length || 0} of {data?.pagination.total || 0} devices
              </p>

              {/* Table */}
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('eui')}
                      >
                        EUI {sortBy === 'eui' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th
                        className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('model')}
                      >
                        Model {sortBy === 'model' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th
                        className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('firmware')}
                      >
                        Firmware {sortBy === 'firmware' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th
                        className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('last_seen')}
                      >
                        Last Seen {sortBy === 'last_seen' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th
                        className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('updated_at')}
                      >
                        Updated {sortBy === 'updated_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data?.data.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          No gateway devices found.
                        </td>
                      </tr>
                    ) : (
                      data?.data.map((device) => (
                        <tr key={device.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono text-xs truncate max-w-[150px]">
                            {device.eui}
                          </td>
                          <td className="px-4 py-3">{device.model}</td>
                          <td className="px-4 py-3 font-mono text-xs truncate max-w-[120px]">
                            {device.firmware}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {device.last_seen ? new Date(device.last_seen).toLocaleString() : '-'}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {new Date(device.updated_at).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data?.pagination && data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-gray-600">
                    Page {data.pagination.page} of {data.pagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === data.pagination.totalPages}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

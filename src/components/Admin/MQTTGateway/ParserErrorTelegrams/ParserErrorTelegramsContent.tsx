'use client';

import { TelegramsParserErrorResponse } from "@/types/GateTelegramRecord";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import TelegramParserTest from "./TelegramParserTest";
import TelegramParserBatchCSVTest from "./TelegramParserBatchCSVTest";

export default function ParserErrorTelegramsContent() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useQuery<TelegramsParserErrorResponse>({
    queryKey: ["parserErrorTelegrams", page, pageSize, sortBy, sortOrder, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortBy,
        sortOrder,
        search,
      });
      const response = await fetch(`/api/mqtt-gateway/telegrams/parserErrorTelegrams?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch parserErrorTelegrams");
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

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="mt-2 text-gray-500">Loading telegrams...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 text-red-500 bg-red-50 rounded-lg px-4">
        Error loading telegrams: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  const telegrams = data?.data || [];
  const pagination = data?.pagination;
  return (
    <div className="space-y-4">
      <TelegramParserTest />
      <TelegramParserBatchCSVTest />

      {/* Search and Page Size Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search telegrams..."
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
        Showing {telegrams.length} of {pagination?.total || 0} telegrams
      </p>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('gateway_eui')}
              >
                Device ID {sortBy === 'gateway_eui' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('error')}
              >
                Error {sortBy === 'error' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('telegramLength')}
              >
                Length {sortBy === 'telegramLength' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('created_at')}
              >
                Created {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Raw Telegram</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {telegrams.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No parser errors found.
                </td>
              </tr>
            ) : (
              telegrams.map((telegram) => (
                <tr key={telegram.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs truncate max-w-[150px]">
                    {telegram.gateway_eui}
                  </td>
                  <td className="px-4 py-3 text-red-600 font-medium">
                    {telegram.error}
                  </td>
                  <td className="px-4 py-3">{telegram.telegramLength}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(telegram.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs truncate max-w-[200px]" title={telegram.telegram}>
                    {telegram.telegram}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
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
              disabled={page === pagination.totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

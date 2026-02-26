'use client';

import { TelegramsParserErrorResponse } from "@/types/GateTelegramRecord";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export default function ParserErrorTelegramsContent() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [testTelegram, setTestTelegram] = useState('');
  const [testTelegramBuffer, setTestTelegramBuffer] = useState('');
  const [testGatewayEui, setTestGatewayEui] = useState('');
  const [parseResult, setParseResult] = useState<Record<string, any> | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

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

  const parseTelegramMutation = useMutation({
    mutationFn: async ({ gatewayEui, telegram }: { gatewayEui: string; telegram: string | { type: string; data: number[] } }) => {
      const response = await fetch('/api/mqtt-gateway/telegrams/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gatewayEui, telegram }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to parse telegram');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setParseResult(data.data);
      setParseError(null);
    },
    onError: (error: Error) => {
      setParseError(error.message);
      setParseResult(null);
    },
  });

  const handleParseTelegram = () => {
    if (!testTelegram.trim() && !testTelegramBuffer.trim()) {
      setParseError('Please enter either a hex string or Buffer object');
      return;
    }
    if (!testGatewayEui.trim()) {
      setParseError('Please enter Gateway EUI');
      return;
    }
    
    let telegramPayload: string | { type: string; data: number[] };
    
    // Check if it's a Buffer-like object (JSON format)
    try {
      const parsed = JSON.parse(testTelegramBuffer || testTelegram);
      if (parsed && parsed.type === 'Buffer' && Array.isArray(parsed.data)) {
        telegramPayload = parsed;
        console.log('Using Buffer-like object format');
      } else {
        telegramPayload = testTelegramBuffer || testTelegram;
      }
    } catch {
      // Not JSON, use as hex string
      telegramPayload = testTelegramBuffer || testTelegram;
    }
    
    parseTelegramMutation.mutate({ gatewayEui: testGatewayEui, telegram: telegramPayload });
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
      {/* Telegram Parser Test Section */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="text-lg font-medium mb-4">Test Telegram Parser</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gateway EUI
            </label>
            <input
              type="text"
              placeholder="Enter gateway EUI (e.g., a840416a926b4b12)"
              value={testGatewayEui}
              onChange={(e) => setTestGatewayEui(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telegram (hex string or JSON Buffer object)
            </label>
            <textarea
              placeholder='Enter telegram hex string or JSON like {"type":"Buffer","data":[161,68,...]}'
              value={testTelegram}
              onChange={(e) => setTestTelegram(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleParseTelegram}
            disabled={parseTelegramMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {parseTelegramMutation.isPending ? 'Parsing...' : 'Parse Telegram'}
          </button>
          <button
            onClick={() => {
              setTestTelegram('');
              setTestTelegramBuffer('');
              setTestGatewayEui('');
              setParseResult(null);
              setParseError(null);
            }}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Clear
          </button>
        </div>

        {/* Parse Result Display */}
        {(parseResult || parseError) && (
          <div className={`mt-4 p-4 rounded-lg ${parseError ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
            {parseError ? (
              <div className="text-red-600">
                <span className="font-medium">Error:</span> {parseError}
              </div>
            ) : parseResult ? (
              <div>
                <h4 className="font-medium text-green-700 mb-2">Parse Result:</h4>
                
                {/* Meter Info Section */}
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-green-800 mb-1">Meter Information</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-green-100">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-green-800">Field</th>
                          <th className="px-3 py-2 text-left font-medium text-green-800">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-green-200">
                        {Object.entries(parseResult).filter(([key]) => key !== 'readings').map(([key, value]) => (
                          <tr key={key}>
                            <td className="px-3 py-2 font-mono text-xs text-green-700">{key}</td>
                            <td className="px-3 py-2 text-green-900">
                              {value === null ? <span className="text-gray-400">null</span> : String(value)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Readings Section */}
                {parseResult.readings && (
                  <div>
                    <h5 className="text-sm font-semibold text-green-800 mb-1">Readings</h5>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-green-100">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium text-green-800">Field</th>
                            <th className="px-3 py-2 text-left font-medium text-green-800">Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-green-200">
                          {Object.entries(parseResult.readings).map(([key, value]) => (
                            <tr key={key}>
                              <td className="px-3 py-2 font-mono text-xs text-green-700">{key}</td>
                              <td className="px-3 py-2 text-green-900">
                                {value === null ? <span className="text-gray-400">null</span> : String(value)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>

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

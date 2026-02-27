'use client';

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function TelegramParserTest() {
  const [testTelegram, setTestTelegram] = useState('');
  const [testTelegramBuffer, setTestTelegramBuffer] = useState('');
  const [testGatewayEui, setTestGatewayEui] = useState('');
  const [parseResult, setParseResult] = useState<Record<string, any> | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);


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
  return (
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
  )
}

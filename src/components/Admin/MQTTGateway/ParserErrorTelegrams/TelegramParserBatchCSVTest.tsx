'use client';

import { handleTelegramData } from "@/services/parserService";
import { useState, useRef } from "react";

interface ParseResult {
  gatewayEui: string;
  telegram: string;
  success: boolean;
  data?: Record<string, any> | null;
  error?: string;
}

const MIN_TELEGRAM_LENGTH = 16;

function parseCSVLine(line: string): { gatewayEui: string; telegram: string } | null {
  const trimmedLine = line.trim();
  if (!trimmedLine || trimmedLine.startsWith('#')) return null;
  
  // Check for header row
  if (trimmedLine.toLowerCase().includes('gatewayeui')) return null;

  // Try to find the first comma that separates gatewayEui from telegram
  // The telegram can be a JSON object with commas inside, so we need to handle that
  let firstCommaIndex = trimmedLine.indexOf(',');
  
  if (firstCommaIndex === -1) {
    return null; // Invalid format
  }
  
  const gatewayEui = trimmedLine.substring(0, firstCommaIndex).trim();
  let telegram = trimmedLine.substring(firstCommaIndex + 1);
  
  // Check if telegram looks like a JSON object (starts with {)
  if (telegram.trim().startsWith('{')) {
    // Find the matching closing brace
    let braceCount = 0;
    let endIndex = -1;
    for (let i = 0; i < telegram.length; i++) {
      if (telegram[i] === '{') braceCount++;
      else if (telegram[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          endIndex = i;
          break;
        }
      }
    }
    if (endIndex !== -1) {
      telegram = telegram.substring(0, endIndex + 1);
    }
  }
  
  return { gatewayEui, telegram: telegram.trim() };
}

function isValidHexOrBuffer(telegram: string): { valid: boolean; error?: string } {
  const trimmed = telegram.trim();
  
  // Check if it's a JSON Buffer object
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && parsed.type === 'Buffer' && Array.isArray(parsed.data)) {
        if (parsed.data.length < MIN_TELEGRAM_LENGTH) {
          return { valid: false, error: `Telegram too short: ${parsed.data.length} bytes (minimum ${MIN_TELEGRAM_LENGTH} required)` };
        }
        return { valid: true };
      }
    } catch {
      // Invalid JSON, fall through to hex check
    }
  }
  
  // Check if it's a hex string (remove spaces first)
  const hexCleaned = trimmed.replace(/\s/g, '');
  
  // If it looks like hex (contains only hex characters and has even length)
  if (/^[0-9a-fA-F]+$/.test(hexCleaned) && hexCleaned.length % 2 === 0) {
    const byteLength = hexCleaned.length / 2;
    if (byteLength < MIN_TELEGRAM_LENGTH) {
      return { valid: false, error: `Telegram too short: ${byteLength} bytes (minimum ${MIN_TELEGRAM_LENGTH} required)` };
    }
    return { valid: true };
  }
  
  // Empty check
  if (!trimmed) {
    return { valid: false, error: 'Empty telegram' };
  }
  
  // If we get here, assume it's valid and let the API handle it
  // (could be a different format we're not validating)
  return { valid: true };
}

export default function TelegramParserBatchCSVTest() {
  const [csvInput, setCsvInput] = useState('');
  const [results, setResults] = useState<ParseResult[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        setCsvInput(content);
      }
    };
    reader.onerror = () => {
      setParseError('Failed to read file');
    };
    reader.readAsText(file);
  };

  const handleParseCSV = async () => {
    if (!csvInput.trim()) {
      setParseError('Please enter CSV data or upload a CSV file');
      return;
    }

    setParseError(null);
    setResults([]);
    setIsProcessing(true);

    // Parse CSV - expected format: gatewayEui,telegram
    const lines = csvInput.trim().split('\n');
    const parsedLines: { gatewayEui: string; telegram: string }[] = [];
    
    for (const line of lines) {
      const parsed = parseCSVLine(line);
      console.log('Parsed data', parsed)
      if (parsed) {
        parsedLines.push(parsed);
      }
    }
    
    setProgress({ current: 0, total: parsedLines.length });
    const parseResults: ParseResult[] = [];

    for (let i = 0; i < parsedLines.length; i++) {
      const { gatewayEui, telegram } = parsedLines[i];

      // Pre-validate telegram length before sending to API
      const validation = isValidHexOrBuffer(telegram);
      if (!validation.valid) {
        parseResults.push({
          gatewayEui,
          telegram,
          success: false,
          error: validation.error,
        });
        // Update progress even for validation failures
        setProgress({ current: i + 1, total: parsedLines.length });
        continue;
      }

      let telegramPayload: string | { type: string; data: number[] };

      // Check if it's a Buffer-like object (JSON format)

      // Check if it's a Buffer-like object (JSON format)
      try {
        const parsed = JSON.parse(telegram);
        if (parsed && parsed.type === 'Buffer' && Array.isArray(parsed.data)) {
          telegramPayload = parsed;
          console.log('Using Buffer-like object format');
        } else {
          telegramPayload = telegram;
        }
      } catch {
        // Not JSON, use as hex string
        telegramPayload = telegram;
      }


      try {
        // const response = await fetch('/api/mqtt-gateway/telegrams/parse', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ gatewayEui, telegram: telegramPayload }),
        // });

        // if (!response.ok) {
        //   const error = await response.json();
        //   parseResults.push({
        //     gatewayEui,
        //     telegram,
        //     success: false,
        //     error: error.error || 'Failed to parse telegram',
        //   });
        // } else {
        const buffer = Buffer.from(telegram);
        const data = await handleTelegramData(gatewayEui, buffer) //await response.json();
          parseResults.push({
            gatewayEui,
            telegram,
            success: true,
            data: data,
          });
        // }
      } catch (err) {
        parseResults.push({
          gatewayEui,
          telegram,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
      
      // Update progress
      setProgress({ current: i + 1, total: parsedLines.length });
    }

    setResults(parseResults);
    setIsProcessing(false);
  };

  const handleClear = () => {
    setCsvInput('');
    setResults([]);
    setParseError(null);
    setProgress({ current: 0, total: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const successCount = results.filter(r => r.success).length;
  const errorCount = results.filter(r => !r.success).length;

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="text-lg font-medium mb-4">Test Telegram Parser (Batch CSV)</h3>
      
      <div className="mb-4">
        <div className="flex items-center gap-4 mb-2">
          <label htmlFor="csv-file-upload" className="block text-sm font-medium text-gray-700">
            Upload CSV File
          </label>
          <input
            id="csv-file-upload"
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
            "
          />
        </div>
        
        <div className="mt-4">
          <label htmlFor="csv-text-input" className="block text-sm font-medium text-gray-700 mb-1">
            Or paste CSV data (gatewayEui,telegram per line)
          </label>
          <textarea
            id="csv-text-input"
            placeholder={'a840416a926b4b12,{"type":"Buffer","data":[51,68,104,80,32,132,105,17,148,128,162,15,159,51,51,5,176,5,98,2,17,166,8,3,9,95,161,0,178,93,118,47,6,0,0,0,0,0,0,0,0,0,0,0,0,35,119,127,121,160,164,163]}\n# Comments start with #'}
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            rows={8}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Lines starting with # are treated as comments. Minimum telegram length: {MIN_TELEGRAM_LENGTH} bytes.
            Supports JSON Buffer objects with commas inside the data array.
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleParseCSV}
          disabled={isProcessing}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Parse CSV'}
        </button>
        <button
          onClick={handleClear}
          disabled={isProcessing}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          Clear
        </button>
      </div>

      {/* Progress Indicator */}
      {isProcessing && progress.total > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Processing: {progress.current} / {progress.total}</span>
            <span>{Math.round((progress.current / progress.total) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {parseError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-red-600 font-medium">Error:</span> {parseError}
        </div>
      )}

      {/* Results Summary */}
      {results.length > 0 && (
        <div className="mb-4 flex gap-4">
          <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg">
            <span className="font-medium">{successCount}</span> successful
          </div>
          <div className="px-4 py-2 bg-red-100 text-red-700 rounded-lg">
            <span className="font-medium">{errorCount}</span> failed
          </div>
          <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
            <span className="font-medium">{results.length}</span> total
          </div>
        </div>
      )}

      {/* Results Display */}
      {results.length > 0 && (
        <div className="mt-4">
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">#</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Gateway EUI</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Telegram</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Status</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results.map((result, index) => (
                  <tr key={index} className={result.success ? 'bg-green-50' : 'bg-red-50'}>
                    <td className="px-3 py-2 font-mono text-xs text-gray-600">{index + 1}</td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-700">{result.gatewayEui}</td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-600 max-w-xs truncate" title={result.telegram}>
                      {result.telegram}
                    </td>
                    <td className="px-3 py-2">
                      {result.success ? (
                        <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-200 rounded">Success</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-200 rounded">Error</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-gray-700">
                      {result.success && result.data ? (
                        <div className="text-xs">
                          {Object.entries(result.data).filter(([key]) => key !== 'readings').map(([key, value]) => (
                            <div key={key}>
                              <span className="font-mono text-gray-600">{key}:</span> {String(value)}
                            </div>
                          ))}
                          {result.data.readings && (
                            <div className="mt-1 pt-1 border-t border-gray-300">
                              {Object.entries(result.data.readings).map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-mono text-gray-600">readings.{key}:</span> {String(value)}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-red-600 text-xs">{result.error}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

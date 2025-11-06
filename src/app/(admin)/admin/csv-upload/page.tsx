'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import Breadcrumb from '@/components/Admin/Breadcrumb/Breadcrumb';
import ContentWrapper from '@/components/Admin/ContentWrapper/ContentWrapper';
import { ROUTE_ADMIN } from '@/routes/routes';

interface UploadResult {
  fileName?: string;
  recordCount?: number;
  insertedRecords?: number;
  skippedDuplicates?: number;
  skippedHeaders?: number;
  uniqueDeviceIds?: string;
  meterIdMatches?: {
    found: number;
    notFound: number;
  };
  errors?: string[];
  error?: string;
}

interface UploadHistory {
  id: string;
  created_at: string;
  device_id: string;
  device_type: string;
  local_meter_id: string | null;
}

export default function CSVUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [recentUploads, setRecentUploads] = useState<UploadHistory[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    loadUploadHistory();
  }, []);

  const loadUploadHistory = async () => {
    setLoadingHistory(true);
    try {
      
      // Get total count (without head: true to avoid RLS issues)
      const { count, error: countError } = await supabase
        .from('parsed_data')
        .select('id', { count: 'exact', head: false });
      
      if (countError) {
        console.error('Error getting count:', countError);
      } else {
        setTotalRecords(count || 0);
      }

      // Get recent uploads (last 100 records)
      const { data, error } = await supabase
        .from('parsed_data')
        .select('id, created_at, device_id, device_type, local_meter_id')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error loading history:', error);
      } else {
        setRecentUploads(data || []);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
        alert('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      // Read file content
      const content = await file.text();
      
      // Upload to API with filename parameter
      const response = await fetch(`/api/upload-csv?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'x-filename': file.name,
        },
        body: content,
      });

      const data = await response.json();
      setResult(data);

      // Reload history if upload was successful
      if (data.insertedRecords > 0) {
        setTimeout(() => loadUploadHistory(), 1000);
      }
    } catch (error: any) {
      setResult({ error: error.message });
    } finally {
      setUploading(false);
    }
  };

  // Group uploads by date
  const uploadsByDate = recentUploads.reduce((acc, upload) => {
    const date = new Date(upload.created_at).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(upload);
    return acc;
  }, {} as Record<string, UploadHistory[]>);

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] overflow-y-auto">
      <Breadcrumb
        backTitle="Admin"
        link={ROUTE_ADMIN}
        title="CSV Upload"
      />
      
      <ContentWrapper className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Manual CSV Upload</h2>
          <p className="text-gray-600">
            Upload meter reading CSV files from Engelmann Gateway. All data is permanently stored.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-600 font-medium">Total Records</div>
            <div className="text-2xl font-bold text-blue-900">
              {totalRecords.toLocaleString()}
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm text-green-600 font-medium">Parser Status</div>
            <div className="text-lg font-bold text-green-900">✅ Fixed & Deployed</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-sm text-purple-600 font-medium">Recent Uploads</div>
            <div className="text-2xl font-bold text-purple-900">
              {Object.keys(uploadsByDate).length} days
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  cursor-pointer"
              />
            </div>

            {file && (
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{file.name}</div>
                    <div className="text-sm text-gray-600">
                      {(file.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg 
                      hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                      font-medium transition-colors"
                  >
                    {uploading ? 'Uploading...' : 'Upload CSV'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className={`p-6 rounded-lg border-2 ${
            result.error 
              ? 'bg-red-50 border-red-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">
                {result.error ? '❌ Upload Failed' : '✅ Upload Complete'}
              </h3>
              {result.fileName && !result.error && (
                <div className="text-sm text-gray-600 font-mono bg-white px-3 py-1 rounded border border-gray-300">
                  📄 {result.fileName}
                </div>
              )}
            </div>
            
            {result.error ? (
              <div className="text-red-700">{result.error}</div>
            ) : (
              <div className="space-y-4">
                {/* Summary Box */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <div className="text-sm font-semibold text-gray-700 mb-3">📊 UPLOAD SUMMARY</div>
                  
                  <div className="space-y-3">
                    {/* Total */}
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                      <span className="text-gray-700 font-medium">Total Records in File</span>
                      <span className="text-xl font-bold">{result.recordCount}</span>
                    </div>

                    {/* Valid Data Section */}
                    <div className="pl-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-8 bg-blue-500 rounded"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700">✅ Valid Data Records</div>
                          <div className="text-xs text-gray-500">Actual meter readings</div>
                        </div>
                        <span className="text-lg font-bold text-blue-600">
                          {(result.recordCount || 0) - (result.skippedHeaders || 0)}
                        </span>
                      </div>
                      
                      {/* Breakdown */}
                      <div className="pl-8 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">├─ New records inserted:</span>
                          <span className="font-bold text-green-600">{result.insertedRecords || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">└─ Duplicates skipped:</span>
                          <span className="font-bold text-purple-600">{result.skippedDuplicates || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Filtered Section */}
                    {(result.skippedHeaders || 0) > 0 && (
                      <div className="pl-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-8 bg-gray-400 rounded"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700">🗑️ Filtered Out</div>
                            <div className="text-xs text-gray-500">Invalid/header rows</div>
                          </div>
                          <span className="text-lg font-bold text-gray-600">
                            {result.skippedHeaders || 0}
                          </span>
                        </div>
                        <div className="pl-8 text-sm text-gray-600">
                          └─ Header rows automatically removed
                        </div>
                      </div>
                    )}

                    {/* Meter Linking Section */}
                    <div className="pl-4 space-y-2 pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-8 bg-green-500 rounded"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700">🔗 Meter Linking</div>
                          <div className="text-xs text-gray-500">Connected to apartments</div>
                        </div>
                      </div>
                      <div className="pl-8 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">├─ Linked to apartments:</span>
                          <span className="font-bold text-blue-600">{result.meterIdMatches?.found || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">└─ Not linked yet:</span>
                          <span className="font-bold text-orange-600">{result.meterIdMatches?.notFound || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Message */}
                {result.insertedRecords === 0 && result.skippedDuplicates > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="text-2xl">💡</div>
                    <div>
                      <div className="font-semibold text-purple-900">This file was already uploaded</div>
                      <div className="text-sm text-purple-700">
                        All {result.skippedDuplicates} data records were skipped because they already exist in the database.
                        {(result.skippedHeaders || 0) > 0 && ` Additionally, ${result.skippedHeaders} header rows were filtered out.`}
                      </div>
                    </div>
                  </div>
                )}

                {result.insertedRecords > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-2xl">✨</div>
                    <div>
                      <div className="font-semibold text-green-900">Successfully imported new data</div>
                      <div className="text-sm text-green-700">
                        {result.insertedRecords} new records were added to the database.
                        {result.skippedDuplicates > 0 && ` ${result.skippedDuplicates} duplicates were skipped.`}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {result.errors && result.errors.length > 0 && (
              <details className="mt-4">
                <summary className="cursor-pointer font-medium text-red-700">
                  View Errors ({result.errors.length})
                </summary>
                <div className="mt-2 max-h-40 overflow-y-auto text-sm text-red-600">
                  {result.errors.slice(0, 5).map((error, i) => (
                    <div key={i} className="py-1 border-t border-red-200">
                      {error}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}

        {/* Upload History */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            Recent Uploads History ({totalRecords.toLocaleString()} total records)
          </h2>
          
          {loadingHistory ? (
            <div className="text-center py-8 text-gray-500">Loading history...</div>
          ) : (
            <div className="space-y-6">
              {Object.entries(uploadsByDate).map(([date, uploads]) => (
                <div key={date}>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">{date}</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Time
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Device ID
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Type
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Linked
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {uploads
                          .filter((upload) => {
                            // Filter out header rows and invalid device IDs
                            const invalidIds = ['ID', 'Device Type', '', null, undefined];
                            const invalidTypes = ['Device Type', '', null, undefined];
                            return (
                              !invalidIds.includes(upload.device_id) &&
                              !invalidTypes.includes(upload.device_type) &&
                              upload.device_id?.trim().length > 0
                            );
                          })
                          .map((upload) => (
                          <tr key={upload.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                              {new Date(upload.created_at).toLocaleTimeString()}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-mono text-gray-900">
                              {upload.device_id}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                              {upload.device_type}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                              {upload.local_meter_id ? (
                                <span className="text-green-600 font-medium">✅ Yes</span>
                              ) : (
                                <span className="text-orange-600 font-medium">⚠️ No</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ContentWrapper>
    </div>
  );
}


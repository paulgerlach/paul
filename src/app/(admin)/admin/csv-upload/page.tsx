'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [recentUploads, setRecentUploads] = useState<UploadHistory[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // 🔒 SECURITY: Check if user is admin on mount
  useEffect(() => {
    checkAdminPermission();
  }, []);

  const checkAdminPermission = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/');
        return;
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('permission')
        .eq('id', user.id)
        .single();

      if (error || !userData || userData.permission !== 'admin') {
        console.error('Unauthorized access attempt to CSV Upload');
        router.push(ROUTE_ADMIN);
        return;
      }

      setIsAuthorized(true);
    } catch (error) {
      console.error('Error checking admin permission:', error);
      router.push('/');
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      loadUploadHistory();
    }
  }, [isAuthorized]);

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

  // 🔒 SECURITY: Show loading or redirect if not authorized
  if (isAuthorized === null) {
    return (
      <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg max-medium:text-base text-gray-600">Checking authorization...</div>
        </div>
      </div>
    );
  }

  if (isAuthorized === false) {
    return null; // Will redirect via router.push in checkAdminPermission
  }

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-medium:h-auto max-medium:max-h-none overflow-y-auto">
      <Breadcrumb
        backTitle="Admin"
        link={ROUTE_ADMIN}
        title="CSV Upload"
      />
      
      <ContentWrapper className="space-y-6 max-medium:space-y-4">
        {/* Header */}
        <div>
          <h2 className="text-2xl max-medium:text-xl font-bold mb-2">Manual CSV Upload (Super Admin Only)</h2>
          <p className="text-gray-600 max-medium:text-sm">
            Upload meter reading CSV files from Engelmann Gateway. All data is permanently stored.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-medium:gap-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-medium:p-3">
            <div className="text-sm max-medium:text-xs text-blue-600 font-medium">Total Records</div>
            <div className="text-2xl max-medium:text-xl font-bold text-blue-900">
              {totalRecords.toLocaleString()}
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-medium:p-3">
            <div className="text-sm max-medium:text-xs text-green-600 font-medium">Parser Status</div>
            <div className="text-lg max-medium:text-base font-bold text-green-900">✅ Fixed & Deployed</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-medium:p-3">
            <div className="text-sm max-medium:text-xs text-purple-600 font-medium">Recent Uploads</div>
            <div className="text-2xl max-medium:text-xl font-bold text-purple-900">
              {Object.keys(uploadsByDate).length} days
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 max-medium:p-4 bg-gray-50">
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
              <div className="p-4 max-medium:p-3 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between max-medium:flex-col max-medium:items-stretch max-medium:gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 max-medium:text-sm truncate">{file.name}</div>
                    <div className="text-sm max-medium:text-xs text-gray-600">
                      {(file.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="px-6 py-2 max-medium:px-4 max-medium:py-2 bg-blue-600 text-white rounded-lg 
                      hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                      font-medium max-medium:text-sm transition-colors max-medium:w-full"
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
          <div className={`p-6 max-medium:p-4 rounded-lg border-2 ${
            result.error 
              ? 'bg-red-50 border-red-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center justify-between max-medium:flex-col max-medium:items-start max-medium:gap-2 mb-4">
              <h3 className="font-bold text-lg max-medium:text-base">
                {result.error ? '❌ Upload Failed' : '✅ Upload Complete'}
              </h3>
              {result.fileName && !result.error && (
                <div className="text-sm max-medium:text-xs text-gray-600 font-mono bg-white px-3 py-1 rounded border border-gray-300 truncate max-w-full">
                  📄 {result.fileName}
                </div>
              )}
            </div>
            
            {result.error ? (
              <div className="text-red-700">{result.error}</div>
            ) : (
              <div className="space-y-4">
                {/* Summary Box */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4 max-medium:p-3">
                  <div className="text-sm max-medium:text-xs font-semibold text-gray-700 mb-3">📊 UPLOAD SUMMARY</div>
                  
                  <div className="space-y-4 max-medium:space-y-3">
                    {/* Simple Math Breakdown at Top */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 max-medium:p-3">
                      <div className="flex items-baseline justify-between mb-2 max-medium:flex-col max-medium:items-start max-medium:gap-1">
                        <span className="text-gray-700 font-medium max-medium:text-sm">📄 Total Rows in CSV File</span>
                        <span className="text-2xl max-medium:text-xl font-bold text-gray-900">{result.recordCount}</span>
                      </div>
                      
                      <div className="text-sm max-medium:text-xs space-y-1 ml-4 max-medium:ml-0 pt-2 border-t border-gray-300">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">= Meter readings (data)</span>
                          <span className="font-bold text-blue-600">{(result.recordCount || 0) - (result.skippedHeaders || 0)}</span>
                        </div>
                        {(result.skippedHeaders || 0) > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">+ Header rows (auto-removed)</span>
                            <span className="font-bold text-gray-500">{result.skippedHeaders || 0}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* What Happened Section */}
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-gray-600 uppercase">What Happened:</div>
                      
                      {/* New vs Duplicate */}
                      <div className="grid grid-cols-2 gap-3 max-medium:gap-2">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-medium:p-2">
                          <div className="text-xs text-green-700 mb-1">✅ New Data Added</div>
                          <div className="text-2xl max-medium:text-xl font-bold text-green-600">{result.insertedRecords || 0}</div>
                        </div>
                        
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 max-medium:p-2">
                          <div className="text-xs text-purple-700 mb-1">🔄 Duplicates Skipped</div>
                          <div className="text-2xl max-medium:text-xl font-bold text-purple-600">{result.skippedDuplicates || 0}</div>
                        </div>
                      </div>

                      {/* Meter Linking */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-medium:p-2">
                        <div className="text-xs text-gray-600 mb-2">🔗 Meter Linking Status:</div>
                        <div className="grid grid-cols-2 gap-2 text-sm max-medium:text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Linked:</span>
                            <span className="font-bold text-blue-600">{result.meterIdMatches?.found || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Not linked:</span>
                            <span className="font-bold text-orange-600">{result.meterIdMatches?.notFound || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Message */}
                {result.insertedRecords === 0 && (result.skippedDuplicates || 0) > 0 && (
                  <div className="flex items-start gap-3 max-medium:gap-2 p-4 max-medium:p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="text-2xl max-medium:text-xl flex-shrink-0">💡</div>
                    <div>
                      <div className="font-semibold text-purple-900 max-medium:text-sm">This file was already uploaded</div>
                      <div className="text-sm max-medium:text-xs text-purple-700">
                        All {result.skippedDuplicates || 0} data records were skipped because they already exist in the database.
                        {(result.skippedHeaders || 0) > 0 && ` Additionally, ${result.skippedHeaders} header rows were filtered out.`}
                      </div>
                    </div>
                  </div>
                )}

                {(result.insertedRecords || 0) > 0 && (
                  <div className="flex items-start gap-3 max-medium:gap-2 p-4 max-medium:p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-2xl max-medium:text-xl flex-shrink-0">✨</div>
                    <div>
                      <div className="font-semibold text-green-900 max-medium:text-sm">Successfully imported new data</div>
                      <div className="text-sm max-medium:text-xs text-green-700">
                        {result.insertedRecords || 0} new records were added to the database.
                        {(result.skippedDuplicates || 0) > 0 && ` ${result.skippedDuplicates} duplicates were skipped.`}
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
        <div className="bg-white border border-gray-200 rounded-lg p-6 max-medium:p-4">
          <h2 className="text-xl max-medium:text-lg font-bold mb-4 max-medium:mb-3">
            Recent Uploads History ({totalRecords.toLocaleString()} total records)
          </h2>
          
          {loadingHistory ? (
            <div className="text-center py-8 max-medium:py-4 text-gray-500 max-medium:text-sm">Loading history...</div>
          ) : (
            <div className="space-y-6 max-medium:space-y-4">
              {Object.entries(uploadsByDate).map(([date, uploads]) => (
                <div key={date}>
                  <h3 className="text-lg max-medium:text-base font-semibold text-gray-700 mb-2">{date}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200 max-medium:text-[10px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 max-medium:px-1 py-2 text-left text-xs max-medium:text-[10px] font-medium text-gray-500 uppercase">
                            Time
                          </th>
                          <th className="px-2 max-medium:px-1 py-2 text-left text-xs max-medium:text-[10px] font-medium text-gray-500 uppercase">
                            ID
                          </th>
                          <th className="px-2 max-medium:px-1 py-2 text-left text-xs max-medium:text-[10px] font-medium text-gray-500 uppercase">
                            Type
                          </th>
                          <th className="px-2 max-medium:px-1 py-2 text-center text-xs max-medium:text-[10px] font-medium text-gray-500 uppercase">
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
                            <td className="px-2 max-medium:px-1 py-2 whitespace-nowrap text-sm max-medium:text-[10px] text-gray-900">
                              {new Date(upload.created_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="px-2 max-medium:px-1 py-2 whitespace-nowrap text-sm max-medium:text-[10px] font-mono text-gray-900">
                              {upload.device_id}
                            </td>
                            <td className="px-2 max-medium:px-1 py-2 whitespace-nowrap text-sm max-medium:text-[10px] text-gray-900">
                              {upload.device_type}
                            </td>
                            <td className="px-2 max-medium:px-1 py-2 whitespace-nowrap text-sm max-medium:text-[10px] text-center">
                              {upload.local_meter_id ? (
                                <span className="text-green-600">✅</span>
                              ) : (
                                <span className="text-orange-600">⚠️</span>
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


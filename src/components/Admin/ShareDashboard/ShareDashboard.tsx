"use client";

import { useState } from 'react';
import { createShareableUrl, DashboardFilters } from '@/lib/shareUtils';
import { useChartStore } from '@/store/useChartStore';
import { Copy, Share2, Check, ExternalLink } from 'lucide-react';

interface ShareDashboardProps {
  userId: string;
  objectId?: string;
  className?: string;
}

export default function ShareDashboard({ userId, objectId, className = "" }: ShareDashboardProps) {
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const { startDate, endDate, meterIds } = useChartStore();

  const generateShareLink = () => {
    const filters: DashboardFilters = {
      startDate: startDate?.toISOString().split('T')[0] || null,
      endDate: endDate?.toISOString().split('T')[0] || null,
      meterIds,
      userId,
      objectId
    };

    const url = createShareableUrl(filters);
    setShareUrl(url);
    setShowModal(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openInNewTab = () => {
    window.open(shareUrl, '_blank');
  };

  const hasFilters = startDate || endDate || meterIds.length > 0;

  return (
    <>
      <button
        onClick={generateShareLink}
        disabled={!hasFilters}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
          ${hasFilters 
            ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
          ${className}
        `}
        title={hasFilters ? 'Share current dashboard view' : 'Apply filters first to enable sharing'}
      >
        <Share2 size={16} />
        Share Dashboard
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Share Dashboard</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Share this read-only dashboard view with external parties. Recipients can view the data but cannot modify filters.
              </p>
              
              {/* Filter Summary */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Applied Filters:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {startDate && endDate && (
                    <li>📅 Date Range: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</li>
                  )}
                  {meterIds.length > 0 && (
                    <li>📊 Meters: {meterIds.length} selected</li>
                  )}
                  {objectId && (
                    <li>🏢 Object: {objectId}</li>
                  )}
                </ul>
              </div>
              
              {/* Share URL */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
                />
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <button
                  onClick={openInNewTab}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink size={16} />
                </button>
              </div>
              
              {copied && (
                <p className="text-sm text-green-600 mt-2">✓ Link copied to clipboard!</p>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={copyToClipboard}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


"use client";

import { useState } from "react";
import { createShareableUrl, ShareFilters } from "@/lib/shareUtils";
import { useChartStore } from "@/store/useChartStore";

interface ShareButtonProps {
  className?: string;
}

export default function ShareButton({ className = "" }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const { startDate, endDate, meterIds } = useChartStore();

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      // Create filters from current dashboard state
      // Don't send meterIds if none selected (share ALL data)
      const filters: ShareFilters = {
        meterIds: meterIds.length > 0 ? meterIds : undefined,
        startDate: startDate?.toISOString().split('T')[0],
        endDate: endDate?.toISOString().split('T')[0]
      };

      // Generate secure shareable URL (30 days expiry)
      const url = createShareableUrl(filters, 720); // 30 days
      const fullUrl = `${window.location.origin}${url}`;
      
      setShareUrl(fullUrl);
      setShowModal(true);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(fullUrl);
    } catch (error) {
      console.error('Failed to create share link:', error);
      alert('Freigabe-Link konnte nicht erstellt werden. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Kopieren in die Zwischenablage fehlgeschlagen');
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        disabled={isSharing}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 ${className}`}
      >
        {isSharing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="animate-pulse">Erstelle Link...</span>
          </>
        ) : (
          <>
            <span className="animate-bounce">📤</span>
            <span>Dashboard teilen</span>
          </>
        )}
      </button>

      {/* Enhanced Share Modal with Animations */}
      {showModal && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right-4 duration-300">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-96 p-6 border border-gray-200 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
            {/* Header with gradient and animation */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white text-sm animate-bounce">📊</span>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Dashboard teilen
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200 hover:rotate-90"
              >
                ✕
              </button>
            </div>
            
            {/* Description with better styling */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Share this link with tenants to give them access to their usage data:
              </p>
              
              {/* Enhanced URL input with copy functionality */}
              <div className="relative">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="w-full p-3 pr-20 border-2 border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-blue-300 focus:bg-white transition-all duration-200 font-mono"
                />
                <button
                  onClick={copyToClipboard}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    copied 
                      ? 'bg-green-100 text-green-700 scale-105' 
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:scale-105'
                  }`}
                >
                  {copied ? (
                    <span className="flex items-center gap-1">
                      <span className="animate-bounce">✅</span>
                      Copied!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      📋 Copy
                    </span>
                  )}
                </button>
              </div>
            </div>
            
            {/* Enhanced info section with icons and better spacing */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-100">
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-orange-500">⏰</span>
                  <span>Link expires in 30 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">🔒</span>
                  <span>Only shows data for selected meters and date range</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">🛡️</span>
                  <span>Link cannot be modified or tampered with</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Done button */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}

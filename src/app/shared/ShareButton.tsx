"use client";

import { useState } from "react";
import { createShareableUrl, ShareFilters } from "@/lib/shareUtils";
import { useChartStore } from "@/store/useChartStore";
import { useDialogStore } from "@/store/useDIalogStore";
import DialogBase from "@/components/Basic/ui/DialogBase";

interface ShareButtonProps {
  className?: string;
}

export default function ShareButton({ className = "" }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [regelErstellen, setRegelErstellen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [emailTitle, setEmailTitle] = useState('');
  const [messageToTenant, setMessageToTenant] = useState('');
  
  const { startDate, endDate, meterIds } = useChartStore();
  const { openDialog, closeDialog, openDialogByType } = useDialogStore();

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
      openDialog("shareModal");
      
      // Copy to clipboard
      await navigator.clipboard.writeText(fullUrl);
    } catch (error) {
      console.error('Failed to create share link:', error);
      alert('Failed to create share link. Please try again.');
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
      alert('Failed to copy to clipboard');
    }
  };

  const handlePDFExport = () => {
    // TODO: Implement PDF export functionality
    console.log('Exporting dashboard as PDF...');
    // This would generate a PDF of the current dashboard view
  };

  const handleDownloadLink = () => {
    // Download the share URL as a text file
    const element = document.createElement('a');
    const file = new Blob([shareUrl], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'dashboard-link.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleGmailShare = () => {
    const subject = encodeURIComponent('Dashboard-Zugang für Ihre Verbrauchsdaten');
    const body = encodeURIComponent(`Hallo,

hier ist der Link zu Ihrem persönlichen Dashboard mit Ihren Verbrauchsdaten:

${shareUrl}

Mit freundlichen Grüßen`);
    
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, '_blank');
  };

  const handleDateSelection = (dateRange: string) => {
    setSelectedDateRange(dateRange);
    setShowCalendar(false);
  };

  const handleSaveExtendedShare = () => {
    // TODO: Implement backend integration for saving share rules
    console.log('Saving extended share configuration:', {
      shareUrl,
      dateRange: selectedDateRange,
      emailTitle,
      messageToTenant,
      regelErstellen: true
    });
    
    // For now, just close the modal
    closeDialog("shareExtendedModal");
  };

  return (
    <>
      <button
        onClick={handleShare}
        disabled={isSharing}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-[#8AD68F] hover:bg-[#7BC87F] disabled:bg-[#A8E6AD] text-black rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 ${className}`}
      >
        {isSharing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="animate-pulse">Link wird erstellt...</span>
          </>
        ) : (
          <>
            <span className="animate-bounce">📤</span>
            <span>Dashboard Teilen</span>
          </>
        )}
      </button>

      {/* Enhanced Share Modal with DialogBase */}
      {openDialogByType.shareModal && (
        <DialogBase dialogName="shareModal" size={480}>
            {/* Content Container with Padding */}
            <div className="-mt-6 space-y-6">
              {/* Header */}
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Dashboard teilen
                </h3>
              </div>
              
              {/* Description */}
              <div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Dashboard direkt an Mieter teilen und die Verbrauchsdaten übersichtlich zur Verfügung stellen.
                </p>
              </div>
              
              {/* Link section */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Link mit Mietern teilen
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="w-full h-12 px-3 pr-20 border border-gray-300 rounded-lg text-sm bg-white focus:border-blue-300 transition-all duration-200"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="absolute right-1 top-1 h-10 px-3 bg-[#8AD68F] hover:bg-[#7BC87F] rounded-md text-black text-sm font-medium transition-all duration-200"
                  >
                    {copied ? "Kopiert!" : "Kopieren"}
                  </button>
                </div>
              </div>
              
              {/* Sharing section */}
              <div>
                <label className="text-sm text-gray-600 mb-3 block">
                  An Mieter teilen
                </label>
                <div className="flex gap-4">
                  {/* PDF Export */}
                  <div 
                    onClick={() => handlePDFExport()}
                    className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform duration-200"
                  >
                    <img src="/pdf_icon.png" alt="PDF Export" className="w-full h-full object-contain opacity-80 hover:opacity-100" />
                  </div>
                  {/* Download Link */}
                  <div 
                    onClick={() => handleDownloadLink()}
                    className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform duration-200"
                  >
                    <img src="/doc_download.png" alt="Download" className="w-full h-full object-contain opacity-50 hover:opacity-100" />
                  </div>
                  {/* Gmail Share */}
                  <div 
                    onClick={() => handleGmailShare()}
                    className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform duration-200"
                  >
                    <img src="/gmail.png" alt="Gmail" className="w-full h-full object-contain opacity-80 hover:opacity-100" />
                  </div>
                </div>
              </div>
              
              {/* Regel erstellen toggle */}
              <div>
                <div 
                  onClick={() => {
                    closeDialog("shareModal");
                    openDialog("shareExtendedModal");
                  }}
                  className="flex items-center gap-3 px-4 py-2 border border-gray-300 rounded-full bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                  <span className="text-gray-800 text-sm">Regel erstellen</span>
                </div>
              </div>
            </div>
        </DialogBase>
      )}

      {/* Extended Modal (Second Frame) */}
      {openDialogByType.shareExtendedModal && (
        <DialogBase dialogName="shareExtendedModal" size={520}>
            {/* Scrollable Content Container */}
            <div className="max-h-[70vh] overflow-y-auto -mt-6">
              {/* Content Container with Padding */}
              <div className="space-y-6">
              {/* Header */}
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Dashboard teilen
                </h3>
              </div>
              
              {/* Description */}
              <div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Dashboard direkt an Mieter teilen und die Verbrauchsdaten übersichtlich zur Verfügung stellen.
                </p>
              </div>
              
              {/* Link section */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Link mit Mietern teilen
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="w-full h-12 px-3 pr-20 border border-gray-300 rounded-lg text-sm bg-white focus:border-blue-300 transition-all duration-200"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="absolute right-1 top-1 h-10 px-3 bg-[#8AD68F] hover:bg-[#7BC87F] rounded-md text-black text-sm font-medium transition-all duration-200"
                  >
                    {copied ? "Kopiert!" : "Kopieren"}
                  </button>
                </div>
              </div>
              
              {/* Regel erstellen toggle - activated */}
              <div>
                <div className="flex items-center gap-3 px-4 py-2 border border-green-400 rounded-full bg-green-50 transition-colors">
                  <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-gray-800 text-sm">Regel erstellen</span>
                </div>
              </div>
              
              {/* Zeitspanne field */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Zeitspanne
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Zeitraum auswählen..."
                    value={selectedDateRange}
                    onClick={() => setShowCalendar(true)}
                    className="w-full h-12 px-3 pr-10 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer hover:border-blue-300 transition-all duration-200"
                    readOnly
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-400 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Email Titel field */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Email Titel
                </label>
                <input
                  type="text"
                  value={emailTitle}
                  onChange={(e) => setEmailTitle(e.target.value)}
                  className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:border-blue-300 transition-all duration-200"
                  placeholder="E-Mail Betreff eingeben..."
                />
              </div>
              
              {/* Nachricht an Mieter field */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Nachricht an Mieter
                </label>
                <textarea
                  value={messageToTenant}
                  onChange={(e) => setMessageToTenant(e.target.value)}
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-blue-300 transition-all duration-200 resize-none"
                  placeholder="Persönliche Nachricht an den Mieter..."
                />
              </div>
              
              {/* Action buttons */}
              <div className="flex justify-between gap-4 pt-4">
                <button
                  onClick={() => closeDialog("shareExtendedModal")}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSaveExtendedShare}
                  className="px-6 py-2 bg-[#8AD68F] hover:bg-[#7BC87F] rounded-lg text-black text-sm font-medium transition-all duration-200"
                >
                  Speichern
                </button>
              </div>
            </div>
          </div>
        </DialogBase>
      )}

      {/* Calendar Popup */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white rounded-lg shadow-2xl w-[489px] h-[633px] animate-in zoom-in-95 duration-300 relative">
            {/* Close button */}
            <button
              onClick={() => setShowCalendar(false)}
              className="absolute top-4 right-4 w-6 h-6 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:rotate-90 z-10"
            >
              ✕
            </button>
            
            {/* Calendar Header */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Titel hinzufügen
              </h3>
            </div>
            
            {/* Calendar Content - Simplified for now */}
            <div className="p-6">
              <div className="mb-4">
                <div className="flex gap-2 mb-4">
                  <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
                    Termin
                  </button>
                  <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    Aufgabe
                  </button>
                  <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    Terminplan
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Datum & Zeit</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Donnerstag, 4. September</span>
                      <span className="text-sm">06:15 - 07:15</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Ganztägig</span>
                    <span className="text-sm text-blue-600">Zeitzone</span>
                  </div>
                  
                  <div>
                    <select className="w-full p-2 border border-gray-300 rounded-lg">
                      <option>Einmalig</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
                      <span className="text-sm">Gäste hinzufügen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                      <span className="text-sm">Google Meet-Videokonferenz hinzufügen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-gray-500 rounded-full"></span>
                      <span className="text-sm">Ort hinzufügen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-yellow-500 rounded-full"></span>
                      <span className="text-sm">Beschreibung oder einen Google Drive-Anhang hinzufügen</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Calendar Footer */}
            <div className="absolute bottom-6 right-6 flex gap-3">
              <button
                onClick={() => setShowCalendar(false)}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Weitere Optionen
              </button>
              <button
                onClick={() => handleDateSelection('Donnerstag, 4. September - 06:15 bis 07:15')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";
import { createShareableUrl } from "@/lib/shareUtils";
import { useChartStore } from "@/store/useChartStore";

export default function ShareButton() {
  const { startDate, endDate, meterIds } = useChartStore();
  
  const handleShare = () => {
    const shareUrl = createShareableUrl({
      startDate: startDate?.toISOString().split('T')[0] || undefined,
      endDate: endDate?.toISOString().split('T')[0] || undefined,
      meterIds: meterIds.length > 0 ? meterIds : undefined
    });
    navigator.clipboard.writeText(window.location.origin + shareUrl);
    
    // Show expiration info in alert
    const expiryDate = new Date(Date.now() + (24 * 60 * 60 * 1000));
    alert(`✅ Share link copied to clipboard!\n\n⏰ Link expires in 24 hours (${expiryDate.toLocaleString()})\n\n🔗 Recipients will have read-only access to your current dashboard filters.`);
  };

  return (
    <button 
      onClick={handleShare}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      📤 Share Dashboard
    </button>
  );
}

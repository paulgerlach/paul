// Demo mode configuration
export const isDemoMode = (): boolean => {
  // Check if we're in development
  if (typeof window !== 'undefined') {
    // Check URL for demo parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true') return true;
    
    // Check if localhost (development)
    if (window.location.hostname === 'localhost') return true;
    
    // Check if it's the demo Vercel URL
    if (window.location.hostname.includes('heidisystems-livedemo') || 
        window.location.hostname.includes('vercel.app')) return true;
  }
  
  // Server-side: check environment
  return process.env.NODE_ENV === 'development' || 
         process.env.VERCEL_URL?.includes('heidisystems-livedemo') ||
         process.env.VERCEL_URL?.includes('vercel.app') ||
         false;
};

export const getDemoConfig = () => ({
  isDemo: isDemoMode(),
  showMockPanel: isDemoMode(), // Show MockPanel in demo mode (localhost + Vercel demo)
  showIoTOverlay: isDemoMode(), // Show IoT overlay in demo mode (localhost + Vercel demo)
});

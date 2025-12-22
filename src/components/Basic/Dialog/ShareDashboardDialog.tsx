"use client";

import { useDialogStore } from "@/store/useDIalogStore";
import DialogBase from "../ui/DialogBase";
import { useEffect, useState } from "react";
import { useShareStore } from "@/store/useShareStore";
import { useChartStore } from "@/store/useChartStore";
import { createShareableUrl, ShareFilters } from "@/lib/shareUtils";
import { Button } from "../ui/Button";

export default function ShareDashboardDialog() {
  const { openDialogByType } = useDialogStore();
  const isOpen = openDialogByType.share_dashboard;
  const [copied, setCopied] = useState<boolean>(false);
  const { shareUrl, generateShareUrl, setShareUrl } = useShareStore();
  const [tenantEmail, setTenantEmail] = useState<string>("");
  const [sendingCode, setSendingCode] = useState<boolean>(false);
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const [generatedPin, setGeneratedPin] = useState<string>("");

  const { startDate, endDate, meterIds } = useChartStore();

  // Helper to format date as YYYY-MM-DD in local timezone (not UTC)
  const formatLocalDate = (date: Date | null): string | undefined => {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper to format date for German users (dd.MM.yyyy, HH:mm Uhr)
  const formatGermanDateTime = (isoDateString: string): string => {
    const date = new Date(isoDateString);
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Berlin'
    }) + ' Uhr';
  };

  const handleShare = async () => {
    try {
      // Debug: Log current state
      console.log('Share Dialog Current State:', {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        startDateLocal: formatLocalDate(startDate),
        endDateLocal: formatLocalDate(endDate),
        meterIds: meterIds,
        meterIdsLength: meterIds.length
      });

      // Create filters from current dashboard state
      // Only include dates if they're actually set in the dashboard
      // Use local date formatting to avoid timezone issues
      const filters: ShareFilters = {
        meterIds: meterIds.length > 0 ? meterIds : undefined,
        startDate: formatLocalDate(startDate),
        endDate: formatLocalDate(endDate),
      };

      console.log('Filters being sent:', filters);

      // Generate secure shareable URL (30 days expiry)
      const url = createShareableUrl(filters, 720); // 30 days
      const fullUrl = `${window.location.origin}${url}`;

      console.log('Generated URL:', fullUrl);

      setShareUrl(fullUrl);

      // Try to copy to clipboard (optional, don't fail if it doesn't work)
      try {
        await navigator.clipboard.writeText(fullUrl);
        console.log('URL copied to clipboard automatically');
      } catch (clipboardError) {
        // Clipboard write failed, but that's okay - user can still use the copy button
        console.log('Auto-copy skipped (requires user interaction)');
      }
    } catch (error) {
      console.error("Failed to create share link:", error);
      alert("Failed to create share link. Please try again.");
    }
  };

  useEffect(() => {
    handleShare();
  }, [startDate, endDate, meterIds]); // Regenerate URL when state changes


  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to copy:", error);
      alert("Failed to copy to clipboard");
    }
  };

  // Handle sending access code to tenant
  const handleSendAccessCode = async () => {
    if (!tenantEmail || !tenantEmail.includes('@')) {
      alert('Bitte geben Sie eine gültige E-Mail-Adresse ein');
      return;
    }

    setSendingCode(true);
    
    try {
      // Extract link params from shareUrl
      const urlObj = new URL(shareUrl);
      const linkParams = urlObj.search.substring(1); // Remove leading '?'
      
      // Get expiry from URL params
      const expParam = urlObj.searchParams.get('exp');
      const expiresAt = expParam ? new Date(parseInt(expParam)).toISOString() : undefined;

      // Call API to generate PIN
      const response = await fetch('/api/share-pin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: tenantEmail,
          linkParams: linkParams,
          expiresAt: expiresAt,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate PIN');
      }

      setGeneratedPin(result.pin);
      setCodeSent(true);
      
      console.log('[share-pin] Access code generated for:', tenantEmail);
      console.log('[share-pin] PIN:', result.pin);
      console.log('[share-pin] Share token:', result.shareToken);
      console.log('[share-pin] Expires:', result.expiresAt);
      
      // Build SHORT URL using share token (instead of long URL with all meters)
      const shortShareUrl = `${window.location.origin}/shared/verify?token=${result.shareToken}`;
      console.log('[share-pin] Short URL:', shortShareUrl);
      
      // Trigger Make.com webhook to send email to tenant
      try {
        // Format expiry for display (German format)
        const formattedExpiry = formatGermanDateTime(result.expiresAt);
        
        const webhookPayload = {
          email: tenantEmail,
          pin: result.pin,
          shareUrl: shortShareUrl, // Short URL with token
          expiresAt: result.expiresAt, // ISO format (keeps Make.com happy)
          expiresAtDisplay: formattedExpiry, // German format for email display
        };
        
        console.log('[share-pin] 📤 Sending webhook payload:', webhookPayload);
        
        const webhookResponse = await fetch('https://hook.eu2.make.com/0nabn3y343aq32nnvi2m1sd8u5k2k7yn', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload),
        });
        
        console.log('[share-pin] 📥 Webhook response status:', webhookResponse.status);
        console.log('[share-pin] 📥 Webhook response ok:', webhookResponse.ok);
        
        if (!webhookResponse.ok) {
          console.error('[share-pin] ❌ Webhook returned error status:', webhookResponse.status);
        } else {
          console.log('[share-pin] ✅ Email webhook triggered successfully for:', tenantEmail);
        }
      } catch (webhookError) {
        // Don't fail the whole process if email fails
        console.error('[share-pin] ❌ Email webhook failed:', webhookError);
      }
      
    } catch (error) {
      console.error('Fehler beim Senden des Zugangscodes:', error);
      alert('Fehler beim Senden des Zugangscodes. Bitte versuchen Sie es erneut.');
    } finally {
      setSendingCode(false);
    }
  };

  // Reset the code sent state when dialog closes or email changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTenantEmail(e.target.value);
    setCodeSent(false);
    setGeneratedPin("");
  };

  if (isOpen)
    return (
      <DialogBase dialogName="share_dashboard" maxHeight={850}>
        <h3 className="text-xl font-bold text-dark_text">Dashbboard teilen</h3>

        {/* Description with better styling */}
        <div className="mb-6">
          <p className="text-sm text-dark_text/80 max-w-10/12 mb-4 leading-relaxed">
            Dashboard direkt an Mieter teilen und die Verbrauchsdaten
            übersichtlich zur Verfügung stellen.
          </p>

          {/* Enhanced URL input with copy functionality */}
          <div className="relative">
            <label
              htmlFor="shareable_url"
              className="text-[#757575] mb-1.5 text-sm"
            >
              Link mit Mietern teilen
            </label>
            <input
              type="text"
              id="shareable_url"
              name="shareable_url"
              value={shareUrl}
              readOnly
              className="w-full focus:outline-none p-6 pr-28 max-h-[70px] border border-black/20 rounded text-sm"
            />
            <Button
              onClick={copyToClipboard}
              className={`absolute max right-0 bottom-0 text-sm font-medium h-full max-h-[70px]`}
            >
              {copied ? (
                <span className="flex items-center gap-1">Kopiert!</span>
              ) : (
                <span className="flex items-center gap-1">Kopieren</span>
              )}
            </Button>
          </div>
        </div>

        {/* NEW: Send Access Code Section */}
        <div className="mb-6 p-4 bg-green/10 rounded-lg border border-green/20">
          <p className="text-sm font-medium text-dark_text mb-3">
            🔐 Zugangscode per E-Mail senden
          </p>
          
          {!codeSent ? (
            <>
              <div className="mb-3">
                <label
                  htmlFor="tenant_email"
                  className="text-[#757575] mb-1.5 text-sm block"
                >
                  E-Mail-Adresse des Mieters
                </label>
                <input
                  type="email"
                  id="tenant_email"
                  name="tenant_email"
                  value={tenantEmail}
                  onChange={handleEmailChange}
                  placeholder="mieter@beispiel.de"
                  className="w-full focus:outline-none p-3 border border-black/20 rounded text-sm"
                />
              </div>
              <Button
                onClick={handleSendAccessCode}
                disabled={sendingCode || !tenantEmail}
                className="w-full text-white disabled:opacity-50"
              >
                {sendingCode ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> Wird gesendet...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Zugangscode senden
                  </span>
                )}
              </Button>
            </>
          ) : (
            <div className="text-center py-2">
              <div className="text-green font-medium text-lg mb-2">✅ Zugangscode gesendet!</div>
              <p className="text-sm text-dark_text/80 mb-2">
                E-Mail: <strong>{tenantEmail}</strong>
              </p>
              <p className="text-sm text-dark_text/80 mb-3">
                Code: <strong className="font-mono text-lg">{generatedPin}</strong>
                <span className="text-xs text-gray-500 ml-2">(Für Ihre Referenz)</span>
              </p>
              <p className="text-xs text-gray-500">
                Der Mieter erhält eine E-Mail mit dem Zugangscode und dem Link zum Dashboard.
              </p>
              <button
                onClick={() => {
                  setCodeSent(false);
                  setTenantEmail("");
                  setGeneratedPin("");
                }}
                className="mt-3 text-sm text-green underline hover:no-underline"
              >
                Weiteren Code senden
              </button>
            </div>
          )}
        </div>
      </DialogBase>
    );
}

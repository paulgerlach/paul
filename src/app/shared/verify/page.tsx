"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createVerifiedToken } from "@/lib/shareUtils";

// Loading component for Suspense fallback
function VerifyPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-4xl mb-4 animate-pulse">🔐</div>
        <p className="text-gray-600">Laden...</p>
      </div>
    </div>
  );
}

// Main verify component (uses useSearchParams)
function VerifyPinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // NEW: Get share token (short URL format)
  const shareToken = searchParams.get("token");
  
  // LEGACY: Get all original link parameters (for backward compatibility)
  const meters = searchParams.get("meters");
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const exp = searchParams.get("exp");
  const checksum = searchParams.get("c");
  
  const [pin, setPin] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [blocked, setBlocked] = useState<boolean>(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6).split("");
        const newPin = [...pin];
        digits.forEach((digit, i) => {
          if (i < 6) newPin[i] = digit;
        });
        setPin(newPin);
        // Focus last filled input or last input
        const lastIndex = Math.min(digits.length, 5);
        inputRefs.current[lastIndex]?.focus();
      });
    }
  };

  const handleVerify = async () => {
    const fullPin = pin.join("");
    
    if (fullPin.length !== 6) {
      setError("Bitte geben Sie alle 6 Ziffern ein");
      return;
    }

    if (blocked) {
      setError("Zu viele Fehlversuche. Bitte warten Sie 15 Minuten.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call API to verify PIN
      // NEW: Use shareToken if available, otherwise use legacy linkParams
      const response = await fetch('/api/share-pin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: fullPin,
          shareToken: shareToken || undefined,
          linkParams: shareToken ? undefined : searchParams.toString(),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log("[share-pin] PIN verified successfully!");
        
        // Get link_params from API response (contains meters, dates, etc.)
        const linkParams = result.linkParams || searchParams.toString();
        const storedParams = new URLSearchParams(linkParams);
        
        // Generate secure verified token
        const token = createVerifiedToken(storedParams);
        
        // Build redirect URL with params from database + verified token
        const redirectParams = new URLSearchParams(linkParams);
        redirectParams.set('vt', token); // Add verified token
        
        // Redirect to dashboard with all original params + verified token
        router.push(`/shared/dashboard?${redirectParams.toString()}`);
      } else {
        // Handle error from API
        if (response.status === 429) {
          setBlocked(true);
          setError("Zu viele Fehlversuche. Bitte fordern Sie einen neuen Code an.");
        } else if (result.remainingAttempts !== undefined) {
          setAttempts(5 - result.remainingAttempts);
          setError(`Falscher Code. Noch ${result.remainingAttempts} Versuche übrig.`);
        } else {
          setError(result.error || "Ungültiger Code");
        }
        
        // Clear PIN
        setPin(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  };

  // Check if we have valid parameters (either new token OR legacy params)
  const hasValidParams = shareToken || (meters && exp && checksum);
  
  if (!hasValidParams) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Ungültiger Link</h1>
          <p className="text-gray-600">
            Dieser Link ist ungültig oder wurde manipuliert.
            Bitte verwenden Sie den Link aus Ihrer E-Mail.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Dashboard-Zugang
          </h1>
          <p className="text-gray-600">
            Bitte geben Sie Ihren 6-stelligen Zugangscode ein
          </p>
        </div>

        {/* PIN Input */}
        <div className="flex justify-center gap-2 mb-6">
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={blocked || loading}
              className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg
                focus:outline-none focus:border-green transition-colors
                ${error ? "border-red-400" : "border-gray-300"}
                ${blocked ? "bg-gray-100" : "bg-white"}
              `}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleVerify}
          disabled={loading || blocked || pin.some(d => !d)}
          className={`w-full py-4 rounded-lg font-medium text-white transition-all
            ${loading || blocked || pin.some(d => !d)
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green hover:bg-green/90 cursor-pointer"
            }
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> Wird überprüft...
            </span>
          ) : blocked ? (
            "Zugang gesperrt"
          ) : (
            "Dashboard öffnen"
          )}
        </button>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Sie haben den Code per E-Mail erhalten.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Bei Problemen wenden Sie sich an Ihren Vermieter.
          </p>
        </div>

        {/* PIN system now uses real database verification */}
      </div>
    </div>
  );
}

// Page component with Suspense wrapper (required for useSearchParams in Next.js 15)
export default function VerifyPinPage() {
  return (
    <Suspense fallback={<VerifyPageLoading />}>
      <VerifyPinContent />
    </Suspense>
  );
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Loading component for Suspense fallback
function SetupPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-4xl mb-4 animate-pulse">🔑</div>
        <p className="text-gray-600">Laden...</p>
      </div>
    </div>
  );
}

// Main setup component
function SetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }
    // Token validation will happen on submit
    // For now, assume token format is valid if it exists
    setTokenValid(true);
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError("Bitte füllen Sie alle Felder aus");
      return;
    }

    if (password.length < 8) {
      setError("Das Passwort muss mindestens 8 Zeichen lang sein");
      return;
    }

    if (password !== confirmPassword) {
      setError("Die Passwörter stimmen nicht überein");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/tenant/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Redirect to homepage - user can then click login popup
        router.push('/?setup=success');
      } else {
        setError(result.error || "Einrichtung fehlgeschlagen");
      }
    } catch (err) {
      console.error("Setup error:", err);
      setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  };

  // Invalid or missing token
  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Ungültiger Link</h1>
          <p className="text-gray-600">
            Dieser Einrichtungslink ist ungültig oder abgelaufen.
            Bitte wenden Sie sich an Ihren Vermieter für einen neuen Link.
          </p>
        </div>
      </div>
    );
  }

  // Still validating
  if (tokenValid === null) {
    return <SetupPageLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🔑</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Passwort einrichten
          </h1>
          <p className="text-gray-600">
            Legen Sie ein Passwort für Ihren Dashboard-Zugang fest
          </p>
        </div>

        {/* Setup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Neues Passwort
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="Mindestens 8 Zeichen"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green transition-colors"
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Passwort bestätigen
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              placeholder="Passwort wiederholen"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green transition-colors"
            />
          </div>

          {/* Password Requirements */}
          <div className="text-xs text-gray-500 space-y-1">
            <p className={password.length >= 8 ? "text-green" : ""}>
              ✓ Mindestens 8 Zeichen
            </p>
            <p className={password && password === confirmPassword ? "text-green" : ""}>
              ✓ Passwörter stimmen überein
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !password || !confirmPassword}
            className={`w-full py-4 rounded-lg font-medium text-white transition-all
              ${loading || !password || !confirmPassword
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green hover:bg-green/90 cursor-pointer"
              }
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Wird eingerichtet...
              </span>
            ) : (
              "Passwort speichern"
            )}
          </button>
        </form>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Nach der Einrichtung können Sie sich mit Ihrer E-Mail und diesem Passwort anmelden.
          </p>
        </div>
      </div>
    </div>
  );
}

// Page component with Suspense wrapper
export default function MieterSetupPage() {
  return (
    <Suspense fallback={<SetupPageLoading />}>
      <SetupContent />
    </Suspense>
  );
}

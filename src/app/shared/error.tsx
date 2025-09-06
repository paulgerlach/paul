"use client";

import { useEffect } from "react";

export default function SharedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Shared Dashboard Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Shared Dashboard Error
        </h1>
        <p className="text-gray-600 mb-6">
          Something went wrong while loading the shared dashboard.
          <br />
          This might be due to an invalid or expired share link.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => reset()}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}


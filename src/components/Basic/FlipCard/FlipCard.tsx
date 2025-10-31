"use client";

import { useState, useEffect, ReactNode } from "react";
import { RefreshCw } from "lucide-react";

interface FlipCardProps {
  frontContent: ReactNode;
  backContent: ReactNode;
  storageKey?: string; // localStorage key to persist flip state
  className?: string;
}

/**
 * FlipCard - A 3D flip animation component
 * 
 * Features:
 * - 3D flip animation between two pieces of content
 * - Flip icon in top-right corner
 * - Persists flip state in localStorage
 * - Smooth 600ms transition
 * - Both sides stay mounted (keep data fresh)
 */
export default function FlipCard({ 
  frontContent, 
  backContent, 
  storageKey = "flipcard-state",
  className = ""
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Load flip state from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined" && storageKey) {
      const savedState = localStorage.getItem(storageKey);
      if (savedState === "true") {
        setIsFlipped(true);
      }
    }
  }, [storageKey]);

  // Handle flip toggle
  const handleFlip = () => {
    const newState = !isFlipped;
    setIsFlipped(newState);
    
    // Save to localStorage
    if (typeof window !== "undefined" && storageKey) {
      localStorage.setItem(storageKey, String(newState));
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Flip Button - Always visible on top */}
      <button
        onClick={handleFlip}
        className="absolute top-3 right-3 z-50 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all duration-200 group"
        aria-label="Flip card"
        title="Flip to see alternate view"
      >
        <RefreshCw 
          className={`w-4 h-4 text-gray-600 transition-transform duration-600 ${
            isFlipped ? 'rotate-180' : ''
          } group-hover:rotate-180`}
        />
      </button>

      {/* 3D Flip Container */}
      <div 
        className="relative w-full h-full"
        style={{
          perspective: "1000px",
        }}
      >
        <div
          className="relative w-full h-full transition-transform duration-600 ease-in-out"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front Side - Total Costs (GaugeChart) */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {frontContent}
          </div>

          {/* Back Side - Electricity Chart */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {backContent}
          </div>
        </div>
      </div>
    </div>
  );
}


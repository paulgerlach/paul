'use client'

import React, { useState } from 'react'
import TelegramsContent from './TelegramsContent'

export default function Telegrams() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="border rounded-lg bg-white">
      {/* Header */}
      <button
        
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <h2 className="font-semibold text-lg">Telegramme</h2>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${
            isCollapsed ? 'rotate-0' : 'rotate-180'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Content */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          <TelegramsContent/>
        </div>
      )}
    </div>
  )
}

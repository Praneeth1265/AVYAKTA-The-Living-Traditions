"use client";

import { useState } from "react";

interface IndicatorBuzzerProps {
  domain: string;
  initialStatus: boolean;
}

export default function IndicatorBuzzer({
  domain,
  initialStatus,
}: IndicatorBuzzerProps) {
  const [isActive, setIsActive] = useState(initialStatus);

  const handleToggle = () => {
    // Only allow toggling from red (false) to green (true)
    if (!isActive) {
      setIsActive(true);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition">
      <span className="font-medium text-gray-800">{domain}</span>

      <button
        onClick={handleToggle}
        disabled={isActive}
        className={`w-12 h-12 rounded-full font-bold text-white text-sm transition-all duration-300 ${
          isActive
            ? "bg-green-500 cursor-not-allowed opacity-90"
            : "bg-red-500 hover:bg-red-600 cursor-pointer"
        }`}
      >
        {isActive ? "✓" : "◯"}
      </button>
    </div>
  );
}

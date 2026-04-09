import React from 'react';

const DiyaIcon = ({ className = 'w-6 h-6', glow = false }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Glow effect if true */}
      {glow && (
        <circle
          cx="12"
          cy="8"
          r="8"
          fill="#C9A84C"
          opacity="0.3"
          className="animate-pulse"
        />
      )}

      {/* Flame */}
      <path
        d="M12 2C12 2 15 6 15 9C15 11 12.5 13 12 13C11.5 13 9 11 9 9C9 6 12 2 12 2Z"
        fill="#C9A84C"
      />

      {/* Base/Lamp */}
      <path
        d="M5 14C5 14 5 18 12 18C19 18 19 14 19 14C19 14 15 15 12 15C9 15 5 14 5 14Z"
        fill="#92791B"
      />
      <path
        d="M12 18C10 18 8 19 8 20C8 21 16 21 16 20C16 19 14 18 12 18Z"
        fill="#1B5E3B"
      />
    </svg>
  );
};

export default DiyaIcon;

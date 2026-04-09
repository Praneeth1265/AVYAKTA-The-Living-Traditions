import React from 'react';

const PaisleyBackground = ({ children, opacity = '0.05', className = '' }: any) => {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Background Pattern Layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: opacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10C35 10 40 15 40 25C40 35 30 45 30 45C30 45 20 35 20 25C20 15 25 10 30 10ZM30 16C28 16 26 18 26 22C26 26 30 32 30 32C30 32 34 26 34 22C34 18 32 16 30 16Z' fill='%2392791B' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
        aria-hidden="true"
      />

      {/* Content Layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default PaisleyBackground;

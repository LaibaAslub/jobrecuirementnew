import React from 'react';

export function NcaiLogo({ className = '', size = 40 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Orange Swoosh */}
      <path 
        d="M20 100C20 100 40 80 60 40C60 40 55 70 45 105C35 140 20 100 20 100Z" 
        fill="#F59E0B" 
      />
      
      {/* NCAI Text (Simplified as paths or text) */}
      <text 
        x="65" 
        y="160" 
        fontFamily="sans-serif" 
        fontWeight="bold" 
        fontSize="80" 
        fill="#005696"
      >
        NCAI
      </text>

      {/* Circuitry Pattern */}
      <g stroke="#94A3B8" strokeWidth="3">
        <path d="M80 80V60L100 40V20" />
        <circle cx="100" cy="20" r="5" fill="#94A3B8" />
        
        <path d="M100 80V60L120 40V20" />
        <circle cx="120" cy="20" r="5" fill="#94A3B8" />
        
        <path d="M120 80V60L140 40V20" />
        <circle cx="140" cy="20" r="5" fill="#94A3B8" />
        
        <path d="M140 80V60L160 40V20" />
        <circle cx="160" cy="20" r="5" fill="#94A3B8" />
      </g>
    </svg>
  );
}

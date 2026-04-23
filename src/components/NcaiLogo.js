import React from 'react';

export function NcaiLogo({ className = '', size = 40 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 400 300" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Orange Swoosh/Checkmark */}
      <path 
        d="M20 120 C40 100 80 80 150 40 C140 80 120 120 90 180 C70 140 40 130 20 120Z" 
        fill="#F59E0B" 
      />
      
      {/* Circuitry Pattern above text */}
      <g stroke="#9CA3AF" strokeWidth="4" fill="none">
        {/* Line 1 */}
        <path d="M160 110 L160 80 L180 50 L180 30" />
        <circle cx="180" cy="30" r="6" fill="#9CA3AF" />
        
        {/* Line 2 */}
        <path d="M185 110 L185 85 L210 55 L210 30" />
        <circle cx="210" cy="30" r="6" fill="#9CA3AF" />
        
        {/* Line 3 */}
        <path d="M210 110 L210 90 L240 60 L240 30" />
        <circle cx="240" cy="30" r="6" fill="#9CA3AF" />
        
        {/* Line 4 */}
        <path d="M235 110 L235 95 L270 65 L270 30" />
        <circle cx="270" cy="30" r="6" fill="#9CA3AF" />
        
        {/* Line 5 */}
        <path d="M260 110 L260 100 L300 70 L300 30" />
        <circle cx="300" cy="30" r="6" fill="#9CA3AF" />
        
        {/* Line 6 */}
        <path d="M285 110 L285 105 L330 75 L330 30" />
        <circle cx="330" cy="30" r="6" fill="#9CA3AF" />

        {/* Line 7 */}
        <path d="M310 110 L310 110 L360 80 L360 30" />
        <circle cx="360" cy="30" r="6" fill="#9CA3AF" />
      </g>

      {/* NCAI Text */}
      <text 
        x="35" 
        y="250" 
        fontFamily="Arial, sans-serif" 
        fontWeight="900" 
        fontSize="160" 
        fill="#005696"
        letterSpacing="-5"
      >
        NCAI
      </text>
    </svg>
  );
}

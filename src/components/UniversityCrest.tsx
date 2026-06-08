import React from "react";

interface UniversityCrestProps {
  abbreviation: string;
  primaryHsl: string;
  secondaryHex: string;
  className?: string;
  size?: number;
}

export const UniversityCrest: React.FC<UniversityCrestProps> = ({
  abbreviation,
  primaryHsl,
  secondaryHex,
  className = "",
  size = 120
}) => {
  // Extract hue/sat/light components to construct background gradient
  const primaryColorCss = `hsl(${primaryHsl})`;
  const lightColorCss = `hsl(${primaryHsl.split(" ")[0]} 80% 88%)`;

  return (
    <div 
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-lg filter"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Shield Gradient Background */}
          <linearGradient id={`shieldBg-${abbreviation}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColorCss} />
            <stop offset="100%" stopColor={`hsl(${primaryHsl.split(" ")[0]} 90% 12%)`} />
          </linearGradient>

          {/* Accent Gold Border Gradient */}
          <linearGradient id={`goldBorder-${abbreviation}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={secondaryHex} />
            <stop offset="50%" stopColor="#FFF2A3" />
            <stop offset="100%" stopColor={secondaryHex} />
          </linearGradient>
        </defs>

        {/* Outer Shield Path */}
        <path
          d="M 50,4 C 76,4 88,14 88,38 C 88,68 68,90 50,96 C 32,90 12,68 12,38 C 12,14 24,4 50,4 Z"
          fill={`url(#shieldBg-${abbreviation})`}
          stroke={`url(#goldBorder-${abbreviation})`}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Inner Border Line */}
        <path
          d="M 50,9 C 72,9 82,18 82,38 C 82,64 64,84 50,89 C 36,84 18,64 18,38 C 18,18 28,9 50,9 Z"
          fill="none"
          stroke={secondaryHex}
          strokeWidth="1"
          opacity="0.4"
        />

        {/* Open Book Icon in the upper center */}
        <g transform="translate(34, 25)" fill="none" stroke={secondaryHex} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Left page */}
          <path d="M 16,10 C 10,12 3,12 0,11 L 0,2 C 3,3 10,3 16,1 Z" fill={lightColorCss} />
          {/* Right page */}
          <path d="M 16,10 C 22,12 29,12 32,11 L 32,2 C 29,3 22,3 16,1 Z" fill={lightColorCss} />
          {/* Book middle line */}
          <line x1="16" y1="1" x2="16" y2="10" stroke={primaryColorCss} strokeWidth="1.5" />
        </g>

        {/* Stars decoration */}
        <g fill="#FFF2A3">
          {/* Left star */}
          <polygon points="28,21 30,24 33,24 31,26 32,29 30,27 28,29 29,26 27,24 30,24" transform="scale(0.8) translate(7, 4)" />
          {/* Right star */}
          <polygon points="72,21 74,24 77,24 75,26 76,29 74,27 72,29 73,26 71,24 74,24" transform="scale(0.8) translate(15, 4)" />
        </g>

        {/* Ribbon for Motto or Abbreviation at the bottom */}
        <path
          d="M 20,72 L 80,72 L 75,81 L 50,78 L 25,81 Z"
          fill={secondaryHex}
          stroke="#FFF2A3"
          strokeWidth="0.75"
        />

        {/* Abbreviation Text on Shield Ribbon */}
        <text
          x="50"
          y="77.5"
          textAnchor="middle"
          fill={primaryColorCss}
          fontSize="5.5"
          fontWeight="bold"
          fontFamily="'Times New Roman', Times, serif"
          letterSpacing="0.8"
        >
          {abbreviation}
        </text>

        {/* Academic laurel branches surrounding bottom of crest */}
        <path
          d="M 12,68 C 8,82 25,95 48,97"
          fill="none"
          stroke={secondaryHex}
          strokeWidth="1.5"
          strokeDasharray="1, 3"
          opacity="0.75"
        />
        <path
          d="M 88,68 C 92,82 75,95 52,97"
          fill="none"
          stroke={secondaryHex}
          strokeWidth="1.5"
          strokeDasharray="1, 3"
          opacity="0.75"
        />
      </svg>
    </div>
  );
};

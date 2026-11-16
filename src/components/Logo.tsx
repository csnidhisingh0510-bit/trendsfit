import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "custom";
  customWidth?: number;
  showTagline?: boolean;
  tagline?: string;
}

export default function Logo({
  className = "",
  size = "md",
  customWidth,
  showTagline = true,
  tagline = "Wear Your Style",
}: LogoProps) {
  // Determine widths based on size prop
  const dimensions = {
    sm: { width: 120, emblemSize: 60, fontSize: "text-lg", spacing: "tracking-widest" },
    md: { width: 180, emblemSize: 90, fontSize: "text-2xl", spacing: "tracking-[0.15em]" },
    lg: { width: 280, emblemSize: 140, fontSize: "text-4xl", spacing: "tracking-[0.2em]" },
    xl: { width: 380, emblemSize: 180, fontSize: "text-5xl", spacing: "tracking-[0.25em]" },
    custom: { width: customWidth || 180, emblemSize: (customWidth || 180) * 0.5, fontSize: "text-2xl", spacing: "tracking-[0.2em]" },
  }[size];

  return (
    <div className={`flex flex-col items-center text-center ${className}`} id="brand-logo-root">
      {/* 1. Emblem SVG */}
      <svg
        width={dimensions.emblemSize}
        height={dimensions.emblemSize}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-300 hover:scale-105"
        id="logo-emblem-svg"
      >
        {/* Upper-Left Black Circle Arch */}
        <path
          d="M 148,45 A 68,68 0 1,0 68,155"
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Bottom-Right Gold Circle Arch */}
        <path
          d="M 68,155 A 68,68 0 0,0 154,82"
          fill="none"
          stroke="#AF905F"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Mannequin Contour (Gold) on the left */}
        {/* Stand knob */}
        <circle cx="68" cy="72" r="1.5" fill="none" stroke="#AF905F" strokeWidth="1" />
        {/* Mannequin body contour line */}
        <path
          d="M 68,73.5 L 68,78 
             M 65,79 L 71,79 
             M 68,78 C 64,81 60,84 58,90 C 56,96 59,101 62,106 C 64,109 62,116 60,123 C 58,128 59,134 60,138"
          fill="none"
          stroke="#AF905F"
          strokeWidth="1"
          strokeLinecap="round"
        />
        {/* Right shoulder suggestion */}
        <path
          d="M 68,78 C 70,80 72,82 73,84"
          fill="none"
          stroke="#AF905F"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Black Clothes Hanger Hanging on neck */}
        {/* Hanger Hook */}
        <path
          d="M 81,89 C 81,84 77.5,84 77.5,89 C 77.5,92 81,93 81,96 L 81,99"
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="1"
          strokeLinecap="round"
        />
        {/* Hanger Base Triangle */}
        <path
          d="M 81,99 L 66,108 C 74,107.5 86,107.5 96,108 Z"
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* Monogram T & F */}
        {/* 'T' Serif Letter */}
        <text
          x="100"
          y="110"
          fontFamily="Cinzel, Playfair Display, Georgia, Garamond, serif"
          fontSize="64"
          fontWeight="300"
          fill="#1A1A1A"
          textAnchor="middle"
        >
          T
        </text>

        {/* 'F' Serif Letter overlapping in gold */}
        <text
          x="118"
          y="120"
          fontFamily="Cinzel, Playfair Display, Georgia, Garamond, serif"
          fontSize="52"
          fontWeight="300"
          fill="#AF905F"
          textAnchor="middle"
        >
          F
        </text>
      </svg>

      {/* 2. Text Brand Logo "TRENDFITS" */}
      <div className="mt-4 space-y-1">
        <h1 className={`${dimensions.fontSize} font-serif font-light text-[#1A1A1A] select-none`}>
          TREND<span className="text-[#AF905F]">FITS</span>
        </h1>

        {showTagline && (
          <div className="flex flex-col items-center space-y-2 mt-1">
            {/* Divider with Sparkle Star in Middle */}
            <div className="flex items-center w-full justify-center gap-3">
              <div className="h-[0.5px] w-12 bg-[#1A1A1A]/20"></div>
              {/* Four-Point Sparkle Star */}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-[#1A1A1A]">
                <path
                  d="M5 0C5 2.76142 2.76142 5 0 5C2.76142 5 5 7.23858 5 10C5 7.23858 7.23858 5 10 5C7.23858 5 5 2.76142 5 0Z"
                  fill="currentColor"
                />
              </svg>
              <div className="h-[0.5px] w-12 bg-[#1A1A1A]/20"></div>
            </div>

            {/* Tagline */}
            <p className="text-[9px] sm:text-[10px] font-sans font-medium uppercase tracking-[0.3em] text-[#1A1A1A]/70 select-none">
              {tagline}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import React from "react";

interface HeaderLogoProps {
  className?: string;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({
  className = "h-16 sm:h-17 w-auto",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 320"
      className={className}
      role="img"
      aria-label="Project Jauhari - Islamic Rationalism Revival Framework"
    >
      <defs>
        {/* Background Gradient matching stone-900 header background (#1c1917) */}
        <linearGradient id="headerBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1c1917" stopOpacity="0" />
          <stop offset="100%" stopColor="#141210" stopOpacity="0" />
        </linearGradient>

        {/* Gold Gradients for Gem & Astrolabe */}
        <linearGradient id="headerGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#996515" />
        </linearGradient>
        
        <linearGradient id="headerGoldLight" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#996515" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#FFF8DC" />
        </linearGradient>

        {/* Subtle Glow Filter */}
        <filter id="headerGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background: Transparent to seamlessly blend with header stone-900/95 */}
      <rect width="900" height="320" fill="transparent" />

      {/* Decorative Astrolabe Background Circles */}
      <circle cx="160" cy="160" r="87.5" fill="none" stroke="#D4AF37" strokeWidth="0.75" opacity="0.2" strokeDasharray="4 4" />
      <circle cx="160" cy="160" r="102.5" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.15" />
      <line x1="72.5" y1="160" x2="247.5" y2="160" stroke="#D4AF37" strokeWidth="0.5" opacity="0.2" />
      <line x1="160" y1="72.5" x2="160" y2="247.5" stroke="#D4AF37" strokeWidth="0.5" opacity="0.2" />

      {/* LOGO MARK: Heptagonal Faceted Gem & Center Axis */}
      <g transform="translate(160, 160) scale(0.8) scale(1, -1)" filter="url(#headerGoldGlow)">
        {/* Outer Layer / Peeled Accident (Heptagon) */}
        <polygon
          points="0,-100 78,-62 97,22 43,90 -43,90 -97,22 -78,-62"
          fill="none"
          stroke="url(#headerGoldGrad)"
          strokeWidth="1.5"
          opacity="0.45"
          strokeDasharray="12 6"
        />

        {/* Secondary Structural Framework (Heptagon) matched to header stone-900 (#1c1917) */}
        <polygon
          points="0,-75 58,-46 72,17 32,68 -32,68 -72,17 -58,-46"
          fill="#1c1917"
          stroke="url(#headerGoldLight)"
          strokeWidth="2"
          opacity="0.9"
        />

        {/* Inner Core Faceted Gem (Jawhar - Heptagon) */}
        <polygon
          points="0,-45 35,-28 43,10 19,41 -19,41 -43,10 -35,-28"
          fill="url(#headerGoldGrad)"
          opacity="0.3"
        />

        {/* Heptagonal Star / Facet Cut Lines to Center */}
        <line x1="0" y1="0" x2="0" y2="-45" stroke="#F3E5AB" strokeWidth="1.5" opacity="0.85" />
        <line x1="0" y1="0" x2="35" y2="-28" stroke="#F3E5AB" strokeWidth="1.5" opacity="0.85" />
        <line x1="0" y1="0" x2="43" y2="10" stroke="#F3E5AB" strokeWidth="1.5" opacity="0.85" />
        <line x1="0" y1="0" x2="19" y2="41" stroke="#F3E5AB" strokeWidth="1.5" opacity="0.85" />
        <line x1="0" y1="0" x2="-19" y2="41" stroke="#F3E5AB" strokeWidth="1.5" opacity="0.85" />
        <line x1="0" y1="0" x2="-43" y2="10" stroke="#F3E5AB" strokeWidth="1.5" opacity="0.85" />
        <line x1="0" y1="0" x2="-35" y2="-28" stroke="#F3E5AB" strokeWidth="1.5" opacity="0.85" />

        {/* Center Point: The Absolute Axis of Tawhid */}
        <circle cx="0" cy="0" r="5" fill="#F8F9FA" />
        <circle cx="0" cy="0" r="2" fill="#1c1917" />
      </g>

      {/* TYPOGRAPHY SECTION */}
      <g transform="translate(300, 0)">
        {/* Main Project Title */}
        <text
          x="0"
          y="142"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', sans-serif"
          fontWeight="800"
          fontSize="52"
          fill="#F8F9FA"
          letterSpacing="3.5"
        >
          PROJECT JAUHARI
        </text>

        {/* Elegant Divider Line */}
        <line x1="0" y1="168" x2="530" y2="168" stroke="#996515" strokeWidth="2" strokeLinecap="round" opacity="0.45" />

        {/* Tagline */}
        <text
          x="0"
          y="202"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', sans-serif"
          fontWeight="600"
          fontSize="19"
          fill="#D4AF37"
          letterSpacing="3.5"
        >
          ISLAMIC RATIONALISM REVIVAL FRAMEWORK
        </text>
      </g>
    </svg>
  );
};

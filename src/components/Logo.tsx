export default function Logo({ className = "", variant = "dark" }: { className?: string, variant?: "dark" | "light" }) {
  const primaryColor = variant === "dark" ? "#4B2A6B" : "#FFFFFF";
  const accentColor = "#F8B62C";

  return (
    <svg 
      viewBox="0 0 400 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* RUYA Text */}
      <text 
        x="10" 
        y="75" 
        fill={primaryColor}
        style={{ font: '900 80px Cairo, sans-serif', letterSpacing: '-2px' }}
      >
        RUYA
      </text>
      
      {/* DESIGN Text */}
      <text 
        x="12" 
        y="110" 
        fill={accentColor} 
        style={{ font: '700 24px Cairo, sans-serif', letterSpacing: '24px' }}
      >
        DESIGN
      </text>

      {/* Approximating the stylized R from the screenshot */}
      <g transform="translate(250, 10)">
        <path 
          d="M0 10 L80 10 C110 10 135 35 135 65 S110 120 80 120 L50 120 L80 160" 
          stroke={primaryColor}
          strokeWidth="18" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          transform="scale(0.6)"
        />
        <path 
          d="M20 50 L60 50 C75 50 85 60 85 75 S75 100 60 100 L30 100" 
          stroke={accentColor} 
          strokeWidth="8" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          transform="translate(10, 5) scale(0.6)"
        />
      </g>
    </svg>
  );
}

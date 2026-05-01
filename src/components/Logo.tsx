export default function Logo({
  className = "",
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const primaryColor = variant === "dark" ? "#4B2A6B" : "#FFFFFF";
  const accentColor = "#F8B62C";

  return (
    <svg
      viewBox="0 0 450 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* RUYA Text */}
      <text
        x="0"
        y="80"
        fill={primaryColor}
        style={{ font: "900 95px Cairo, sans-serif", letterSpacing: "-2px" }}
      >
        RUYA
      </text>

      {/* DESIGN Text */}
      <text
        x="2"
        y="120"
        fill={accentColor}
        style={{ font: "800 34px Cairo, sans-serif", letterSpacing: "22px" }}
      >
        DESIGN
      </text>

      {/* TAGLINE */}
      <text
        x="2"
        y="145"
        fill={variant === "dark" ? "#6B7280" : "rgba(255,255,255,0.9)"}
        style={{ font: "400 14px Cairo, sans-serif", letterSpacing: "4px" }}
      >
        NEW WORLD, NEW THINKING
      </text>

      {/* Stylized R Symbol on the right */}
      <g transform="translate(300, 10) scale(0.8)">
        <path
          d="M20 0 H100 C144 0 180 36 180 80 S144 160 100 160 H80 L110 180"
          stroke={primaryColor}
          strokeWidth="35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M50 45 H90 C107 45 120 58 120 75 S107 105 90 105 H60 L80 135"
          stroke={accentColor}
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

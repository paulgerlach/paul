// Inline SVG icons to replace react-icons (saves ~3.5MB)
// These are the exact same icons, just without the heavy library

export function ChatCircleIcon({ 
  className, 
  onClick, 
  color = "currentColor", 
  size 
}: { 
  className?: string; 
  onClick?: () => void; 
  color?: string; 
  size?: number;
}) {
  return (
    <svg 
      className={className}
      onClick={onClick}
      width={size}
      height={size}
      viewBox="0 0 256 256" 
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-4-1.08,7.85,7.85,0,0,0-2.53.42L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216ZM80,128a12,12,0,1,1,12,12A12,12,0,0,1,80,128Zm48,0a12,12,0,1,1,12,12A12,12,0,0,1,128,128Zm48,0a12,12,0,1,1,12,12A12,12,0,0,1,176,128Z"/>
    </svg>
  );
}

export function MinimizeIcon({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <svg 
      className={className}
      onClick={onClick}
      viewBox="0 0 512 512" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M480 480H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h448c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/>
    </svg>
  );
}

export function BrainCircuitIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z"/>
      <path d="M16 8V5c0-1.1.9-2 2-2"/>
      <path d="M12 13h4"/>
      <path d="M12 18h6a2 2 0 0 1 2 2v1"/>
      <path d="M12 8h8"/>
      <path d="M20.5 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/>
      <path d="M16.5 13a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/>
      <path d="M20.5 21a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/>
      <path d="M18.5 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/>
    </svg>
  );
}

export function SupportAgentIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21 12.22C21 6.73 16.74 3 12 3c-4.69 0-9 3.65-9 9.28-.6.34-1 .98-1 1.72v2c0 1.1.9 2 2 2h1v-6.1c0-3.87 3.13-7 7-7s7 3.13 7 7V19h-8v2h8c1.1 0 2-.9 2-2v-1.22c.59-.31 1-.92 1-1.64v-2.3c0-.7-.41-1.31-1-1.62z"/>
      <circle cx="9" cy="13" r="1"/>
      <circle cx="15" cy="13" r="1"/>
      <path d="M18 11.03A6.04 6.04 0 0 0 12.05 6c-3.03 0-6.29 2.51-6.03 6.45a8.075 8.075 0 0 0 4.86-5.89c1.31 2.63 4 4.44 7.12 4.47z"/>
    </svg>
  );
}

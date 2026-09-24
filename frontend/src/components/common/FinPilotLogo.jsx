import { C } from '@/constants/landingData';

export function FinPilotLogo({ size = 34, showText = true }) {
  const r = Math.round(size * 0.28);
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        style={{
          width: size, height: size, borderRadius: r, flexShrink: 0,
          background: `linear-gradient(145deg, ${C.primary} 0%, #1e5c40 100%)`,
          boxShadow: '0 2px 10px rgba(15,61,46,0.28)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <svg width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} viewBox="0 0 22 22" fill="none">
          <polyline points="2,17 8,10 13,13 20,4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="4" r="2.2" fill="#F59E0B" />
          <line x1="2" y1="20" x2="20" y2="20" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.3" />
        </svg>
      </div>
      {showText && (
        <span style={{ color: C.primary, fontSize: size * 0.52, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>
          FinPilot
        </span>
      )}
    </div>
  );
}

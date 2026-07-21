export function HumanoidRobot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 130" className={className} aria-hidden="true">
      <ellipse cx="50" cy="124" rx="26" ry="5" fill="#000" opacity="0.35" />
      <g className="rd-bob">
        <rect x="16" y="48" width="10" height="32" rx="5" fill="var(--surface-raised)" stroke="var(--border)" strokeWidth="2" />
        <rect x="74" y="48" width="10" height="32" rx="5" fill="var(--surface-raised)" stroke="var(--border)" strokeWidth="2" />

        <rect x="34" y="88" width="12" height="28" rx="6" fill="var(--surface-raised)" stroke="var(--border)" strokeWidth="2" />
        <rect x="54" y="88" width="12" height="28" rx="6" fill="var(--surface-raised)" stroke="var(--border)" strokeWidth="2" />
        <rect x="30" y="112" width="18" height="8" rx="3" fill="var(--border)" />
        <rect x="52" y="112" width="18" height="8" rx="3" fill="var(--border)" />

        <rect x="28" y="42" width="44" height="46" rx="14" fill="var(--surface-raised)" stroke="var(--border)" strokeWidth="2" />
        <circle cx="50" cy="60" r="5" fill="var(--red-500)" opacity="0.85" />
        <rect x="36" y="72" width="28" height="4" rx="2" fill="var(--border)" />

        <g transform="rotate(-8 50 24)">
          <rect x="32" y="8" width="36" height="32" rx="12" fill="var(--surface-raised)" stroke="var(--border)" strokeWidth="2" />
          <rect x="38" y="22" width="24" height="10" rx="5" fill="var(--background)" />
          <circle cx="44" cy="27" r="2.5" fill="var(--red-500)" />
          <circle cx="56" cy="27" r="2.5" fill="var(--red-500)" />
        </g>
      </g>
    </svg>
  );
}

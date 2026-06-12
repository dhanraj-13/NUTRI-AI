import { useEffect, useState } from 'react';

interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  sublabel?: string;
  animate?: boolean;
}

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  color = '#18B89A',
  trackColor = 'rgba(24,184,154,0.1)',
  label,
  sublabel,
  animate = true,
}: ProgressRingProps) {
  const [animated, setAnimated] = useState(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedValue = Math.min(100, Math.max(0, value));
  const offset = circumference - (clampedValue / 100) * circumference;

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setAnimated(true), 100);
      return () => clearTimeout(t);
    } else {
      setAnimated(true);
    }
  }, [animate]);

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
          className="progress-ring-circle"
          style={{
            filter: `drop-shadow(0 0 6px ${color}60)`,
          }}
        />
      </svg>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        {label && (
          <div
            className="font-display font-bold"
            style={{ fontSize: size * 0.22, color: '#E8F2ED', lineHeight: 1 }}
          >
            {label}
          </div>
        )}
        {sublabel && (
          <div style={{ fontSize: size * 0.11, color: '#9AB8A8', marginTop: 2 }}>
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}

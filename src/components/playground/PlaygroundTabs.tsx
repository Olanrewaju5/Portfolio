'use client';

import { LayoutGroup, motion, useMotionValue, animate } from 'framer-motion';
import type { LayoutMode } from '@/data/playground';

function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
      <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" />
      <rect x="9"   y="1.5" width="5.5" height="5.5" rx="1" />
      <rect x="1.5" y="9"   width="5.5" height="5.5" rx="1" />
      <rect x="9"   y="9"   width="5.5" height="5.5" rx="1" />
    </svg>
  );
}

function CanonicalIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <ellipse cx="8" cy="4.5" rx="5" ry="1.8" fill="currentColor" opacity="0.8" />
      <path d="M3 4.5v7c0 1 2.24 1.8 5 1.8s5-.8 5-1.8v-7" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="8" cy="11.5" rx="5" ry="1.8" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function CubeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
      <path d="M8 1.5L14 5v6L8 14.5 2 11V5L8 1.5Z" />
      <path d="M8 1.5V14.5M2 5l6 3.5 6-3.5" opacity="0.55" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="8" cy="8" r="5.5" />
      <ellipse cx="8" cy="8" rx="5.5" ry="2.2" />
      <line x1="2.5" y1="8" x2="13.5" y2="8" strokeOpacity="0.45" />
    </svg>
  );
}

function HorizontalIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <rect x="1.5" y="3" width="13" height="10" rx="1.5" />
      <line x1="6" y1="3" x2="6" y2="13" opacity="0.5" />
    </svg>
  );
}

const TABS: { id: LayoutMode; label: string; Icon: () => React.JSX.Element }[] = [
  { id: 'grid',       label: 'Grid',       Icon: GridIcon },
  { id: 'canonical',  label: 'Canonical',  Icon: CanonicalIcon },
  { id: 'cube',       label: 'Cube',       Icon: CubeIcon },
  { id: 'globe',      label: 'Globe',      Icon: GlobeIcon },
  { id: 'horizontal', label: 'Horizontal', Icon: HorizontalIcon },
];

interface Props {
  active: LayoutMode;
  onChange: (mode: LayoutMode) => void;
}

export function PlaygroundTabs({ active, onChange }: Props) {
  // Motion values for squash-and-stretch on the pill
  const pillScaleX = useMotionValue(1);
  const pillScaleY = useMotionValue(1);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        background: '#1e1c1c',
        borderRadius: '28px',
        padding: '5px',
        boxShadow: '0 2px 20px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      <LayoutGroup id="playground-tabs">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 13px',
                borderRadius: '22px',
                border: 'none',
                cursor: 'pointer',
                background: 'transparent',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.45)',
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '13px',
                fontWeight: isActive ? 500 : 400,
                letterSpacing: '-0.3px',
                whiteSpace: 'nowrap',
                lineHeight: 1,
                transition: 'color 0.2s ease',
                zIndex: 1,
              }}
            >
              {/* Sliding glass pill with squash-and-stretch */}
              {isActive && (
                <motion.div
                  layoutId="active-tab-pill"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '22px',
                    background: 'rgba(255,255,255,0.14)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 1px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)',
                    zIndex: -1,
                    // Squash-and-stretch driven by motion values
                    scaleX: pillScaleX,
                    scaleY: pillScaleY,
                  }}
                  // Stretch when the pill starts morphing to a new tab
                  onLayoutAnimationStart={() => {
                    animate(pillScaleX, 1.16, {
                      type: 'spring', stiffness: 480, damping: 14,
                    });
                    animate(pillScaleY, 0.86, {
                      type: 'spring', stiffness: 480, damping: 14,
                    });
                  }}
                  // Bounce back once it has landed
                  onLayoutAnimationComplete={() => {
                    animate(pillScaleX, 1, {
                      type: 'spring', stiffness: 360, damping: 11, mass: 0.6,
                    });
                    animate(pillScaleY, 1, {
                      type: 'spring', stiffness: 360, damping: 11, mass: 0.6,
                    });
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 40,
                    mass: 0.7,
                  }}
                />
              )}
              <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <Icon />
              </span>
              {label}
            </button>
          );
        })}
      </LayoutGroup>
    </div>
  );
}

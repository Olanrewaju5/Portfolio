'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import type { PlayItem } from '@/data/playground';

// ─── Card sub-component ──────────────────────────────────────────────────────
interface CardProps {
  item: PlayItem;
  style?: React.CSSProperties;
}

function GridCard({ item, style }: CardProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', ...style }}>
      <div style={{ background: '#000', flexGrow: 1, flexShrink: 1, flexBasis: 0, minHeight: 0, width: '100%', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: item.gradient, opacity: 0.1 }} />
        <div style={{ position: 'absolute', bottom: '14px', right: '14px', width: '52px', height: '52px', background: item.gradient, borderRadius: '4px', opacity: 0.85 }} />
      </div>
      <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: '#000', letterSpacing: '0.2px', lineHeight: 1, margin: 0, flexShrink: 0 }}>
        {item.name.replace('\n', ' ')}
      </p>
    </div>
  );
}

// ─── One full "screen" of the grid ───────────────────────────────────────────
function GridPage({ items }: { items: PlayItem[] }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '5fr 3fr 5fr 5fr', gridTemplateRows: '1fr 1.32fr', gap: '18px', padding: '80px 24px', boxSizing: 'border-box' }}>
      <GridCard item={items[0]} style={{ gridColumn: 1, gridRow: 1 }} />
      <GridCard item={items[1]} style={{ gridColumn: 2, gridRow: 1 }} />
      <GridCard item={items[2]} style={{ gridColumn: 3, gridRow: 1 }} />

      {/* Tall card spans both rows */}
      <div style={{ gridColumn: 4, gridRow: '1 / span 2', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ background: '#000', flex: 1, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: items[3].gradient, opacity: 0.1 }} />
          <div style={{ position: 'absolute', bottom: '14px', right: '14px', width: '52px', height: '52px', background: items[3].gradient, borderRadius: '4px', opacity: 0.85 }} />
        </div>
        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: '#000', letterSpacing: '0.2px', lineHeight: 1, margin: 0, flexShrink: 0 }}>{items[3].name.replace('\n', ' ')}</p>
      </div>

      <GridCard item={items[4]} style={{ gridColumn: '1 / span 2', gridRow: 2 }} />
      <GridCard item={items[5]} style={{ gridColumn: 3, gridRow: 2 }} />
    </div>
  );
}

// ─── Endless-canvas wrapper ───────────────────────────────────────────────────
interface Props {
  items: PlayItem[];
}

export function GridLayout({ items }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x            = useMotionValue(0);
  const teleporting  = useRef(false);
  const pageW        = useRef(0);

  // Initialise: set x to the MIDDLE page of three
  useEffect(() => {
    pageW.current = containerRef.current?.offsetWidth ?? window.innerWidth;
    x.set(-pageW.current);
  }, [x]);

  // Seamless loop — teleport silently when drifting into outer copies
  const checkLoop = useCallback(() => {
    if (teleporting.current) return;
    const w   = pageW.current;
    const val = x.get();
    if (val > -w * 0.35) {
      teleporting.current = true;
      x.set(val - w);
      teleporting.current = false;
    } else if (val < -w * 1.65) {
      teleporting.current = true;
      x.set(val + w);
      teleporting.current = false;
    }
  }, [x]);

  useEffect(() => x.on('change', checkLoop), [x, checkLoop]);

  const handleDragEnd = (_: unknown, info: { velocity: { x: number } }) => {
    const target = x.get() + info.velocity.x * 0.16;
    animate(x, target, {
      type: 'spring',
      stiffness: 160,
      damping: 28,
      mass: 1,
      onComplete: checkLoop,
    });
  };

  // Each page cycles through items with an offset so adjacent pages differ
  const page = (offset: number) =>
    Array.from({ length: 6 }, (_, i) => items[(i + offset) % items.length]);

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden', cursor: 'grab' }}>
      {/* Subtle drag hint */}
      <p style={{ position: 'absolute', bottom: '88px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 300, color: 'rgba(0,0,0,0.22)', letterSpacing: '1px', pointerEvents: 'none', zIndex: 10, whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
        drag to explore
      </p>

      {/* 3-wide track (left copy · center · right copy) */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -(pageW.current * 2.6), right: pageW.current * 0.6 }}
        dragElastic={0.05}
        style={{ x, display: 'flex', width: '300%', height: '100%', willChange: 'transform' }}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: 'grabbing' }}
      >
        <div style={{ width: '33.333%', flexShrink: 0, height: '100%' }}><GridPage items={page(0)} /></div>
        <div style={{ width: '33.333%', flexShrink: 0, height: '100%' }}><GridPage items={page(3)} /></div>
        <div style={{ width: '33.333%', flexShrink: 0, height: '100%' }}><GridPage items={page(6)} /></div>
      </motion.div>
    </div>
  );
}

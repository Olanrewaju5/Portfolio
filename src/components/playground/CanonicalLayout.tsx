'use client';

import { useEffect, useRef } from 'react';
import type { PlayItem } from '@/data/playground';

const CARD_W     = 200;
const CARD_H     = 400;
const ANGLE_STEP = 26;   // degrees between adjacent cards
const ARC_RADIUS = 450;

interface Props {
  items: PlayItem[];
}

export function CanonicalLayout({ items }: Props) {
  const count        = Math.min(items.length, 6);
  const centerIdx    = (count - 1) / 2;
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const rotAngle     = useRef(0);
  const dragState    = useRef<{ startX: number; startAngle: number } | null>(null);
  const animRef      = useRef<number>(0);

  // ── Apply rotation to all card wrappers via direct DOM ─────────────────────
  const applyAngle = (angle: number) => {
    rotAngle.current = angle;
    wrapperRefs.current.forEach((el, i) => {
      if (!el) return;
      const offset = i - centerIdx;
      el.style.transform = `rotateY(${offset * ANGLE_STEP - angle}deg)`;
    });
  };

  // ── Manual spring simulation for snap ──────────────────────────────────────
  const springTo = (from: number, to: number) => {
    cancelAnimationFrame(animRef.current);
    let current  = from;
    let velocity = 0;
    const K = 0.14, D = 0.72;

    const tick = () => {
      velocity  = (velocity + (to - current) * K) * D;
      current  += velocity;
      applyAngle(current);
      if (Math.abs(velocity) < 0.015 && Math.abs(to - current) < 0.015) {
        applyAngle(to);
        return;
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
  };

  // ── Pointer handlers ────────────────────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    cancelAnimationFrame(animRef.current);
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = { startX: e.clientX, startAngle: rotAngle.current };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    const delta = e.clientX - dragState.current.startX;
    applyAngle(dragState.current.startAngle - delta * 0.35);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    dragState.current = null;
    const snapped = Math.round(rotAngle.current / ANGLE_STEP) * ANGLE_STEP;
    springTo(rotAngle.current, snapped);
  };

  // ── Fade in (WAAPI avoids Framer Motion stacking-context issues) ───────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 400,
      fill: 'forwards',
      easing: 'ease-out',
    });
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        perspective: '1400px',
        perspectiveOrigin: '50% 48%',
        opacity: 0,
        cursor: 'grab',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {/* Drag hint */}
      <p style={{ position: 'absolute', bottom: '88px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 300, color: 'rgba(0,0,0,0.22)', letterSpacing: '1px', pointerEvents: 'none', zIndex: 10, whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
        drag to rotate
      </p>

      {/* Scene pivot */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transformStyle: 'preserve-3d',
        }}
      >
        {items.slice(0, count).map((item, i) => {
          const offset  = i - centerIdx;
          const angle   = offset * ANGLE_STEP;
          const opacity = 1 - Math.abs(offset) * 0.13;

          return (
            <div
              key={item.id}
              ref={(el) => { wrapperRefs.current[i] = el; }}
              style={{
                position: 'absolute',
                transform: `rotateY(${angle}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: CARD_W,
                  height: CARD_H,
                  marginLeft: -CARD_W / 2,
                  marginTop: -CARD_H / 2,
                  transform: `translateZ(${ARC_RADIUS}px)`,
                  background: '#000',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '28px 24px 24px',
                  overflow: 'hidden',
                  borderRadius: '4px',
                  opacity,
                }}
              >
                <div style={{ position: 'absolute', inset: 0, background: item.gradient, opacity: 0.08, pointerEvents: 'none' }} />
                <h2 style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '36px', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-1.5px', color: '#fff', whiteSpace: 'pre-line', margin: 0, position: 'relative' }}>
                  {item.name}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', position: 'relative' }}>
                  <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 300, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.3px', margin: '0 0 1px' }}>{item.role}</p>
                  <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 300, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.3px', margin: 0 }}>{item.location}</p>
                  <div style={{ width: '72px', height: '72px', background: item.gradient, marginTop: '16px', borderRadius: '3px', alignSelf: 'flex-end', opacity: 0.88 }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

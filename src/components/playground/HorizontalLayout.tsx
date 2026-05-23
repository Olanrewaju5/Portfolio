'use client';

import { useRef } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import type { PlayItem } from '@/data/playground';

// How many px of the NEXT card peek from the right edge
const PEEK = 48;
// Gap between cards
const GAP  = 20;

interface Props {
  items: PlayItem[];
}

export function HorizontalLayout({ items }: Props) {
  const trackRef      = useRef<HTMLDivElement>(null);
  const x             = useMotionValue(0);
  const currentIdx    = useRef(0);
  const dragStartX    = useRef(0);
  const dragStartVal  = useRef(0);
  const isDragging    = useRef(false);

  const cardWidth = () =>
    (typeof window !== 'undefined' ? window.innerWidth : 1280) - PEEK * 2;

  const snapTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    currentIdx.current = clamped;
    animate(x, -(clamped * (cardWidth() + GAP)), {
      type: 'spring',
      stiffness: 320,
      damping: 36,
      mass: 0.9,
    });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    dragStartX.current   = e.clientX;
    dragStartVal.current = x.get();
    trackRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const delta = e.clientX - dragStartX.current;
    // Rubber-band past edges
    const raw    = dragStartVal.current + delta;
    const minX   = -((items.length - 1) * (cardWidth() + GAP));
    const rubberband = (v: number, limit: number) =>
      limit + (v - limit) * 0.18;
    const clamped =
      raw > 0      ? rubberband(raw, 0)   :
      raw < minX   ? rubberband(raw, minX) :
      raw;
    x.set(clamped);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    trackRef.current?.releasePointerCapture(e.pointerId);

    const delta = e.clientX - dragStartX.current;
    const THRESHOLD = 55;
    if      (delta < -THRESHOLD) snapTo(currentIdx.current + 1);
    else if (delta >  THRESHOLD) snapTo(currentIdx.current - 1);
    else                          snapTo(currentIdx.current);
  };

  return (
    <div
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', cursor: 'grab' }}
    >
      {/* Draggable track */}
      <motion.div
        ref={trackRef}
        style={{
          x,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          height: '100%',
          gap: `${GAP}px`,
          paddingLeft: PEEK,
          paddingRight: PEEK,
          boxSizing: 'border-box',
          willChange: 'transform',
          touchAction: 'none',
          userSelect: 'none',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            style={{
              flexShrink: 0,
              width: `calc(100vw - ${PEEK * 2}px)`,
              display: 'flex',
              flexDirection: 'column',
              paddingTop: '88px',
              paddingBottom: '88px',
            }}
          >
            {/* Large card — nearly full viewport height */}
            <div
              style={{
                flexGrow: 1,
                background: '#090909',
                borderRadius: '10px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 16px 56px rgba(0,0,0,0.32)',
              }}
            >
              {/* Subtle gradient tint */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: item.gradient,
                  opacity: 0.1,
                }}
              />

              {/* Accent bar top */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: item.accent,
                  opacity: 0.6,
                }}
              />

              {/* Name + meta — bottom left */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '36px',
                  left: '40px',
                  right: '40px',
                }}
              >
                <h2
                  style={{
                    fontFamily: 'var(--font-inter), sans-serif',
                    fontSize: 'clamp(40px, 5.5vw, 72px)',
                    fontWeight: 700,
                    letterSpacing: '-2.5px',
                    lineHeight: 1.02,
                    color: '#fff',
                    margin: 0,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {item.name}
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-inter), sans-serif',
                    fontSize: '13px',
                    fontWeight: 300,
                    color: 'rgba(255,255,255,0.38)',
                    letterSpacing: '0.2px',
                    margin: '12px 0 0',
                  }}
                >
                  {item.role} · {item.location}
                </p>
              </div>
            </div>

            {/* Below-card label row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '14px',
                paddingLeft: '4px',
                paddingRight: '4px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontSize: '11px',
                  fontWeight: 300,
                  color: 'rgba(0,0,0,0.32)',
                  letterSpacing: '0.4px',
                  margin: 0,
                }}
              >
                {item.year}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontSize: '11px',
                  fontWeight: 300,
                  color: 'rgba(0,0,0,0.22)',
                  letterSpacing: '0.4px',
                  margin: 0,
                }}
              >
                {i + 1} / {items.length}
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

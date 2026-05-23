'use client';

import { useEffect, useRef } from 'react';
import type { PlayItem } from '@/data/playground';

// ─── Sphere constants ──────────────────────────────────────────────────────────
const SPHERE_R = 190;   // radius in px
const CARD_W   = 108;
const CARD_H   = 142;

// Spherical positions: phi = polar angle from north (0 = top, 180 = bottom),
// theta = azimuthal angle around Y axis (degrees).
// Formula: rotateY(theta) rotateX(90 - phi) translateZ(SPHERE_R)
// → card position = (R·sinφ·sinθ, −R·cosφ, R·sinφ·cosθ) and card faces outward ✓
const POSITIONS = [
  { phi: 20,  theta: 0   },   // near north pole, front
  { phi: 60,  theta: 52  },   // upper belt, right-front
  { phi: 60,  theta: 172 },   // upper belt, left-back
  { phi: 60,  theta: 292 },   // upper belt, right-back
  { phi: 120, theta: 12  },   // lower belt, slightly right
  { phi: 120, theta: 132 },   // lower belt, left
  { phi: 120, theta: 252 },   // lower belt, back
  { phi: 160, theta: 92  },   // near south pole
];

// Decorative orbit rings — each is a 2R×2R circle in a rotated plane
const RING_ROTATIONS = [
  'rotateX(90deg)',                        // equatorial
  'rotateX(70deg) rotateZ(-38deg)',        // tilted orbit
  'rotateX(110deg) rotateZ(28deg)',        // counter-tilted orbit
];

interface DragState {
  x: number; y: number;
  rx: number; ry: number;
  lx: number; ly: number; lt: number;
}

interface Props { items: PlayItem[] }

export function GlobeLayout({ items }: Props) {
  const sceneRef   = useRef<HTMLDivElement>(null);
  const rotX       = useRef(16);
  const rotY       = useRef(-22);
  const velX       = useRef(0);
  const velY       = useRef(0);
  const autoRotate = useRef(true);
  const dragState  = useRef<DragState | null>(null);
  const rafRef     = useRef<number>(0);
  const resumeRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const apply = () => {
    if (sceneRef.current) {
      sceneRef.current.style.transform =
        `rotateX(${rotX.current}deg) rotateY(${rotY.current}deg)`;
    }
  };

  useEffect(() => {
    apply();
    const tick = () => {
      if (!dragState.current) {
        if (autoRotate.current) {
          rotY.current += 0.18;
          apply();
        } else if (Math.abs(velX.current) > 0.004 || Math.abs(velY.current) > 0.004) {
          rotX.current = Math.max(-75, Math.min(75, rotX.current + velX.current));
          rotY.current += velY.current;
          velX.current *= 0.93;
          velY.current *= 0.93;
          apply();
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (resumeRef.current) clearTimeout(resumeRef.current);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    autoRotate.current = false;
    velX.current = 0; velY.current = 0;
    if (resumeRef.current) clearTimeout(resumeRef.current);
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = {
      x: e.clientX, y: e.clientY,
      rx: rotX.current, ry: rotY.current,
      lx: e.clientX, ly: e.clientY, lt: performance.now(),
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.x;
    const dy = e.clientY - dragState.current.y;
    rotX.current = Math.max(-75, Math.min(75, dragState.current.rx - dy * 0.38));
    rotY.current = dragState.current.ry + dx * 0.38;
    const dt = performance.now() - dragState.current.lt;
    if (dt > 8) {
      velX.current = -(e.clientY - dragState.current.ly) * 0.38 * (16 / dt);
      velY.current =  (e.clientX - dragState.current.lx) * 0.38 * (16 / dt);
      dragState.current.lx = e.clientX;
      dragState.current.ly = e.clientY;
      dragState.current.lt = performance.now();
    }
    apply();
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    dragState.current = null;
    resumeRef.current = setTimeout(() => {
      velX.current = 0; velY.current = 0;
      autoRotate.current = true;
    }, 4000);
  };

  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        cursor: 'grab', touchAction: 'none', userSelect: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Drag hint */}
      <p style={{
        position: 'absolute', bottom: '88px', left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--font-inter), sans-serif',
        fontSize: '10px', fontWeight: 300, color: 'rgba(0,0,0,0.22)',
        letterSpacing: '1px', pointerEvents: 'none', zIndex: 10,
        whiteSpace: 'nowrap', textTransform: 'uppercase',
      }}>
        drag to spin
      </p>

      {/* Perspective wrapper */}
      <div style={{ perspective: '1100px', perspectiveOrigin: '50% 50%' }}>
        {/* 3D scene — rotated by RAF / drag */}
        <div
          ref={sceneRef}
          style={{
            width:  `${SPHERE_R * 2}px`,
            height: `${SPHERE_R * 2}px`,
            position: 'relative',
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotX.current}deg) rotateY(${rotY.current}deg)`,
            willChange: 'transform',
          }}
        >
          {/* ── Orbit rings ─────────────────────────────────────────────── */}
          {RING_ROTATIONS.map((rot, i) => (
            <div
              key={`ring-${i}`}
              style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width:  `${SPHERE_R * 2}px`,
                height: `${SPHERE_R * 2}px`,
                marginTop:  `-${SPHERE_R}px`,
                marginLeft: `-${SPHERE_R}px`,
                transform: rot,
                border: `1px solid rgba(0,0,0,${i === 0 ? 0.15 : 0.09})`,
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* ── Cards on the sphere surface ──────────────────────────────── */}
          {items.slice(0, POSITIONS.length).map((item, i) => {
            const { phi, theta } = POSITIONS[i];
            return (
              <div
                key={item.id}
                style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  width:  `${CARD_W}px`,
                  height: `${CARD_H}px`,
                  marginTop:  `-${CARD_H / 2}px`,
                  marginLeft: `-${CARD_W / 2}px`,
                  transform: `rotateY(${theta}deg) rotateX(${90 - phi}deg) translateZ(${SPHERE_R}px)`,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  background: '#0a0a0a',
                  borderRadius: '7px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '12px 11px 11px',
                  boxShadow: '0 6px 28px rgba(0,0,0,0.38)',
                }}
              >
                {/* Gradient tint fill */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: item.gradient,
                  opacity: 0.11,
                  pointerEvents: 'none',
                }} />

                {/* Accent bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: '2px',
                  background: item.accent,
                  opacity: 0.72,
                }} />

                {/* Name */}
                <h3 style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: '-0.4px',
                  color: '#fff',
                  whiteSpace: 'pre-line',
                  margin: 0,
                  position: 'relative',
                }}>
                  {item.name}
                </h3>

                {/* Role + swatch */}
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-inter), sans-serif',
                      fontSize: '9px',
                      fontWeight: 300,
                      color: 'rgba(255,255,255,0.42)',
                      letterSpacing: '0.3px',
                      margin: 0,
                    }}>
                      {item.role}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-inter), sans-serif',
                      fontSize: '9px',
                      fontWeight: 300,
                      color: 'rgba(255,255,255,0.24)',
                      letterSpacing: '0.3px',
                      margin: '2px 0 0',
                    }}>
                      {item.year}
                    </p>
                  </div>
                  <div style={{
                    width: '26px', height: '26px',
                    background: item.gradient,
                    borderRadius: '3px',
                    opacity: 0.85,
                    flexShrink: 0,
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

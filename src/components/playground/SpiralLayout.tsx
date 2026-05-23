'use client';

import { useEffect, useRef } from 'react';
import type { PlayItem } from '@/data/playground';

// ─── Rubik's cube constants ────────────────────────────────────────────────
const SIZE = 264;  // cube side length in px
const HALF = SIZE / 2;

// Classic Rubik's colors
const W = '#F4F4F2';  // white
const Y = '#F5C518';  // yellow
const R = '#E8372A';  // red
const O = '#FF6B00';  // orange
const B = '#1E5ECD';  // blue
const G = '#189C37';  // green

// 6 faces × 9 tiles.  Centre tile (index 4) = face identity colour.
// Pre-baked scramble that looks realistic — not solved, not fully random.
const TILES: string[][] = [
  [B, W, B,  B, B, O,  G, B, B],   // front  (blue)
  [G, R, R,  O, R, R,  R, R, W],   // right  (red)
  [G, G, Y,  G, G, G,  R, G, G],   // back   (green)
  [W, O, O,  O, O, R,  O, O, B],   // left   (orange)
  [W, W, R,  W, W, W,  W, G, W],   // top    (white)
  [Y, B, Y,  Y, Y, Y,  O, Y, Y],   // bottom (yellow)
];

const FACE_TRANSFORMS = [
  `translateZ(${HALF}px)`,
  `rotateY(90deg) translateZ(${HALF}px)`,
  `rotateY(180deg) translateZ(${HALF}px)`,
  `rotateY(-90deg) translateZ(${HALF}px)`,
  `rotateX(90deg) translateZ(${HALF}px)`,
  `rotateX(-90deg) translateZ(${HALF}px)`,
];

// Drag state type
interface DragState {
  x: number; y: number;
  rx: number; ry: number;
  lx: number; ly: number; lt: number;
}

interface Props { items: PlayItem[] }

export function CubeLayout({ items: _items }: Props) {
  const cubeRef    = useRef<HTMLDivElement>(null);
  const rotX       = useRef(22);
  const rotY       = useRef(-28);
  const velX       = useRef(0);
  const velY       = useRef(0);
  const autoRotate = useRef(true);
  const dragState  = useRef<DragState | null>(null);
  const rafRef     = useRef<number>(0);
  const resumeRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const apply = () => {
    if (cubeRef.current) {
      cubeRef.current.style.transform =
        `rotateX(${rotX.current}deg) rotateY(${rotY.current}deg)`;
    }
  };

  useEffect(() => {
    apply();
    const tick = () => {
      if (!dragState.current) {
        if (autoRotate.current) {
          rotY.current += 0.22;
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
    dragState.current = { x: e.clientX, y: e.clientY, rx: rotX.current, ry: rotY.current, lx: e.clientX, ly: e.clientY, lt: performance.now() };
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
      style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'grab', touchAction: 'none', userSelect: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Hint */}
      <p style={{ position: 'absolute', bottom: '88px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 300, color: 'rgba(0,0,0,0.22)', letterSpacing: '1px', pointerEvents: 'none', zIndex: 10, whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
        drag to spin
      </p>

      {/* Perspective */}
      <div style={{ width: `${SIZE}px`, height: `${SIZE}px`, perspective: '1100px', perspectiveOrigin: '50% 45%' }}>
        {/* Cube */}
        <div
          ref={cubeRef}
          style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', transform: `rotateX(${rotX.current}deg) rotateY(${rotY.current}deg)`, willChange: 'transform' }}
        >
          {FACE_TRANSFORMS.map((transform, faceIdx) => (
            <div
              key={faceIdx}
              style={{
                position: 'absolute', inset: 0,
                transform,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                // Dark plastic frame between tiles
                background: '#0f0f0f',
                borderRadius: '10px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridTemplateRows: 'repeat(3, 1fr)',
                gap: '5px',
                padding: '7px',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              {TILES[faceIdx].map((color, tileIdx) => (
                <div
                  key={tileIdx}
                  style={{
                    background: color,
                    borderRadius: '4px',
                    // Plastic bevel: top-left highlight, bottom-right shadow
                    boxShadow:
                      'inset 0 1px 0 rgba(255,255,255,0.45), ' +
                      'inset 0 -1px 0 rgba(0,0,0,0.18), ' +
                      'inset 1px 0 0 rgba(255,255,255,0.2), ' +
                      'inset -1px 0 0 rgba(0,0,0,0.12)',
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

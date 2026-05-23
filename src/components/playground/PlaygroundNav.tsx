'use client';

import Link from 'next/link';

export function PlaygroundNav() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        background: '#292727',
        borderRadius: '31px',
        padding: '12px',
        width: '374px',
      }}
    >
      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 600,
            color: '#fff',
            fontFamily: 'var(--font-inter), sans-serif',
            letterSpacing: '-0.5px',
          }}
        >
          AQ
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '-1px',
            right: '-1px',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#4ade80',
            border: '1.5px solid #292727',
          }}
        />
      </div>

      {/* Playground pill */}
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '28px',
          padding: '4px 10px 4px 12px',
          height: '28px',
          textDecoration: 'none',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            color: '#f6f5f5',
            letterSpacing: '-0.56px',
            whiteSpace: 'nowrap',
            lineHeight: 1,
          }}
        >
          Playground
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4.5 6.5l3.5 3.5 3.5-3.5" stroke="#f6f5f5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      {/* Right: separator + menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <div style={{ width: '1px', height: '22px', background: 'rgba(255,255,255,0.18)' }} />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="#f6f5f5" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

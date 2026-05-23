'use client';

import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PlaygroundNav } from './PlaygroundNav';
import { PlaygroundTabs } from './PlaygroundTabs';
import { GridLayout } from './GridLayout';
import { CanonicalLayout } from './CanonicalLayout';
import { CubeLayout } from './SpiralLayout';
import { GlobeLayout } from './GlobeLayout';
import { HorizontalLayout } from './HorizontalLayout';
import { PLAY_ITEMS } from '@/data/playground';
import type { LayoutMode } from '@/data/playground';

const TAB_ORDER: LayoutMode[] = ['grid', 'canonical', 'cube', 'globe', 'horizontal'];

// Content layer: spring slide + scale only — NO filter, so CSS preserve-3d stays intact
// (a filter on the wrapper would flatten 3D transforms in CanonicalLayout)
const slideVariants = {
  initial: (dir: number) => ({ opacity: 0, x: dir * 52, scale: 0.91 }),
  animate: { opacity: 1, x: 0, scale: 1 },
  exit:    (dir: number) => ({ opacity: 0, x: dir * -52, scale: 0.95 }),
};

// Separate glass-blur overlay — backdropFilter blurs whatever is behind it
// without creating a stacking context on the content layer
const blurVariants = {
  initial: { backdropFilter: 'blur(20px)', opacity: 1 },
  animate: { backdropFilter: 'blur(0px)',  opacity: 0 },
  exit:    { backdropFilter: 'blur(20px)', opacity: 1 },
};

const springT  = { type: 'spring', stiffness: 300, damping: 28, mass: 0.85 } as const;
const blurT    = { duration: 0.38, ease: [0.32, 0.72, 0, 1] as number[] };

export function PlaygroundDisplay() {
  const [mode, setMode] = useState<LayoutMode>('grid');
  const dirRef = useRef<number>(1);

  const handleChange = (next: LayoutMode) => {
    const oldIdx = TAB_ORDER.indexOf(mode);
    const newIdx = TAB_ORDER.indexOf(next);
    dirRef.current = newIdx >= oldIdx ? 1 : -1;
    setMode(next);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        background: '#d7d7d7',
        overflow: 'hidden',
        fontFamily: 'var(--font-inter), sans-serif',
      }}
    >
      <PlaygroundNav />

      {/* Content — spring slide, no blur filter */}
      <AnimatePresence mode="wait" custom={dirRef.current}>
        <motion.div
          key={mode}
          custom={dirRef.current}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={springT}
          style={{ position: 'absolute', inset: 0 }}
        >
          {mode === 'grid'       && <GridLayout       items={PLAY_ITEMS} />}
          {mode === 'canonical'  && <CanonicalLayout  items={PLAY_ITEMS} />}
          {mode === 'cube'       && <CubeLayout       items={PLAY_ITEMS} />}
          {mode === 'globe'      && <GlobeLayout      items={PLAY_ITEMS} />}
          {mode === 'horizontal' && <HorizontalLayout items={PLAY_ITEMS} />}
        </motion.div>
      </AnimatePresence>

      {/* Glass blur overlay — separate compositing layer, doesn't touch preserve-3d */}
      <AnimatePresence>
        <motion.div
          key={mode + '-glass'}
          variants={blurVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={blurT}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 40 }}
        />
      </AnimatePresence>

      <PlaygroundTabs active={mode} onChange={handleChange} />
    </div>
  );
}

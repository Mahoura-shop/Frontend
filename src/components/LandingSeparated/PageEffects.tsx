'use client';

import { useCustomCursor } from '@/hooks/useCustomCursor';
import { useScrollEffects } from '@/hooks/useScrollEffects';

/**
 * Mounts page-level effects once: custom cursor + scroll progress / nav state.
 * Renders only the static elements those effects target.
 */
export default function PageEffects() {
  useCustomCursor();
  useScrollEffects();

  return <div id="progress" />;
}

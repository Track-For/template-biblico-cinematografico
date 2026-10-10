import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
gsap.registerPlugin(ScrollTrigger, SplitText);
export { gsap, ScrollTrigger, SplitText };
export function useMotion<T extends HTMLElement>(setup: (el: T) => void, deps: unknown[] = []) {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const context = gsap.context(() => setup(ref.current!), ref);
    return () => context.revert();
    // Caller must keep setup stable or pass dependencies deliberately.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}
export function motionAllowed() { return typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/app/lib/motion";

type SmoothScrollProps = {
  enabled: boolean;
};

export function SmoothScroll({ enabled }: SmoothScrollProps) {
  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.86,
    });

    const update = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [enabled]);

  return null;
}

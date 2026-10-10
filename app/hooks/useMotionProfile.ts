"use client";

import { useEffect, useState } from "react";

export type MotionProfile = {
  ready: boolean;
  reduced: boolean;
  coarse: boolean;
  compact: boolean;
  webgl: boolean;
};

const initialProfile: MotionProfile = {
  ready: false,
  reduced: false,
  coarse: false,
  compact: false,
  webgl: false,
};

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
        canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }),
    );
  } catch {
    return false;
  }
}

export function useMotionProfile() {
  const [profile, setProfile] = useState<MotionProfile>(initialProfile);

  useEffect(() => {
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    const compactQuery = window.matchMedia("(max-width: 767px)");

    const update = () => {
      setProfile({
        ready: true,
        reduced: reducedQuery.matches,
        coarse: coarseQuery.matches,
        compact: compactQuery.matches,
        webgl: supportsWebGL(),
      });
    };

    update();
    reducedQuery.addEventListener("change", update);
    coarseQuery.addEventListener("change", update);
    compactQuery.addEventListener("change", update);

    return () => {
      reducedQuery.removeEventListener("change", update);
      coarseQuery.removeEventListener("change", update);
      compactQuery.removeEventListener("change", update);
    };
  }, []);

  return profile;
}

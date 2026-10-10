import { useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, motionAllowed } from '../effects/useMotion';
import 'lenis/dist/lenis.css';
export function SmoothScroll({children}:{children:ReactNode}) {const instance=useRef<Lenis|null>(null);useEffect(()=>{if(!motionAllowed())return;const lenis=new Lenis({autoRaf:false,lerp:0.1});instance.current=lenis;const update=(time:number)=>lenis.raf(time*1000);lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(update);gsap.ticker.lagSmoothing(0);return()=>{gsap.ticker.remove(update);lenis.off('scroll',ScrollTrigger.update);lenis.destroy();instance.current=null}},[]);return <>{children}</>}

import type { ReactNode } from 'react';
import { gsap, ScrollTrigger, SplitText, useMotion } from './useMotion';

type Wrap = { children: ReactNode; className?: string };
export function FadeUp({ children, className }: Wrap) {
  const ref = useMotion<HTMLDivElement>((el) => gsap.fromTo(el, { y: 55, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } }));
  return <div ref={ref} className={className}>{children}</div>;
}
export function ParallaxImage({ src, alt, speed = 18, className = '' }: { src: string; alt: string; speed?: number; className?: string }) {
  const ref = useMotion<HTMLDivElement>((el) => { const img = el.querySelector('img'); if (!img) return; gsap.fromTo(img, { yPercent: -speed }, { yPercent: speed, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }); });
  return <div ref={ref} className={'tf-parallax '+className}><img src={src} alt={alt}/></div>;
}
export function ImageClipReveal({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const ref = useMotion<HTMLDivElement>((el) => gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 80%', once: true } }));
  return <div ref={ref} className={className}><img src={src} alt={alt} style={{ width:'100%', display:'block' }}/></div>;
}
export function TextReveal({ children, as: Tag='h2', className='' }: Wrap & { as?: 'h1'|'h2'|'h3'|'p' }) {
  const ref = useMotion<HTMLElement>((el) => {
    SplitText.create(el, { type:'lines,words', mask:'lines', autoSplit:true, onSplit(self) { return gsap.from(self.lines, { yPercent:110, autoAlpha:0, duration:1.1, ease:'power3.out', stagger:0.12, scrollTrigger:{trigger:el,start:'top 88%',once:true} }); } });
  });
  return <Tag ref={ref as React.Ref<never>} className={className}>{children}</Tag>;
}
export function StaggerGrid({ children, className='' }: Wrap) {
  const ref = useMotion<HTMLDivElement>((el) => { gsap.fromTo(Array.from(el.children),{y:45,autoAlpha:0},{y:0,autoAlpha:1,stagger:0.12,duration:0.8,scrollTrigger:{trigger:el,start:'top 80%',once:true}}); });
  return <div ref={ref} className={className}>{children}</div>;
}
export function PinnedStory({ steps }: {steps: {title:string;description:string}[]}) {
 const ref=useMotion<HTMLElement>((el)=> { const panels=gsap.utils.toArray<HTMLElement>('.tf-story-step',el); gsap.set(panels.slice(1),{autoAlpha:0}); const tl=gsap.timeline({scrollTrigger:{trigger:el,start:'top top',end:()=>'+='+(steps.length*window.innerHeight),pin:true,scrub:1,invalidateOnRefresh:true}}); panels.forEach((panel,i)=>{if(i>0)tl.to(panels[i-1],{autoAlpha:0,duration:0.4}).to(panel,{autoAlpha:1,duration:0.4},'<'); tl.to({}, {duration:0.9});}); });
 return <section ref={ref} className="tf-pinned-story">{steps.map((s,i)=><article className="tf-story-step" key={i}><span>0{i+1} / 0{steps.length}</span><h2>{s.title}</h2><p>{s.description}</p></article>)}</section>;
}
export function HorizontalScroll({ children }:Wrap) {
 const ref=useMotion<HTMLElement>((el)=>{const track=el.querySelector<HTMLElement>('.tf-horizontal-track');if(!track)return;const mm=gsap.matchMedia();mm.add('(min-width: 800px)',()=>{const tween=gsap.to(track,{x:()=>-Math.max(0,track.scrollWidth-window.innerWidth),ease:'none',scrollTrigger:{trigger:el,pin:true,scrub:1,start:'top top',end:()=>'+='+Math.max(1,track.scrollWidth-window.innerWidth),invalidateOnRefresh:true}});return()=>tween.kill();});});
 return <section ref={ref} className="tf-horizontal-outer"><div className="tf-horizontal-track">{children}</div></section>;
}
export function ScrollProgress(){ const ref=useMotion<HTMLDivElement>((el)=> { gsap.fromTo(el,{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:document.documentElement,start:'top top',end:'bottom bottom',scrub:true}}); }); return <div aria-hidden="true" ref={ref} className="tf-progress"/>; }
export function Marquee({ text, duration=24 }: {text:string;duration?:number}) {const ref=useMotion<HTMLDivElement>((el)=>{ const track=el.firstElementChild; if(track)gsap.to(track,{xPercent:-50,repeat:-1,duration,ease:'none'});});return <div ref={ref} className="tf-marquee" aria-label={text}><div className="tf-marquee-track" aria-hidden="true">{Array.from({length:8},(_,i)=><span key={i}>{text} ✦ </span>)}</div></div>}
export function ScaleOnScroll({children}:Wrap){const ref=useMotion<HTMLDivElement>(el=>gsap.fromTo(el,{scale:0.86,borderRadius:'3rem'},{scale:1,borderRadius:'0rem',ease:'none',scrollTrigger:{trigger:el,start:'top 90%',end:'center center',scrub:true}}));return <div ref={ref}>{children}</div>}

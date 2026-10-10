"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { chapters, Chapter } from "@/app/data/chapters";
import { useMotionProfile } from "@/app/hooks/useMotionProfile";
import { gsap, ScrollTrigger } from "@/app/lib/motion";
import { SmoothScroll } from "./SmoothScroll";

const VideoDistortionPlane = dynamic(() => import("./VideoDistortionPlane"), {
  ssr: false,
});

const originalFilm = "/videos/Video biblico.mp4";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${remainder}`;
}

type EntryProps = {
  onEnter: (skipIntro: boolean) => void;
};

function ExperienceEntry({ onEnter }: EntryProps) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <section className="entry" aria-labelledby="experience-title">
      <Image
        className="entry__image"
        src={chapters[0].poster}
        alt=""
        fill
        priority
        sizes="100vw"
        onLoad={() => setReady(true)}
        onError={() => setFailed(true)}
      />
      <video
        className="entry__preload"
        src={chapters[0].desktopVideo}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="entry__veil" aria-hidden="true" />
      <div className="entry__light" aria-hidden="true" />
      <div className="entry__content">
        <p className="entry__context">Uma jornada bíblica cinematográfica</p>
        <h1 id="experience-title">A Jornada Divina</h1>
        <p className="entry__subtitle">
          Uma travessia pela escolha, pelo abismo e pela luz.
        </p>
        <p className="entry__warning">
          Esta experiência contém imagens intensas de violência, morte e
          conflito espiritual.
        </p>
        <div className="entry__actions">
          <button
            className="button button--primary"
            type="button"
            onClick={() => onEnter(false)}
            disabled={!ready && !failed}
          >
            {ready || failed ? "Iniciar jornada" : "Preparando experiência"}
          </button>
          <button
            className="button button--quiet"
            type="button"
            onClick={() => onEnter(true)}
            disabled={!ready && !failed}
          >
            Pular prólogo
          </button>
        </div>
        <p className="entry__status" aria-live="polite">
          {failed
            ? "A versão estática será usada quando necessário."
            : ready
              ? "Experiência pronta"
              : "Carregando o primeiro capítulo"}
        </p>
      </div>
    </section>
  );
}

type NavigationProps = {
  activeIndex: number;
  open: boolean;
  setOpen: (value: boolean) => void;
  onNavigate: (id: string) => void;
};

function ChapterNavigation({
  activeIndex,
  open,
  setOpen,
  onNavigate,
}: NavigationProps) {
  return (
    <>
      <header className="experience-nav">
        <button
          className="experience-nav__brand"
          type="button"
          onClick={() => onNavigate(chapters[0].id)}
          aria-label="Voltar ao início da jornada"
        >
          A Jornada Divina
        </button>
        <p className="experience-nav__active" aria-live="polite">
          {chapters[activeIndex]?.title}
        </p>
        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="chapter-menu"
          aria-label={open ? "Fechar capítulos" : "Abrir capítulos"}
          onClick={() => setOpen(!open)}
        >
          <span>{open ? "Fechar" : "Capítulos"}</span>
          <i aria-hidden="true" />
        </button>
      </header>
      <div className="narrative-progress" aria-hidden="true">
        <span data-progress />
      </div>
      <div
        id="chapter-menu"
        className={`chapter-menu${open ? " chapter-menu--open" : ""}`}
        aria-hidden={!open}
      >
        <div className="chapter-menu__inner">
          <p className="chapter-menu__title">A travessia</p>
          <nav aria-label="Navegação por capítulos">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                type="button"
                className={index === activeIndex ? "is-active" : ""}
                onClick={() => onNavigate(chapter.id)}
                tabIndex={open ? 0 : -1}
              >
                <span>{chapter.label}</span>
                <strong>{chapter.title}</strong>
                <small>{formatTime(chapter.start)}</small>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

type ChapterSectionProps = {
  chapter: Chapter;
  index: number;
  entered: boolean;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  profile: ReturnType<typeof useMotionProfile>;
};

function ChapterSection({
  chapter,
  index,
  entered,
  activeIndex,
  setActiveIndex,
  profile,
}: ChapterSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const narrationRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const entranceTransitionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const seekFrameRef = useRef<number | null>(null);
  const [nearViewport, setNearViewport] = useState(index === 0);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const compact = profile.compact || profile.coarse;
  const source = compact ? chapter.mobileVideo : chapter.desktopVideo;
  const distortionActive =
    chapter.effect === "choice" &&
    activeIndex === index &&
    profile.webgl &&
    !compact &&
    !profile.reduced &&
    Boolean(videoElement);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNearViewport(true);
      },
      { rootMargin: "140% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    const title = titleRef.current;
    const narration = narrationRef.current;
    const quote = quoteRef.current;
    const entranceTransition = entranceTransitionRef.current;

    if (
      !entered ||
      !profile.ready ||
      profile.reduced ||
      !section ||
      !stage ||
      !video ||
      !title ||
      !narration
    ) {
      return;
    }

    const context = gsap.context(() => {
      const state = { progress: 0 };
      const maskZoom = entranceTransition?.querySelector<SVGGElement>(
        ".chapter-transition__mask-zoom",
      );
      const maskEnd = index > 0 ? (compact ? 0.22 : 0.18) : 0;
      const maskTarget = compact ? { x: 450, y: 800 } : { x: 800, y: 450 };

      const renderFrame = (progress: number) => {
        const chapterProgress =
          maskEnd > 0
            ? gsap.utils.clamp(0, 1, (progress - maskEnd) / (1 - maskEnd))
            : progress;

        progressRef.current = chapterProgress;
        stage.style.setProperty(
          "--chapter-progress",
          chapterProgress.toFixed(4),
        );

        const mediaDuration = video.duration || chapter.duration;
        const playbackStart = Math.min(
          chapter.playbackStart ?? 0,
          Math.max(0, mediaDuration - 0.04),
        );
        const playbackEnd = Math.max(
          playbackStart,
          Math.min(
            chapter.playbackEnd ?? mediaDuration - 0.04,
            mediaDuration - 0.04,
          ),
        );
        const targetTime =
          playbackStart + chapterProgress * (playbackEnd - playbackStart);

        if (
          Number.isFinite(targetTime) &&
          Math.abs(video.currentTime - targetTime) > 0.025 &&
          seekFrameRef.current === null
        ) {
          seekFrameRef.current = window.requestAnimationFrame(() => {
            video.currentTime = targetTime;
            seekFrameRef.current = null;
          });
        }

        const titleIn = gsap.utils.clamp(0, 1, (chapterProgress - 0.015) / 0.08);
        const titleOut =
          1 - gsap.utils.clamp(0, 1, (chapterProgress - 0.38) / 0.15);
        const narrationIn = gsap.utils.clamp(
          0,
          1,
          (chapterProgress - 0.12) / 0.16,
        );
        const narrationOut =
          1 - gsap.utils.clamp(0, 1, (chapterProgress - 0.78) / 0.14);

        gsap.set(title, {
          opacity: titleIn * titleOut,
          yPercent: (1 - titleIn) * 18 - (1 - titleOut) * 12,
        });
        gsap.set(narration, {
          opacity: narrationIn * narrationOut,
          yPercent: (1 - narrationIn) * 16,
        });

        if (quote) {
          const quoteIn = gsap.utils.clamp(
            0,
            1,
            (chapterProgress - 0.48) / 0.17,
          );
          const quoteOut =
            1 - gsap.utils.clamp(0, 1, (chapterProgress - 0.88) / 0.1);
          gsap.set(quote, {
            opacity: quoteIn * quoteOut,
            yPercent: (1 - quoteIn) * 12,
          });
        }

        if (entranceTransition && maskZoom && maskEnd > 0) {
          const maskProgress = gsap.utils.clamp(0, 1, progress / maskEnd);
          const zoomProgress = gsap.utils.clamp(
            0,
            1,
            (maskProgress - 0.08) / 0.78,
          );
          const easedZoom = zoomProgress * zoomProgress;
          const maskOpacity =
            1 - gsap.utils.clamp(0, 1, (maskProgress - 0.38) / 0.62);
          const maskScale = 1 + easedZoom * (compact ? 6.2 : 7.5);

          gsap.set(entranceTransition, {
            autoAlpha: maskProgress >= 0.999 ? 0 : maskOpacity,
          });
          gsap.set(maskZoom, {
            attr: {
              transform: `translate(${maskTarget.x} ${maskTarget.y}) scale(${maskScale})`,
            },
          });
        }
      };

      const animatedElements = [
        title,
        narration,
        quote,
        entranceTransition,
        maskZoom,
      ].filter(Boolean) as Array<HTMLElement | SVGGElement>;

      gsap.set(animatedElements, { willChange: "transform,opacity" });
      renderFrame(0);

      gsap.to(state, {
        progress: 1,
        ease: "none",
        onUpdate: () => renderFrame(state.progress),
        scrollTrigger: {
          id: `chapter-${chapter.id}`,
          trigger: section,
          start: "top top",
          end: compact ? "bottom bottom" : `+=${chapter.scrollDistance}`,
          pin: compact ? false : stage,
          pinSpacing: !compact,
          scrub: compact ? 0.25 : 0.55,
          anticipatePin: compact ? 0 : 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        },
      });
    }, section);

    return () => {
      if (seekFrameRef.current !== null) {
        window.cancelAnimationFrame(seekFrameRef.current);
        seekFrameRef.current = null;
      }
      context.revert();
    };
  }, [chapter, compact, entered, index, profile.ready, profile.reduced, setActiveIndex]);

  const style = {
    "--mobile-height": `${chapter.mobileHeight}svh`,
  } as CSSProperties;
  const transitionWord = chapter.title.replace(/^(A|O)\s+/i, "").toUpperCase();
  const maskId = `chapter-mask-${chapter.id}`;
  const maskWidth = compact ? 900 : 1600;
  const maskHeight = compact ? 1600 : 900;

  return (
    <section
      ref={sectionRef}
      id={chapter.id}
      className={`chapter chapter--${chapter.effect}${profile.reduced ? " chapter--reduced" : ""}`}
      style={style}
      aria-labelledby={`${chapter.id}-title`}
    >
      <div
        ref={stageRef}
        className="chapter__stage"
      >
        <video
          ref={videoRef}
          className="chapter__video"
          src={nearViewport || profile.reduced ? source : undefined}
          poster={chapter.poster}
          preload={index === 0 ? "auto" : "metadata"}
          muted
          playsInline
          controls={profile.reduced}
          onLoadedMetadata={(event) => {
            const element = event.currentTarget;
            if (chapter.playbackStart) {
              element.currentTime = chapter.playbackStart;
            }
            setVideoElement(element);
          }}
          aria-label={`Filme do capítulo ${chapter.title}`}
        />
        {distortionActive && videoElement ? (
          <VideoDistortionPlane video={videoElement} progress={progressRef} />
        ) : null}
        <div className="chapter__grade" aria-hidden="true" />
        <div className="chapter__effect" aria-hidden="true" />
        <div ref={titleRef} className="chapter__title-block">
          <p>{chapter.label}</p>
          <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
          <span>
            {formatTime(chapter.start)} / {formatTime(chapter.end)}
          </span>
        </div>
        <div ref={narrationRef} className="chapter__narration">
          <p>{chapter.narration}</p>
        </div>
        {chapter.quote ? (
          <blockquote ref={quoteRef} className="chapter__quote">
            <p>{chapter.quote}</p>
            <cite>{chapter.citation}</cite>
          </blockquote>
        ) : null}
        {index > 0 ? (
          <div
            ref={entranceTransitionRef}
            className="chapter-transition chapter-transition--entrance-mask"
            aria-hidden="true"
          >
            <svg
              className="chapter-transition__mask-svg"
              viewBox={`0 0 ${maskWidth} ${maskHeight}`}
              preserveAspectRatio="none"
              focusable="false"
            >
              <defs>
                <mask
                  id={maskId}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width={maskWidth}
                  height={maskHeight}
                >
                  <rect width={maskWidth} height={maskHeight} fill="white" />
                  <g
                    className="chapter-transition__mask-zoom"
                    transform={`translate(${maskWidth / 2} ${maskHeight / 2})`}
                  >
                    <text
                      className="chapter-transition__mask-cutout"
                      x="0"
                      y="0"
                      textAnchor="middle"
                      dominantBaseline="central"
                      textLength={maskWidth * 0.84}
                      lengthAdjust="spacingAndGlyphs"
                      fill="black"
                    >
                      {transitionWord}
                    </text>
                  </g>
                </mask>
              </defs>
              <rect
                className="chapter-transition__mask-cover"
                width={maskWidth}
                height={maskHeight}
                mask={`url(#${maskId})`}
              />
            </svg>
          </div>
        ) : null}
      </div>
    </section>
  );
}

type FilmPlayerProps = {
  open: boolean;
  onClose: () => void;
};

function FilmPlayer({ open, onClose }: FilmPlayerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="film-player" role="dialog" aria-modal="true" aria-label="Filme completo">
      <button ref={closeRef} type="button" onClick={onClose}>
        Fechar filme
      </button>
      <video src={originalFilm} controls playsInline preload="metadata" autoPlay muted>
        Seu navegador não oferece suporte à reprodução de vídeo.
      </video>
    </div>
  );
}

export function CinematicExperience() {
  const [entered, setEntered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);
  const skipTargetRef = useRef<string | null>(null);
  const profile = useMotionProfile();

  const navigate = useCallback(
    (id: string) => {
      setMenuOpen(false);
      document.getElementById(id)?.scrollIntoView({
        behavior: profile.reduced ? "auto" : "smooth",
        block: "start",
      });
    },
    [profile.reduced],
  );

  const enter = useCallback((skipIntro: boolean) => {
    skipTargetRef.current = skipIntro ? chapters[1].id : chapters[0].id;
    setEntered(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("experience-locked", !entered);
    return () => document.documentElement.classList.remove("experience-locked");
  }, [entered]);

  useEffect(() => {
    if (!entered || !skipTargetRef.current) return;
    const target = skipTargetRef.current;
    skipTargetRef.current = null;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById(target)?.scrollIntoView({ block: "start" });
        ScrollTrigger.refresh();
      });
    });
  }, [entered]);

  useLayoutEffect(() => {
    if (!entered || !profile.ready) return;
    const bar = document.querySelector<HTMLElement>("[data-progress]");
    if (!bar) return;

    const context = gsap.context(() => {
      gsap.set(bar, { transformOrigin: "left center", scaleX: 0 });
      gsap.to(bar, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          id: "narrative-progress",
          start: 0,
          end: "max",
          scrub: profile.reduced ? false : 0.2,
        },
      });
    });

    return () => context.revert();
  }, [entered, profile.ready, profile.reduced]);

  return (
    <>
      {!entered ? <ExperienceEntry onEnter={enter} /> : null}
      <div className={`experience${entered ? " experience--entered" : ""}`}>
        <a className="skip-link" href="#guerra-invisivel">
          Ir para a experiência
        </a>
        <SmoothScroll
          enabled={
            entered && profile.ready && !profile.reduced && !profile.coarse
          }
        />
        {entered ? (
          <ChapterNavigation
            activeIndex={activeIndex}
            open={menuOpen}
            setOpen={setMenuOpen}
            onNavigate={navigate}
          />
        ) : null}
        <main>
          {chapters.map((chapter, index) => (
            <ChapterSection
              key={chapter.id}
              chapter={chapter}
              index={index}
              entered={entered}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              profile={profile}
            />
          ))}
          <section className="finale" aria-labelledby="finale-title">
            <div>
              <p className="finale__prelude">A travessia continua fora da tela</p>
              <h2 id="finale-title">O que você escolhe alimentar?</h2>
              <p>
                Reveja a obra em seu ritmo ou retorne ao início para atravessar
                novamente cada escolha.
              </p>
              <div className="finale__actions">
                <button
                  className="button button--primary"
                  type="button"
                  onClick={() => setFilmOpen(true)}
                >
                  Assistir ao filme
                </button>
                <button
                  className="button button--quiet"
                  type="button"
                  onClick={() => navigate(chapters[0].id)}
                >
                  Recomeçar a jornada
                </button>
              </div>
              <small>
                Texto bíblico da Nova Almeida Atualizada © 2017 Sociedade
                Bíblica do Brasil.
              </small>
            </div>
          </section>
        </main>
      </div>
      <FilmPlayer open={filmOpen} onClose={() => setFilmOpen(false)} />
    </>
  );
}

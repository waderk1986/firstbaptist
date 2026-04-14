import { useEffect, useRef, useState, type RefObject } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParticleField from './ParticleField';

const STACK_LINES: Array<{ text: string; italic?: boolean }> = [
  { text: 'First Baptist' },
  { text: 'Church', italic: true },
  { text: 'of Delta' },
];

function TypeStack({
  stackRef,
}: {
  stackRef: RefObject<HTMLDivElement | null>;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional post-hydration capability check
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = innerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    const onLeave = () => setPos(null);
    window.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const maskStyle: React.CSSProperties =
    pos && !reduced
      ? {
          WebkitMaskImage: `radial-gradient(ellipse 320px 240px at ${pos.x}px ${pos.y}px, black 0%, black 35%, transparent 75%)`,
          maskImage: `radial-gradient(ellipse 320px 240px at ${pos.x}px ${pos.y}px, black 0%, black 35%, transparent 75%)`,
          opacity: 0.92,
        }
      : { opacity: 0 };

  const lineClass = (italic?: boolean) =>
    italic
      ? 'block font-italic italic leading-[0.9] tracking-[-0.015em] select-none'
      : 'block font-display leading-[0.9] tracking-[-0.015em] select-none';

  const lineSize = (italic?: boolean) => ({
    fontSize: italic
      ? 'clamp(3.5rem, 11vw, 10rem)'
      : 'clamp(4rem, 13vw, 12rem)',
  });

  return (
    <div
      ref={stackRef}
      className="relative z-[6] w-full text-center will-change-[opacity,transform]"
      style={{ marginTop: '-2rem' }}
    >
      <motion.div
        ref={innerRef}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.1,
          delay: 0.25,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="relative mx-auto inline-block"
      >
        {/* base layer */}
        <div className="relative z-[1]">
          {STACK_LINES.map((l) => (
            <div
              key={l.text}
              className={lineClass(l.italic)}
              style={{
                ...lineSize(l.italic),
                color: l.italic
                  ? 'rgba(224, 106, 72, 0.95)'
                  : 'rgba(247, 241, 227, 0.92)',
              }}
            >
              {l.text}
            </div>
          ))}
        </div>

        {/* reveal layer — masked to cursor */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2] transition-opacity duration-300"
          style={maskStyle}
        >
          {STACK_LINES.map((l) => (
            <div
              key={l.text}
              className={lineClass(l.italic)}
              style={{
                ...lineSize(l.italic),
                color: l.italic
                  ? 'rgba(124, 143, 107, 0.98)'
                  : 'rgba(197, 74, 44, 1)',
              }}
            >
              {l.text}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<SVGTextElement>(null);
  const line2Ref = useRef<SVGTextElement>(null);
  const line3Ref = useRef<SVGTextElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (videoRef.current) {
      videoRef.current.playbackRate = 0.85;
      videoRef.current.play().catch(() => {});
    }

    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set(taglineRef.current, { opacity: 1 });
      [line1Ref.current, line2Ref.current, line3Ref.current].forEach((el) => {
        if (!el) return;
        gsap.set(el, {
          opacity: 0,
          y: 18,
          clipPath: 'inset(0 100% 0 0)',
          filter: 'blur(3px)',
        });
      });
      gsap.set(subRef.current, { opacity: 0, y: 8 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      tl.to(
        stackRef.current,
        { opacity: 0, y: -60, duration: 0.22, ease: 'power2.in' },
        0
      )
        .to(
          line1Ref.current,
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0 0% 0 0)',
            filter: 'blur(0px)',
            duration: 0.22,
            ease: 'power2.out',
          },
          0.24
        )
        .to(
          line2Ref.current,
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0 0% 0 0)',
            filter: 'blur(0px)',
            duration: 0.22,
            ease: 'power2.out',
          },
          0.42
        )
        .to(
          line3Ref.current,
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0 0% 0 0)',
            filter: 'blur(0px)',
            duration: 0.22,
            ease: 'power2.out',
          },
          0.6
        )
        .to(
          subRef.current,
          { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' },
          0.82
        );

      gsap.to(videoRef.current, {
        scale: 1.06,
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '+=130%',
          scrub: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="top" className="relative z-[1] h-screen w-full">
      <div className="bg-slate-d relative flex h-screen w-full items-center justify-center overflow-hidden">
        {/* video layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
            style={{ objectPosition: 'center 42%' }}
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
        </div>

        {/* warm tint overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              'linear-gradient(to bottom, rgba(18,20,24,0.78) 0%, rgba(42,46,53,0.62) 35%, rgba(26,29,34,0.68) 65%, rgba(10,12,16,0.88) 100%)',
          }}
        />

        {/* particle field */}
        <div className="absolute inset-0 z-[2]">
          <ParticleField />
        </div>

        {/* grain */}
        <div
          aria-hidden="true"
          className="grain pointer-events-none absolute -inset-[50%] z-[3] opacity-[0.12] mix-blend-soft-light"
        />

        {/* vignette */}
        <div
          className="absolute inset-0 z-[4]"
          style={{
            background:
              'radial-gradient(ellipse 75% 70% at 50% 48%, transparent 15%, rgba(10,8,5,0.45) 100%)',
          }}
        />

        {/* subtle warm light bloom */}
        <div
          className="absolute top-[5%] left-1/2 z-[5] h-[80vh] w-[80vw] -translate-x-1/2"
          style={{
            background:
              'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(197,74,44,0.10) 0%, rgba(197,74,44,0.03) 40%, transparent 65%)',
          }}
        />

        {/* TYPE STACK — cursor-reveal over base layer */}
        <TypeStack stackRef={stackRef} />

        {/* HANDWRITING — drawn on as you scroll */}
        <div
          ref={taglineRef}
          className="absolute inset-0 z-[7] flex flex-col items-center justify-center"
          aria-label="Come As You Are"
        >
          <svg
            viewBox="0 0 720 420"
            className="w-[clamp(320px,60vw,680px)] overflow-visible"
            aria-hidden="true"
          >
            <text
              ref={line1Ref}
              x="360"
              y="120"
              textAnchor="middle"
              style={{
                fontFamily: 'var(--font-italic)',
                fontStyle: 'italic',
                fontSize: '120px',
                fill: 'rgba(247, 241, 227, 0.94)',
              }}
            >
              Come
            </text>
            <text
              ref={line2Ref}
              x="360"
              y="250"
              textAnchor="middle"
              style={{
                fontFamily: 'var(--font-italic)',
                fontStyle: 'italic',
                fontSize: '120px',
                fill: 'rgba(224, 106, 72, 0.96)',
              }}
            >
              As You
            </text>
            <text
              ref={line3Ref}
              x="360"
              y="380"
              textAnchor="middle"
              style={{
                fontFamily: 'var(--font-italic)',
                fontStyle: 'italic',
                fontSize: '120px',
                fill: 'rgba(247, 241, 227, 0.94)',
              }}
            >
              Are
            </text>
          </svg>
          <div
            ref={subRef}
            className="mt-7 text-[0.68rem] font-medium uppercase"
            style={{
              letterSpacing: '0.25em',
              color: 'rgba(197, 74, 44, 0.75)',
            }}
          >
            Delta, Colorado · Sundays at 9:45 AM
          </div>
        </div>

        {/* scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.7 }}
          className="pointer-events-none absolute bottom-9 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <div
            className="relative h-10 w-px overflow-hidden"
            style={{ background: 'rgba(247,241,227,0.1)' }}
          >
            <motion.div
              className="absolute top-0 left-0 w-full"
              style={{ background: 'var(--color-rust)', height: '40%' }}
              animate={{ top: ['-40%', '100%'] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
          <span
            className="text-[0.55rem] font-semibold uppercase"
            style={{ letterSpacing: '0.22em', color: 'rgba(247,241,227,0.28)' }}
          >
            Scroll
          </span>
          <ChevronDown
            aria-hidden="true"
            className="size-3"
            style={{ color: 'rgba(247,241,227,0.28)' }}
          />
        </motion.div>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Person = {
  name: string;
  role: string;
  contact: React.ReactNode;
  photo?: string;
  vLabel: string;
};

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('');

const PEOPLE: Person[] = [
  {
    name: 'James Conley',
    role: 'Senior Pastor',
    contact: (
      <>
        Sat–Thu · <a href="mailto:deltafbc.james@skybeam.com">Email</a>
      </>
    ),
    photo: '/images/james-conley.png',
    vLabel: 'James Conley',
  },
  {
    name: 'Thaddeus Conley',
    role: 'Youth Pastor',
    contact: '(970) 712-4903',
    vLabel: 'Thaddeus Conley',
  },
  {
    name: 'Vicki Conley',
    role: 'Secretary',
    contact: (
      <>
        Tue–Thu 8:30–2 · <a href="mailto:deltafbc@yahoo.com">Email</a>
      </>
    ),
    vLabel: 'Vicki Conley',
  },
  {
    name: 'Cheryl Grange',
    role: 'Treasurer',
    contact: (
      <>
        Tuesdays · <a href="mailto:deltafbc.treasurer@skybeam.com">Email</a>
      </>
    ),
    vLabel: 'Cheryl Grange',
  },
  {
    name: 'Melvin Randall',
    role: 'Grounds Keeper',
    contact: '(719) 407-9520',
    vLabel: 'Melvin Randall',
  },
  {
    name: 'Gail Gibson',
    role: 'Janitor',
    contact: '(970) 874-3847',
    vLabel: 'Gail Gibson',
  },
];

function MonogramPortrait({ name, index }: { name: string; index: number }) {
  const palettes: Array<{ bg: string; ink: string }> = [
    {
      bg: 'linear-gradient(155deg, #3a3e45 0%, #1e2127 60%, #15171b 100%)',
      ink: 'rgba(247,241,227,0.14)',
    },
    {
      bg: 'linear-gradient(155deg, #4a3e35 0%, #2a211a 60%, #1a140f 100%)',
      ink: 'rgba(224,106,72,0.16)',
    },
    {
      bg: 'linear-gradient(155deg, #3d4437 0%, #23281f 60%, #171b14 100%)',
      ink: 'rgba(124,143,107,0.18)',
    },
    {
      bg: 'linear-gradient(155deg, #33363d 0%, #1c1e24 60%, #121418 100%)',
      ink: 'rgba(247,241,227,0.12)',
    },
    {
      bg: 'linear-gradient(155deg, #423732 0%, #261e1a 60%, #18120f 100%)',
      ink: 'rgba(224,106,72,0.14)',
    },
  ];
  const p = palettes[index % palettes.length];
  return (
    <div
      className="relative h-full w-full"
      style={{ background: p.bg }}
      aria-hidden="true"
    >
      <span
        className="font-display absolute inset-0 grid place-items-center leading-none select-none"
        style={{
          fontSize: 'clamp(5rem, 12vw, 8rem)',
          color: p.ink,
          letterSpacing: '-0.04em',
        }}
      >
        {initials(name)}
      </span>
      <div className="grain absolute inset-0 opacity-[0.08] mix-blend-soft-light" />
    </div>
  );
}

function PersonCard({ p, index }: { p: Person; index: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.7, delay: index * 0.05 }}
      className="group border-ink/10 border-r border-b"
    >
      <div className="bg-slate/20 relative aspect-[3/4] overflow-hidden">
        {p.photo ? (
          <img
            src={p.photo}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.02]"
            style={{
              objectPosition: 'center 25%',
              filter:
                'grayscale(0.35) contrast(0.98) brightness(1.02) sepia(0.08)',
            }}
          />
        ) : (
          <div className="h-full w-full transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]">
            <MonogramPortrait name={p.name} index={index} />
          </div>
        )}

        {/* static diagonal gloss */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(125deg, rgba(247,241,227,0.14) 0%, rgba(247,241,227,0.04) 28%, transparent 48%, transparent 72%, rgba(247,241,227,0.05) 100%)',
            mixBlendMode: 'screen',
          }}
        />

        {/* sweeping sheen on hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-[60%] w-[55%] -skew-x-12 opacity-0 transition-[transform,opacity] duration-[900ms] ease-out group-hover:left-[105%] group-hover:opacity-100"
          style={{
            background:
              'linear-gradient(110deg, transparent 0%, rgba(247,241,227,0.18) 45%, rgba(247,241,227,0.32) 50%, rgba(247,241,227,0.18) 55%, transparent 100%)',
            mixBlendMode: 'screen',
          }}
        />

        {/* bottom gradient for legibility */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(10,10,10,0.42) 0%, rgba(10,10,10,0) 45%)',
          }}
        />

        <span
          className="font-display pointer-events-none absolute right-4 bottom-4 leading-none tracking-wide"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
            color: 'rgba(247, 241, 227, 0.92)',
            textShadow: '0 1px 6px rgba(0,0,0,0.55)',
          }}
        >
          {p.vLabel}
        </span>
      </div>

      <div className="flex flex-col gap-1 px-5 py-4">
        <p className="text-rust text-[0.6rem] font-bold tracking-[0.14em] uppercase">
          {p.role}
        </p>
        <p className="text-ink-soft [&_a]:text-sage-d hover:[&_a]:text-rust-d text-[0.8rem] [&_a]:font-semibold [&_a]:transition-colors">
          {p.contact}
        </p>
      </div>
    </motion.article>
  );
}

function CursorRevealHeadline() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    const onLeave = () => setPos(null);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [reduced]);

  const maskStyle =
    pos && !reduced
      ? ({
          WebkitMaskImage: `radial-gradient(circle 220px at ${pos.x}px ${pos.y}px, black 30%, transparent 75%)`,
          maskImage: `radial-gradient(circle 220px at ${pos.x}px ${pos.y}px, black 30%, transparent 75%)`,
        } as React.CSSProperties)
      : {};

  return (
    <div ref={ref} className="relative">
      <h2
        className="font-display text-ink"
        style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.1 }}
      >
        Our People
      </h2>
      <h2
        aria-hidden="true"
        className="font-display pointer-events-none absolute inset-0"
        style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          lineHeight: 1.1,
          color: 'var(--color-rust)',
          ...maskStyle,
        }}
      >
        Our People
      </h2>
    </div>
  );
}

export default function People() {
  return (
    <section
      id="people"
      className="bg-bg side relative z-10"
      style={{
        paddingTop: 'clamp(4rem, 8vw, 7rem)',
        paddingBottom: 'clamp(4rem, 8vw, 7rem)',
      }}
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-10">
          <CursorRevealHeadline />
        </div>

        <div className="border-ink/10 grid grid-cols-1 border-t border-l sm:grid-cols-2 lg:grid-cols-3">
          {PEOPLE.map((p, i) => (
            <PersonCard key={p.name} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

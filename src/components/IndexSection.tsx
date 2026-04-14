import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

type Row = {
  num: string;
  title: string;
  desc: string;
  tag: string;
  href: string;
};

const LEFT: Row[] = [
  {
    num: '01',
    title: 'AWANA',
    desc: 'Bible-centered fun for kids ages 2–12',
    tag: 'Kids',
    href: '#',
  },
  {
    num: '02',
    title: 'Youth Ministry',
    desc: 'Camping, games, Bible study & real friendships',
    tag: 'Youth',
    href: '#',
  },
  {
    num: '03',
    title: "Women's Bible Study",
    desc: 'Deep dives into Scripture together',
    tag: 'Women',
    href: '#',
  },
  {
    num: '04',
    title: "Men's Ministries",
    desc: 'Fellowship, service, and discipleship',
    tag: 'Men',
    href: '#',
  },
  {
    num: '05',
    title: 'Senior Adults',
    desc: 'Outings, lunches, and staying connected',
    tag: 'Seniors',
    href: '#',
  },
  {
    num: '06',
    title: 'Young Singles & Marrieds',
    desc: 'Community and spiritual growth',
    tag: 'Young Adults',
    href: '#',
  },
  {
    num: '07',
    title: 'Karen Baptist Fellowship',
    desc: 'Worship for our Burmese families',
    tag: 'Fellowship',
    href: '#',
  },
  {
    num: '08',
    title: 'Karate Class',
    desc: 'Discipline, fitness, and fellowship',
    tag: 'Fitness',
    href: '#',
  },
];

const RIGHT: Row[] = [
  {
    num: '01',
    title: 'Vacation Bible School',
    desc: 'Stories, crafts, and faith for kids',
    tag: 'Summer',
    href: '#',
  },
  {
    num: '02',
    title: 'Sunday Worship',
    desc: 'Where we gather each week as one body',
    tag: 'Weekly',
    href: '#',
  },
  {
    num: '03',
    title: 'Youth Camping',
    desc: 'Adventures in the Colorado backcountry',
    tag: 'Youth',
    href: '#',
  },
  {
    num: '04',
    title: 'Baptisms',
    desc: 'Celebrating new life in Christ',
    tag: 'Worship',
    href: '#',
  },
  {
    num: '05',
    title: 'Fellowship Dinners',
    desc: 'Good food and better company',
    tag: 'Community',
    href: '#',
  },
  {
    num: '06',
    title: 'AWANA Nights',
    desc: 'Games, verses, and family fun',
    tag: 'Kids',
    href: '#',
  },
  {
    num: '07',
    title: 'Senior Mini Golf',
    desc: 'Staying active and connected',
    tag: 'Seniors',
    href: '#',
  },
  {
    num: '08',
    title: 'Gal Pals',
    desc: "Women's fellowship and encouragement",
    tag: 'Women',
    href: '#',
  },
];

function Rows({ rows, startDelay }: { rows: Row[]; startDelay: number }) {
  const reduced = useReducedMotion();
  return (
    <div className="flex flex-col gap-[6px]">
      {rows.map((r, i) => (
        <motion.a
          key={r.num}
          href={r.href}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-5% 0px' }}
          transition={{ duration: 0.5, delay: startDelay + i * 0.04 }}
          whileHover={reduced ? undefined : { y: -2 }}
          whileTap={{ scale: 0.99 }}
          className="group relative grid grid-cols-[36px_1fr_auto] items-center gap-4 rounded-[12px] px-5 py-4 text-[inherit] no-underline"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.06) 100%)',
            backdropFilter: 'blur(16px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
            border: '1.5px solid rgba(255,255,255,0.09)',
            borderTopColor: 'rgba(255,255,255,0.15)',
            borderBottomColor: 'rgba(255,255,255,0.03)',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.28), 0 1px 2px rgba(0,0,0,0.22)',
          }}
        >
          {/* top shine */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[12px]"
            style={{
              background:
                'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.20) 50%, rgba(255,255,255,0.12) 70%, transparent 90%)',
            }}
          />
          <span
            className="font-display text-[0.82rem]"
            style={{ color: 'rgba(247,241,227,0.28)' }}
          >
            {r.num}
          </span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span
              className="font-display truncate text-[1rem]"
              style={{ color: 'rgba(247,241,227,0.9)' }}
            >
              {r.title}
            </span>
            <span
              className="hidden truncate text-[0.76rem] leading-tight sm:block"
              style={{ color: 'rgba(247,241,227,0.4)' }}
            >
              {r.desc}
            </span>
          </span>
          <span className="flex items-center gap-1.5 pl-2">
            <span
              className="text-[0.58rem] font-bold tracking-[0.12em] whitespace-nowrap uppercase"
              style={{ color: 'rgba(224,106,72,0.75)' }}
            >
              {r.tag}
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: 'rgba(224,106,72,0.75)' }}
            />
          </span>
        </motion.a>
      ))}
    </div>
  );
}

export default function IndexSection() {
  return (
    <>
      <div className="relative z-[2] mx-auto grid max-w-[1280px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
        <div>
          <div className="mb-6">
            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                color: 'rgba(247,241,227,0.9)',
              }}
            >
              Ministries
            </h2>
          </div>
          <Rows rows={LEFT} startDelay={0} />
        </div>
        <div>
          <div className="mb-6">
            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                color: 'rgba(247,241,227,0.9)',
              }}
            >
              Life at FBC
            </h2>
          </div>
          <Rows rows={RIGHT} startDelay={0.08} />
        </div>
      </div>
    </>
  );
}

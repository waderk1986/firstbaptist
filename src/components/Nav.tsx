import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Mountain } from 'lucide-react';
import { cn } from '@/lib/cn';

const LINKS = [
  { label: 'Gather', href: '#gather' },
  { label: 'Ministries', href: '#ministries' },
  { label: 'People', href: '#people' },
  { label: 'Connect', href: '#connect' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          'side fixed inset-x-0 top-0 z-[800] flex h-16 items-center justify-between transition-[background,box-shadow] duration-400',
          scrolled
            ? 'bg-[rgba(237,228,211,0.92)] shadow-[0_1px_0_rgba(18,20,24,0.06)] backdrop-blur-xl'
            : 'bg-transparent'
        )}
      >
        <a href="#top" className="flex items-center gap-2.5">
          <span
            className={cn(
              'grid size-8 place-items-center rounded-[8px] transition-colors',
              scrolled
                ? 'bg-slate text-rust-l'
                : 'text-rust-l bg-[rgba(197,74,44,0.18)]'
            )}
          >
            <Mountain className="size-4" strokeWidth={2} />
          </span>
          <span
            className={cn(
              'font-display text-[1.05rem] tracking-tight transition-colors',
              scrolled ? 'text-ink' : 'text-bone/90'
            )}
          >
            FBC <span className="text-rust-l">Delta</span>
          </span>
        </a>

        <nav className="hidden items-center gap-0.5 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={cn(
                'rounded px-3 py-1.5 text-[0.78rem] font-medium tracking-wide transition-colors',
                scrolled
                  ? 'text-ink-soft hover:bg-ink/5 hover:text-ink'
                  : 'text-bone/55 hover:bg-bone/8 hover:text-bone'
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <motion.a
            href="#contact"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            className="bg-rust text-bone hover:bg-rust-d hidden rounded-full px-4 py-1.5 text-[0.78rem] font-semibold tracking-wide shadow-[0_1px_0_rgba(0,0,0,0.1)] md:inline-block"
          >
            Visit Us
          </motion.a>
          <button
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className={cn(
              'grid size-9 place-items-center rounded transition-colors md:hidden',
              scrolled ? 'text-ink' : 'text-bone'
            )}
          >
            <Menu className="size-5" strokeWidth={1.75} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="bg-bone/97 fixed inset-0 z-[900] flex flex-col backdrop-blur-xl"
          >
            <div className="side flex h-16 items-center justify-between">
              <span className="font-display text-ink text-[1.05rem]">
                FBC <span className="text-rust">Delta</span>
              </span>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="text-ink grid size-9 place-items-center rounded"
              >
                <X className="size-5" strokeWidth={1.75} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col items-center justify-center gap-6">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.4 }}
                  className="font-display text-ink hover:text-rust text-4xl transition-colors"
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.08 + LINKS.length * 0.06,
                  duration: 0.4,
                }}
                className="bg-rust text-bone hover:bg-rust-d mt-4 rounded-full px-6 py-2.5 text-sm font-semibold"
              >
                Visit Us
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

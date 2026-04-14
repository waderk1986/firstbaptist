import { motion, useReducedMotion } from 'framer-motion';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface Props extends Omit<ComponentPropsWithoutRef<'a'>, 'ref'> {
  variant?: 'solid' | 'ghost';
  children: ReactNode;
}

export default function Button({
  variant = 'solid',
  className,
  children,
  ...rest
}: Props) {
  const reduced = useReducedMotion();
  return (
    <motion.a
      {...(rest as object)}
      whileHover={reduced ? undefined : { y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      className={cn(
        'inline-flex items-center justify-center rounded-full px-7 py-3 text-[0.82rem] font-semibold tracking-wide transition-colors',
        variant === 'solid'
          ? 'bg-bone text-slate-d hover:bg-white'
          : 'border-bone/20 text-bone/70 hover:border-bone/45 hover:bg-bone/5 hover:text-bone border-[1.5px] bg-transparent',
        className
      )}
    >
      {children}
    </motion.a>
  );
}

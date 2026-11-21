import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: RevealDirection;
  once?: boolean;
  /** Optional custom cubic-bezier tuple. Defaults to editorial ease [0.76, 0, 0.24, 1] */
  ease?: readonly [number, number, number, number];
}

const DEFAULT_EASE: readonly [number, number, number, number] = [0.76, 0, 0.24, 1];

export const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.7,
  distance = 24,
  direction = 'up',
  once = true,
  ease = DEFAULT_EASE,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const initialOffset = {
    x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
    y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...initialOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{
        duration,
        delay,
        ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideIn = (direction) => ({
  initial: { [direction]: 100, opacity: 0 },
  animate: { [direction]: 0, opacity: 1 },
  exit: { [direction]: 100, opacity: 0 },
});

export const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
};

export const bounce = {
  initial: { y: -20 },
  animate: { y: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 10 },
};

export const staggerChildren = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export const letterAnimation = {
  initial: { opacity: 0, y: 50 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', damping: 12, stiffness: 200 },
  },
};

export const infiniteBounce = {
  animate: {
    y: ['0%', '-20%'],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};
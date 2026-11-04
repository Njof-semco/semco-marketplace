import { easeInOut } from "framer-motion";

// Views slide in from the right and out to the left. Spread onto a motion.div
// inside <AnimatePresence mode="wait">, keyed by the active view.
export const slideTransition = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
  transition: { duration: 0.4, ease: easeInOut },
};

export const slideTransitionBack = {
  initial: { x: "-100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "100%", opacity: 0 },
  transition: { duration: 0.4, ease: easeInOut },
};

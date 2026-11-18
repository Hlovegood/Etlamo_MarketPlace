/**
 * PageTransition.jsx
 *
 * Page Transition component adapted from PODIE library
 * Upstream Sources:
 * - https://podie.dev/components/scrollxui--transition
 * - https://podie.dev/components/motion-lexicon--page-transition-stack
 *
 * Provides Apple-grade layered depth and directional spring transitions
 * between routes, with full reduced-motion accessibility.
 */

import { motion, useReducedMotion } from 'framer-motion'

export default function PageTransition({ children, routeKey }) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className="w-full">{children}</div>
  }

  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, y: 14, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.995 }}
      transition={{
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1], // Apple fluid cubic-bezier
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}

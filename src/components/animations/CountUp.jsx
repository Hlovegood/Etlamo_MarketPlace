import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { useI18n } from '../../lib/i18n'

/**
 * CountUp Component
 *
 * Smooth count-up animation triggered when scrolling into view.
 * Uses easeOutExpo easing for organic deceleration, supports custom prefixes/suffixes,
 * adapts formatting to the active locale (EN/AR), and respects prefers-reduced-motion.
 */
export function CountUp({
  to = 0,
  from = 0,
  duration = 2.0,
  prefix = '',
  suffix = '',
  decimals = 0,
  format = true,
  className = '',
}) {
  const [count, setCount] = useState(from)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const { lang } = useI18n()

  useEffect(() => {
    if (!isInView) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setCount(to)
      return
    }

    let startTime = null
    let animationFrameId

    // Apple-style exponential deceleration curve
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = (timestamp - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutExpo(progress)

      const current = from + (to - from) * easedProgress
      setCount(current)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step)
      } else {
        setCount(to)
      }
    }

    animationFrameId = requestAnimationFrame(step)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [isInView, from, to, duration])

  const formattedNumber = (() => {
    const rounded = decimals > 0 ? Number(count.toFixed(decimals)) : Math.round(count)
    if (!format) return rounded

    try {
      const locale = lang === 'ar' ? 'ar-EG' : 'en-US'
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: true,
      }).format(rounded)
    } catch {
      return rounded.toLocaleString()
    }
  })()

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  )
}

export default CountUp

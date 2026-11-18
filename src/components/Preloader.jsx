import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { MorphingInfinity } from './loading-ui/morphing-infinity'
import { useI18n } from '../lib/i18n'
import { cx } from '../lib/format'

/**
 * Global Website Preloader featuring the PODIE Morphing Infinity component.
 * Upstream component author: Bartosz Zagrodzki (MIT License, see licenses/loading-ui/morphing-infinity.txt)
 * Adapter & Experience Design: Etlamo Planners Marketplace
 */
export function Preloader({
  minDisplayTime = 1200,
  autoDismiss = true,
} = {}) {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const { t, isRtl } = useI18n()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    // Listen for custom trigger to replay preloader
    const onReplay = () => {
      setProgress(0)
      setVisible(true)
    }
    window.addEventListener('etlamo:replay-preloader', onReplay)
    return () => window.removeEventListener('etlamo:replay-preloader', onReplay)
  }, [])

  useEffect(() => {
    // Absolute failsafe maximum: dismiss after 2000ms under any scenario
    const safetyTimer = setTimeout(() => {
      setVisible(false)
    }, 2000)
    return () => clearTimeout(safetyTimer)
  }, [])

  useEffect(() => {
    if (!visible) return

    // Progress tick
    const start = performance.now()
    const timer = setInterval(() => {
      const elapsed = performance.now() - start
      const nextProgress = Math.min(100, Math.round((elapsed / minDisplayTime) * 100))
      setProgress(nextProgress)

      if (elapsed >= minDisplayTime && autoDismiss) {
        clearInterval(timer)
        setTimeout(() => setVisible(false), 200)
      }
    }, 25)

    return () => clearInterval(timer)
  }, [visible, minDisplayTime, autoDismiss])

  // Dismiss instantly on interaction (interruptibility - Apple design principle)
  const handleDismiss = () => {
    setVisible(false)
  }

  // Escape, Enter or Space keys dismiss instantly
  useEffect(() => {
    if (!visible) return
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        setVisible(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible])

  // Manage body scroll while preloader is active, release immediately when dismissed
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

  const getStatusText = () => {
    if (progress < 40) {
      return isRtl ? 'جاري تجهيز أرقى الفعاليات…' : 'Curating standout celebrations…'
    }
    if (progress < 85) {
      return isRtl ? 'تحميل معارض الأعمال المعتمدة…' : 'Connecting verified portfolios…'
    }
    return isRtl ? 'أهلاً بك في إتلامو' : 'Welcome to Etlamo'
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="etlamo-preloader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={
            shouldReduceMotion
              ? { opacity: 0, transition: { duration: 0.25 } }
              : {
                  opacity: 0,
                  scale: 1.02,
                  filter: 'blur(8px)',
                  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                }
          }
          onClick={handleDismiss}
          role="dialog"
          aria-modal="true"
          aria-label={t('brand_name', 'Etlamo') + ' Loading'}
          className={cx(
            'fixed inset-0 z-[120] flex cursor-pointer flex-col items-center justify-center select-none',
            'bg-surface/96 dark:bg-[#0c0d0f]/98 backdrop-blur-2xl transition-colors duration-300',
            !visible && 'pointer-events-none',
          )}
        >
          {/* Ambient background glow */}
          <div
            className="pointer-events-none absolute h-72 w-72 rounded-full bg-amber/15 dark:bg-amber/10 blur-[90px] transition-opacity duration-700"
            style={{ transform: 'translate3d(0, 0, 0)' }}
          />

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 flex flex-col items-center px-6 text-center"
          >
            {/* Morphing Infinity Component from PODIE */}
            <div className="relative mb-6 flex items-center justify-center">
              <MorphingInfinity
                className="size-20 sm:size-24 text-amber dark:text-[#f5c518] drop-shadow-sm transition-transform duration-300"
              />
            </div>

            {/* Brand Title */}
            <h1 className="text-[28px] sm:text-[34px] font-semibold tracking-[-0.03em] text-ink">
              {t('brand_name', 'Etlamo')}
            </h1>

            {/* Brand Subtitle / Tagline */}
            <p className="mt-1.5 max-w-xs text-[13px] sm:text-[14px] text-graphite font-normal leading-snug">
              {t('brand_tagline', 'Verified luxury wedding & celebration planners')}
            </p>

            {/* Elegant Progress Track */}
            <div className="mt-7 w-48 sm:w-56 overflow-hidden rounded-full bg-mist dark:bg-card-border/60 p-0.5 shadow-inner">
              <motion.div
                className="h-1 rounded-full bg-gradient-to-r from-amber to-amber-deep dark:from-[#f5c518] dark:to-amber shadow-sm"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear', duration: 0.1 }}
              />
            </div>

            {/* Dynamic Status Text */}
            <p className="mt-3 text-[12px] text-silver font-medium tracking-wide">
              {getStatusText()}
            </p>

            {/* Skip / Enter hint */}
            <button
              type="button"
              onClick={handleDismiss}
              className="mt-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium text-graphite hover:text-ink transition hover:bg-mist dark:hover:bg-card-border/40"
            >
              <span>{isRtl ? 'انقر للدخول مباشرة' : 'Click anywhere to enter'}</span>
              <span className="text-silver opacity-80">· Esc</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

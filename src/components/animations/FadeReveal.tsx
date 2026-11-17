import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'

interface FadeRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
  x?: number
  blur?: number
  scale?: number
}

export function FadeReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.7,
  y = 24,
  x = 0,
  blur = 6,
  scale = 0.98,
}: FadeRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let animated = false
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            animated = true
            gsap.fromTo(
              el,
              {
                opacity: 0,
                y,
                x,
                scale,
                filter: `blur(${blur}px)`,
              },
              {
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1,
                filter: 'blur(0px)',
                duration,
                delay,
                ease: 'power3.out',
              },
            )
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [delay, duration, y, x, blur, scale])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

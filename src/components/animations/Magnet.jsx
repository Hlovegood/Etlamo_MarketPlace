import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function Magnet({ children, className = '', strength = 0.25, disabled = false }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || disabled) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const onMouseMove = (e) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY)
      const threshold = Math.max(rect.width, rect.height) * 1.5

      if (dist < threshold) {
        const dx = (e.clientX - centerX) * strength
        const dy = (e.clientY - centerY) * strength
        gsap.to(el, { x: dx, y: dy, duration: 0.35, ease: 'power2.out' })
      } else {
        gsap.to(el, { x: 0, y: 0, duration: 0.45, ease: 'elastic.out(1, 0.4)' })
      }
    }

    const onMouseLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
    }

    window.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseleave', onMouseLeave)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [strength, disabled])

  return (
    <div ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  )
}

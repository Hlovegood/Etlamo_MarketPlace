import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface SplitTextProps {
  text: string
  className?: string
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  delay?: number
  duration?: number
  stagger?: number
  by?: 'words' | 'chars'
}

export function SplitText({
  text,
  className = '',
  tag: Tag = 'span',
  delay = 0,
  duration = 0.8,
  stagger = 0.05,
  by = 'words',
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const targets = containerRef.current.querySelectorAll('.split-char')
    if (!targets.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        {
          y: 35,
          opacity: 0,
          rotateX: -20,
          filter: 'blur(4px)',
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          filter: 'blur(0px)',
          duration,
          stagger,
          delay,
          ease: 'power3.out',
        },
      )
    }, containerRef)

    return () => ctx.revert()
  }, [text, delay, duration, stagger, by])

  const tokens = by === 'words' ? text.split(' ') : text.split('')

  return (
    <Tag ref={containerRef as any} className={`inline-block ${className}`} style={{ perspective: '1000px' }}>
      {tokens.map((token, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1">
          <span className="split-char inline-block will-change-transform">
            {token}
            {by === 'words' && i < tokens.length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </Tag>
  )
}

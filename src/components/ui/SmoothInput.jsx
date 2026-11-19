/**
 * SmoothInput.jsx
 *
 * Smooth Text Input with spring-animated caret.
 * Based on Skiper UI skiper106 (Smooth Input).
 *
 * Features:
 * - Fluid spring-animated cursor tracking (Framer Motion useSpring)
 * - Exact text-prefix metric measuring via off-screen element
 * - Full support for both LTR and RTL (Arabic) typing
 * - Automatic horizontal scrolling tracking
 * - Fades caret on blur or multi-character selection
 * - Custom azure luminous caret matching Etlamo's design system
 * - Supports icons, clear button, error states, and standard HTML input props
 * - Reduced-motion accessibility fallback
 */

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { cn } from '../../lib/utils'

const PASSWORD_CHAR =
  typeof navigator !== 'undefined' && navigator.userAgent.match(/firefox|fxios/i)
    ? '\u25CF'
    : '\u2022'

export const SmoothInput = forwardRef(function SmoothInput(
  {
    type = 'text',
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    placeholder,
    className,
    wrapperClassName,
    style,
    icon,
    rightIcon,
    springConfig,
    ...props
  },
  forwardedRef,
) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const [isFocused, setIsFocused] = useState(false)

  const caretX = useMotionValue(0)
  const caretOpacity = useMotionValue(0)

  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const measureRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  useImperativeHandle(forwardedRef, () => inputRef.current)

  const isControlled = value !== undefined
  const inputValue = isControlled ? String(value ?? '') : internalValue

  const spring = useSpring(
    caretX,
    prefersReducedMotion
      ? { stiffness: 10000, damping: 100, mass: 0.1 }
      : springConfig ?? { stiffness: 500, damping: 32, mass: 0.45 },
  )

  // Synchronize measuring span font properties to match the input
  const syncMeasureSpan = () => {
    const input = inputRef.current
    const measureSpan = measureRef.current
    if (!input || !measureSpan) return

    const styles = window.getComputedStyle(input)
    const isPassword = input.type === 'password'

    let fontSize = styles.fontSize
    if (
      PASSWORD_CHAR === '\u2022' &&
      isPassword &&
      typeof navigator !== 'undefined' &&
      !navigator.userAgent.match(/chrome|chromium|crios/i)
    ) {
      fontSize = `${parseFloat(fontSize) + 6.25}px`
    }

    measureSpan.style.font = `${styles.fontStyle} ${styles.fontWeight} ${fontSize} ${styles.fontFamily}`
    measureSpan.style.letterSpacing = styles.letterSpacing
    measureSpan.style.fontFeatureSettings = styles.fontFeatureSettings
    measureSpan.style.fontVariationSettings = styles.fontVariationSettings
  }

  // Measure pixel width of text up to the caret
  const measurePrefixWidth = (text) => {
    const input = inputRef.current
    const measureSpan = measureRef.current
    if (!input || !measureSpan) return 0

    syncMeasureSpan()
    measureSpan.textContent = text
    return measureSpan.offsetWidth
  }

  // Ensure caret remains visible inside horizontally scrolled input
  const scrollCaretIntoView = (target, caretXPos, isRtl) => {
    const styles = window.getComputedStyle(target)
    const paddingLeft = parseFloat(styles.paddingLeft) || 0
    const paddingRight = parseFloat(styles.paddingRight) || 0
    const maxScroll = Math.max(0, target.scrollWidth - target.clientWidth)

    if (isRtl) return

    const visibleRight = target.scrollLeft + target.clientWidth - paddingRight
    const visibleLeft = target.scrollLeft + paddingLeft

    if (caretXPos > visibleRight) {
      target.scrollLeft = Math.min(caretXPos - target.clientWidth + paddingRight, maxScroll)
    } else if (caretXPos < visibleLeft) {
      target.scrollLeft = Math.max(0, caretXPos - paddingLeft)
    }
  }

  const getCaretIndex = (target) => {
    const selectionStart = target.selectionStart ?? 0
    const selectionEnd = target.selectionEnd ?? 0
    if (selectionStart === selectionEnd) return selectionStart
    return target.selectionDirection === 'backward' ? selectionStart : selectionEnd
  }

  const updateCaretFromInput = (target) => {
    if (!target) return
    const selectionStart = target.selectionStart ?? 0
    const selectionEnd = target.selectionEnd ?? 0
    const hasSelection = selectionStart !== selectionEnd
    const caretIndex = getCaretIndex(target)
    const isPassword = target.type === 'password'
    const textBeforeCaret = isPassword
      ? PASSWORD_CHAR.repeat(caretIndex)
      : target.value.slice(0, caretIndex)

    const prefixWidth = measurePrefixWidth(textBeforeCaret)

    const styles = window.getComputedStyle(target)
    const isRtl = styles.direction === 'rtl'
    const paddingLeft = parseFloat(styles.paddingLeft) || 0
    const paddingRight = parseFloat(styles.paddingRight) || 0

    let caretPosition = 0
    let minX = 0
    let maxX = target.clientWidth

    if (isRtl) {
      caretPosition = target.clientWidth - paddingRight - prefixWidth + target.scrollLeft
      minX = paddingLeft
      maxX = target.clientWidth - paddingRight + 1
    } else {
      caretPosition = paddingLeft + prefixWidth - target.scrollLeft
      minX = paddingLeft - 1
      maxX = target.clientWidth - paddingRight
      scrollCaretIntoView(target, paddingLeft + prefixWidth, isRtl)
    }

    const boundedX = Math.min(Math.max(caretPosition, minX), maxX)
    caretX.set(boundedX)

    if (hasSelection || document.activeElement !== target) {
      caretOpacity.set(0)
    } else {
      caretOpacity.set(1)
    }
  }

  const updateCaretRef = useRef(updateCaretFromInput)
  updateCaretRef.current = updateCaretFromInput

  useEffect(() => {
    const input = inputRef.current
    if (input && document.activeElement === input) {
      updateCaretRef.current(input)
    }
  }, [inputValue, type])

  useEffect(() => {
    const input = inputRef.current
    const container = containerRef.current
    if (!input || !container) return

    const updateCaretIfFocused = () => {
      if (document.activeElement === input) {
        updateCaretRef.current(input)
      }
    }

    const handleSelectionChange = () => {
      if (document.activeElement === input) {
        requestAnimationFrame(() => updateCaretIfFocused())
      }
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    if (document.fonts) {
      document.fonts.addEventListener('loadingdone', updateCaretIfFocused)
      document.fonts.ready.then(updateCaretIfFocused)
    }
    input.addEventListener('scroll', updateCaretIfFocused)

    const resizeObserver = new ResizeObserver(updateCaretIfFocused)
    resizeObserver.observe(container)

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
      if (document.fonts) {
        document.fonts.removeEventListener('loadingdone', updateCaretIfFocused)
      }
      input.removeEventListener('scroll', updateCaretIfFocused)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn('relative flex w-full items-center', wrapperClassName)}
    >
      {icon && (
        <span className="pointer-events-none absolute left-3.5 rtl:left-auto rtl:right-3.5 z-10 flex items-center text-silver">
          {icon}
        </span>
      )}

      <input
        {...props}
        ref={inputRef}
        type={type}
        value={inputValue}
        placeholder={placeholder}
        style={{
          caretColor: 'transparent',
          ...style,
        }}
        className={cn(
          'field text-ink placeholder:text-silver transition-all',
          icon && 'pl-10 rtl:pl-3 rtl:pr-10',
          rightIcon && 'pr-10 rtl:pr-3 rtl:pl-10',
          className,
        )}
        onChange={(e) => {
          if (!isControlled) setInternalValue(e.target.value)
          onChange?.(e)
          requestAnimationFrame(() => {
            updateCaretRef.current(e.target)
          })
        }}
        onFocus={(e) => {
          setIsFocused(true)
          onFocus?.(e)
          requestAnimationFrame(() => {
            updateCaretRef.current(e.target)
          })
        }}
        onBlur={(e) => {
          setIsFocused(false)
          caretOpacity.set(0)
          onBlur?.(e)
        }}
      />

      {/* Hidden text measuring span */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute top-0 left-0 whitespace-pre"
      />

      {/* Skiper UI smooth animated spring caret */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-[2px] rounded-full bg-azure dark:bg-azure shadow-[0_0_8px_rgba(56,189,248,0.55)]"
        style={{
          left: 0,
          x: spring,
          opacity: isFocused ? caretOpacity : 0,
          height: '1.25em',
        }}
      />

      {rightIcon && (
        <span className="absolute right-3 rtl:right-auto rtl:left-3 z-10 flex items-center">
          {rightIcon}
        </span>
      )}
    </div>
  )
})

export default SmoothInput

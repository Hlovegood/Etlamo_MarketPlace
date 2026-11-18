/**
 * GlassNavbar.jsx
 *
 * Integrated Glass Navbar for Etlamo.
 * Based on PODIE aicanvas--glass-navbar component (MIT License - Copyright (c) 2026 AI Canvas)
 * Upstream Source: https://podie.dev/components/aicanvas--glass-navbar
 *
 * Features:
 * - Morphing scroll behavior: Full-width attached to viewport top when at top (scrollY <= 20),
 *   smoothly shrinking into a floating pill shape with spring physics when scrolling down.
 * - Layered frosted glass styling (backdrop-filter: blur(24px) saturate(180%)).
 * - Smooth active navigation indicator with Framer Motion spring physics (layoutId="glass-nav-active").
 * - Dynamic CTA button with warm luminous gradient, glow shadow, and interactive hover/tap scale.
 * - Animated mobile menu toggle using Phosphor Icons (List <-> X 90° flip) and frosted dropdown.
 * - Full Dark & Light mode integration and Arabic RTL support.
 * - Reduced-motion accessibility check.
 */

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { List, X } from '@phosphor-icons/react'
import {
  ChevronDown,
  LayoutGrid,
  LogOut,
  MessageCircle,
  Plus,
  ShieldCheck,
} from 'lucide-react'
import { Link, navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { useI18n } from '../lib/i18n'
import { useTheme } from '../lib/theme'
import { cx } from '../lib/format'
import { Avatar, Button, Verified } from './ui'
import { ThemeToggle } from './ThemeToggle'
import { LangToggle } from './LangToggle'
import { Logo } from './Shell'

export default function GlassNavbar({ path = '/' }) {
  const { me, signOut, unreadCount } = useStore()
  const { t, isRtl } = useI18n()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const [isScrolled, setIsScrolled] = useState(false)
  const [activeHover, setActiveHover] = useState(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const userMenuRef = useRef(null)

  // Listen for prefers-reduced-motion
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mql.matches)
    const handler = (e) => setReducedMotion(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  // Scroll listener for full-width -> pill shape morph with hysteresis
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY
          setIsScrolled((prev) => {
            if (!prev && y > 35) return true
            if (prev && y < 14) return false
            return prev
          })
          ticking = false
        })
        ticking = true
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setUserMenuOpen(false)
    setMobileMenuOpen(false)
  }, [path])

  // Close user dropdown on outside click
  useEffect(() => {
    const onMouseDown = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  // Navigation Links configuration
  const navLinks = [
    { to: '/explore', label: t('nav_explore', 'Explore') },
    { to: '/planners', label: t('nav_planners', 'Planners') },
    { to: '/requests', label: t('nav_requests', 'Requests') },
  ]

  const isLinkActive = (to) => {
    if (to === '/explore') return path.startsWith('/explore') || path.startsWith('/project')
    if (to === '/planners') return path.startsWith('/planners') || path.startsWith('/planner/')
    if (to === '/requests') return path.startsWith('/requests') || path.startsWith('/request/')
    return path.startsWith(to)
  }

  // PODIE Glass Styling definitions adapted for Dark / Light mode
  const glassStyle = {
    background: isDark
      ? isScrolled
        ? 'rgba(18, 20, 26, 0.82)'
        : 'rgba(9, 10, 13, 0.88)'
      : isScrolled
        ? 'rgba(255, 255, 255, 0.84)'
        : 'rgba(255, 255, 255, 0.92)',
    border: isScrolled
      ? isDark
        ? '1px solid rgba(255, 255, 255, 0.14)'
        : '1px solid rgba(15, 23, 42, 0.10)'
      : '1px solid transparent',
    borderBottom: isScrolled
      ? isDark
        ? '1px solid rgba(255, 255, 255, 0.14)'
        : '1px solid rgba(15, 23, 42, 0.10)'
      : isDark
        ? '1px solid rgba(255, 255, 255, 0.12)'
        : '1px solid rgba(15, 23, 42, 0.08)',
    boxShadow: isScrolled
      ? isDark
        ? '0 18px 45px -10px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.14)'
        : '0 16px 36px -8px rgba(15, 23, 42, 0.10), 0 2px 6px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
      : 'none',
    backdropFilter: 'blur(24px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
  }

  const glassBlur = {
    backdropFilter: 'blur(24px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
  }

  // PODIE CTA gradient button styles
  const ctaStyle = {
    background: 'linear-gradient(135deg, rgba(234, 138, 38, 0.9), rgba(217, 70, 39, 0.85))',
    border: '1px solid rgba(255, 200, 120, 0.35)',
    boxShadow: '0 2px 14px rgba(220, 80, 30, 0.35)',
  }

  const ctaHoverStyle = {
    background: 'linear-gradient(135deg, rgba(245, 150, 50, 0.98), rgba(235, 75, 45, 0.92))',
    boxShadow: '0 4px 22px rgba(220, 80, 30, 0.55)',
  }

  const springTransition = reducedMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 280, damping: 28, mass: 0.8 }

  return (
    <header className="sticky top-0 z-40 w-full pointer-events-none flex justify-center relative">
      <motion.nav
        initial={false}
        animate={{
          width: isScrolled ? 'min(1140px, calc(100% - 1.5rem))' : '100%',
          marginTop: isScrolled ? 10 : 0,
          borderRadius: isScrolled ? 9999 : 0,
          paddingTop: isScrolled ? 8 : 14,
          paddingBottom: isScrolled ? 8 : 14,
          paddingLeft: isScrolled ? 18 : 28,
          paddingRight: isScrolled ? 18 : 28,
        }}
        transition={springTransition}
        className="pointer-events-auto relative isolate flex w-full items-center justify-between transition-colors duration-200"
        style={glassStyle}
      >
        {/* Inner container to keep full-width content gracefully aligned with max-w-7xl */}
        <div className="flex w-full max-w-7xl mx-auto items-center justify-between gap-3">
          {/* Brand Logo with PODIE ambient rotation accent */}
          <div className="flex items-center gap-7">
            <div className="flex items-center gap-2">
              <Logo />
            </div>

            {/* Desktop Navigation Links with PODIE active sliding indicator */}
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link, i) => {
                const active = isLinkActive(link.to)
                const isHovered = activeHover === i

                return (
                  <motion.div
                    key={link.to}
                    onHoverStart={() => setActiveHover(i)}
                    onHoverEnd={() => setActiveHover(null)}
                    className="relative"
                  >
                    <Link
                      to={link.to}
                      className={cx(
                        'relative block rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors duration-150',
                        active
                          ? 'font-semibold text-ink dark:text-white'
                          : 'text-graphite hover:text-ink dark:text-white/70 dark:hover:text-white',
                      )}
                    >
                      {active && (
                        <motion.div
                          layoutId="glass-nav-active"
                          className={cx(
                            'absolute inset-0 rounded-full',
                            isDark
                              ? 'bg-white/12 border border-white/15 shadow-[0_2px_10px_rgba(0,0,0,0.3)]'
                              : 'bg-mist border border-black/5 shadow-subtle',
                          )}
                          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Right Action Controls: Toggles, CTAs & User Menu */}
          <div className="flex items-center gap-2">
            {/* Language & Theme Controls */}
            <div className="flex items-center gap-1">
              <LangToggle />
              <ThemeToggle />
            </div>

            <div className="hidden h-5 w-px bg-hairline sm:block mx-1" />

            {/* User Signed In State */}
            {me ? (
              <div className="flex items-center gap-2">
                {/* Role Specific Quick Actions */}
                {me.role === 'client' && (
                  <motion.button
                    whileHover={reducedMotion ? {} : { scale: 1.03 }}
                    whileTap={reducedMotion ? {} : { scale: 0.97 }}
                    onClick={() => navigate('/requests/new')}
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-semibold text-white cursor-pointer shadow-subtle"
                    style={ctaStyle}
                  >
                    <Plus size={14} /> {t('nav_post_request', 'Post request')}
                  </motion.button>
                )}
                {me.role === 'planner' && (
                  <motion.button
                    whileHover={reducedMotion ? {} : { scale: 1.03 }}
                    whileTap={reducedMotion ? {} : { scale: 0.97 }}
                    onClick={() => navigate('/portfolio/new')}
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-semibold text-white cursor-pointer shadow-subtle"
                    style={ctaStyle}
                  >
                    <Plus size={14} /> {t('nav_add_project', 'Add project')}
                  </motion.button>
                )}
                {me.role === 'admin' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="hidden sm:inline-flex rounded-full text-[13px]"
                    onClick={() => navigate('/admin')}
                  >
                    <ShieldCheck size={14} className="text-azure" /> {t('nav_review_queue', 'Review queue')}
                  </Button>
                )}

                {/* Messages Icon with unread badge */}
                {me.role !== 'admin' && (
                  <Link
                    to="/messages"
                    aria-label={t('nav_messages', 'Messages')}
                    className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-ink transition hover:bg-mist active:scale-95"
                  >
                    <MessageCircle size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff3b30] px-1 text-[10px] font-semibold text-white ring-2 ring-surface">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* User Avatar & Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className="flex cursor-pointer items-center gap-1.5 rounded-full p-0.5 pr-1.5 transition hover:bg-mist active:scale-98"
                    aria-label="User Account Menu"
                  >
                    <Avatar user={me} size={30} />
                    <ChevronDown
                      size={13}
                      className="text-graphite transition duration-200"
                      style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'none' }}
                    />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                        className={cx(
                          'absolute top-12 w-64 overflow-hidden rounded-2xl border border-card-border bg-card/95 p-1.5 shadow-lift backdrop-blur-2xl z-50',
                          isRtl ? 'left-0' : 'right-0',
                        )}
                        style={glassBlur}
                      >
                        <div className="px-3 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate text-[14px] font-semibold text-ink">{me.name}</p>
                            {me.verification === 'verified' && <Verified size={14} />}
                          </div>
                          <p className="text-[12px] text-graphite capitalize">
                            {me.role === 'planner'
                              ? `Planner · ${me.verification === 'verified' ? 'Verified' : me.verification === 'pending' ? 'In review' : 'Not verified'}`
                              : me.role}
                          </p>
                        </div>

                        <div className="my-1 h-px bg-card-border" />

                        {me.role !== 'admin' && (
                          <MenuItem
                            to="/dashboard"
                            icon={<LayoutGrid size={15} />}
                            label={t('nav_dashboard', 'Dashboard')}
                          />
                        )}
                        {me.role === 'planner' && (
                          <MenuItem
                            to={`/planner/${me.id}`}
                            icon={<Avatar user={me} size={15} />}
                            label={t('nav_my_profile', 'My public profile')}
                          />
                        )}
                        {me.role === 'planner' && (
                          <MenuItem
                            to="/verify"
                            icon={<ShieldCheck size={15} />}
                            label={t('nav_verification', 'Verification')}
                          />
                        )}
                        {me.role !== 'admin' && (
                          <MenuItem
                            to="/messages"
                            icon={<MessageCircle size={15} />}
                            label={t('nav_messages', 'Messages')}
                          />
                        )}
                        {me.role === 'admin' && (
                          <MenuItem
                            to="/admin"
                            icon={<ShieldCheck size={15} />}
                            label={t('nav_review_queue', 'Review queue')}
                          />
                        )}

                        <div className="my-1 h-px bg-card-border" />

                        <button
                          onClick={() => {
                            signOut()
                            navigate('/')
                          }}
                          className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[14px] text-rose-500 transition hover:bg-rose-500/10"
                        >
                          <LogOut size={15} /> {t('nav_signout', 'Sign out')}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              /* Visitor Signed Out State */
              <div className="flex items-center gap-1 sm:gap-2">
                <Link
                  to="/signin"
                  className="hidden rounded-full px-3 py-1.5 text-[14px] font-medium text-ink hover:bg-mist sm:block transition"
                >
                  {t('nav_signin', 'Sign in')}
                </Link>

                {/* PODIE Luminous CTA Join Button */}
                <motion.button
                  whileHover={reducedMotion ? {} : { scale: 1.04, ...ctaHoverStyle }}
                  whileTap={reducedMotion ? {} : { scale: 0.96 }}
                  onClick={() => navigate('/signup')}
                  className="cursor-pointer rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-[13px] sm:text-sm font-semibold text-white tracking-wide"
                  style={ctaStyle}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {t('nav_join', 'Join Etlamo')}
                </motion.button>
              </div>
            )}

            {/* Mobile Hamburger Toggle using Phosphor Icons List <-> X flip */}
            <motion.button
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-mist md:hidden transition"
              onClick={() => setMobileMenuOpen((o) => !o)}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle navigation menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={19} weight="bold" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <List size={19} weight="bold" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown with PODIE Glass & spring animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className={cx(
              'pointer-events-auto absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg flex flex-col gap-1 rounded-2xl p-3 shadow-lift z-50 md:hidden',
              isDark ? 'bg-card/95 border-white/12' : 'bg-card/98 border-card-border',
            )}
            style={{
              border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.08)',
              ...glassBlur,
            }}
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3 py-2 text-[15px] font-medium text-ink hover:bg-mist transition"
                >
                  {link.label}
                </Link>
              ))}

              {me?.role === 'client' && (
                <Link
                  to="/requests/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3 py-2 text-[15px] font-semibold text-azure hover:bg-azure/5 transition"
                >
                  {t('nav_post_request', 'Post request')}
                </Link>
              )}

              {me?.role === 'planner' && (
                <Link
                  to="/portfolio/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3 py-2 text-[15px] font-semibold text-azure hover:bg-azure/5 transition"
                >
                  {t('nav_add_project', 'Add project')}
                </Link>
              )}

              {me ? (
                <>
                  <div className="my-1.5 h-px bg-card-border/60" />
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-[15px] font-medium text-ink hover:bg-mist transition"
                  >
                    <LayoutGrid size={16} className="text-graphite" />
                    {t('nav_dashboard', 'Dashboard')}
                  </Link>
                  {me.role !== 'admin' && (
                    <Link
                      to="/messages"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-[15px] font-medium text-ink hover:bg-mist transition"
                    >
                      <span className="flex items-center gap-2">
                        <MessageCircle size={16} className="text-graphite" />
                        {t('nav_messages', 'Messages')}
                      </span>
                      {unreadCount > 0 && (
                        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff3b30] px-1 text-[10px] font-semibold text-white">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      signOut()
                      navigate('/')
                    }}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-left text-[15px] font-medium text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                  >
                    <LogOut size={16} />
                    {t('nav_signout', 'Sign out')}
                  </button>
                </>
              ) : (
                <Link
                  to="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3 py-2 text-[15px] font-medium text-ink hover:bg-mist transition"
                >
                  {t('nav_signin', 'Sign in')}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function MenuItem({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[14px] text-ink transition hover:bg-mist"
    >
      <span className="flex w-4 justify-center text-graphite">{icon}</span>
      {label}
    </Link>
  )
}

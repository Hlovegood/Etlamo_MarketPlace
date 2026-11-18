import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  ChevronDown,
  LayoutGrid,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  X,
} from 'lucide-react'
import { Link, navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { useI18n } from '../lib/i18n'
import { cx } from '../lib/format'
import { Avatar, Button, Container, Verified } from './ui'
import { ThemeToggle } from './ThemeToggle'
import { LangToggle } from './LangToggle'
import GlassNavbar from './GlassNavbar'

export function Logo({ light }) {
  return (
    <Link
      to="/"
      className={cx(
        'group flex items-center gap-2.5 text-[21px] font-semibold tracking-tight transition active:scale-[0.98]',
        light ? 'text-white' : 'text-ink',
      )}
    >
      <span className="relative flex h-7 w-8 items-center justify-center shrink-0">
        <span
          className="absolute -inset-1 rounded-full opacity-0 blur-[3px] group-hover:opacity-60 transition-opacity duration-500 animate-spin"
          style={{
            background: 'linear-gradient(135deg, rgba(2,132,199,0.7), rgba(245,158,11,0.6))',
            animationDuration: '14s',
          }}
        />
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden className="relative z-10 shrink-0">
          <circle
            cx="10"
            cy="14"
            r="8"
            stroke={light ? '#ffffff' : 'currentColor'}
            strokeWidth="2.2"
            strokeOpacity={light ? '0.9' : '0.8'}
          />
          <circle cx="18" cy="14" r="8" stroke="var(--azure)" strokeWidth="2.2" />
        </svg>
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className="font-bold tracking-[-0.03em] font-sans">Etlamo</span>
        <span className="text-[13px] font-semibold text-azure opacity-90 hidden sm:inline font-arabic">إتلامو</span>
      </div>
    </Link>
  )
}

export { GlassNavbar }

export function Nav({ path }) {
  return <GlassNavbar path={path} />
}

function MenuItem({ to, icon, label }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[14px] text-ink transition hover:bg-mist">
      <span className="flex w-4 justify-center text-graphite">{icon}</span>
      {label}
    </Link>
  )
}

export function PersonaSwitcher() {
  const { me, signInAs, signOut, getUser, resetDemo } = useStore()
  const { t, isRtl } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const DEMOS = [
    { id: 'pl-elena', label: 'Elena Marchetti', sub: isRtl ? 'منظمة أعراس فاخرة معتمدة' : 'Verified Luxury Planner', role: 'planner' },
    { id: 'pl-amara', label: 'Amara Okafor', sub: isRtl ? 'متخصصة بالاحتفالات التراثية' : 'Cultural Celebration Specialist', role: 'planner' },
    { id: 'cl-maya', label: 'Maya Chen', sub: isRtl ? 'عميلة (تنظم عرس في وادي نابا)' : 'Client (Planning Napa Wedding)', role: 'client' },
    { id: 'admin', label: 'Etlamo Trust Team', sub: isRtl ? 'فريق فحص واعتماد المخططين' : 'Admin (Verification Queue)', role: 'admin' },
  ]

  const currentLabel = me
    ? me.role === 'admin'
      ? isRtl
        ? 'فريق النزاهة'
        : 'Trust Team'
      : me.name.split(' ')[0]
    : isRtl
      ? 'وضع الزائر'
      : 'Visitor'

  return (
    <div className={cx('fixed bottom-5 z-40 font-sans', isRtl ? 'left-5' : 'right-5')} ref={ref}>
      {open && (
        <div className="mb-3 w-80 animate-pop overflow-hidden rounded-3xl border border-card-border bg-card/95 p-3 shadow-lift backdrop-blur-2xl">
          <div className="px-3 pt-2 pb-2">
            <p className="text-[12px] font-semibold text-graphite">
              {t('quick_persona', 'Quick Demo Persona')}
            </p>
            <p className="text-[13px] text-graphite">
              {t('persona_switch_note', 'Switch accounts instantly to explore both sides of the marketplace.')}
            </p>
          </div>
          <div className="mt-1 space-y-1">
            {DEMOS.map((d) => {
              const u = getUser(d.id)
              if (!u) return null
              const active = me?.id === u.id
              return (
                <button
                  key={d.id}
                  onClick={() => {
                    signInAs(u.id)
                    setOpen(false)
                  }}
                  className={cx(
                    'flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2 text-left transition-all',
                    active ? 'bg-ink text-surface' : 'hover:bg-mist text-ink',
                  )}
                >
                  <Avatar user={u} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 text-[13px] font-semibold">
                      <span className="truncate">{d.label}</span>
                      {u.verification === 'verified' && <Verified size={13} />}
                    </p>
                    <p className={cx('truncate text-[11px]', active ? 'opacity-70' : 'text-graphite')}>{d.sub}</p>
                  </div>
                  {active && <span className="h-2 w-2 rounded-full bg-azure shrink-0" />}
                </button>
              )
            })}
          </div>

          <div className="mt-2 border-t border-card-border pt-2 flex items-center justify-between px-2 text-[12px]">
            {me ? (
              <button
                onClick={() => {
                  signOut()
                  setOpen(false)
                }}
                className="cursor-pointer text-graphite hover:text-ink hover:underline"
              >
                {t('visitor_mode', 'Visitor mode')}
              </button>
            ) : (
              <span className="text-silver">{isRtl ? 'غير مسجل' : 'Currently logged out'}</span>
            )}
            <button
              onClick={() => {
                resetDemo()
                setOpen(false)
                navigate('/')
              }}
              className="flex items-center gap-1 cursor-pointer text-azure hover:underline"
            >
              <RotateCcw size={12} /> {t('reset_demo', 'Reset demo')}
            </button>
          </div>
        </div>
      )}

      {/* Trigger pill */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex cursor-pointer items-center gap-2 rounded-full border border-card-border bg-card/90 px-3.5 py-2 text-[13px] font-medium text-ink shadow-float backdrop-blur-xl transition hover:bg-card hover:shadow-lift active:scale-95"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-azure opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-azure" />
        </span>
        <span className="text-graphite font-normal">{isRtl ? 'الحساب:' : 'Persona:'}</span>
        <span className="font-semibold text-ink">{currentLabel}</span>
        <ChevronDown
          size={14}
          className="text-silver transition duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </button>
    </div>
  )
}

export function Footer() {
  const { resetDemo } = useStore()
  const { t, isRtl } = useI18n()

  return (
    <footer className="mt-28 border-t border-card-border bg-mist/60 transition-colors">
      <Container className="py-14 text-[13px] text-graphite">
        <div className="grid gap-10 pb-12 sm:grid-cols-2 md:grid-cols-4 border-b border-card-border">
          <div>
            <Logo />
            <p className="mt-3.5 max-w-[240px] leading-relaxed text-[13px] text-graphite">
              {t('brand_desc', 'The verified portfolio and celebration discovery marketplace for discerning clients and luxury event planners.')}
            </p>
          </div>
          <FooterCol
            title={isRtl ? 'للعملاء' : 'For Clients'}
            links={[
              [t('nav_post_request', 'Post a Request'), '/requests/new'],
              [t('find_planner_cta', 'Browse Verified Planners'), '/planners'],
              [t('curated_title', 'Explore Standout Work'), '/explore'],
            ]}
          />
          <FooterCol
            title={isRtl ? 'للمخططين' : 'For Planners'}
            links={[
              [t('how_planner_cta', 'Apply for Verification'), '/verify'],
              [t('hero_cta_requests', 'Browse Open Requests'), '/requests'],
              [t('nav_add_project', 'Build Portfolio'), '/portfolio/new'],
            ]}
          />
          <FooterCol
            title={isRtl ? 'الثقة والأمان' : 'Trust & Safety'}
            links={[
              [t('nav_review_queue', 'Review Queue (Admin)'), '/admin'],
              [t('nav_signin', 'Demo Accounts'), '/signin'],
              [t('nav_verification', 'Verification Standards'), '/verify'],
            ]}
          />
        </div>
        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-[12px] sm:flex-row">
          <p>{t('copyright', `© ${new Date().getFullYear()} Etlamo Inc. All portfolios, requests and reviews verified.`)}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('etlamo:replay-preloader'))}
              className="flex cursor-pointer items-center gap-1.5 text-graphite hover:text-ink transition"
            >
              <Sparkles size={12} className="text-amber" /> {t('replay_preloader', 'Preview preloader')}
            </button>
            <span className="text-card-border">·</span>
            <button
              onClick={() => {
                resetDemo()
                navigate('/')
              }}
              className="flex cursor-pointer items-center gap-1.5 text-azure hover:underline transition"
            >
              <RotateCcw size={12} /> {t('reset_demo', 'Reset interactive demo state')}
            </button>
          </div>
        </div>
      </Container>
    </footer>
  )
}

function FooterCol({ title, links }) {
  return (
    <div>
      <p className="mb-3.5 font-semibold text-ink text-[14px]">{title}</p>
      <ul className="space-y-2.5">
        {links.map(([l, to]) => (
          <li key={l}>
            <Link to={to} className="text-graphite transition hover:text-ink hover:underline">
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

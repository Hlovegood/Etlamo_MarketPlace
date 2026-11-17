import { useEffect, useRef, useState, type ReactNode } from 'react'
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

export function Logo({ light }: { light?: boolean }) {
  const { isRtl } = useI18n()
  return (
    <Link
      to="/"
      className={cx(
        'flex items-center gap-2.5 text-[21px] font-semibold tracking-tight transition active:scale-[0.98]',
        light ? 'text-white' : 'text-ink',
      )}
    >
      <span className="relative flex h-7 w-8 items-center justify-center shrink-0">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden className="shrink-0">
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

export function Nav({ path }: { path: string }) {
  const { me, signOut, unreadCount } = useStore()
  const { t, isRtl } = useI18n()
  const [menu, setMenu] = useState(false)
  const [mobile, setMobile] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMenu(false)
    setMobile(false)
  }, [path])

  useEffect(() => {
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setMenu(false)
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const links = [
    { to: '/explore', label: t('nav_explore', 'Explore') },
    { to: '/planners', label: t('nav_planners', 'Planners') },
    { to: '/requests', label: t('nav_requests', 'Requests') },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-card-border bg-surface/85 backdrop-blur-2xl backdrop-saturate-180 transition-colors">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-7">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active =
                path.startsWith(l.to) ||
                (l.to === '/explore' && path.startsWith('/project')) ||
                (l.to === '/planners' && path.startsWith('/planner/')) ||
                (l.to === '/requests' && path.startsWith('/request/'))
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cx(
                    'rounded-full px-3.5 py-1.5 text-[14px] transition-all duration-150',
                    active
                      ? 'bg-mist font-semibold text-ink shadow-subtle'
                      : 'text-graphite hover:text-ink hover:bg-mist/50',
                  )}
                >
                  {l.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme & Language Toggles */}
          <div className="flex items-center gap-1.5">
            <LangToggle />
            <ThemeToggle />
          </div>

          <div className="h-5 w-px bg-hairline mx-1 hidden sm:block" />

          {me ? (
            <>
              {me.role === 'client' && (
                <Button size="sm" className="hidden sm:inline-flex" onClick={() => navigate('/requests/new')}>
                  <Plus size={14} /> {t('nav_post_request', 'Post request')}
                </Button>
              )}
              {me.role === 'planner' && (
                <Button size="sm" className="hidden sm:inline-flex" onClick={() => navigate('/portfolio/new')}>
                  <Plus size={14} /> {t('nav_add_project', 'Add project')}
                </Button>
              )}
              {me.role === 'admin' && (
                <Button size="sm" variant="secondary" className="hidden sm:inline-flex" onClick={() => navigate('/admin')}>
                  <ShieldCheck size={14} className="text-azure" /> {t('nav_review_queue', 'Review queue')}
                </Button>
              )}
              {me.role !== 'admin' && (
                <Link
                  to="/messages"
                  aria-label={t('nav_messages', 'Messages')}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink transition hover:bg-mist active:scale-95"
                >
                  <MessageCircle size={19} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff3b30] px-1 text-[10px] font-semibold text-white ring-2 ring-surface">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )}
              <div className="relative" ref={ref}>
                <button
                  onClick={() => setMenu((m) => !m)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full p-1 pr-2 transition hover:bg-mist active:scale-98"
                >
                  <Avatar user={me} size={32} />
                  <ChevronDown
                    size={14}
                    className="text-graphite transition duration-200"
                    style={{ transform: menu ? 'rotate(180deg)' : 'none' }}
                  />
                </button>
                {menu && (
                  <div
                    className={cx(
                      'absolute top-12 w-64 animate-pop overflow-hidden rounded-2xl border border-card-border bg-card/95 p-1.5 shadow-lift backdrop-blur-2xl z-50',
                      isRtl ? 'left-0' : 'right-0',
                    )}
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
                      <MenuItem to="/dashboard" icon={<LayoutGrid size={15} />} label={t('nav_dashboard', 'Dashboard')} />
                    )}
                    {me.role === 'planner' && (
                      <MenuItem
                        to={`/planner/${me.id}`}
                        icon={<Avatar user={me} size={15} />}
                        label={t('nav_my_profile', 'My public profile')}
                      />
                    )}
                    {me.role === 'planner' && (
                      <MenuItem to="/verify" icon={<ShieldCheck size={15} />} label={t('nav_verification', 'Verification')} />
                    )}
                    {me.role !== 'admin' && (
                      <MenuItem to="/messages" icon={<MessageCircle size={15} />} label={t('nav_messages', 'Messages')} />
                    )}
                    {me.role === 'admin' && (
                      <MenuItem to="/admin" icon={<ShieldCheck size={15} />} label={t('nav_review_queue', 'Review queue')} />
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
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="hidden rounded-full px-3.5 py-1.5 text-[14px] font-medium text-ink hover:bg-mist sm:block transition"
              >
                {t('nav_signin', 'Sign in')}
              </Link>
              <Button size="sm" onClick={() => navigate('/signup')}>
                {t('nav_join', 'Join Etlamo')}
              </Button>
            </>
          )}

          <button
            onClick={() => setMobile((m) => !m)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-mist md:hidden text-ink"
            aria-label="Menu"
          >
            {mobile ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </Container>

      {mobile && (
        <div className="animate-fade border-t border-card-border bg-card/98 px-5 py-4 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col space-y-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="rounded-xl px-3 py-2.5 text-[16px] font-medium text-ink hover:bg-mist">
                {l.label}
              </Link>
            ))}
            {me?.role === 'client' && (
              <Link
                to="/requests/new"
                className="rounded-xl px-3 py-2.5 text-[16px] font-semibold text-azure hover:bg-azure/5"
              >
                {t('nav_post_request', 'Post request')}
              </Link>
            )}
            {me?.role === 'planner' && (
              <Link
                to="/portfolio/new"
                className="rounded-xl px-3 py-2.5 text-[16px] font-semibold text-azure hover:bg-azure/5"
              >
                {t('nav_add_project', 'Add project')}
              </Link>
            )}
            {!me && (
              <Link to="/signin" className="rounded-xl px-3 py-2.5 text-[16px] font-medium text-ink hover:bg-mist">
                {t('nav_signin', 'Sign in')}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

function MenuItem({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
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
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
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
            <p className="text-[11px] font-semibold tracking-wider text-graphite uppercase">
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
      </Container>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
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

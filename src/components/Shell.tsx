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
import { cx } from '../lib/format'
import { Avatar, Button, Container, Verified } from './ui'

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link to="/" className={cx('flex items-center gap-2 text-[20px] font-semibold tracking-tight transition active:scale-[0.98]', light ? 'text-white' : 'text-ink')}>
      <span className="relative flex h-6 w-7 items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden className="shrink-0">
          <circle cx="10" cy="14" r="8" stroke={light ? '#ffffff' : '#1d1d1f'} strokeWidth="2.2" strokeOpacity={light ? '0.9' : '0.85'} />
          <circle cx="18" cy="14" r="8" stroke="#0071e3" strokeWidth="2.2" />
        </svg>
      </span>
      <span className="font-semibold tracking-[-0.02em]">Fête</span>
    </Link>
  )
}

export function Nav({ path }: { path: string }) {
  const { me, signOut, unreadCount } = useStore()
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
    { to: '/explore', label: 'Explore' },
    { to: '/planners', label: 'Planners' },
    { to: '/requests', label: 'Requests' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.07] bg-white/80 backdrop-blur-2xl backdrop-saturate-180">
      <Container className="flex h-15 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
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

        <div className="flex items-center gap-2.5">
          {me ? (
            <>
              {me.role === 'client' && (
                <Button size="sm" className="hidden sm:inline-flex" onClick={() => navigate('/requests/new')}>
                  <Plus size={14} /> Post request
                </Button>
              )}
              {me.role === 'planner' && (
                <Button size="sm" className="hidden sm:inline-flex" onClick={() => navigate('/portfolio/new')}>
                  <Plus size={14} /> Add project
                </Button>
              )}
              {me.role === 'admin' && (
                <Button size="sm" variant="secondary" className="hidden sm:inline-flex" onClick={() => navigate('/admin')}>
                  <ShieldCheck size={14} className="text-azure" /> Review queue
                </Button>
              )}
              {me.role !== 'admin' && (
                <Link
                  to="/messages"
                  aria-label="Messages"
                  className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink transition hover:bg-mist active:scale-95"
                >
                  <MessageCircle size={19} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff3b30] px-1 text-[10px] font-semibold text-white ring-2 ring-white">
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
                  <ChevronDown size={14} className="text-graphite transition duration-200" style={{ transform: menu ? 'rotate(180deg)' : 'none' }} />
                </button>
                {menu && (
                  <div className="absolute top-12 right-0 w-64 animate-pop overflow-hidden rounded-2xl border border-black/[0.08] bg-white/95 p-1.5 shadow-lift backdrop-blur-2xl">
                    <div className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-[14px] font-semibold">{me.name}</p>
                        {me.verification === 'verified' && <Verified size={14} />}
                      </div>
                      <p className="text-[12px] text-graphite capitalize">
                        {me.role === 'planner'
                          ? `Planner · ${me.verification === 'verified' ? 'Verified' : me.verification === 'pending' ? 'In review' : 'Not verified'}`
                          : me.role}
                      </p>
                    </div>
                    <div className="my-1 h-px bg-black/[0.06]" />
                    {me.role !== 'admin' && <MenuItem to="/dashboard" icon={<LayoutGrid size={15} />} label="Dashboard" />}
                    {me.role === 'planner' && <MenuItem to={`/planner/${me.id}`} icon={<Avatar user={me} size={15} />} label="My public profile" />}
                    {me.role === 'planner' && <MenuItem to="/verify" icon={<ShieldCheck size={15} />} label="Verification" />}
                    {me.role !== 'admin' && <MenuItem to="/messages" icon={<MessageCircle size={15} />} label="Messages" />}
                    {me.role === 'admin' && <MenuItem to="/admin" icon={<ShieldCheck size={15} />} label="Review queue" />}
                    <div className="my-1 h-px bg-black/[0.06]" />
                    <button
                      onClick={() => {
                        signOut()
                        navigate('/')
                      }}
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[14px] text-rose-600 transition hover:bg-rose-50"
                    >
                      <LogOut size={15} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/signin" className="hidden rounded-full px-3.5 py-1.5 text-[14px] font-medium text-ink hover:bg-mist sm:block transition">
                Sign in
              </Link>
              <Button size="sm" onClick={() => navigate('/signup')}>
                Join Fête
              </Button>
            </>
          )}
          <button
            onClick={() => setMobile((m) => !m)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-mist md:hidden"
            aria-label="Menu"
          >
            {mobile ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </Container>

      {mobile && (
        <div className="animate-fade border-t border-black/[0.06] bg-white/95 px-5 py-4 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col space-y-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="rounded-xl px-3 py-2.5 text-[16px] font-medium hover:bg-mist">
                {l.label}
              </Link>
            ))}
            {me?.role === 'client' && (
              <Link to="/requests/new" className="rounded-xl px-3 py-2.5 text-[16px] font-semibold text-azure hover:bg-azure/5">
                Post an event request
              </Link>
            )}
            {me?.role === 'planner' && (
              <Link to="/portfolio/new" className="rounded-xl px-3 py-2.5 text-[16px] font-semibold text-azure hover:bg-azure/5">
                Add project to portfolio
              </Link>
            )}
            {!me && (
              <Link to="/signin" className="rounded-xl px-3 py-2.5 text-[16px] font-medium hover:bg-mist">
                Sign in
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
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const DEMOS = [
    { id: 'pl-elena', label: 'Elena Marchetti', sub: 'Verified Luxury Planner', role: 'planner' },
    { id: 'pl-amara', label: 'Amara Okafor', sub: 'Cultural Celebration Specialist', role: 'planner' },
    { id: 'cl-maya', label: 'Maya Chen', sub: 'Client (Planning Napa Wedding)', role: 'client' },
    { id: 'admin', label: 'Fête Trust Team', sub: 'Admin (Verification Queue)', role: 'admin' },
  ]

  const currentLabel = me ? (me.role === 'admin' ? 'Trust Team' : me.role === 'planner' ? me.name.split(' ')[0] : me.name.split(' ')[0]) : 'Visitor'

  return (
    <div className="fixed bottom-5 right-5 z-40 font-sans" ref={ref}>
      {open && (
        <div className="mb-3 w-80 animate-pop overflow-hidden rounded-3xl border border-black/[0.08] bg-white/95 p-3 shadow-lift backdrop-blur-2xl">
          <div className="px-3 pt-2 pb-2">
            <p className="text-[11px] font-semibold tracking-wider text-graphite uppercase">Quick Demo Persona</p>
            <p className="text-[13px] text-graphite">Switch accounts instantly to explore both sides of the marketplace.</p>
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
                    active ? 'bg-ink text-white' : 'hover:bg-mist text-ink',
                  )}
                >
                  <Avatar user={u} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 text-[13px] font-semibold">
                      <span className="truncate">{d.label}</span>
                      {u.verification === 'verified' && <Verified size={13} />}
                    </p>
                    <p className={cx('truncate text-[11px]', active ? 'text-white/70' : 'text-graphite')}>{d.sub}</p>
                  </div>
                  {active && <span className="h-2 w-2 rounded-full bg-azure shrink-0" />}
                </button>
              )
            })}
          </div>

          <div className="mt-2 border-t border-black/[0.06] pt-2 flex items-center justify-between px-2 text-[12px]">
            {me ? (
              <button
                onClick={() => {
                  signOut()
                  setOpen(false)
                }}
                className="cursor-pointer text-graphite hover:text-ink hover:underline"
              >
                Sign out (Visitor)
              </button>
            ) : (
              <span className="text-silver">Currently logged out</span>
            )}
            <button
              onClick={() => {
                resetDemo()
                setOpen(false)
                navigate('/')
              }}
              className="flex items-center gap-1 cursor-pointer text-link hover:underline"
            >
              <RotateCcw size={12} /> Reset demo
            </button>
          </div>
        </div>
      )}

      {/* Trigger pill */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex cursor-pointer items-center gap-2 rounded-full border border-black/[0.08] bg-white/90 px-3.5 py-2 text-[13px] font-medium text-ink shadow-float backdrop-blur-xl transition hover:bg-white hover:shadow-lift active:scale-95"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-azure opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-azure" />
        </span>
        <span className="text-graphite font-normal">Persona:</span>
        <span className="font-semibold text-ink">{currentLabel}</span>
        <ChevronDown size={14} className="text-silver transition duration-200" style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
    </div>
  )
}

export function Footer() {
  const { resetDemo } = useStore()
  return (
    <footer className="mt-28 border-t border-black/[0.06] bg-mist/60">
      <Container className="py-14 text-[13px] text-graphite">
        <div className="grid gap-10 pb-12 sm:grid-cols-2 md:grid-cols-4 border-b border-black/[0.06]">
          <div>
            <Logo />
            <p className="mt-3.5 max-w-[240px] leading-relaxed text-[13px] text-graphite">
              The verified portfolio and celebration discovery marketplace for discerning clients and luxury event planners.
            </p>
          </div>
          <FooterCol
            title="For Clients"
            links={[
              ['Post a Request', '/requests/new'],
              ['Browse Verified Planners', '/planners'],
              ['Explore Standout Work', '/explore'],
            ]}
          />
          <FooterCol
            title="For Planners"
            links={[
              ['Apply for Verification', '/verify'],
              ['Browse Open Requests', '/requests'],
              ['Build Portfolio', '/portfolio/new'],
            ]}
          />
          <FooterCol
            title="Trust & Team"
            links={[
              ['Review Queue (Admin)', '/admin'],
              ['Demo Accounts', '/signin'],
              ['Terms & Verification Standards', '/verify'],
            ]}
          />
        </div>
        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-[12px] sm:flex-row">
          <p>© {new Date().getFullYear()} Fête Inc. All portfolios, requests and reviews verified.</p>
          <button
            onClick={() => {
              resetDemo()
              navigate('/')
            }}
            className="flex cursor-pointer items-center gap-1.5 text-link hover:underline transition"
          >
            <RotateCcw size={12} /> Reset interactive demo state
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

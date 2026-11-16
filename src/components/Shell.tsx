import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronDown, LayoutGrid, LogOut, Menu, MessageCircle, Plus, RotateCcw, ShieldCheck, X } from 'lucide-react'
import { Link, navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { cx } from '../lib/format'
import { Avatar, Button, Container } from './ui'

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link to="/" className={cx('flex items-center gap-1.5 text-[19px] font-semibold tracking-tight', light ? 'text-white' : 'text-ink')}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
        <circle cx="9" cy="12" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="15" cy="12" r="6.5" fill="none" stroke="#0071e3" strokeWidth="2" />
      </svg>
      Fête
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
    <header className="sticky top-0 z-40 border-b border-black/[0.07] bg-white/75 backdrop-blur-2xl backdrop-saturate-150">
      <Container className="flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cx(
                  'rounded-full px-3 py-1.5 text-[14px] transition',
                  path.startsWith(l.to) || (l.to === '/explore' && path.startsWith('/project')) || (l.to === '/planners' && path.startsWith('/planner/')) || (l.to === '/requests' && path.startsWith('/request/'))
                    ? 'font-medium text-ink'
                    : 'text-graphite hover:text-ink',
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {me ? (
            <>
              {me.role === 'client' && (
                <Button size="sm" className="hidden sm:inline-flex" onClick={() => navigate('/requests/new')}>
                  <Plus size={14} /> Post a request
                </Button>
              )}
              {me.role === 'planner' && (
                <Button size="sm" className="hidden sm:inline-flex" onClick={() => navigate('/portfolio/new')}>
                  <Plus size={14} /> Add project
                </Button>
              )}
              {me.role === 'admin' && (
                <Button size="sm" variant="secondary" className="hidden sm:inline-flex" onClick={() => navigate('/admin')}>
                  <ShieldCheck size={14} /> Review queue
                </Button>
              )}
              {me.role !== 'admin' && (
                <Link to="/messages" aria-label="Messages" className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink transition hover:bg-mist">
                  <MessageCircle size={19} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff3b30] px-1 text-[10px] font-semibold text-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )}
              <div className="relative" ref={ref}>
                <button onClick={() => setMenu((m) => !m)} className="flex cursor-pointer items-center gap-1 rounded-full p-0.5 pr-1.5 transition hover:bg-mist">
                  <Avatar user={me} size={30} />
                  <ChevronDown size={14} className="text-graphite" />
                </button>
                {menu && (
                  <div className="absolute top-11 right-0 w-64 animate-pop overflow-hidden rounded-2xl border border-black/[0.06] bg-white/95 p-1.5 shadow-lift backdrop-blur-2xl">
                    <div className="px-3 py-2.5">
                      <p className="text-[14px] font-semibold">{me.name}</p>
                      <p className="text-[12px] text-graphite capitalize">
                        {me.role === 'planner' ? `Planner · ${me.verification === 'verified' ? 'Verified' : me.verification === 'pending' ? 'In review' : 'Not verified'}` : me.role}
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
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[14px] hover:bg-mist"
                    >
                      <LogOut size={15} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/signin" className="hidden rounded-full px-3 py-1.5 text-[14px] text-ink hover:bg-mist sm:block">
                Sign in
              </Link>
              <Button size="sm" onClick={() => navigate('/signup')}>
                Join Fête
              </Button>
            </>
          )}
          <button onClick={() => setMobile((m) => !m)} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-mist md:hidden" aria-label="Menu">
            {mobile ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </Container>
      {mobile && (
        <div className="animate-fade border-t border-black/[0.06] bg-white md:hidden">
          <Container className="flex flex-col py-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="py-3 text-[17px] font-medium">
                {l.label}
              </Link>
            ))}
            {me?.role === 'client' && (
              <Link to="/requests/new" className="py-3 text-[17px] font-medium text-link">
                Post a request
              </Link>
            )}
            {me?.role === 'planner' && (
              <Link to="/portfolio/new" className="py-3 text-[17px] font-medium text-link">
                Add project
              </Link>
            )}
            {!me && (
              <Link to="/signin" className="py-3 text-[17px] font-medium">
                Sign in
              </Link>
            )}
          </Container>
        </div>
      )}
    </header>
  )
}

function MenuItem({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[14px] hover:bg-mist">
      <span className="flex w-4 justify-center text-graphite">{icon}</span>
      {label}
    </Link>
  )
}

export function Footer() {
  const { resetDemo } = useStore()
  return (
    <footer className="mt-24 bg-mist">
      <Container className="py-12 text-[12px] text-graphite">
        <div className="grid gap-8 border-b border-black/[0.08] pb-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 max-w-[220px] leading-relaxed">The portfolio platform for verified wedding and event planners.</p>
          </div>
          <FooterCol title="For clients" links={[['Post a request', '/requests/new'], ['Browse planners', '/planners'], ['Explore work', '/explore']]} />
          <FooterCol title="For planners" links={[['Join as a planner', '/signup?role=planner'], ['Get verified', '/verify'], ['Open requests', '/requests']]} />
          <FooterCol title="Demo" links={[['Sign in with a demo account', '/signin'], ['Verification review queue', '/admin']]} />
        </div>
        <div className="flex flex-col justify-between gap-3 pt-5 sm:flex-row">
          <p>Prototype. Data is stored locally in this browser.</p>
          <button
            onClick={() => {
              resetDemo()
              navigate('/')
            }}
            className="flex cursor-pointer items-center gap-1 text-link hover:underline"
          >
            <RotateCcw size={12} /> Reset demo data
          </button>
        </div>
      </Container>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="mb-3 font-semibold text-ink">{title}</p>
      <ul className="space-y-2">
        {links.map(([l, to]) => (
          <li key={l}>
            <Link to={to} className="hover:text-ink hover:underline">
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

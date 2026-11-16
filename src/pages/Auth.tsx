import { useState } from 'react'
import { ArrowRight, Check, ChevronLeft, PartyPopper, Sparkles } from 'lucide-react'
import { Link, navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { img } from '../lib/seed'
import { cx } from '../lib/format'
import type { Role } from '../lib/types'
import { Avatar, Button, useToast } from '../components/ui'

function AuthFrame({ children, image }: { children: React.ReactNode; image: string }) {
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] lg:grid-cols-[1fr_minmax(0,46%)]">
      <div className="flex items-start justify-center px-5 py-12 md:items-center md:py-16">
        <div className="w-full max-w-[440px] animate-rise">{children}</div>
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <p className="absolute right-10 bottom-10 left-10 text-[28px] leading-tight font-semibold tracking-tight text-white">
          “We found our planner in a weekend. She understood us from the first message.”
          <span className="mt-3 block text-[15px] font-normal text-white/75">Priya & Sam, married in Napa</span>
        </p>
      </div>
    </div>
  )
}

export function SignUp({ query }: { query: URLSearchParams }) {
  const { signUp } = useStore()
  const toast = useToast()
  const preset = query.get('role') as Role | null
  const next = query.get('next')
  const [step, setStep] = useState<1 | 2>(1)
  const [role, setRole] = useState<Role | null>(preset === 'client' || preset === 'planner' ? preset : null)
  const [f, setF] = useState({ name: '', email: '', password: '', business: '', location: '', agree: false })
  const [error, setError] = useState('')
  const set = (k: keyof typeof f, v: string | boolean) => setF((x) => ({ ...x, [k]: v }))

  const valid =
    f.name.trim().split(' ').filter(Boolean).length >= 1 &&
    /\S+@\S+\.\S+/.test(f.email) &&
    f.password.length >= 8 &&
    f.agree &&
    (role !== 'planner' || f.business.trim())

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!role || !valid) return
    const res = signUp({ role, name: f.name, email: f.email, password: f.password, business: f.business, location: f.location })
    if (typeof res === 'string') return setError(res)
    if (role === 'planner') {
      toast('Account created. Let’s get you verified.')
      navigate('/verify')
    } else {
      toast('Welcome to Fête')
      navigate(next || '/dashboard')
    }
  }

  return (
    <AuthFrame image={img(role === 'planner' ? '1785672951683-dba4e3867b8a' : '1764380754282-194c847f6d4c', 1600)}>
      {step === 1 ? (
        <>
          <h1 className="text-[40px] leading-[1.05] font-semibold tracking-[-0.03em]">Join Fête</h1>
          <p className="mt-2 text-[17px] text-graphite">First, tell us how you’ll use it.</p>
          <div className="mt-8 space-y-3" role="radiogroup">
            <RoleCard
              selected={role === 'client'}
              onClick={() => setRole('client')}
              icon={<PartyPopper size={22} />}
              title="I’m planning an event"
              body="Post requests, browse portfolios and chat with verified planners."
            />
            <RoleCard
              selected={role === 'planner'}
              onClick={() => setRole('planner')}
              icon={<Sparkles size={22} />}
              title="I’m a wedding or event planner"
              body="Showcase your portfolio, get verified and reply to client requests."
            />
          </div>
          <Button size="lg" className="mt-8 w-full" disabled={!role} onClick={() => setStep(2)}>
            Continue
          </Button>
          <p className="mt-6 text-center text-[14px] text-graphite">
            Already have an account?{' '}
            <Link to={`/signin${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="text-link hover:underline">
              Sign in
            </Link>
          </p>
        </>
      ) : (
        <form onSubmit={submit}>
          <button type="button" onClick={() => setStep(1)} className="mb-6 flex cursor-pointer items-center gap-0.5 text-[15px] text-link hover:underline">
            <ChevronLeft size={17} /> Change account type
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1 text-[13px] font-medium">
            {role === 'planner' ? <Sparkles size={13} /> : <PartyPopper size={13} />}
            {role === 'planner' ? 'Planner account' : 'Client account'}
          </span>
          <h1 className="mt-4 text-[36px] leading-[1.05] font-semibold tracking-[-0.03em]">Create your account</h1>
          {role === 'planner' && <p className="mt-2 text-[15px] text-graphite">Next you’ll verify your business. It takes about five minutes.</p>}
          <div className="mt-8 space-y-4">
            <div>
              <label className="label" htmlFor="name">Full name</label>
              <input id="name" className="field" autoComplete="name" value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Jordan Avery" />
            </div>
            {role === 'planner' && (
              <div>
                <label className="label" htmlFor="biz">Business name</label>
                <input id="biz" className="field" value={f.business} onChange={(e) => set('business', e.target.value)} placeholder="Avery Events Co." />
              </div>
            )}
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" type="email" className="field" autoComplete="email" value={f.email} onChange={(e) => { set('email', e.target.value); setError('') }} placeholder="you@example.com" />
            </div>
            <div>
              <label className="label" htmlFor="pw">Password</label>
              <input id="pw" type="password" className="field" autoComplete="new-password" value={f.password} onChange={(e) => set('password', e.target.value)} placeholder="At least 8 characters" />
            </div>
            <div>
              <label className="label" htmlFor="city">City <span className="font-normal text-silver">(optional)</span></label>
              <input id="city" className="field" value={f.location} onChange={(e) => set('location', e.target.value)} placeholder="San Francisco, CA" />
            </div>
            <label className="flex cursor-pointer items-start gap-3 pt-1 text-[14px] text-graphite">
              <input type="checkbox" checked={f.agree} onChange={(e) => set('agree', e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#0071e3]" />
              I agree to the Terms of Service and Privacy Policy.
            </label>
          </div>
          {error && <p className="mt-4 rounded-xl bg-[#fbeaea] px-4 py-3 text-[14px] text-[#c4271b]">{error}</p>}
          <Button size="lg" type="submit" className="mt-7 w-full" disabled={!valid}>
            {role === 'planner' ? 'Continue to verification' : 'Create account'} <ArrowRight size={17} />
          </Button>
        </form>
      )}
    </AuthFrame>
  )
}

function RoleCard({ selected, onClick, icon, title, body }: { selected: boolean; onClick: () => void; icon: React.ReactNode; title: string; body: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cx(
        'flex w-full cursor-pointer items-start gap-4 rounded-[20px] border p-5 text-left transition duration-200',
        selected ? 'border-azure bg-azure/[0.04] ring-4 ring-azure/12' : 'border-hairline hover:border-silver',
      )}
    >
      <span className={cx('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition', selected ? 'bg-azure text-white' : 'bg-mist text-ink')}>{icon}</span>
      <span className="flex-1">
        <span className="block text-[17px] font-semibold">{title}</span>
        <span className="mt-0.5 block text-[14px] leading-snug text-graphite">{body}</span>
      </span>
      <span className={cx('mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition', selected ? 'border-azure bg-azure text-white' : 'border-hairline')}>
        {selected && <Check size={12} strokeWidth={3} />}
      </span>
    </button>
  )
}

const DEMOS = [
  { id: 'cl-maya', label: 'Client', note: 'Has requests and planner replies' },
  { id: 'pl-elena', label: 'Verified planner', note: 'Portfolio and active chats' },
  { id: 'pl-marcus', label: 'Planner in review', note: 'Verification pending' },
  { id: 'admin', label: 'Trust team admin', note: 'Approves planners' },
]

export function SignIn({ query }: { query: URLSearchParams }) {
  const { signIn, signInAs, getUser } = useStore()
  const next = query.get('next')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')

  const go = (role: Role) => navigate(next || (role === 'admin' ? '/admin' : '/dashboard'))

  return (
    <AuthFrame image={img('1768777270882-9f74939fee50', 1600)}>
      <h1 className="text-[40px] leading-[1.05] font-semibold tracking-[-0.03em]">Sign in</h1>
      <p className="mt-2 text-[17px] text-graphite">Welcome back to Fête.</p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          const res = signIn(email, pw)
          if (typeof res === 'string') return setError(res)
          go(res.role)
        }}
      >
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" className="field" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} placeholder="you@example.com" />
        </div>
        <div>
          <label className="label" htmlFor="pw">Password</label>
          <input id="pw" type="password" className="field" value={pw} onChange={(e) => { setPw(e.target.value); setError('') }} />
        </div>
        {error && <p className="rounded-xl bg-[#fbeaea] px-4 py-3 text-[14px] text-[#c4271b]">{error}</p>}
        <Button size="lg" type="submit" className="w-full" disabled={!email || !pw}>
          Sign in
        </Button>
      </form>
      <p className="mt-6 text-center text-[14px] text-graphite">
        New to Fête?{' '}
        <Link to={`/signup${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="text-link hover:underline">
          Create an account
        </Link>
      </p>

      <div className="mt-10 rounded-3xl bg-mist p-5">
        <p className="text-[13px] font-semibold text-graphite">Explore with a demo account</p>
        <div className="mt-3 space-y-1">
          {DEMOS.map((d) => {
            const u = getUser(d.id)
            if (!u) return null
            return (
              <button
                key={d.id}
                onClick={() => {
                  signInAs(u.id)
                  go(u.role)
                }}
                className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-2 py-2 text-left transition hover:bg-white"
              >
                <Avatar user={u} size={34} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold">
                    {u.name} <span className="font-normal text-graphite">· {d.label}</span>
                  </span>
                  <span className="block text-[12px] text-graphite">{d.note}</span>
                </span>
                <ArrowRight size={15} className="text-silver" />
              </button>
            )
          })}
        </div>
      </div>
    </AuthFrame>
  )
}

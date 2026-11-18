import { useState } from 'react'
import { ArrowRight, Check, ChevronLeft, PartyPopper, Sparkles } from 'lucide-react'
import { Link, navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { useI18n } from '../lib/i18n'
import { img } from '../lib/seed'
import { cx } from '../lib/format'
import { Avatar, Button, useToast } from '../components/ui'

function AuthFrame({ children, image }) {
  const { isRtl } = useI18n()
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[1fr_minmax(0,46%)] bg-surface text-ink transition-colors">
      <div className="flex items-start justify-center px-5 py-12 md:items-center md:py-16">
        <div className="w-full max-w-[440px] animate-rise">{children}</div>
      </div>
      <div className="relative hidden overflow-hidden lg:block border-l border-card-border">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <p className="absolute right-10 bottom-10 left-10 text-[26px] leading-tight font-semibold tracking-tight text-white drop-shadow-md">
          {isRtl
            ? '“وجدنا المخطط المثالي في عطلة نهاية الأسبوع. فهمت طابعنا وتطلعاتنا من أول رسالة.”'
            : '“We found our planner in a weekend. She understood us from the first message.”'}
          <span className="mt-3 block text-[15px] font-normal text-white/80">
            {isRtl ? 'بريا وسام · عقد قران في وادي نابا' : 'Priya & Sam, married in Napa'}
          </span>
        </p>
      </div>
    </div>
  )
}

export function SignUp({ query }) {
  const { signUp } = useStore()
  const { isRtl } = useI18n()
  const toast = useToast()
  const preset = query.get('role') 
  const next = query.get('next')
  const [step, setStep] = useState(1)
  const [role, setRole] = useState(preset === 'client' || preset === 'planner' ? preset : null)
  const [f, setF] = useState({ name: '', email: '', password: '', business: '', location: '', agree: false })
  const [error, setError] = useState('')
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }))

  const valid =
    f.name.trim().split(' ').filter(Boolean).length >= 1 &&
    /\S+@\S+\.\S+/.test(f.email) &&
    f.password.length >= 8 &&
    f.agree &&
    (role !== 'planner' || f.business.trim())

  const submit = (e) => {
    e.preventDefault()
    if (!role || !valid) return
    const res = signUp({ role, name: f.name, email: f.email, password: f.password, business: f.business, location: f.location })
    if (typeof res === 'string') return setError(res)
    if (role === 'planner') {
      toast(isRtl ? 'تم إنشاء الحساب. فلنبدأ إجراءات التوثيق والاعتماد.' : 'Account created. Let’s get you verified.')
      navigate('/verify')
    } else {
      toast(isRtl ? 'أهلاً بك في إتلامو' : 'Welcome to Etlamo')
      navigate(next || '/dashboard')
    }
  }

  return (
    <AuthFrame image={img(role === 'planner' ? '1785672951683-dba4e3867b8a' : '1764380754282-194c847f6d4c', 1600)}>
      {step === 1 ? (
        <>
          <h1 className="text-[40px] leading-[1.05] font-semibold tracking-[-0.03em] text-ink">
            {isRtl ? 'انضم إلى إتلامو' : 'Join Etlamo'}
          </h1>
          <p className="mt-2 text-[17px] text-graphite">
            {isRtl ? 'أولاً، أخبرنا كيف تخطط لاستخدام المنصة.' : 'First, tell us how you’ll use it.'}
          </p>
          <div className="mt-8 space-y-3" role="radiogroup">
            <RoleCard
              selected={role === 'client'}
              onClick={() => setRole('client')}
              icon={<PartyPopper size={22} />}
              title={isRtl ? 'أنا أخطط لمناسبة أو حفل' : 'I’m planning an event'}
              body={isRtl ? 'انشر طلباتك، تصفح معارض الأعمال، وتواصل مع المخططين المعتمدين.' : 'Post requests, browse portfolios and chat with verified planners.'}
            />
            <RoleCard
              selected={role === 'planner'}
              onClick={() => setRole('planner')}
              icon={<Sparkles size={22} />}
              title={isRtl ? 'أنا منظم أو مخطط حفلات وأعراس' : 'I’m a wedding or event planner'}
              body={isRtl ? 'اعرض سوابق أعمالك الفاخرة، احصل على شارة التوثيق، وتواصل مع العملاء.' : 'Showcase your portfolio, get verified and reply to client requests.'}
            />
          </div>
          <Button size="lg" className="mt-8 w-full" disabled={!role} onClick={() => setStep(2)}>
            {isRtl ? 'متابعة' : 'Continue'}
          </Button>
          <p className="mt-6 text-center text-[14px] text-graphite">
            {isRtl ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
            <Link to={`/signin${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="text-azure hover:underline font-medium">
              {isRtl ? 'تسجيل الدخول' : 'Sign in'}
            </Link>
          </p>
        </>
      ) : (
        <form onSubmit={submit}>
          <button type="button" onClick={() => setStep(1)} className="mb-6 flex cursor-pointer items-center gap-0.5 text-[15px] text-azure hover:underline">
            <ChevronLeft size={17} className={isRtl ? 'rotate-180' : ''} /> {isRtl ? 'تغيير نوع الحساب' : 'Change account type'}
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1 text-[13px] font-medium text-ink border border-card-border">
            {role === 'planner' ? <Sparkles size={13} /> : <PartyPopper size={13} />}
            {role === 'planner' ? (isRtl ? 'حساب منظم فعاليات' : 'Planner account') : (isRtl ? 'حساب عميل' : 'Client account')}
          </span>
          <h2 className="mt-4 text-[32px] font-semibold tracking-tight text-ink">{isRtl ? 'إنشاء حسابك' : 'Create your account'}</h2>
          <div className="mt-6 space-y-4">
            <div>
              <label className="label">{isRtl ? 'الاسم الكامل' : 'Full name'}</label>
              <input className="field" value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Elena Marchetti" />
            </div>
            {role === 'planner' && (
              <div>
                <label className="label">{isRtl ? 'اسم الاستوديو أو النشاط التجاري' : 'Business name'}</label>
                <input className="field" value={f.business} onChange={(e) => set('business', e.target.value)} placeholder="Marchetti & Co." />
              </div>
            )}
            <div>
              <label className="label">{isRtl ? 'المدينة والمنطقة' : 'Primary location'}</label>
              <input className="field" value={f.location} onChange={(e) => set('location', e.target.value)} placeholder="New York, NY" />
            </div>
            <div>
              <label className="label">{isRtl ? 'البريد الإلكتروني' : 'Email'}</label>
              <input type="email" className="field" value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="elena@example.com" />
            </div>
            <div>
              <label className="label">{isRtl ? 'كلمة المرور' : 'Password'}</label>
              <input type="password" className="field" value={f.password} onChange={(e) => set('password', e.target.value)} placeholder="8+ characters" />
            </div>
            <label className="flex items-start gap-2.5 pt-2 text-[13px] text-graphite cursor-pointer">
              <input type="checkbox" checked={f.agree} onChange={(e) => set('agree', e.target.checked)} className="mt-0.5" />
              <span>
                {isRtl
                  ? 'أوافق على شروط خدمة إتلامو ومعايير التوثيق وسياسة الخصوصية.'
                  : 'I agree to the Etlamo Terms of Service, verification guidelines and privacy policy.'}
              </span>
            </label>
          </div>
          {error && <p className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-[14px] text-rose-500">{error}</p>}
          <Button size="lg" type="submit" className="mt-6 w-full" disabled={!valid}>
            {role === 'planner' ? (isRtl ? 'إنشاء حساب ومتابعة التوثيق' : 'Continue to verification') : (isRtl ? 'إنشاء الحساب' : 'Create account')}
          </Button>
        </form>
      )}
    </AuthFrame>
  )
}

function RoleCard({ selected, onClick, icon, title, body }) {
  return (
    <div
      onClick={onClick}
      role="radio"
      aria-checked={selected}
      className={cx(
        'flex cursor-pointer gap-4 rounded-2xl border p-4 transition-all duration-200',
        selected ? 'border-azure bg-azure-tint ring-2 ring-azure/20' : 'border-card-border bg-card hover:bg-mist',
      )}
    >
      <div className={cx('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', selected ? 'bg-azure text-white' : 'bg-mist text-graphite')}>
        {icon}
      </div>
      <div>
        <p className="text-[16px] font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-[14px] leading-snug text-graphite">{body}</p>
      </div>
    </div>
  )
}

const DEMOS = [
  { id: 'pl-elena', label: 'Elena Marchetti (Planner)', note: 'Verified luxury wedding planner' },
  { id: 'cl-maya', label: 'Maya Chen (Client)', note: 'Planning a Napa Valley vineyard wedding' },
  { id: 'admin', label: 'Trust Team (Admin)', note: 'Reviews planner verification queue' },
]

export function SignIn({ query }) {
  const { signIn, signInAs, getUser } = useStore()
  const { isRtl } = useI18n()
  const next = query.get('next')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')

  const go = (role) => navigate(next || (role === 'admin' ? '/admin' : '/dashboard'))

  return (
    <AuthFrame image={img('1768777270882-9f74939fee50', 1600)}>
      <h1 className="text-[40px] leading-[1.05] font-semibold tracking-[-0.03em] text-ink">
        {isRtl ? 'تسجيل الدخول' : 'Sign in'}
      </h1>
      <p className="mt-2 text-[17px] text-graphite">
        {isRtl ? 'مرحباً بك مجدداً في إتلامو.' : 'Welcome back to Etlamo.'}
      </p>
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
          <label className="label" htmlFor="email">{isRtl ? 'البريد الإلكتروني' : 'Email'}</label>
          <input id="email" type="email" className="field" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} placeholder="you@example.com" />
        </div>
        <div>
          <label className="label" htmlFor="pw">{isRtl ? 'كلمة المرور' : 'Password'}</label>
          <input id="pw" type="password" className="field" value={pw} onChange={(e) => { setPw(e.target.value); setError('') }} />
        </div>
        {error && <p className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-[14px] text-rose-500">{error}</p>}
        <Button size="lg" type="submit" className="w-full" disabled={!email || !pw}>
          {isRtl ? 'تسجيل الدخول' : 'Sign in'}
        </Button>
      </form>
      <p className="mt-6 text-center text-[14px] text-graphite">
        {isRtl ? 'مستخدم جديد؟' : 'New to Etlamo?'}{' '}
        <Link to={`/signup${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="text-azure hover:underline font-medium">
          {isRtl ? 'إنشاء حساب جديد' : 'Create an account'}
        </Link>
      </p>

      <div className="mt-10 rounded-3xl bg-mist p-5 border border-card-border">
        <p className="text-[13px] font-semibold text-graphite">
          {isRtl ? 'استكشف بحساب تجريبي فوري' : 'Explore with a demo account'}
        </p>
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
                className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-2.5 py-2.5 text-left transition hover:bg-card border border-transparent hover:border-card-border"
              >
                <Avatar user={u} size={34} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold text-ink">
                    {u.name} <span className="font-normal text-graphite">· {d.label}</span>
                  </span>
                  <span className="block text-[12px] text-graphite">{d.note}</span>
                </span>
                <ArrowRight size={15} className={`text-silver ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            )
          })}
        </div>
      </div>
    </AuthFrame>
  )
}

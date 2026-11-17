import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  FileCheck2,
  Heart,
  MessageCircle,
  PenLine,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
} from 'lucide-react'
import { Link, navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { img } from '../lib/seed'
import { ProjectCard, RequestCard } from '../components/cards'
import { Avatar, Button, Container, RatingStars, Verified } from '../components/ui'

export default function Home() {
  const { db, me, isPlannerVisible } = useStore()
  const featured = [...db.projects]
    .filter((p) => isPlannerVisible(p.plannerId))
    .sort((a, b) => b.baseLikes + b.likedBy.length - (a.baseLikes + a.likedBy.length))
    .slice(0, 6)
  const openRequests = db.requests.filter((r) => r.status === 'open').slice(0, 3)
  const verifiedPlanners = db.users.filter((u) => u.role === 'planner' && u.verification === 'verified')

  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden pt-16 pb-12 md:pt-24">
        <Container className="text-center">
          <p className="animate-rise text-[16px] font-semibold text-amber md:text-[18px]">
            For weddings, galas and milestone celebrations
          </p>
          <h1 className="mx-auto mt-3 max-w-4xl animate-rise text-[46px] leading-[1.03] font-semibold tracking-[-0.035em] [animation-delay:60ms] md:text-[80px]">
            Celebrations,
            <br />
            beautifully planned.
          </h1>
          <p className="mx-auto mt-6 max-w-xl animate-rise text-[19px] leading-relaxed text-graphite [animation-delay:120ms] md:text-[21px]">
            Discover the curated portfolios of verified luxury planners. Post what you’re dreaming of. Let the right talent reach out.
          </p>
          <div className="mt-9 flex animate-rise flex-wrap items-center justify-center gap-3.5 [animation-delay:180ms]">
            <Button
              size="lg"
              onClick={() => navigate(me?.role === 'planner' ? '/requests' : me ? '/requests/new' : '/signup?role=client')}
            >
              {me?.role === 'planner' ? 'Browse open requests' : 'Post your event'}
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/explore')}>
              Explore portfolio work
            </Button>
          </div>
        </Container>

        {/* Hero Gallery Mosaic */}
        <div className="mx-auto mt-16 grid max-w-[1400px] animate-rise grid-cols-12 gap-3.5 px-3.5 [animation-delay:260ms] md:mt-20 md:gap-5 md:px-8">
          <HeroTile
            src={img('1764380754282-194c847f6d4c', 1200)}
            className="col-span-4 aspect-[3/4] translate-y-8 md:translate-y-12"
          />
          <HeroTile
            src={img('1768777270882-9f74939fee50', 1600)}
            className="col-span-4 aspect-[3/4]"
            label="Rooftop Vows at Golden Hour"
            by="Marchetti & Co."
          />
          <HeroTile
            src={img('1780340309081-eb5eeca87ba5', 1200)}
            className="col-span-4 aspect-[3/4] translate-y-8 md:translate-y-12"
          />
        </div>
      </section>

      {/* Trust & Verified Metrics */}
      <section className="mt-28">
        <Container>
          <div className="grid grid-cols-2 gap-y-10 border-y border-black/[0.08] py-12 text-center md:grid-cols-4">
            <Stat n={`${verifiedPlanners.length * 210}+`} label="Verified luxury planners" />
            <Stat n="14,200+" label="Celebrations showcased" />
            <Stat n="< 4 hours" label="Median initial reply" />
            <Stat n="100%" label="Vetted & insured profiles" />
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="mt-28">
        <Container>
          <h2 className="max-w-3xl text-[36px] leading-[1.08] font-semibold tracking-[-0.03em] md:text-[54px]">
            Two sides. <span className="text-silver">One beautifully fluid flow.</span>
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <FlowCard
              tone="light"
              kicker="For clients & couples"
              title="Tell us the dream. Vetted planners come to you."
              steps={[
                { icon: <PenLine size={18} />, t: 'Post your vision', d: 'Date, guest count, estimated budget and preferred aesthetic in two minutes.' },
                { icon: <MessageCircle size={18} />, t: 'Hear from verified talent', d: 'Only identity-confirmed and insured professionals can reply.' },
                { icon: <Sparkles size={18} />, t: 'Review & collaborate', d: 'Compare portfolios, review moodboards and chat in one unified inbox.' },
              ]}
              cta={<Button size="lg" onClick={() => navigate(me ? '/requests/new' : '/signup?role=client')}>Post an event request</Button>}
            />
            <FlowCard
              tone="dark"
              kicker="For event producers"
              title="Your best work, directly in front of ideal clients."
              steps={[
                { icon: <Sparkles size={18} />, t: 'Build your showcase', d: 'Display high-resolution galleries and full vendor team credits.' },
                { icon: <UserCheck size={18} />, t: 'Earn the verified badge', d: 'Verify credentials and insurance to build immediate client trust.' },
                { icon: <Search size={18} />, t: 'Reply to qualified leads', d: 'Browse fresh client requests and send customized introductions.' },
              ]}
              cta={
                <Button variant="secondary" size="lg" className="bg-white text-ink hover:bg-mist" onClick={() => navigate(me ? '/verify' : '/signup?role=planner')}>
                  Apply as a planner
                </Button>
              }
            />
          </div>
        </Container>
      </section>

      {/* Featured Standout Projects */}
      <section className="mt-28">
        <Container>
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-[14px] font-semibold text-amber uppercase tracking-wider">Curated Collections</p>
              <h2 className="mt-1 text-[32px] font-semibold tracking-[-0.03em] md:text-[44px]">Standout celebrations</h2>
              <p className="mt-1.5 text-[17px] text-graphite">Real events produced by verified studios across the continent.</p>
            </div>
            <Link to="/explore" className="hidden items-center gap-1.5 text-[16px] font-medium text-azure hover:underline sm:flex">
              Explore all work <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
          <div className="mt-10 text-center sm:hidden">
            <Button variant="secondary" className="w-full" onClick={() => navigate('/explore')}>
              Explore all work <ArrowRight size={15} />
            </Button>
          </div>
        </Container>
      </section>

      {/* Trust & Verification Section */}
      <section className="mt-32 bg-ink py-24 text-white md:py-32">
        <Container>
          <div className="grid items-center gap-14 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] font-medium text-[#2997ff]">
                <ShieldCheck size={16} /> Fête Verification Standard
              </div>
              <h2 className="mt-6 text-[40px] leading-[1.05] font-semibold tracking-[-0.03em] md:text-[58px]">
                Every planner.
                <br />
                <span className="text-[#2997ff]">Verified.</span>
              </h2>
              <p className="mt-6 max-w-md text-[18px] leading-relaxed text-[#a1a1a6]">
                Before any planner can message you or appear in public search, our dedicated trust team inspects four tiers of professional credentials.
              </p>
            </div>
            <div className="space-y-3.5">
              {[
                {
                  icon: <UserCheck size={20} />,
                  t: 'Identity Authenticated',
                  d: 'Government photo ID biometric verification matched to the account holder.',
                },
                {
                  icon: <FileCheck2 size={20} />,
                  t: 'Commercial Liability Insurance',
                  d: 'Active policy with at least $1,000,000 to $2,000,000 general aggregate coverage.',
                },
                {
                  icon: <ShieldCheck size={20} />,
                  t: 'Registered Business Entity',
                  d: 'Official state or municipal business registration verified in good standing.',
                },
                {
                  icon: <CheckCircle2 size={20} />,
                  t: 'Client Reference Checked',
                  d: 'Our team directly contacts recent clients to confirm delivery and professionalism.',
                },
              ].map((s) => (
                <div key={s.t} className="flex gap-4 rounded-2xl bg-[#2c2c2e]/70 p-5 backdrop-blur-xl border border-white/5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2997ff]/15 text-[#2997ff]">
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-white">{s.t}</p>
                    <p className="mt-0.5 text-[14px] text-[#a1a1a6] leading-snug">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Fresh Client Requests */}
      <section className="mt-28">
        <Container>
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-[14px] font-semibold text-amber uppercase tracking-wider">Active Board</p>
              <h2 className="mt-1 text-[32px] font-semibold tracking-[-0.03em] md:text-[44px]">Happening soon</h2>
              <p className="mt-1.5 text-[17px] text-graphite">Fresh event briefs posted by clients seeking experienced planners.</p>
            </div>
            <Link to="/requests" className="hidden items-center gap-1.5 text-[16px] font-medium text-azure hover:underline sm:flex">
              All requests <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {openRequests.map((r) => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials Strip */}
      <section className="mt-28">
        <Container>
          <div className="rounded-[32px] bg-mist px-6 py-16 md:px-16 text-center">
            <div className="flex justify-center -space-x-3 mb-6">
              {verifiedPlanners.slice(0, 6).map((p) => (
                <Avatar key={p.id} user={p} size={54} className="ring-4 ring-mist shadow-subtle" />
              ))}
            </div>
            <h2 className="mx-auto max-w-2xl text-[32px] leading-tight font-semibold tracking-[-0.03em] md:text-[46px]">
              Find the planner who understands your aesthetic.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[18px] text-graphite leading-relaxed">
              Browse by city and specialty, view authenticated event galleries, and connect with professionals holding the <Verified size={15} /> badge.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3.5">
              <Button size="lg" onClick={() => navigate('/planners')}>
                Browse verified planners
              </Button>
              {!me && (
                <Button size="lg" variant="outline" onClick={() => navigate('/signup')}>
                  Create a client account
                </Button>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

function HeroTile({ src, className, label, by }: { src: string; className: string; label?: string; by?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[22px] bg-mist shadow-subtle md:rounded-[30px] ${className}`}>
      <img src={src} alt="" className="h-full w-full object-cover" />
      {label && (
        <div className="absolute bottom-4 left-4 hidden items-center gap-2 rounded-full bg-white/85 py-1.5 pr-4 pl-1.5 text-[13px] backdrop-blur-xl shadow-float sm:flex">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white">
            <Sparkles size={13} />
          </span>
          <span className="font-semibold text-ink">{label}</span>
          <span className="text-graphite font-normal">by {by}</span>
        </div>
      )}
    </div>
  )
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <p className="text-[34px] font-semibold tracking-[-0.03em] md:text-[42px] text-ink">{n}</p>
      <p className="text-[14px] text-graphite mt-1">{label}</p>
    </div>
  )
}

function FlowCard({
  tone,
  kicker,
  title,
  steps,
  cta,
}: {
  tone: 'light' | 'dark'
  kicker: string
  title: string
  steps: { icon: React.ReactNode; t: string; d: string }[]
  cta: React.ReactNode
}) {
  const dark = tone === 'dark'
  return (
    <div className={`flex flex-col rounded-[32px] p-8 md:p-11 shadow-subtle ${dark ? 'bg-ink text-white' : 'bg-mist text-ink'}`}>
      <p className={`text-[14px] font-semibold uppercase tracking-wider ${dark ? 'text-[#2997ff]' : 'text-amber'}`}>{kicker}</p>
      <h3 className="mt-3 max-w-sm text-[28px] leading-tight font-semibold tracking-[-0.02em]">{title}</h3>
      <ol className="mt-8 flex-1 space-y-6">
        {steps.map((s, i) => (
          <li key={s.t} className="flex gap-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${dark ? 'bg-white/10 text-[#2997ff]' : 'bg-white text-ink shadow-float'}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-[16px] font-semibold">
                <span className={dark ? 'text-white/40' : 'text-silver'}>{i + 1}. </span>
                {s.t}
              </p>
              <p className={`mt-0.5 text-[14px] leading-relaxed ${dark ? 'text-[#a1a1a6]' : 'text-graphite'}`}>{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-10">{cta}</div>
    </div>
  )
}

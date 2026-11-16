import { ArrowRight, BadgeCheck, FileCheck2, MessageCircle, PenLine, Search, ShieldCheck, Sparkles, UserCheck } from 'lucide-react'
import { Link, navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { img } from '../lib/seed'
import { ProjectCard, RequestCard } from '../components/cards'
import { Avatar, Button, Container, Verified } from '../components/ui'

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
          <p className="animate-rise text-[17px] font-semibold text-amber md:text-[19px]">For weddings, galas and everything worth celebrating</p>
          <h1 className="mx-auto mt-3 max-w-4xl animate-rise text-[48px] leading-[1.03] font-semibold tracking-[-0.035em] [animation-delay:60ms] md:text-[84px]">
            Celebrations,
            <br />
            beautifully planned.
          </h1>
          <p className="mx-auto mt-6 max-w-xl animate-rise text-[19px] leading-snug text-graphite [animation-delay:120ms] md:text-[21px]">
            Discover the portfolios of verified planners. Post what you’re dreaming of. Let the right people reach out.
          </p>
          <div className="mt-9 flex animate-rise flex-wrap items-center justify-center gap-3 [animation-delay:180ms]">
            <Button size="lg" onClick={() => navigate(me?.role === 'planner' ? '/requests' : me ? '/requests/new' : '/signup?role=client')}>
              {me?.role === 'planner' ? 'See open requests' : 'Post your event'}
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/explore')}>
              Explore the work
            </Button>
          </div>
        </Container>

        <div className="mx-auto mt-16 grid max-w-[1400px] animate-rise grid-cols-12 gap-3 px-3 [animation-delay:260ms] md:mt-20 md:gap-4 md:px-6">
          <HeroTile src={img('1764380754282-194c847f6d4c', 1200)} className="col-span-4 aspect-[3/4] translate-y-10" />
          <HeroTile src={img('1768777270882-9f74939fee50', 1600)} className="col-span-4 aspect-[3/4]" label="Rooftop Vows" by="Marchetti & Co." />
          <HeroTile src={img('1780340309081-eb5eeca87ba5', 1200)} className="col-span-4 aspect-[3/4] translate-y-10" />
        </div>
      </section>

      {/* Stats */}
      <section className="mt-28">
        <Container>
          <div className="grid grid-cols-2 gap-y-10 border-y border-black/[0.08] py-10 text-center md:grid-cols-4">
            <Stat n={`${verifiedPlanners.length * 210}+`} label="Verified planners" />
            <Stat n="14k" label="Events showcased" />
            <Stat n="< 4h" label="Median first reply" />
            <Stat n="100%" label="ID-checked profiles" />
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="mt-28">
        <Container>
          <h2 className="max-w-3xl text-[36px] leading-[1.08] font-semibold tracking-[-0.03em] md:text-[56px]">
            Two sides. <span className="text-silver">One beautifully simple flow.</span>
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <FlowCard
              tone="light"
              kicker="For clients"
              title="Tell us the dream. Planners come to you."
              steps={[
                { icon: <PenLine size={18} />, t: 'Post a request', d: 'Date, guests, budget and the feeling you want. Two minutes.' },
                { icon: <MessageCircle size={18} />, t: 'Hear from verified planners', d: 'Only ID-checked professionals can reach out.' },
                { icon: <Sparkles size={18} />, t: 'Chat and choose', d: 'Compare portfolios and talk it through in one inbox.' },
              ]}
              cta={<Button onClick={() => navigate(me ? '/requests/new' : '/signup?role=client')}>Post a request</Button>}
            />
            <FlowCard
              tone="dark"
              kicker="For planners"
              title="Your best work, in front of the right clients."
              steps={[
                { icon: <Sparkles size={18} />, t: 'Build your portfolio', d: 'Showcase events with large, beautiful galleries.' },
                { icon: <UserCheck size={18} />, t: 'Get verified', d: 'Confirm your identity and business to earn the badge.' },
                { icon: <Search size={18} />, t: 'Answer real requests', d: 'Browse posted events and message clients directly.' },
              ]}
              cta={
                <Button variant="secondary" className="bg-white" onClick={() => navigate(me ? '/verify' : '/signup?role=planner')}>
                  Join as a planner
                </Button>
              }
            />
          </div>
        </Container>
      </section>

      {/* Featured */}
      <section className="mt-28">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-[32px] font-semibold tracking-[-0.03em] md:text-[44px]">Most appreciated</h2>
              <p className="mt-1 text-[17px] text-graphite">This season’s standout work from the community.</p>
            </div>
            <Link to="/explore" className="hidden items-center gap-1 text-[17px] text-link hover:underline sm:flex">
              Explore all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* Verification */}
      <section className="mt-28 bg-black py-24 text-white md:py-32">
        <Container>
          <div className="grid items-center gap-14 md:grid-cols-2">
            <div>
              <BadgeCheck size={48} strokeWidth={1.6} className="text-[#2997ff]" />
              <h2 className="mt-6 text-[40px] leading-[1.05] font-semibold tracking-[-0.03em] md:text-[60px]">
                Every planner.
                <br />
                <span className="bg-gradient-to-r from-[#2997ff] to-[#a78bfa] bg-clip-text text-transparent">Verified.</span>
              </h2>
              <p className="mt-6 max-w-md text-[19px] leading-snug text-[#a1a1a6]">
                Before a planner can message you, our trust team checks their identity, business registration, insurance and a past-client reference.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { icon: <UserCheck size={20} />, t: 'Identity confirmed', d: 'Government ID matched to the account holder.' },
                { icon: <FileCheck2 size={20} />, t: 'Business & insurance checked', d: 'Licence number and liability cover reviewed.' },
                { icon: <ShieldCheck size={20} />, t: 'Reference contacted', d: 'A recent client vouches for their work.' },
              ].map((s) => (
                <div key={s.t} className="flex gap-4 rounded-2xl bg-[#1d1d1f] p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2997ff]/15 text-[#2997ff]">{s.icon}</div>
                  <div>
                    <p className="text-[17px] font-semibold">{s.t}</p>
                    <p className="mt-0.5 text-[15px] text-[#a1a1a6]">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Requests */}
      <section className="mt-28">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-[32px] font-semibold tracking-[-0.03em] md:text-[44px]">Happening soon</h2>
              <p className="mt-1 text-[17px] text-graphite">Fresh requests from people looking for a planner right now.</p>
            </div>
            <Link to="/requests" className="hidden items-center gap-1 text-[17px] text-link hover:underline sm:flex">
              All requests <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {openRequests.map((r) => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        </Container>
      </section>

      {/* Planners strip */}
      <section className="mt-28">
        <Container>
          <div className="rounded-[32px] bg-mist px-6 py-16 text-center md:px-16">
            <div className="flex justify-center -space-x-3">
              {verifiedPlanners.slice(0, 6).map((p) => (
                <Avatar key={p.id} user={p} size={52} className="ring-4 ring-mist" />
              ))}
            </div>
            <h2 className="mx-auto mt-7 max-w-2xl text-[32px] leading-tight font-semibold tracking-[-0.03em] md:text-[44px]">
              Find the planner who gets it.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[17px] text-graphite">
              Browse by specialty and city, see real events, and message anyone with the <Verified size={15} /> badge.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" onClick={() => navigate('/planners')}>
                Browse planners
              </Button>
              {!me && (
                <Button size="lg" variant="ghost" onClick={() => navigate('/signup')}>
                  Create an account <ArrowRight size={16} />
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
    <div className={`relative overflow-hidden rounded-[20px] bg-mist md:rounded-[28px] ${className}`}>
      <img src={src} alt="" className="h-full w-full object-cover" />
      {label && (
        <div className="absolute bottom-4 left-4 hidden items-center gap-2 rounded-full bg-white/80 py-1.5 pr-4 pl-1.5 text-[13px] backdrop-blur-xl sm:flex">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white">
            <Sparkles size={13} />
          </span>
          <span className="font-semibold">{label}</span>
          <span className="text-graphite">by {by}</span>
        </div>
      )}
    </div>
  )
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <p className="text-[36px] font-semibold tracking-[-0.03em] md:text-[44px]">{n}</p>
      <p className="text-[14px] text-graphite">{label}</p>
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
    <div className={`flex flex-col rounded-[28px] p-8 md:p-10 ${dark ? 'bg-ink text-white' : 'bg-mist'}`}>
      <p className={`text-[15px] font-semibold ${dark ? 'text-[#2997ff]' : 'text-amber'}`}>{kicker}</p>
      <h3 className="mt-2 max-w-sm text-[28px] leading-tight font-semibold tracking-[-0.02em]">{title}</h3>
      <ol className="mt-8 flex-1 space-y-5">
        {steps.map((s, i) => (
          <li key={s.t} className="flex gap-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${dark ? 'bg-white/10' : 'bg-white shadow-float'}`}>{s.icon}</div>
            <div>
              <p className="text-[17px] font-semibold">
                <span className={dark ? 'text-white/40' : 'text-silver'}>{i + 1}. </span>
                {s.t}
              </p>
              <p className={`text-[15px] ${dark ? 'text-[#a1a1a6]' : 'text-graphite'}`}>{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-9">{cta}</div>
    </div>
  )
}

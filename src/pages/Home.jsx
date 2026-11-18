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
import { useI18n } from '../lib/i18n'
import { img } from '../lib/seed'
import { ProjectCard, RequestCard } from '../components/cards'
import { Avatar, Button, Container, RatingStars, Verified } from '../components/ui'
import { SplitText, Magnet, ShinyText, FadeReveal, CountUp } from '../components/animations'

export default function Home() {
  const { db, me, isPlannerVisible } = useStore()
  const { t, isRtl } = useI18n()

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
            {t('hero_kicker', 'For weddings, galas and milestone celebrations')}
          </p>

          <h1 className="mx-auto mt-4 max-w-4xl text-[46px] leading-[1.04] font-semibold tracking-[-0.035em] md:text-[80px]">
            <SplitText
              text={t('hero_title_1', 'Celebrations,')}
              className="block"
              delay={0.1}
              by="words"
            />
            <SplitText
              text={t('hero_title_2', 'beautifully planned.')}
              className="block text-azure"
              delay={0.3}
              by="words"
            />
          </h1>

          <p className="mx-auto mt-6 max-w-xl animate-rise text-[19px] leading-relaxed text-graphite [animation-delay:200ms] md:text-[21px]">
            {t(
              'hero_subtitle',
              'Discover the curated portfolios of verified luxury planners. Post what you’re dreaming of. Let the right talent reach out.',
            )}
          </p>

          <div className="mt-9 flex animate-rise flex-wrap items-center justify-center gap-4 [animation-delay:300ms]">
            <Magnet strength={0.3}>
              <Button
                size="lg"
                onClick={() =>
                  navigate(me?.role === 'planner' ? '/requests' : me ? '/requests/new' : '/signup?role=client')
                }
              >
                {me?.role === 'planner'
                  ? t('hero_cta_requests', 'Browse open requests')
                  : t('hero_cta_post', 'Post your event')}
              </Button>
            </Magnet>

            <Magnet strength={0.2}>
              <Button size="lg" variant="secondary" onClick={() => navigate('/explore')}>
                {t('hero_cta_explore', 'Explore portfolio work')}
              </Button>
            </Magnet>
          </div>
        </Container>

        {/* Hero Gallery Mosaic with subtle 3D hover */}
        <div className="mx-auto mt-16 grid max-w-[1400px] animate-rise grid-cols-12 gap-3.5 px-3.5 [animation-delay:400ms] md:mt-20 md:gap-5 md:px-8">
          <HeroTile
            src={img('1764380754282-194c847f6d4c', 1200)}
            className="col-span-4 aspect-[3/4] translate-y-8 md:translate-y-12"
          />
          <HeroTile
            src={img('1768777270882-9f74939fee50', 1600)}
            className="col-span-4 aspect-[3/4]"
            label={t('hero_rooftop_label', 'Rooftop Vows at Golden Hour')}
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
          <FadeReveal>
            <div className="grid grid-cols-2 gap-y-10 border-y border-card-border py-12 text-center md:grid-cols-4">
              <Stat
                value={verifiedPlanners.length * 210}
                suffix="+"
                label={t('stat_planners_label', 'Verified luxury planners')}
              />
              <Stat
                value={14200}
                suffix="+"
                label={t('stat_events_label', 'Celebrations showcased')}
              />
              <Stat
                value={4}
                prefix={isRtl ? 'أقل من ' : '< '}
                suffix={isRtl ? ' ساعات' : ' hours'}
                label={t('stat_reply_label', 'Median initial reply')}
              />
              <Stat
                value={100}
                suffix={isRtl ? '٪' : '%'}
                label={t('stat_verified_label', 'Vetted & insured profiles')}
              />
            </div>
          </FadeReveal>
        </Container>
      </section>

      {/* How it works */}
      <section className="mt-28">
        <Container>
          <FadeReveal>
            <h2 className="max-w-3xl text-[36px] leading-[1.08] font-semibold tracking-[-0.03em] md:text-[54px] text-ink">
              {t('how_title_main', 'Two sides.')}{' '}
              <span className="text-silver">{t('how_title_sub', 'One beautifully fluid flow.')}</span>
            </h2>
          </FadeReveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <FadeReveal delay={0.1}>
              <FlowCard
                tone="light"
                kicker={t('how_client_kicker', 'For clients & couples')}
                title={t('how_client_title', 'Tell us the dream. Vetted planners come to you.')}
                steps={[
                  {
                    icon: <PenLine size={18} />,
                    t: t('how_client_step1_title', 'Post your vision'),
                    d: t('how_client_step1_desc', 'Date, guest count, estimated budget and preferred aesthetic in two minutes.'),
                  },
                  {
                    icon: <MessageCircle size={18} />,
                    t: t('how_client_step2_title', 'Hear from verified talent'),
                    d: t('how_client_step2_desc', 'Only identity-confirmed and insured professionals can reply.'),
                  },
                  {
                    icon: <Sparkles size={18} />,
                    t: t('how_client_step3_title', 'Review & collaborate'),
                    d: t('how_client_step3_desc', 'Compare portfolios, review moodboards and chat in one unified inbox.'),
                  },
                ]}
                cta={
                  <Button size="lg" onClick={() => navigate(me ? '/requests/new' : '/signup?role=client')}>
                    {t('how_client_cta', 'Post an event request')}
                  </Button>
                }
              />
            </FadeReveal>

            <FadeReveal delay={0.2}>
              <FlowCard
                tone="dark"
                kicker={t('how_planner_kicker', 'For event producers')}
                title={t('how_planner_title', 'Your best work, directly in front of ideal clients.')}
                steps={[
                  {
                    icon: <Sparkles size={18} />,
                    t: t('how_planner_step1_title', 'Build your showcase'),
                    d: t('how_planner_step1_desc', 'Display high-resolution galleries and full vendor team credits.'),
                  },
                  {
                    icon: <UserCheck size={18} />,
                    t: t('how_planner_step2_title', 'Earn the verified badge'),
                    d: t('how_planner_step2_desc', 'Verify credentials and insurance to build immediate client trust.'),
                  },
                  {
                    icon: <Search size={18} />,
                    t: t('how_planner_step3_title', 'Reply to qualified leads'),
                    d: t('how_planner_step3_desc', 'Browse fresh client requests and send customized introductions.'),
                  },
                ]}
                cta={
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-stone-900 hover:bg-mist"
                    onClick={() => navigate(me ? '/verify' : '/signup?role=planner')}
                  >
                    {t('how_planner_cta', 'Apply as a planner')}
                  </Button>
                }
              />
            </FadeReveal>
          </div>
        </Container>
      </section>

      {/* Featured Standout Projects */}
      <section className="mt-28">
        <Container>
          <FadeReveal>
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-[13px] font-semibold text-amber">
                  {t('curated_kicker', 'Curated Collections')}
                </p>
                <h2 className="mt-1 text-[32px] font-semibold tracking-[-0.03em] md:text-[44px] text-ink">
                  {t('curated_title', 'Standout celebrations')}
                </h2>
                <p className="mt-1.5 text-[17px] text-graphite">
                  {t('curated_subtitle', 'Real events produced by verified studios across the continent.')}
                </p>
              </div>
              <Link
                to="/explore"
                className="hidden items-center gap-1.5 text-[16px] font-medium text-azure hover:underline sm:flex"
              >
                {t('explore_all', 'Explore all work')} <ArrowRight size={16} className={isRtl ? 'rotate-180' : ''} />
              </Link>
            </div>
          </FadeReveal>

          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Button variant="secondary" className="w-full" onClick={() => navigate('/explore')}>
              {t('explore_all', 'Explore all work')} <ArrowRight size={15} className={isRtl ? 'rotate-180' : ''} />
            </Button>
          </div>
        </Container>
      </section>

      {/* Trust & Verification Section */}
      <section className="mt-32 bg-stone-950 py-24 text-white md:py-32 border-y border-white/5">
        <Container>
          <FadeReveal>
            <div className="grid items-center gap-14 md:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] font-medium text-[#2997ff]">
                  <ShieldCheck size={16} /> {t('trust_badge', 'Etlamo Verification Standard')}
                </div>
                <h2 className="mt-6 text-[40px] leading-[1.05] font-semibold tracking-[-0.03em] md:text-[58px]">
                  {t('trust_title_1', 'Every planner.')}
                  <br />
                  <span className="text-[#2997ff]">{t('trust_title_2', 'Verified.')}</span>
                </h2>
                <p className="mt-6 max-w-md text-[18px] leading-relaxed text-[#a1a1a6]">
                  {t(
                    'trust_subtitle',
                    'Before any planner can message you or appear in public search, our dedicated trust team inspects four tiers of professional credentials.',
                  )}
                </p>
              </div>

              <div className="space-y-3.5">
                {[
                  {
                    icon: <UserCheck size={20} />,
                    t: t('trust_item1_t', 'Identity Authenticated'),
                    d: t('trust_item1_d', 'Government photo ID biometric verification matched to the account holder.'),
                  },
                  {
                    icon: <FileCheck2 size={20} />,
                    t: t('trust_item2_t', 'Commercial Liability Insurance'),
                    d: t('trust_item2_d', 'Active policy with at least $1,000,000 to $2,000,000 general aggregate coverage.'),
                  },
                  {
                    icon: <ShieldCheck size={20} />,
                    t: t('trust_item3_t', 'Registered Business Entity'),
                    d: t('trust_item3_d', 'Official state or municipal business registration verified in good standing.'),
                  },
                  {
                    icon: <CheckCircle2 size={20} />,
                    t: t('trust_item4_t', 'Client Reference Checked'),
                    d: t('trust_item4_d', 'Our team directly contacts recent clients to confirm delivery and professionalism.'),
                  },
                ].map((s) => (
                  <div
                    key={s.t}
                    className="flex gap-4 rounded-2xl bg-[#1c1c1f]/80 p-5 backdrop-blur-xl border border-white/5 transition hover:bg-[#242428]"
                  >
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
          </FadeReveal>
        </Container>
      </section>

      {/* Fresh Client Requests */}
      <section className="mt-28">
        <Container>
          <FadeReveal>
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-[13px] font-semibold text-amber">
                  {t('active_board_kicker', 'Active Board')}
                </p>
                <h2 className="mt-1 text-[32px] font-semibold tracking-[-0.03em] md:text-[44px] text-ink">
                  {t('active_board_title', 'Happening soon')}
                </h2>
                <p className="mt-1.5 text-[17px] text-graphite">
                  {t('active_board_subtitle', 'Fresh event briefs posted by clients seeking experienced planners.')}
                </p>
              </div>
              <Link
                to="/requests"
                className="hidden items-center gap-1.5 text-[16px] font-medium text-azure hover:underline sm:flex"
              >
                {t('all_requests', 'All requests')} <ArrowRight size={16} className={isRtl ? 'rotate-180' : ''} />
              </Link>
            </div>
          </FadeReveal>

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
          <FadeReveal>
            <div className="rounded-[32px] border border-card-border bg-mist px-6 py-16 md:px-16 text-center shadow-subtle">
              <div className="flex justify-center -space-x-3 mb-6">
                {verifiedPlanners.slice(0, 6).map((p) => (
                  <Avatar key={p.id} user={p} size={54} className="ring-4 ring-mist shadow-subtle" />
                ))}
              </div>
              <h2 className="mx-auto max-w-2xl text-[32px] leading-tight font-semibold tracking-[-0.03em] md:text-[46px] text-ink">
                {t('find_planner_title', 'Find the planner who understands your aesthetic.')}
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[18px] text-graphite leading-relaxed">
                {t(
                  'find_planner_subtitle',
                  'Browse by city and specialty, view authenticated event galleries, and connect with professionals holding the verified badge.',
                )}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3.5">
                <Magnet strength={0.25}>
                  <Button size="lg" onClick={() => navigate('/planners')}>
                    {t('find_planner_cta', 'Browse verified planners')}
                  </Button>
                </Magnet>
                {!me && (
                  <Button size="lg" variant="outline" onClick={() => navigate('/signup')}>
                    {t('find_planner_account', 'Create a client account')}
                  </Button>
                )}
              </div>
            </div>
          </FadeReveal>
        </Container>
      </section>
    </>
  )
}

function HeroTile({ src, className, label, by }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[24px] bg-mist shadow-subtle md:rounded-[30px] border border-card-border transition duration-500 hover:scale-[1.01] hover:shadow-float ${className}`}
    >
      <img src={src} alt="" className="h-full w-full object-cover" />
      {label && (
        <div className="absolute bottom-4 left-4 right-4 hidden items-center gap-2 rounded-full bg-surface/85 py-1.5 px-3 text-[13px] backdrop-blur-xl shadow-float sm:flex border border-card-border text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-surface shrink-0">
            <Sparkles size={13} />
          </span>
          <span className="font-semibold text-ink truncate">{label}</span>
          <span className="text-graphite font-normal shrink-0">by {by}</span>
        </div>
      )}
    </div>
  )
}

function Stat({ value, prefix = '', suffix = '', n, label }) {
  return (
    <div>
      <p className="text-[34px] font-semibold tracking-[-0.03em] md:text-[42px] text-ink">
        {value !== undefined ? (
          <CountUp to={value} prefix={prefix} suffix={suffix} />
        ) : (
          n
        )}
      </p>
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
}) {
  const dark = tone === 'dark'
  return (
    <div
      className={`flex flex-col rounded-[32px] p-8 md:p-11 border transition-all duration-300 shadow-subtle hover:shadow-float ${
        dark ? 'bg-stone-900 text-white border-white/10' : 'bg-card text-ink border-card-border'
      }`}
    >
      <p className={`text-[13px] font-semibold ${dark ? 'text-[#2997ff]' : 'text-amber'}`}>
        {kicker}
      </p>
      <h3 className="mt-3 max-w-sm text-[28px] leading-tight font-semibold tracking-[-0.02em]">{title}</h3>
      <ol className="mt-8 flex-1 space-y-6">
        {steps.map((s, i) => (
          <li key={s.t} className="flex gap-4">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                dark ? 'bg-white/10 text-[#2997ff]' : 'bg-mist text-ink shadow-subtle'
              }`}
            >
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

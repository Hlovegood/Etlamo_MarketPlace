import { useMemo, useState } from 'react'
import {
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  FileCheck,
  Globe,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  Star,
  UserCheck,
  UserX,
  X,
} from 'lucide-react'
import { navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { useI18n } from '../lib/i18n'
import { SPECIALTIES } from '../lib/seed'
import { compact } from '../lib/format'
import { PlannerCard, ProjectCard } from '../components/cards'
import { ContactButton } from '../components/Contact'
import { Avatar, Button, Chip, Container, Empty, PageHeader, RatingStars, Segmented, SmoothInput, Verified } from '../components/ui'
import { FadeReveal } from '../components/animations'

export function Planners() {
  const { db } = useStore()
  const { t, isRtl } = useI18n()
  const [spec, setSpec] = useState('All')
  const [q, setQ] = useState('')
  const [priceTier, setPriceTier] = useState('all')

  const list = useMemo(
    () =>
      db.users
        .filter((u) => u.role === 'planner' && u.verification === 'verified')
        .filter((u) => spec === 'All' || u.specialties?.includes(spec))
        .filter((u) => {
          if (priceTier === 'under10') return (u.priceFrom ?? 0) < 10000
          if (priceTier === '10to25') return (u.priceFrom ?? 0) >= 10000 && (u.priceFrom ?? 0) <= 25000
          if (priceTier === '25plus') return (u.priceFrom ?? 0) > 25000
          return true
        })
        .filter(
          (u) =>
            !q.trim() ||
            [u.name, u.business, u.location, u.bio].join(' ').toLowerCase().includes(q.trim().toLowerCase()),
        ),
    [db.users, spec, q, priceTier],
  )

  const specialtyTranslations = {
    All: t('cat_all', 'All'),
    'Luxury Weddings': isRtl ? 'أعراس فاخرة' : 'Luxury Weddings',
    'Destination Weddings': isRtl ? 'أعراس الوجهات العالمية' : 'Destination Weddings',
    'Elopements': isRtl ? 'أعراس حميمية ومصغرة' : 'Elopements',
    'Cultural Celebrations': isRtl ? 'احتفالات تراثية وثقافية' : 'Cultural Celebrations',
    'Corporate Events': isRtl ? 'فعاليات ومؤتمرات شركات' : 'Corporate Events',
    'Galas & Fundraisers': isRtl ? 'حفلات خيرية وكبرى' : 'Galas & Fundraisers',
    'Birthdays': isRtl ? 'أعياد ميلاد استثنائية' : 'Birthdays',
    'Intimate Dinners': isRtl ? 'عشاء خاص وموائد فاخرة' : 'Intimate Dinners',
    'Outdoor & Rustic': isRtl ? 'حفلات طبيعية وخارجية' : 'Outdoor & Rustic',
    'Day-of Coordination': isRtl ? 'إدارة وتنسيق يوم الحفل' : 'Day-of Coordination',
  }

  return (
    <Container>
      <PageHeader
        eyebrow={t('planners_eyebrow', 'Verified Directory')}
        title={t('planners_title', 'Planners')}
        sub={t(
          'planners_sub',
          'Every planner here has passed identity verification, commercial liability insurance checks, and past-client reference screening.',
        )}
        right={
          <div className="w-full sm:w-80">
            <SmoothInput
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('search_planners_placeholder', 'Search by name, business or city…')}
              icon={<Search size={16} />}
              rightIcon={
                q ? (
                  <button
                    type="button"
                    onClick={() => setQ('')}
                    className="text-silver hover:text-ink cursor-pointer transition p-1"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                ) : null
              }
              className="h-11 rounded-full bg-mist text-[15px] border-transparent focus:border-azure"
            />
          </div>
        }
      />

      {/* Specialty Filter Chips */}
      <div className="-mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
        {['All', ...SPECIALTIES].map((s) => (
          <Chip key={s} active={spec === s} onClick={() => setSpec(s)}>
            {specialtyTranslations[s] ?? s}
          </Chip>
        ))}
      </div>

      {/* Secondary filter & counter bar */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-[13px] text-graphite border-b border-card-border pb-4">
        <div>
          {t('showing_planners', 'Showing')} <strong className="text-ink">{list.length}</strong>{' '}
          {t('verified_pros', 'verified professionals')}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-silver">{t('price_guide', 'Price guide:')}</span>
          <Segmented
            value={priceTier}
            onChange={setPriceTier}
            options={[
              { value: 'all', label: t('price_all', 'All budgets') },
              { value: 'under10', label: t('price_under10', '< $10k') },
              { value: '10to25', label: t('price_10to25', '$10k–$25k') },
              { value: '25plus', label: t('price_25plus', '$25k+') },
            ]}
          />
        </div>
      </div>

      {list.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <PlannerCard key={p.id} planner={p} />
          ))}
        </div>
      ) : (
        <Empty
          icon={<UserX size={24} />}
          title={t('no_planners_title', 'No planners match your criteria')}
          body={t(
            'no_planners_desc',
            'Try resetting the specialty or budget filter to discover more verified planners.',
          )}
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setSpec('All')
                setQ('')
                setPriceTier('all')
              }}
            >
              {t('reset_all_filters', 'Reset all filters')}
            </Button>
          }
        />
      )}
    </Container>
  )
}

export function PlannerProfile({ id }) {
  const { db, getUser, me } = useStore()
  const { t, isRtl } = useI18n()
  const planner = getUser(id)
  const isMe = me?.id === id
  const [tab, setTab] = useState('portfolio')

  if (!planner || planner.role !== 'planner' || (planner.verification !== 'verified' && !isMe && me?.role !== 'admin'))
    return (
      <Container className="py-24">
        <Empty
          icon={<UserX size={24} />}
          title={t('profile_unavailable', 'Planner profile unavailable')}
          body={t(
            'profile_private_desc',
            'This portfolio is private or still completing trust verification.',
          )}
          action={<Button onClick={() => navigate('/planners')}>{t('return_to_directory', 'Return to Directory')}</Button>}
        />
      </Container>
    )

  const projects = db.projects.filter((p) => p.plannerId === id)
  const appreciations = projects.reduce((s, p) => s + p.baseLikes + p.likedBy.length, 0)
  const views = projects.reduce((s, p) => s + p.views, 0)
  const cover = projects[0]?.images[0]

  const reviews = [
    {
      author: isRtl ? 'بريا ودانيال س.' : 'Priya & Daniel S.',
      event: isRtl ? 'عرس في وادي نابا' : 'Napa Valley Estate Wedding',
      date: isRtl ? 'سبتمبر ٢٠٢٥' : 'September 2025',
      rating: 5,
      quote: isRtl
        ? 'كان التعامل معهم أفضل قرار اتخذناه. كل تفصيلة نُفذت بهدوء وإتقان فني فائق. الضيوف ما زالوا يثنون على تدفق الحفل وإضاءة الشموع الساحرة.'
        : 'Working with them was the best decision we made. Every detail was executed with total calm and artistry. Our guests are still raving about the dinner flow and candlelit atmosphere.',
    },
    {
      author: isRtl ? 'كلوي وماركوس ف.' : 'Chloe & Marcus V.',
      event: isRtl ? 'عقد قران بروكلين' : 'Brooklyn Rooftop Vows',
      date: isRtl ? 'مايو ٢٠٢٥' : 'May 2025',
      rating: 5,
      quote: isRtl
        ? 'فهموا رؤيتنا الفنية على الفور وحولوا لوحة الأفكار إلى واقع يفوق الخيال مع انضباط كامل للميزانية.'
        : 'Understood our modern editorial aesthetic instantly. They took our mood board and elevated it beyond what we imagined while keeping the budget disciplined.',
    },
    {
      author: isRtl ? 'أمينة وطارق ك.' : 'Amina & Tariq K.',
      event: isRtl ? 'احتفال عائلي متعدد الأيام' : 'Multi-Day Fusion Celebration',
      date: isRtl ? 'نوفمبر ٢٠٢٤' : 'November 2024',
      rating: 5,
      quote: isRtl
        ? 'أداروا احتفالاً ضخماً لأكثر من ٣٥٠ ضيفاً بكل يسر مع احترام عميق لكلا الثقافتين.'
        : 'Handled a 350-guest multi-day cultural celebration effortlessly. The transition between ceremonies was seamless and deeply respectful of both families.',
    },
  ]

  return (
    <>
      {/* Cover Banner */}
      <div className="relative h-60 overflow-hidden bg-mist md:h-88 border-b border-card-border">
        {cover && (
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover scale-105 filter brightness-95"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-black/30" />
      </div>

      <Container>
        {isMe && planner.verification !== 'verified' && (
          <div className="relative z-10 -mt-10 mb-6 flex items-center gap-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 px-5 py-4 text-[14px] text-amber-600 shadow-sm backdrop-blur-md">
            <ShieldAlert size={20} className="shrink-0 text-amber-500" />
            <span className="flex-1">
              {isRtl
                ? 'ملفك الشخصي حالياً خاص. سيظهر للجميع فور اكتمال مراجعة اعتماداتك من فريق النزاهة.'
                : 'Your profile is currently private. It will appear publicly across search once our verification team completes review.'}
            </span>
            <Button size="sm" variant="dark" onClick={() => navigate('/verify')}>
              {planner.verification === 'pending'
                ? (isRtl ? 'فحص حالة المراجعة' : 'Check review status')
                : (isRtl ? 'بدء التوثيق' : 'Start verification')}
            </Button>
          </div>
        )}

        {/* Profile Header */}
        <div className="relative -mt-16 flex flex-col gap-6 md:-mt-22 md:flex-row md:items-end md:justify-between">
          <div className="animate-rise">
            <Avatar user={planner} size={124} className="ring-4 ring-card shadow-lift" />
            <h1 className="mt-5 flex items-center gap-2.5 text-[34px] leading-tight font-semibold tracking-[-0.03em] md:text-[48px] text-ink">
              {planner.business || planner.name}
              {planner.verification === 'verified' && <Verified size={28} label={false} />}
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[15px] text-graphite">
              <span className="font-medium text-ink">{planner.name}</span>
              {planner.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} className="text-silver" /> {planner.location}
                </span>
              )}
              {planner.website && (
                <span className="flex items-center gap-1.5">
                  <Globe size={15} className="text-silver" /> {planner.website}
                </span>
              )}
              <span className="flex items-center gap-1 text-amber-500 font-medium">
                <Star size={14} className="fill-amber-400 text-amber-400" /> 5.0 (24 {isRtl ? 'تقييماً' : 'reviews'})
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {isMe ? (
              <Button size="lg" onClick={() => navigate('/portfolio/new')}>
                <Plus size={16} /> {t('add_new_project', 'Add new project')}
              </Button>
            ) : (
              <ContactButton
                other={planner}
                size="lg"
                label={`${t('inquire_style', 'Inquire with')} ${planner.name.split(' ')[0]}`}
                draft={`Hi ${planner.name.split(' ')[0]}, I discovered your profile on Etlamo and would love to check your availability for an upcoming event.`}
              />
            )}
          </div>
        </div>

        {/* Main Grid with Sidebar + Tabs */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[340px_1fr]">
          {/* Left Column: Bio & Verified Credentials */}
          <aside className="space-y-6">
            <div className="grid grid-cols-3 gap-2 rounded-3xl bg-mist p-5 text-center shadow-subtle border border-card-border">
              <Stat n={String(projects.length)} l={isRtl ? 'معارض' : 'Showcases'} />
              <Stat n={compact(appreciations)} l={isRtl ? 'إعجابات' : 'Appreciations'} />
              <Stat n={compact(views)} l={isRtl ? 'مشاهدات' : 'Views'} />
            </div>

            {planner.bio && (
              <div className="rounded-3xl border border-card-border bg-card p-6 shadow-subtle">
                <h3 className="text-[13px] font-semibold text-graphite mb-3">
                  {isRtl ? 'عن الاستوديو' : 'About the Studio'}
                </h3>
                <p className="text-[16px] leading-relaxed text-graphite font-normal">{planner.bio}</p>
              </div>
            )}

            {/* Verified Trust Card */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-subtle">
              <h3 className="flex items-center gap-2 text-[15px] font-semibold text-ink mb-4">
                <ShieldCheck size={18} className="text-azure" /> {t('fete_verified_credentials', 'Etlamo Verified Credentials')}
              </h3>
              <ul className="space-y-3 text-[13px] text-graphite">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>{t('verified_id', 'Government ID & Identity Verified')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>{t('verified_insurance', '$2,000,000 Commercial Liability Coverage')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>{t('verified_business', 'Registered Business Entity in Good Standing')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>{t('verified_references', 'Past-Client References Verified by Trust Team')}</span>
                </li>
              </ul>
            </div>

            <dl className="space-y-3.5 text-[14px] rounded-3xl bg-mist p-6 border border-card-border">
              {planner.yearsExp ? (
                <div className="flex items-center gap-2.5 text-graphite">
                  <Clock size={16} className="text-silver shrink-0" />
                  <span>
                    <strong className="text-ink">{planner.yearsExp} {isRtl ? 'سنوات' : 'years'}</strong>{' '}
                    {t('years_experience', 'years curating luxury celebrations')}
                  </span>
                </div>
              ) : null}
              {planner.priceFrom ? (
                <div className="flex items-center gap-2.5 text-graphite">
                  <Briefcase size={16} className="text-silver shrink-0" />
                  <span>
                    {t('full_services_from', 'Full services from')}{' '}
                    <strong className="text-ink">${planner.priceFrom.toLocaleString()}</strong>
                  </span>
                </div>
              ) : null}
            </dl>

            {!!planner.specialties?.length && (
              <div>
                <p className="mb-2.5 text-[13px] font-semibold text-graphite">
                  {t('specialties_aesthetic', 'Specialties & Aesthetic')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {planner.specialties.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Right Column: Interactive Tabs */}
          <div>
            <div className="mb-8 flex items-center justify-between border-b border-card-border pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTab('portfolio')}
                  className={`rounded-full px-4 py-2 text-[15px] font-semibold transition cursor-pointer ${
                    tab === 'portfolio' ? 'bg-ink text-surface shadow-subtle' : 'text-graphite hover:text-ink hover:bg-mist'
                  }`}
                >
                  {t('tab_portfolio', 'Portfolio')} ({projects.length})
                </button>
                <button
                  onClick={() => setTab('packages')}
                  className={`rounded-full px-4 py-2 text-[15px] font-semibold transition cursor-pointer ${
                    tab === 'packages' ? 'bg-ink text-surface shadow-subtle' : 'text-graphite hover:text-ink hover:bg-mist'
                  }`}
                >
                  {t('tab_services_pricing', 'Services & Pricing')}
                </button>
                <button
                  onClick={() => setTab('reviews')}
                  className={`rounded-full px-4 py-2 text-[15px] font-semibold transition cursor-pointer ${
                    tab === 'reviews' ? 'bg-ink text-surface shadow-subtle' : 'text-graphite hover:text-ink hover:bg-mist'
                  }`}
                >
                  {t('tab_reviews', 'Reviews')} (24)
                </button>
              </div>
            </div>

            {/* Tab: Portfolio */}
            {tab === 'portfolio' && (
              <>
                {projects.length ? (
                  <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2">
                    {projects.map((p) => (
                      <ProjectCard key={p.id} project={p} showPlanner={false} />
                    ))}
                  </div>
                ) : (
                  <Empty
                    icon={<Plus size={24} />}
                    title={isRtl ? 'لا توجد مشاريع منشورة حتى الآن' : 'No portfolio projects yet'}
                    body={
                      isMe
                        ? (isRtl ? 'انشر حفلاتك المميزة لتبدأ في بناء معرضك المعتمد.' : 'Publish your standout weddings and celebrations to show clients your work.')
                        : (isRtl ? 'يقوم المنظم حالياً بتنسيق معرض أعماله.' : 'This planner is currently curating their portfolio gallery.')
                    }
                    action={isMe && <Button onClick={() => navigate('/portfolio/new')}>{t('add_new_project', 'Publish a celebration')}</Button>}
                  />
                )}
              </>
            )}

            {/* Tab: Packages & Pricing */}
            {tab === 'packages' && (
              <div className="space-y-6 animate-rise">
                <PackageCard
                  title={isRtl ? 'التصميم والإنتاج الكامل للحفل الفاخر' : 'Full-Service Wedding Design & Production'}
                  price={planner.priceFrom ? `${isRtl ? 'من' : 'From'} $${planner.priceFrom.toLocaleString()}` : 'From $15,000'}
                  desc={
                    isRtl
                      ? 'إدارة إبداعية ولوجستية شاملة، انتقاء فريق العمل، مفاوضات العقود، ضبط الميزانية، وتخطيط ثلاثي الأبعاد مع إشراف كامل طوال عطلة الأسبوع.'
                      : 'Comprehensive creative direction, vendor sourcing, contract negotiations, budget tracking, spatial 3D floor plans, and full weekend production.'
                  }
                  features={
                    isRtl
                      ? [
                          'لوحة تصميم بصرية ومود بورد مخصص للحفل',
                          'انتقاء وإدارة كافة عقود الموردين والفنانين',
                          'جدول مالي محكم ومتابعة دفعات الميزانية',
                          'زيارات ميدانية واستشارات تصميم غير محدودة',
                          'تغطية كاملة ليوم الحفل، البروفة، ووجبة اليوم التالي',
                        ]
                      : [
                          'Complete visual design concept & bespoke mood board',
                          'Comprehensive vendor team curation & contract management',
                          'Detailed budget tracking and payment schedules',
                          'Unlimited design consultations and site walkthroughs',
                          'Full weekend coverage: rehearsal, day-of, and post-brunch',
                        ]
                  }
                  planner={planner}
                />

                <PackageCard
                  title={isRtl ? 'التخطيط الجزئي والتوجيه الفني والتنسيق' : 'Partial Planning & Design Direction'}
                  price={planner.priceFrom ? `${isRtl ? 'من' : 'From'} $${Math.round(planner.priceFrom * 0.6).toLocaleString()}` : 'From $9,500'}
                  desc={
                    isRtl
                      ? 'للعملاء الذين حجزوا القاعة ويرغبون في توجيه فني دقيق، وانتقاء احترافي للموردين وإشراف محكم على التفاصيل.'
                      : 'For couples who have secured their venue and want expert styling direction, trusted vendor matching, and meticulous execution.'
                  }
                  features={
                    isRtl
                      ? [
                          'توجيه ألوان الحفل وتنسيقات الزهور والإضاءة',
                          'قائمة حصرية ومفحوصة للمصورين والضيافة',
                          'جدول زمني تنفيذي متكامل لسير فعاليات الحفل',
                          'إدارة بروفة الحفل والإشراف الميداني يوم المناسبة',
                        ]
                      : [
                          'Design direction, color palette, and floral styling guidance',
                          'Shortlist of vetted photographers, entertainment & caterers',
                          'Detailed master production timeline & run-of-show',
                          'Rehearsal direction and full day-of coordination',
                        ]
                  }
                  planner={planner}
                />

                <PackageCard
                  title={isRtl ? 'إدارة وتنظيم يوم الحفل (Month-of)' : 'Month-of Coordination & Execution'}
                  price={isRtl ? 'من ٤,٥٠٠ $' : 'From $4,500'}
                  desc={
                    isRtl
                      ? 'سلّم عقودك ومخططاتك قبل ٦ أسابيع. نتولى تنسيق الموردين وجداول الوصول لتكون حاضراً بكامل راحتك.'
                      : 'Hand over your vendor contracts 6 weeks out. We orchestrate the final logistics, confirm vendor arrivals, and ensure you are fully present.'
                  }
                  features={
                    isRtl
                      ? [
                          'استلام العقود ومراجعة اللوجستيات قبل الحفل بـ ٦٠ يوماً',
                          'معاينة نهائية للقاعة ومزامنة جدول الفعاليات',
                          'إدارة بروفة مراسم الزفاف',
                          'المخطط الرئيسي ومساعد ميداني متواجدان لمدة ١٢ ساعة',
                        ]
                      : [
                          'Vendor handover & logistics review 60 days before event',
                          'Final venue walkthrough & run-of-show synchronization',
                          'Ceremony rehearsal management',
                          'Lead planner + assistant on-site for 12 hours day-of',
                        ]
                  }
                  planner={planner}
                />
              </div>
            )}

            {/* Tab: Reviews */}
            {tab === 'reviews' && (
              <div className="space-y-5 animate-rise">
                <div className="rounded-3xl bg-mist p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-card-border">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[32px] font-bold tracking-tight text-ink">5.0</span>
                      <RatingStars rating={5} size={18} />
                    </div>
                    <p className="text-[13px] text-graphite mt-1">
                      {t('based_on_reviews', 'Based on 24 verified past-client evaluations')}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-azure bg-card px-3.5 py-1.5 rounded-full shadow-subtle border border-card-border">
                      <ShieldCheck size={16} /> {t('verified_reviews_badge', '100% Verified Reviews')}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((r, i) => (
                    <article key={i} className="rounded-3xl border border-card-border bg-card p-7 shadow-subtle">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-[16px] text-ink">{r.author}</p>
                          <p className="text-[13px] text-graphite">
                            {r.event} · {r.date}
                          </p>
                        </div>
                        <RatingStars rating={r.rating} size={15} />
                      </div>
                      <blockquote className="mt-4 text-[15px] leading-relaxed text-graphite italic font-normal">
                        “{r.quote}”
                      </blockquote>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  )
}

function Stat({ n, l }) {
  return (
    <div>
      <p className="text-[22px] font-semibold tracking-tight text-ink">{n}</p>
      <p className="text-[12px] text-graphite">{l}</p>
    </div>
  )
}

function PackageCard({
  title,
  price,
  desc,
  features,
  popular,
  planner,
}) {
  const { isRtl } = useI18n()
  return (
    <div className="rounded-3xl border border-card-border bg-card p-7 shadow-subtle hover:shadow-float transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h3 className="text-[19px] font-semibold tracking-tight text-ink">{title}</h3>
          <p className="mt-2 text-[14px] text-graphite leading-relaxed max-w-xl">{desc}</p>
        </div>
        <div className="sm:text-right shrink-0">
          <p className="text-[20px] font-bold text-ink">{price}</p>
          <p className="text-[12px] text-silver">{isRtl ? 'تخصيص كامل بعد الجلسة الاستشارية' : 'Customized after discovery'}</p>
        </div>
      </div>
      <div className="mt-6 pt-5 border-t border-card-border">
        <p className="text-[12px] font-semibold text-graphite mb-3">
          {isRtl ? 'المزايا المشمولة' : 'Service Inclusions'}
        </p>
        <ul className="grid sm:grid-cols-2 gap-2.5 text-[13px] text-graphite">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check size={14} className="text-azure shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex justify-end">
        <ContactButton
          other={planner}
          size="sm"
          label={isRtl ? 'طلب استشارة لهذه الباقة' : 'Inquire about this package'}
          draft={`Hi ${planner.name.split(' ')[0]}, I'm interested in your “${title}” package. Let's discuss details and next steps.`}
        />
      </div>
    </div>
  )
}

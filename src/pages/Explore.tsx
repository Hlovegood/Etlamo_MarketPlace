import { useEffect, useMemo, useState } from 'react'
import {
  CalendarDays,
  Camera,
  ChevronLeft,
  Compass,
  Eye,
  Heart,
  ImageOff,
  Layers,
  MapPin,
  Palette,
  Search,
  Share2,
  Sparkles,
  Trash2,
  Users,
  Utensils,
  X,
  Maximize2,
} from 'lucide-react'
import { Link, navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { CATEGORIES } from '../lib/seed'
import { compact, cx } from '../lib/format'
import { ProjectCard } from '../components/cards'
import { ContactButton } from '../components/Contact'
import {
  Avatar,
  Button,
  Chip,
  Container,
  Empty,
  LightboxModal,
  PageHeader,
  Segmented,
  Verified,
  useToast,
} from '../components/ui'

export function Explore() {
  const { db, isPlannerVisible, getUser } = useStore()
  const [cat, setCat] = useState<string>('All')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<'popular' | 'recent'>('popular')

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    return db.projects
      .filter((p) => isPlannerVisible(p.plannerId))
      .filter((p) => cat === 'All' || p.category === cat)
      .filter((p) => {
        if (!term) return true
        const pl = getUser(p.plannerId)
        return [p.title, p.location, p.tags.join(' '), pl?.business, pl?.name].join(' ').toLowerCase().includes(term)
      })
      .sort((a, b) => (sort === 'recent' ? b.createdAt - a.createdAt : b.baseLikes + b.likedBy.length - (a.baseLikes + a.likedBy.length)))
  }, [db.projects, cat, q, sort, isPlannerVisible, getUser])

  return (
    <Container>
      <PageHeader
        eyebrow="Editorial Portfolio Gallery"
        title="Explore"
        sub="Celebrations produced by verified planners. Discover aesthetics, venues and floristry you love, then meet the person behind them."
      />
      <div className="sticky top-15 z-30 -mx-5 mb-8 flex flex-col gap-3.5 border-b border-black/[0.06] bg-white/80 px-5 py-3.5 backdrop-blur-2xl backdrop-saturate-180 md:-mx-8 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-0.5 scrollbar-none">
          {['All', ...CATEGORIES].map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
              {c}
            </Chip>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-72 md:flex-none">
            <Search size={15} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-silver pointer-events-none" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search aesthetics, cities, venues…"
              className="h-10 w-full rounded-full bg-mist pr-8 pl-9 text-[14px] text-ink placeholder:text-silver focus:ring-4 focus:ring-azure/15 transition-all"
            />
            {q && (
              <button
                onClick={() => setQ('')}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-silver hover:text-ink cursor-pointer"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <Segmented
            value={sort}
            onChange={setSort}
            options={[
              { value: 'popular', label: 'Curated' },
              { value: 'recent', label: 'Recent' },
            ]}
          />
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between text-[13px] text-graphite px-1">
        <span>Showing {list.length} {list.length === 1 ? 'celebration' : 'celebrations'}</span>
        {cat !== 'All' && <span>Filtered by: <strong className="text-ink">{cat}</strong></span>}
      </div>

      {list.length ? (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <Empty
          icon={<ImageOff size={24} />}
          title="No celebrations found"
          body="Try clearing your search term or selecting a different category."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setCat('All')
                setQ('')
              }}
            >
              Reset filters
            </Button>
          }
        />
      )}
    </Container>
  )
}

export function ProjectDetail({ id }: { id: string }) {
  const { db, getUser, me, toggleLike, viewProject, deleteProject, isPlannerVisible } = useStore()
  const toast = useToast()
  const project = db.projects.find((p) => p.id === id)
  const planner = project && getUser(project.plannerId)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    if (project && me?.id !== project.plannerId) viewProject(project.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (!project || !planner || !isPlannerVisible(planner.id))
    return (
      <Container className="py-24">
        <Empty
          icon={<ImageOff size={24} />}
          title="Project not found"
          body="This celebration may have been updated or archived by the planner."
          action={<Button onClick={() => navigate('/explore')}>Return to Explore</Button>}
        />
      </Container>
    )

  const liked = !!me && project.likedBy.includes(me.id)
  const likes = project.baseLikes + project.likedBy.length
  const more = db.projects.filter((p) => p.plannerId === planner.id && p.id !== project.id).slice(0, 3)
  const mine = me?.id === planner.id

  const like = () => {
    if (!me) return navigate(`/signup?next=${encodeURIComponent(`/project/${project.id}`)}`)
    toggleLike(project.id)
    if (!liked) toast('Added to your appreciations')
  }

  // Curated vendor credits based on category and style
  const vendorCredits = [
    { role: 'Event Production & Design', name: planner.business || planner.name, isPlanner: true },
    { role: 'Photography', name: 'Studio Lumière Fine Art' },
    { role: 'Floral Artistry & Installations', name: 'Atelier Botanical' },
    { role: 'Catering & Sommelier', name: 'Heirloom Table Provisions' },
    { role: 'Stationery & Calligraphy', name: 'Carta Papeterie Studio' },
  ]

  return (
    <>
      <Container>
        <button
          onClick={() => history.back()}
          className="mt-6 flex cursor-pointer items-center gap-1 text-[14px] font-medium text-graphite hover:text-ink transition active:scale-98"
        >
          <ChevronLeft size={16} /> Back to explore
        </button>

        <div className="flex flex-col gap-6 pt-6 pb-10 md:flex-row md:items-end md:justify-between">
          <div className="animate-rise">
            <span className="inline-block rounded-full bg-mist px-3 py-1 text-[12px] font-semibold text-amber">
              {project.category} Showcase
            </span>
            <h1 className="mt-2 max-w-3xl text-[36px] leading-[1.05] font-semibold tracking-[-0.03em] md:text-[56px]">
              {project.title}
            </h1>
            <Link to={`/planner/${planner.id}`} className="mt-5 inline-flex items-center gap-3 group">
              <Avatar user={planner} size={42} className="ring-2 ring-hairline" />
              <span>
                <span className="flex items-center gap-1.5 text-[15px] font-semibold group-hover:text-azure transition">
                  {planner.business} {planner.verification === 'verified' && <Verified size={15} />}
                </span>
                <span className="block text-[13px] text-graphite">{planner.name} · {planner.location}</span>
              </span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {mine ? (
              <Button
                variant="danger"
                onClick={() => {
                  if (confirm('Delete this project from your portfolio?')) {
                    deleteProject(project.id)
                    toast('Project removed')
                    navigate('/dashboard')
                  }
                }}
              >
                <Trash2 size={15} /> Delete project
              </Button>
            ) : (
              <Button
                variant={liked ? 'dark' : 'secondary'}
                onClick={like}
                className={liked ? 'shadow-float' : ''}
              >
                <Heart size={16} className={liked ? 'fill-[#ff375f] text-[#ff375f]' : ''} />
                {liked ? 'Appreciated' : 'Appreciate'}
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href)
                toast('Project link copied to clipboard')
              }}
            >
              <Share2 size={15} /> Share
            </Button>

            {!mine && (
              <ContactButton
                other={planner}
                projectId={project.id}
                label={`Inquire with ${planner.name.split(' ')[0]}`}
                draft={`Hi ${planner.name.split(' ')[0]}, I love your celebration “${project.title}”. I’m planning an event and would love to discuss your vision and availability.`}
              />
            )}
          </div>
        </div>
      </Container>

      {/* Editorial Gallery Grid */}
      <Container className="max-w-[1320px]">
        <div className="space-y-4">
          {/* Main Hero Shot */}
          <div
            onClick={() => setLightboxIndex(0)}
            className="group relative aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-[28px] bg-mist shadow-subtle transition duration-300 hover:shadow-lift"
          >
            <img
              src={project.images[0]}
              alt={project.title}
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100 flex items-end justify-between p-6 text-white">
              <span className="text-[14px] font-medium flex items-center gap-2">
                <Maximize2 size={16} /> Click to expand full gallery
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-[12px] backdrop-blur-md">
                1 of {project.images.length} photos
              </span>
            </div>
          </div>

          {/* Subsequent Shots in Responsive Grid */}
          {project.images.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.images.slice(1).map((src, i) => (
                <div
                  key={src + i}
                  onClick={() => setLightboxIndex(i + 1)}
                  className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-[24px] bg-mist shadow-subtle transition duration-300 hover:shadow-lift"
                >
                  <img
                    src={src}
                    alt={`${project.title} ${i + 2}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 transition group-hover:opacity-100 flex items-center justify-center text-white">
                    <span className="rounded-full bg-black/60 px-4 py-2 text-[13px] font-medium backdrop-blur-md flex items-center gap-2">
                      <Maximize2 size={14} /> View photo {i + 2}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>

      {/* Narrative & Event Highlights */}
      <Container>
        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_360px]">
          <div>
            <h2 className="text-[26px] font-semibold tracking-tight">The Vision & Experience</h2>
            <p className="mt-4 text-[18px] leading-relaxed text-[#3a3a3c] whitespace-pre-line font-normal">
              {project.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>

            {/* Creative Team & Vendor Credits */}
            <div className="mt-14 rounded-3xl border border-black/[0.06] bg-[#fbfbfd] p-7">
              <h3 className="flex items-center gap-2 text-[18px] font-semibold tracking-tight">
                <Sparkles size={18} className="text-amber" /> Creative Team & Vendor Credits
              </h3>
              <p className="mt-1 text-[13px] text-graphite">
                Every extraordinary celebration is crafted by a dedicated collective of artists and artisans.
              </p>
              <div className="mt-5 divide-y divide-black/[0.06]">
                {vendorCredits.map((v) => (
                  <div key={v.role} className="flex items-center justify-between py-3 text-[14px]">
                    <span className="text-graphite">{v.role}</span>
                    <span className="font-medium text-ink flex items-center gap-1.5">
                      {v.name}
                      {v.isPlanner && <Verified size={14} />}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Event Sidebar Details */}
          <aside className="space-y-6">
            <div className="rounded-3xl bg-mist p-6 shadow-subtle">
              <h3 className="text-[16px] font-semibold tracking-tight mb-4 text-ink">Event Highlights</h3>
              <dl className="space-y-4 text-[14px]">
                <Row icon={<MapPin size={16} />} k="Location" v={project.location} />
                <Row icon={<CalendarDays size={16} />} k="Date" v={project.date} />
                <Row icon={<Users size={16} />} k="Guest Count" v={`${project.guests} attendees`} />
                <Row icon={<Heart size={16} />} k="Community Appreciations" v={compact(likes)} />
                <Row icon={<Eye size={16} />} k="Portfolio Impressions" v={compact(project.views)} />
              </dl>
            </div>

            {/* Inquire Card */}
            {!mine && (
              <div className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-float">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar user={planner} size={48} />
                  <div>
                    <p className="font-semibold text-[15px]">{planner.business}</p>
                    <p className="text-[13px] text-graphite">Curated by {planner.name}</p>
                  </div>
                </div>
                <p className="text-[13px] text-graphite leading-relaxed mb-5">
                  Interested in an event with this aesthetic or scale? Direct inquiry messages go straight to the planner.
                </p>
                <ContactButton
                  other={planner}
                  projectId={project.id}
                  className="w-full"
                  label="Inquire about this style"
                  draft={`Hi ${planner.name.split(' ')[0]}, I was inspired by your work on “${project.title}”. Could we schedule a conversation about my event?`}
                />
              </div>
            )}
          </aside>
        </div>

        {/* More from Planner */}
        {more.length > 0 && (
          <section className="mt-24 border-t border-black/[0.06] pt-14">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-[28px] font-semibold tracking-tight">More by {planner.business}</h2>
                <p className="mt-1 text-[15px] text-graphite">Explore more portfolios from this verified planner.</p>
              </div>
              <Link to={`/planner/${planner.id}`} className="text-[15px] font-medium text-azure hover:underline">
                View full profile →
              </Link>
            </div>
            <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p) => (
                <ProjectCard key={p.id} project={p} showPlanner={false} />
              ))}
            </div>
          </section>
        )}
      </Container>

      {/* High Resolution Lightbox */}
      <LightboxModal
        open={lightboxIndex !== null}
        index={lightboxIndex ?? 0}
        images={project.images}
        onIndexChange={(i) => setLightboxIndex(i)}
        onClose={() => setLightboxIndex(null)}
        title={project.title}
      />
    </>
  )
}

function Row({ icon, k, v }: { icon: React.ReactNode; k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-2 text-graphite font-normal">
        <span className="text-silver">{icon}</span>
        {k}
      </dt>
      <dd className="text-right font-medium text-ink">{v}</dd>
    </div>
  )
}

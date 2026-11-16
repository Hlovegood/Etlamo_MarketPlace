import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, Eye, Heart, ImageOff, MapPin, Search, Share, Trash2, Users } from 'lucide-react'
import { Link, navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { CATEGORIES } from '../lib/seed'
import { compact, cx } from '../lib/format'
import { ProjectCard } from '../components/cards'
import { ContactButton } from '../components/Contact'
import { Avatar, Button, Chip, Container, Empty, PageHeader, Segmented, Verified, useToast } from '../components/ui'

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
      <PageHeader title="Explore" sub="Real events from verified planners. Find a style you love, then meet the person behind it." />
      <div className="sticky top-14 z-30 -mx-5 mb-8 flex flex-col gap-3 border-b border-black/[0.05] bg-white/80 px-5 py-3 backdrop-blur-xl md:-mx-8 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none]">
          {['All', ...CATEGORIES].map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
              {c}
            </Chip>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64 md:flex-none">
            <Search size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-silver" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search venues, styles, cities" className="h-9 w-full rounded-[10px] bg-mist pr-3 pl-9 text-[14px] placeholder:text-silver focus:ring-4 focus:ring-azure/15" />
          </div>
          <Segmented value={sort} onChange={setSort} options={[{ value: 'popular', label: 'Popular' }, { value: 'recent', label: 'Newest' }]} />
        </div>
      </div>
      {list.length ? (
        <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <Empty icon={<ImageOff size={24} />} title="Nothing matches yet" body="Try a different category or search term." action={<Button variant="secondary" onClick={() => { setCat('All'); setQ('') }}>Clear filters</Button>} />
      )}
    </Container>
  )
}

export function ProjectDetail({ id }: { id: string }) {
  const { db, getUser, me, toggleLike, viewProject, deleteProject, isPlannerVisible } = useStore()
  const toast = useToast()
  const project = db.projects.find((p) => p.id === id)
  const planner = project && getUser(project.plannerId)

  useEffect(() => {
    if (project && me?.id !== project.plannerId) viewProject(project.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (!project || !planner || !isPlannerVisible(planner.id))
    return (
      <Container className="py-24">
        <Empty icon={<ImageOff size={24} />} title="Project not found" body="It may have been removed by the planner." action={<Button onClick={() => navigate('/explore')}>Back to Explore</Button>} />
      </Container>
    )

  const liked = !!me && project.likedBy.includes(me.id)
  const likes = project.baseLikes + project.likedBy.length
  const more = db.projects.filter((p) => p.plannerId === planner.id && p.id !== project.id).slice(0, 3)
  const mine = me?.id === planner.id

  const like = () => {
    if (!me) return navigate(`/signup?next=${encodeURIComponent(`/project/${project.id}`)}`)
    toggleLike(project.id)
    if (!liked) toast('Appreciated')
  }

  return (
    <>
      <Container>
        <button onClick={() => history.back()} className="mt-6 flex cursor-pointer items-center gap-0.5 text-[15px] text-link hover:underline">
          <ChevronLeft size={17} /> Back
        </button>
        <div className="flex flex-col gap-6 pt-6 pb-10 md:flex-row md:items-end md:justify-between">
          <div className="animate-rise">
            <p className="text-[15px] font-semibold text-amber">{project.category}</p>
            <h1 className="mt-1 max-w-3xl text-[36px] leading-[1.05] font-semibold tracking-[-0.03em] md:text-[56px]">{project.title}</h1>
            <Link to={`/planner/${planner.id}`} className="mt-5 inline-flex items-center gap-2.5">
              <Avatar user={planner} size={36} />
              <span>
                <span className="flex items-center gap-1 text-[15px] font-semibold">
                  {planner.business} {planner.verification === 'verified' && <Verified size={15} />}
                </span>
                <span className="block text-[13px] text-graphite">{planner.name}</span>
              </span>
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {mine ? (
              <Button
                variant="danger"
                onClick={() => {
                  if (confirm('Delete this project from your portfolio?')) {
                    deleteProject(project.id)
                    toast('Project deleted')
                    navigate('/dashboard')
                  }
                }}
              >
                <Trash2 size={15} /> Delete
              </Button>
            ) : (
              <Button variant={liked ? 'dark' : 'secondary'} onClick={like}>
                <Heart size={16} className={liked ? 'fill-[#ff375f] text-[#ff375f]' : ''} /> {liked ? 'Appreciated' : 'Appreciate'}
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href)
                toast('Link copied')
              }}
            >
              <Share size={15} /> Share
            </Button>
            {!mine && <ContactButton other={planner} projectId={project.id} draft={`Hi ${planner.name.split(' ')[0]}, I love “${project.title}”. I’m planning an event and would love to talk about working together.`} />}
          </div>
        </div>
      </Container>

      <Container className="max-w-[1320px]">
        <div className="space-y-4">
          {project.images.map((src, i) => (
            <img key={src + i} src={src} alt={`${project.title} ${i + 1}`} className={cx('w-full animate-rise rounded-[28px] bg-mist object-cover', i === 0 ? 'aspect-[16/10]' : 'aspect-[16/9]')} />
          ))}
        </div>
      </Container>

      <Container>
        <div className="mt-14 grid gap-12 md:grid-cols-[1fr_320px]">
          <div>
            <h2 className="text-[24px] font-semibold tracking-tight">About this event</h2>
            <p className="mt-4 text-[19px] leading-relaxed text-[#424245]">{project.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </div>
          <aside className="h-fit rounded-3xl bg-mist p-6">
            <dl className="space-y-4 text-[15px]">
              <Row icon={<MapPin size={16} />} k="Location" v={project.location} />
              <Row icon={<CalendarDays size={16} />} k="Date" v={project.date} />
              <Row icon={<Users size={16} />} k="Guests" v={String(project.guests)} />
              <Row icon={<Heart size={16} />} k="Appreciations" v={compact(likes)} />
              <Row icon={<Eye size={16} />} k="Views" v={compact(project.views)} />
            </dl>
          </aside>
        </div>

        {more.length > 0 && (
          <section className="mt-20">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-[28px] font-semibold tracking-tight">More from {planner.business}</h2>
              <Link to={`/planner/${planner.id}`} className="text-[15px] text-link hover:underline">
                View profile
              </Link>
            </div>
            <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p) => (
                <ProjectCard key={p.id} project={p} showPlanner={false} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  )
}

function Row({ icon, k, v }: { icon: React.ReactNode; k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-2 text-graphite">
        {icon}
        {k}
      </dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  )
}

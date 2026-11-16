import { useMemo, useState } from 'react'
import { Briefcase, Clock, Globe, MapPin, Plus, Search, ShieldAlert, UserX } from 'lucide-react'
import { navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { SPECIALTIES } from '../lib/seed'
import { compact } from '../lib/format'
import { PlannerCard, ProjectCard } from '../components/cards'
import { ContactButton } from '../components/Contact'
import { Avatar, Button, Chip, Container, Empty, PageHeader, Verified } from '../components/ui'

export function Planners() {
  const { db } = useStore()
  const [spec, setSpec] = useState('All')
  const [q, setQ] = useState('')
  const list = useMemo(
    () =>
      db.users
        .filter((u) => u.role === 'planner' && u.verification === 'verified')
        .filter((u) => spec === 'All' || u.specialties?.includes(spec))
        .filter((u) => !q.trim() || [u.name, u.business, u.location, u.bio].join(' ').toLowerCase().includes(q.trim().toLowerCase())),
    [db.users, spec, q],
  )
  return (
    <Container>
      <PageHeader
        title="Planners"
        sub="Every planner here has passed identity, business and reference checks."
        right={
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-silver" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name or city" className="h-11 w-full rounded-full bg-mist pr-4 pl-10 text-[15px] placeholder:text-silver focus:ring-4 focus:ring-azure/15" />
          </div>
        }
      />
      <div className="-mx-1 mb-8 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        {['All', ...SPECIALTIES].map((s) => (
          <Chip key={s} active={spec === s} onClick={() => setSpec(s)}>
            {s}
          </Chip>
        ))}
      </div>
      {list.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <PlannerCard key={p.id} planner={p} />
          ))}
        </div>
      ) : (
        <Empty icon={<UserX size={24} />} title="No planners found" body="Try another specialty or search." />
      )}
    </Container>
  )
}

export function PlannerProfile({ id }: { id: string }) {
  const { db, getUser, me } = useStore()
  const planner = getUser(id)
  const isMe = me?.id === id
  if (!planner || planner.role !== 'planner' || (planner.verification !== 'verified' && !isMe && me?.role !== 'admin'))
    return (
      <Container className="py-24">
        <Empty icon={<UserX size={24} />} title="Planner not available" body="This profile isn’t public yet." action={<Button onClick={() => navigate('/planners')}>Browse planners</Button>} />
      </Container>
    )

  const projects = db.projects.filter((p) => p.plannerId === id)
  const appreciations = projects.reduce((s, p) => s + p.baseLikes + p.likedBy.length, 0)
  const views = projects.reduce((s, p) => s + p.views, 0)
  const cover = projects[0]?.images[0]

  return (
    <>
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#e8e8ed] to-[#d2d2d7] md:h-80">
        {cover && <img src={cover} alt="" className="h-full w-full scale-105 object-cover blur-[2px]" />}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
      </div>
      <Container>
        {isMe && planner.verification !== 'verified' && (
          <div className="relative z-10 -mt-10 mb-4 flex items-center gap-3 rounded-2xl bg-[#fff4e5] px-5 py-4 text-[14px] text-[#7a4100]">
            <ShieldAlert size={18} className="shrink-0" />
            <span className="flex-1">Only you can see this profile. It goes public once you’re verified.</span>
            <Button size="sm" variant="dark" onClick={() => navigate('/verify')}>
              {planner.verification === 'pending' ? 'View status' : 'Get verified'}
            </Button>
          </div>
        )}
        <div className="relative -mt-16 flex flex-col gap-6 md:-mt-20 md:flex-row md:items-end md:justify-between">
          <div className="animate-rise">
            <Avatar user={planner} size={120} className="ring-[6px] ring-white" />
            <h1 className="mt-5 flex items-center gap-2 text-[36px] leading-tight font-semibold tracking-[-0.03em] md:text-[48px]">
              {planner.business || planner.name}
              {planner.verification === 'verified' && <Verified size={30} />}
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px] text-graphite">
              <span>{planner.name}</span>
              {planner.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {planner.location}
                </span>
              )}
              {planner.website && (
                <span className="flex items-center gap-1">
                  <Globe size={14} /> {planner.website}
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            {isMe ? (
              <Button onClick={() => navigate('/portfolio/new')}>
                <Plus size={16} /> Add project
              </Button>
            ) : (
              <ContactButton other={planner} size="lg" />
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-[320px_1fr]">
          <aside className="space-y-6">
            <div className="grid grid-cols-3 gap-2 rounded-3xl bg-mist p-5 text-center">
              <Stat n={String(projects.length)} l="Projects" />
              <Stat n={compact(appreciations)} l="Appreciations" />
              <Stat n={compact(views)} l="Views" />
            </div>
            {planner.bio && <p className="text-[17px] leading-relaxed text-[#424245]">{planner.bio}</p>}
            <dl className="space-y-3 text-[15px]">
              {planner.yearsExp ? (
                <div className="flex items-center gap-2 text-graphite">
                  <Clock size={16} /> {planner.yearsExp} years planning events
                </div>
              ) : null}
              {planner.priceFrom ? (
                <div className="flex items-center gap-2 text-graphite">
                  <Briefcase size={16} /> Packages from ${planner.priceFrom.toLocaleString()}
                </div>
              ) : null}
            </dl>
            {!!planner.specialties?.length && (
              <div>
                <p className="mb-2 text-[13px] font-semibold text-graphite">Specialties</p>
                <div className="flex flex-wrap gap-1.5">
                  {planner.specialties.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </div>
            )}
          </aside>
          <div>
            <h2 className="mb-6 text-[24px] font-semibold tracking-tight">Portfolio</h2>
            {projects.length ? (
              <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2">
                {projects.map((p) => (
                  <ProjectCard key={p.id} project={p} showPlanner={false} />
                ))}
              </div>
            ) : (
              <Empty
                icon={<Plus size={24} />}
                title="No projects yet"
                body={isMe ? 'Add your first event to start building your portfolio.' : 'This planner hasn’t published any work yet.'}
                action={isMe && <Button onClick={() => navigate('/portfolio/new')}>Add a project</Button>}
              />
            )}
          </div>
        </div>
      </Container>
    </>
  )
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <p className="text-[22px] font-semibold tracking-tight">{n}</p>
      <p className="text-[11px] text-graphite">{l}</p>
    </div>
  )
}

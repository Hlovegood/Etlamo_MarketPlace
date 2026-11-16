import { Heart, Eye, MapPin, Users, CalendarDays, Wallet, MessageCircle } from 'lucide-react'
import { Link } from '../lib/router'
import { useStore } from '../lib/store'
import { compact, eventDate, publicName, timeAgo } from '../lib/format'
import type { EventRequest, Project, User } from '../lib/types'
import { Avatar, Verified } from './ui'

export function ProjectCard({ project, showPlanner = true }: { project: Project; showPlanner?: boolean }) {
  const { getUser, me } = useStore()
  const planner = getUser(project.plannerId)
  const likes = project.baseLikes + project.likedBy.length
  const liked = !!me && project.likedBy.includes(me.id)
  return (
    <article className="group animate-rise">
      <Link to={`/project/${project.id}`} className="relative block overflow-hidden rounded-[22px] bg-mist">
        <img
          src={project.images[0]}
          alt={project.title}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-[17px] font-semibold text-white">{project.title}</p>
          <p className="mt-0.5 text-[13px] text-white/80">
            {project.location} · {project.guests} guests
          </p>
        </div>
        <span className="absolute top-3 left-3 rounded-full bg-white/85 px-2.5 py-1 text-[12px] font-medium text-ink backdrop-blur-md">
          {project.category}
        </span>
      </Link>
      <div className="mt-3 flex items-center justify-between gap-3 px-1">
        {showPlanner && planner ? (
          <Link to={`/planner/${planner.id}`} className="flex min-w-0 items-center gap-2">
            <Avatar user={planner} size={24} />
            <span className="truncate text-[14px] font-medium hover:underline">{planner.business ?? planner.name}</span>
            {planner.verification === 'verified' && <Verified size={15} />}
          </Link>
        ) : (
          <span className="truncate text-[14px] font-medium">{project.title}</span>
        )}
        <div className="flex shrink-0 items-center gap-3 text-[13px] text-silver">
          <span className={`flex items-center gap-1 ${liked ? 'text-[#ff375f]' : ''}`}>
            <Heart size={13} className={liked ? 'fill-current' : ''} />
            {compact(likes)}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={13} />
            {compact(project.views)}
          </span>
        </div>
      </div>
    </article>
  )
}

export function RequestCard({ request }: { request: EventRequest }) {
  const { getUser, db, me } = useStore()
  const client = getUser(request.clientId)
  const responses = db.threads.filter((t) => t.requestId === request.id).length
  const contacted = me?.role === 'planner' && db.threads.some((t) => t.requestId === request.id && t.plannerId === me.id)
  return (
    <Link
      to={`/request/${request.id}`}
      className="group flex animate-rise flex-col rounded-[22px] border border-black/[0.06] bg-white p-6 transition duration-300 hover:-translate-y-0.5 hover:shadow-float"
    >
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-mist px-2.5 py-1 text-[12px] font-medium">{request.type}</span>
        <span className="text-[12px] text-silver">{timeAgo(request.createdAt)}</span>
      </div>
      <h3 className="mt-4 text-[19px] leading-snug font-semibold tracking-tight group-hover:text-azure">{request.title}</h3>
      <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-graphite">{request.description}</p>
      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[13px] text-graphite">
        <Meta icon={<CalendarDays size={14} />}>{eventDate(request.date)}</Meta>
        <Meta icon={<MapPin size={14} />}>{request.location}</Meta>
        <Meta icon={<Users size={14} />}>{request.guests} guests</Meta>
        <Meta icon={<Wallet size={14} />}>{request.budget}</Meta>
      </dl>
      <div className="mt-6 flex items-center justify-between border-t border-black/[0.06] pt-4">
        <span className="flex items-center gap-2 text-[13px]">
          <Avatar user={client} size={22} />
          {client ? publicName(client.name) : 'Client'}
        </span>
        <span className="flex items-center gap-1 text-[13px] text-silver">
          <MessageCircle size={13} />
          {contacted ? 'You replied' : `${responses} ${responses === 1 ? 'planner' : 'planners'} replied`}
        </span>
      </div>
    </Link>
  )
}

function Meta({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <span className="shrink-0 text-silver">{icon}</span>
      <span className="truncate">{children}</span>
    </div>
  )
}

export function PlannerCard({ planner }: { planner: User }) {
  const { db } = useStore()
  const projects = db.projects.filter((p) => p.plannerId === planner.id)
  // lead with each project's cover, then fill remaining tiles with other gallery shots
  const covers = [...new Set([...projects.map((p) => p.images[0]), ...projects.flatMap((p) => p.images)])].slice(0, 3)
  return (
    <Link
      to={`/planner/${planner.id}`}
      className="group block animate-rise overflow-hidden rounded-[22px] border border-black/[0.06] bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-float"
    >
      <div className="grid h-44 grid-cols-3 gap-0.5 overflow-hidden bg-mist">
        <div className="col-span-2 overflow-hidden">
          {covers[0] && <img src={covers[0]} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
        </div>
        <div className="grid grid-rows-2 gap-0.5">
          {[1, 2].map((i) => (
            <div key={i} className="overflow-hidden bg-[#ececf0]">
              {covers[i] && <img src={covers[i]} alt="" loading="lazy" className="h-full w-full object-cover" />}
            </div>
          ))}
        </div>
      </div>
      <div className="relative px-5 pt-9 pb-5">
        <Avatar user={planner} size={56} className="absolute -top-7 left-5 ring-4 ring-white" />
        <div className="flex items-center gap-1.5">
          <h3 className="text-[17px] font-semibold tracking-tight">{planner.business}</h3>
          {planner.verification === 'verified' && <Verified />}
        </div>
        <p className="text-[14px] text-graphite">
          {planner.name} · {planner.location}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(planner.specialties ?? []).slice(0, 2).map((s) => (
            <span key={s} className="rounded-full bg-mist px-2.5 py-1 text-[12px] text-graphite">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-[13px] text-graphite">
          <span>
            {projects.length} projects · {planner.yearsExp ?? 0} yrs
          </span>
          {planner.priceFrom ? <span className="font-medium text-ink">From ${compact(planner.priceFrom)}</span> : null}
        </div>
      </div>
    </Link>
  )
}

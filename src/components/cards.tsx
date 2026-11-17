import { Heart, Eye, MapPin, Users, CalendarDays, Wallet, MessageCircle } from 'lucide-react'
import { Link } from '../lib/router'
import { useStore } from '../lib/store'
import { useI18n } from '../lib/i18n'
import { compact, eventDate, publicName, timeAgo } from '../lib/format'
import type { EventRequest, Project, User } from '../lib/types'
import { Avatar, Verified } from './ui'
import { SpotlightCard } from './animations/SpotlightCard'

export function ProjectCard({ project, showPlanner = true }: { project: Project; showPlanner?: boolean }) {
  const { getUser, me } = useStore()
  const { t, isRtl } = useI18n()
  const planner = getUser(project.plannerId)
  const likes = project.baseLikes + project.likedBy.length
  const liked = !!me && project.likedBy.includes(me.id)

  return (
    <article className="group animate-rise">
      <SpotlightCard className="overflow-hidden rounded-[24px] border-card-border bg-card transition-all duration-300 hover:shadow-float">
        <Link to={`/project/${project.id}`} className="relative block overflow-hidden bg-mist">
          <img
            src={project.images[0]}
            alt={project.title}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
          <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 text-white">
            <p className="text-[17px] font-semibold text-white drop-shadow-sm">{project.title}</p>
            <p className="mt-0.5 text-[13px] text-white/85">
              {project.location} · {project.guests} {isRtl ? 'ضيف' : 'guests'}
            </p>
          </div>
          <span className="absolute top-3 left-3 rounded-full bg-surface/85 px-2.5 py-1 text-[12px] font-medium text-ink backdrop-blur-md shadow-subtle border border-card-border">
            {project.category}
          </span>
        </Link>
        <div className="flex items-center justify-between gap-3 p-4">
          {showPlanner && planner ? (
            <Link to={`/planner/${planner.id}`} className="flex min-w-0 items-center gap-2 group/p">
              <Avatar user={planner} size={26} />
              <span className="truncate text-[14px] font-medium text-ink group-hover/p:text-azure transition">
                {planner.business ?? planner.name}
              </span>
              {planner.verification === 'verified' && <Verified size={14} />}
            </Link>
          ) : (
            <span className="truncate text-[14px] font-medium text-ink">{project.title}</span>
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
      </SpotlightCard>
    </article>
  )
}

export function RequestCard({ request }: { request: EventRequest }) {
  const { getUser, db, me } = useStore()
  const { isRtl } = useI18n()
  const client = getUser(request.clientId)
  const responses = db.threads.filter((t) => t.requestId === request.id).length
  const contacted = me?.role === 'planner' && db.threads.some((t) => t.requestId === request.id && t.plannerId === me.id)

  return (
    <SpotlightCard className="group flex animate-rise flex-col rounded-[24px] border border-card-border bg-card p-6 transition duration-300 hover:shadow-float">
      <Link to={`/request/${request.id}`} className="flex flex-col flex-1">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-mist px-3 py-1 text-[12px] font-medium text-ink">{request.type}</span>
          <span className="text-[12px] text-silver">{timeAgo(request.createdAt)}</span>
        </div>
        <h3 className="mt-4 text-[19px] leading-snug font-semibold tracking-tight text-ink group-hover:text-azure transition">
          {request.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-graphite">{request.description}</p>
        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[13px] text-graphite">
          <Meta icon={<CalendarDays size={14} />}>{eventDate(request.date)}</Meta>
          <Meta icon={<MapPin size={14} />}>{request.location}</Meta>
          <Meta icon={<Users size={14} />}>{request.guests} {isRtl ? 'ضيف' : 'guests'}</Meta>
          <Meta icon={<Wallet size={14} />}>{request.budget}</Meta>
        </dl>
        <div className="mt-6 flex items-center justify-between border-t border-card-border pt-4">
          <span className="flex items-center gap-2 text-[13px] text-ink font-medium">
            <Avatar user={client} size={24} />
            {client ? publicName(client.name) : (isRtl ? 'عميل' : 'Client')}
          </span>
          <span className="flex items-center gap-1 text-[13px] text-silver">
            <MessageCircle size={13} />
            {contacted
              ? (isRtl ? 'تم إرسال ردك' : 'You replied')
              : isRtl
                ? `${responses} ${responses === 1 ? 'مخطط تواصل' : 'مخططين تواصلوا'}`
                : `${responses} ${responses === 1 ? 'planner' : 'planners'} replied`}
          </span>
        </div>
      </Link>
    </SpotlightCard>
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
  const { isRtl } = useI18n()
  const projects = db.projects.filter((p) => p.plannerId === planner.id)
  const covers = [...new Set([...projects.map((p) => p.images[0]), ...projects.flatMap((p) => p.images)])].slice(0, 3)

  return (
    <SpotlightCard className="group block animate-rise overflow-hidden rounded-[24px] border border-card-border bg-card transition duration-300 hover:shadow-float">
      <Link to={`/planner/${planner.id}`}>
        <div className="grid h-44 grid-cols-3 gap-0.5 overflow-hidden bg-mist">
          <div className="col-span-2 overflow-hidden">
            {covers[0] && (
              <img
                src={covers[0]}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            )}
          </div>
          <div className="grid grid-rows-2 gap-0.5">
            {[1, 2].map((i) => (
              <div key={i} className="overflow-hidden bg-mist">
                {covers[i] && (
                  <img src={covers[i]} alt="" loading="lazy" className="h-full w-full object-cover" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="relative px-5 pt-10 pb-5">
          <Avatar
            user={planner}
            size={56}
            className="absolute -top-7 ring-4 ring-card shadow-float"
            style={{ [isRtl ? 'right' : 'left']: '1.25rem' } as any}
          />
          <div className="flex items-center gap-1.5">
            <h3 className="text-[17px] font-semibold tracking-tight text-ink group-hover:text-azure transition">
              {planner.business}
            </h3>
            {planner.verification === 'verified' && <Verified size={15} />}
          </div>
          <p className="text-[14px] text-graphite mt-0.5">
            {planner.name} · {planner.location}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(planner.specialties ?? []).slice(0, 2).map((s) => (
              <span key={s} className="rounded-full bg-mist px-2.5 py-1 text-[12px] text-graphite">
                {s}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-[13px] text-graphite border-t border-card-border pt-3">
            <span>
              {projects.length} {isRtl ? 'معارض' : 'projects'} · {planner.yearsExp ?? 0} {isRtl ? 'سنوات' : 'yrs'}
            </span>
            {planner.priceFrom ? (
              <span className="font-semibold text-ink">
                {isRtl ? 'من' : 'From'} ${compact(planner.priceFrom)}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </SpotlightCard>
  )
}

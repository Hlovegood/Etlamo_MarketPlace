import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  Eye,
  MapPin,
  Users,
  CalendarDays,
  Wallet,
  MessageCircle,
  Maximize2,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { Link, navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { useI18n } from '../lib/i18n'
import { compact, eventDate, publicName, timeAgo } from '../lib/format'
import { Avatar, Button, Verified } from './ui'
import { SpotlightCard } from './animations/SpotlightCard'
import { ContactButton } from './Contact'

/**
 * ProjectCard with PODIE Expandable Event Card modal interaction
 * Source: https://podie.dev/components/watermelon--expandable-event-card (MIT License)
 */
export function ProjectCard({ project, showPlanner = true }) {
  const { getUser, me } = useStore()
  const { t, isRtl } = useI18n()
  const planner = getUser(project.plannerId)
  const likes = project.baseLikes + project.likedBy.length
  const liked = !!me && project.likedBy.includes(me.id)

  const [expanded, setExpanded] = useState(false)
  const [activeImgIndex, setActiveImgIndex] = useState(0)

  // Close on Escape key
  useEffect(() => {
    if (!expanded) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setExpanded(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [expanded])

  return (
    <>
      <article className="group animate-rise">
        <SpotlightCard className="overflow-hidden rounded-[24px] border border-card-border/80 bg-card transition-all duration-300 hover:shadow-float">
          <div className="relative block overflow-hidden bg-mist">
            <Link to={`/project/${project.id}`}>
              <img
                src={project.images[0]}
                alt={project.title}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
              />
            </Link>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            
            <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 text-white">
              <p className="text-[17px] font-semibold text-white drop-shadow-sm">{project.title}</p>
              <p className="mt-0.5 text-[13px] text-white/85">
                {project.location} · {project.guests} {isRtl ? 'ضيف' : 'guests'}
              </p>
            </div>

            {/* Category Pill */}
            <span className="absolute top-3 left-3 rounded-full bg-surface/85 px-3 py-1 text-[12px] font-medium text-ink backdrop-blur-md shadow-subtle border border-card-border">
              {project.category}
            </span>

            {/* PODIE Quick Expand Trigger */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setExpanded(true)
              }}
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface/85 text-ink backdrop-blur-md shadow-subtle border border-card-border opacity-0 group-hover:opacity-100 transition duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              title={t('quick_preview', 'Quick Preview')}
              aria-label={t('quick_preview', 'Quick Preview')}
            >
              <Maximize2 size={13} />
            </button>
          </div>

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

      {/* PODIE Expandable Celebration Modal */}
      <AnimatePresence>
        {expanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Frosted Glass Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpanded(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Expanded Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="relative isolate z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-card-border bg-card shadow-lift"
              style={{
                backdropFilter: 'blur(24px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setExpanded(false)}
                className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-surface/85 text-ink backdrop-blur-md shadow-subtle border border-card-border transition hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Close Preview"
              >
                <X size={16} />
              </button>

              <div className="grid flex-1 overflow-y-auto md:grid-cols-12">
                {/* Main Image & Carousel */}
                <div className="relative flex flex-col bg-mist md:col-span-7">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5">
                    <img
                      src={project.images[activeImgIndex] || project.images[0]}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute top-4 left-4 rounded-full bg-surface/90 px-3 py-1 text-[12px] font-semibold text-ink backdrop-blur-md shadow-subtle">
                      {project.category}
                    </span>
                  </div>

                  {/* Thumbnail Row */}
                  {project.images.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto p-3.5 scrollbar-none">
                      {project.images.map((imgUrl, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImgIndex(i)}
                          className={cx(
                            'relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer',
                            activeImgIndex === i
                              ? 'border-azure scale-102 ring-2 ring-azure/20'
                              : 'border-transparent opacity-70 hover:opacity-100',
                          )}
                        >
                          <img src={imgUrl} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Event Details Panel */}
                <div className="flex flex-col justify-between p-6 md:col-span-5 md:p-8">
                  <div>
                    <h2 className="text-[24px] font-semibold tracking-tight text-ink">
                      {project.title}
                    </h2>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px] text-graphite">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-silver" />
                        {project.location}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1.5">
                        <Users size={14} className="text-silver" />
                        {project.guests} {isRtl ? 'ضيف' : 'guests'}
                      </span>
                    </div>

                    <p className="mt-4 text-[14px] leading-relaxed text-graphite">
                      {project.story || project.description}
                    </p>

                    {/* Vibe Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-medium text-graphite"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Planner Bio Card */}
                    {planner && (
                      <div className="mt-6 rounded-2xl border border-card-border bg-mist/50 p-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar user={planner} size={40} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                              <p className="truncate text-[14px] font-semibold text-ink">
                                {planner.business || planner.name}
                              </p>
                              {planner.verification === 'verified' && <Verified size={13} />}
                            </div>
                            <p className="truncate text-[12px] text-graphite">
                              {planner.location} · {planner.yearsExp ?? 0} {isRtl ? 'سنوات خبرة' : 'yrs experience'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions footer */}
                  <div className="mt-8 flex flex-col gap-2.5 border-t border-card-border pt-4">
                    <Button
                      size="md"
                      onClick={() => {
                        setExpanded(false)
                        navigate(`/project/${project.id}`)
                      }}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      {t('view_full_editorial', 'View Full Celebration')}
                      <ArrowRight size={14} className={isRtl ? 'rotate-180' : ''} />
                    </Button>

                    {planner && (
                      <ContactButton
                        planner={planner}
                        projectId={project.id}
                        label={t('inquire_planner', 'Message this planner')}
                        variant="secondary"
                        className="w-full justify-center"
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export function RequestCard({ request }) {
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

function Meta({ icon, children }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <span className="shrink-0 text-silver">{icon}</span>
      <span className="truncate">{children}</span>
    </div>
  )
}

export function PlannerCard({ planner }) {
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
            className="absolute -top-7 left-5 rtl:left-auto rtl:right-5 ring-4 ring-card shadow-float"
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

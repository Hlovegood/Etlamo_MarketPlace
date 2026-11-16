import { useState } from 'react'
import { ArrowRight, BadgeCheck, Camera, Clock, Eye, FileText, Heart, MessageCircle, Plus, ShieldCheck, Sparkles } from 'lucide-react'
import { Link, navigate } from '../lib/router'
import { greeting, useStore } from '../lib/store'
import { clockTime, compact, cx, eventDate, publicName, readImage } from '../lib/format'
import { PlannerCard, ProjectCard, RequestCard } from '../components/cards'
import { Avatar, Button, Container, Empty, Modal, Verified, useToast } from '../components/ui'

export default function Dashboard() {
  const { me } = useStore()
  const [editing, setEditing] = useState(false)
  if (!me || me.role === 'admin')
    return (
      <Container className="py-24">
        <Empty
          icon={<Sparkles size={24} />}
          title={me ? 'Admins use the review queue' : 'Sign in to see your dashboard'}
          body={me ? 'Planner applications are reviewed from the verification queue.' : 'Your requests, portfolio and conversations live here.'}
          action={<Button onClick={() => navigate(me ? '/admin' : '/signin?next=/dashboard')}>{me ? 'Open review queue' : 'Sign in'}</Button>}
        />
      </Container>
    )
  return (
    <Container>
      <div className="flex flex-col gap-5 pt-12 pb-10 sm:flex-row sm:items-center sm:justify-between md:pt-16">
        <div className="flex animate-rise items-center gap-5">
          <button onClick={() => setEditing(true)} className="group relative cursor-pointer" aria-label="Edit profile">
            <Avatar user={me} size={72} />
            <span className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-graphite shadow-float group-hover:text-azure">
              <Camera size={14} />
            </span>
          </button>
          <div>
            <h1 className="text-[32px] leading-tight font-semibold tracking-[-0.03em] md:text-[44px]">{greeting(me)}</h1>
            <p className="text-[15px] text-graphite">
              {me.role === 'planner' ? (me.business ?? 'Planner') : 'Client'} ·{' '}
              <button onClick={() => setEditing(true)} className="cursor-pointer text-link hover:underline">
                Edit profile
              </button>
            </p>
          </div>
        </div>
      </div>
      {me.role === 'planner' ? <PlannerDash /> : <ClientDash />}
      <EditProfile open={editing} onClose={() => setEditing(false)} />
    </Container>
  )
}

function StatCard({ icon, n, l, to }: { icon: React.ReactNode; n: string | number; l: string; to?: string }) {
  const body = (
    <>
      <span className="text-graphite">{icon}</span>
      <p className="mt-4 text-[32px] leading-none font-semibold tracking-tight">{n}</p>
      <p className="mt-1.5 text-[13px] text-graphite">{l}</p>
    </>
  )
  return to ? (
    <Link to={to} className="rounded-3xl bg-mist p-5 transition hover:bg-[#ececf0]">
      {body}
    </Link>
  ) : (
    <div className="rounded-3xl bg-mist p-5">{body}</div>
  )
}

function Inbox() {
  const { db, me, getUser } = useStore()
  const threads = db.threads.filter((t) => t.clientId === me!.id || t.plannerId === me!.id).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4)
  return (
    <section className="rounded-[28px] border border-black/[0.07] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[20px] font-semibold tracking-tight">Recent messages</h2>
        <Link to="/messages" className="text-[14px] text-link hover:underline">
          See all
        </Link>
      </div>
      {threads.length === 0 ? (
        <p className="py-6 text-center text-[14px] text-graphite">No conversations yet.</p>
      ) : (
        <div className="-mx-2 space-y-1">
          {threads.map((t) => {
            const o = getUser(t.clientId === me!.id ? t.plannerId : t.clientId)!
            const last = db.messages.filter((m) => m.threadId === t.id).at(-1)
            const unread = db.messages.some((m) => m.threadId === t.id && m.senderId !== me!.id && m.createdAt > (t.lastRead[me!.id] ?? 0))
            return (
              <Link key={t.id} to={`/messages/${t.id}`} className="flex items-center gap-3 rounded-2xl px-2 py-2.5 hover:bg-mist">
                <Avatar user={o} size={40} />
                <div className="min-w-0 flex-1">
                  <p className={cx('flex items-center gap-1 text-[14px]', unread ? 'font-semibold' : 'font-medium')}>
                    <span className="truncate">{o.role === 'planner' ? o.business : publicName(o.name)}</span>
                    {o.verification === 'verified' && <Verified size={13} />}
                  </p>
                  <p className="truncate text-[13px] text-graphite">{last?.text}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] text-silver">{last && clockTime(last.createdAt)}</span>
                  {unread && <span className="h-2 w-2 rounded-full bg-azure" />}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}

function ClientDash() {
  const { db, me, unreadCount } = useStore()
  const mine = db.requests.filter((r) => r.clientId === me!.id).sort((a, b) => b.createdAt - a.createdAt)
  const open = mine.filter((r) => r.status === 'open')
  const conversations = db.threads.filter((t) => t.clientId === me!.id).length
  const planners = db.users.filter((u) => u.role === 'planner' && u.verification === 'verified').slice(0, 3)

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={<FileText size={20} />} n={open.length} l="Open requests" to="/requests" />
        <StatCard icon={<MessageCircle size={20} />} n={conversations} l="Planner conversations" to="/messages" />
        <StatCard icon={<Sparkles size={20} />} n={unreadCount} l="Unread" to="/messages" />
        <button onClick={() => navigate('/requests/new')} className="flex cursor-pointer flex-col justify-between rounded-3xl bg-azure p-5 text-left text-white transition hover:bg-azure-deep">
          <Plus size={22} />
          <span>
            <span className="block text-[17px] font-semibold">Post a request</span>
            <span className="text-[13px] text-white/80">Get replies from verified planners</span>
          </span>
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section>
          <h2 className="mb-4 text-[24px] font-semibold tracking-tight">Your requests</h2>
          {mine.length === 0 ? (
            <Empty icon={<FileText size={24} />} title="Tell planners what you need" body="Post your first request. Most clients hear from a planner within hours." action={<Button onClick={() => navigate('/requests/new')}>Post a request</Button>} />
          ) : (
            <div className="space-y-3">
              {mine.map((r) => {
                const n = db.threads.filter((t) => t.requestId === r.id).length
                return (
                  <Link key={r.id} to={`/request/${r.id}`} className="flex items-center gap-4 rounded-3xl border border-black/[0.07] p-5 transition hover:shadow-float">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={cx('h-2 w-2 rounded-full', r.status === 'open' ? 'bg-[#30d158]' : 'bg-silver')} />
                        <span className="text-[12px] text-graphite">
                          {r.status === 'open' ? 'Open' : 'Closed'} · {r.type} · {eventDate(r.date)}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-[17px] font-semibold">{r.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[22px] leading-none font-semibold">{n}</p>
                      <p className="text-[12px] text-graphite">{n === 1 ? 'reply' : 'replies'}</p>
                    </div>
                    <ArrowRight size={16} className="text-silver" />
                  </Link>
                )
              })}
            </div>
          )}
        </section>
        <Inbox />
      </div>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-[24px] font-semibold tracking-tight">Planners you might love</h2>
          <Link to="/planners" className="text-[14px] text-link hover:underline">
            Browse all
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {planners.map((p) => (
            <PlannerCard key={p.id} planner={p} />
          ))}
        </div>
      </section>
    </div>
  )
}

function PlannerDash() {
  const { db, me } = useStore()
  const projects = db.projects.filter((p) => p.plannerId === me!.id)
  const likes = projects.reduce((s, p) => s + p.baseLikes + p.likedBy.length, 0)
  const views = projects.reduce((s, p) => s + p.views, 0)
  const conversations = db.threads.filter((t) => t.plannerId === me!.id).length
  const requests = db.requests.filter((r) => r.status === 'open' && !db.threads.some((t) => t.requestId === r.id && t.plannerId === me!.id)).slice(0, 3)
  const status = me!.verification ?? 'none'

  return (
    <div className="space-y-12">
      {status !== 'verified' && (
        <div className={cx('flex flex-col gap-5 rounded-[28px] p-7 sm:flex-row sm:items-center', status === 'pending' ? 'bg-[#fff4e5]' : 'bg-ink text-white')}>
          <div className={cx('flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl', status === 'pending' ? 'bg-white text-amber' : 'bg-white/10 text-[#2997ff]')}>
            {status === 'pending' ? <Clock size={26} /> : <ShieldCheck size={26} />}
          </div>
          <div className="flex-1">
            <p className="text-[20px] font-semibold tracking-tight">
              {status === 'pending' ? 'Your verification is in review' : status === 'rejected' ? 'Your application needs changes' : 'Finish verification to go live'}
            </p>
            <p className={cx('mt-0.5 text-[15px]', status === 'pending' ? 'text-[#7a4100]' : 'text-[#a1a1a6]')}>
              {status === 'pending'
                ? 'Keep adding projects. They’ll appear in Explore the moment you’re approved.'
                : 'Until you’re verified, your profile is private and you can’t message clients.'}
            </p>
          </div>
          <Button variant={status === 'pending' ? 'dark' : 'secondary'} className={status === 'pending' ? '' : 'bg-white'} onClick={() => navigate('/verify')}>
            {status === 'pending' ? 'View status' : status === 'rejected' ? 'Update application' : 'Start verification'}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={status === 'verified' ? <BadgeCheck size={20} className="text-azure" /> : <ShieldCheck size={20} />} n={status === 'verified' ? 'Verified' : status === 'pending' ? 'In review' : 'Not yet'} l="Verification" to="/verify" />
        <StatCard icon={<Heart size={20} />} n={compact(likes)} l="Appreciations" />
        <StatCard icon={<Eye size={20} />} n={compact(views)} l="Project views" />
        <StatCard icon={<MessageCircle size={20} />} n={conversations} l="Client conversations" to="/messages" />
      </div>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-[24px] font-semibold tracking-tight">Your portfolio</h2>
          <Link to={`/planner/${me!.id}`} className="text-[14px] text-link hover:underline">
            View public profile
          </Link>
        </div>
        <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() => navigate('/portfolio/new')}
            className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-[22px] border-2 border-dashed border-hairline text-graphite transition hover:border-azure hover:text-azure"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mist">
              <Plus size={22} />
            </span>
            <span className="mt-3 text-[15px] font-semibold">Add a project</span>
            <span className="text-[13px]">Show off an event you planned</span>
          </button>
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} showPlanner={false} />
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-[24px] font-semibold tracking-tight">New requests for you</h2>
            <Link to="/requests" className="text-[14px] text-link hover:underline">
              See all
            </Link>
          </div>
          {requests.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {requests.slice(0, 2).map((r) => (
                <RequestCard key={r.id} request={r} />
              ))}
            </div>
          ) : (
            <Empty icon={<FileText size={24} />} title="You’re all caught up" body="You’ve replied to every open request." />
          )}
        </section>
        <Inbox />
      </div>
    </div>
  )
}

function EditProfile({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { me, updateMe } = useStore()
  const toast = useToast()
  const [f, setF] = useState(() => ({ name: me!.name, location: me!.location, bio: me!.bio ?? '', priceFrom: String(me!.priceFrom ?? ''), avatar: me!.avatar }))
  const planner = me!.role === 'planner'
  return (
    <Modal open={open} onClose={onClose}>
      <form
        className="p-7"
        onSubmit={(e) => {
          e.preventDefault()
          updateMe({ name: f.name.trim() || me!.name, location: f.location.trim(), avatar: f.avatar, ...(planner ? { bio: f.bio.trim(), priceFrom: Number(f.priceFrom) || undefined } : {}) })
          toast('Profile updated')
          onClose()
        }}
      >
        <h3 className="text-[24px] font-semibold tracking-tight">Edit profile</h3>
        <div className="mt-6 flex items-center gap-4">
          <Avatar user={{ ...me!, avatar: f.avatar }} size={64} />
          <label className="cursor-pointer text-[15px] text-link hover:underline">
            Change photo
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const data = await readImage(file, 400)
                  setF((x) => ({ ...x, avatar: data }))
                }
              }}
            />
          </label>
        </div>
        <div className="mt-6 space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="field" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          </div>
          <div>
            <label className="label">City</label>
            <input className="field" value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} />
          </div>
          {planner && (
            <>
              <div>
                <label className="label">Bio</label>
                <textarea rows={4} className="field resize-none" value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} />
              </div>
              <div>
                <label className="label">Packages start from (USD)</label>
                <input type="number" className="field" value={f.priceFrom} onChange={(e) => setF({ ...f, priceFrom: e.target.value })} placeholder="5000" />
              </div>
            </>
          )}
        </div>
        <div className="mt-7 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  )
}

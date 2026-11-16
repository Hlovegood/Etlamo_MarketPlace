import { useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, Check, ChevronLeft, Inbox, Lock, MapPin, ShieldCheck, Users, Wallet } from 'lucide-react'
import { Link, navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { BUDGETS, CATEGORIES, NEEDS } from '../lib/seed'
import { clockTime, cx, eventDate, firstName, publicName, timeAgo } from '../lib/format'
import { RequestCard } from '../components/cards'
import { ContactButton } from '../components/Contact'
import { Avatar, Button, Chip, Container, Empty, PageHeader, Segmented, Verified, useToast } from '../components/ui'

export function RequestBoard() {
  const { db, me } = useStore()
  const [type, setType] = useState('All')
  const [scope, setScope] = useState<'open' | 'mine'>('open')
  const list = useMemo(
    () =>
      db.requests
        .filter((r) => (scope === 'mine' ? r.clientId === me?.id : r.status === 'open'))
        .filter((r) => type === 'All' || r.type === type)
        .sort((a, b) => b.createdAt - a.createdAt),
    [db.requests, type, scope, me],
  )
  const plannerLocked = me?.role === 'planner' && me.verification !== 'verified'

  return (
    <Container>
      <PageHeader
        title="Requests"
        sub={me?.role === 'planner' ? 'People planning something right now. Reach out to the ones that fit your work.' : 'Tell planners what you need and let them come to you.'}
        right={
          me?.role === 'client' ? (
            <Button size="lg" onClick={() => navigate('/requests/new')}>
              Post a request
            </Button>
          ) : !me ? (
            <Button size="lg" onClick={() => navigate('/signup?role=client&next=/requests/new')}>
              Post a request
            </Button>
          ) : null
        }
      />
      {plannerLocked && (
        <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-ink p-6 text-white sm:flex-row sm:items-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
            <ShieldCheck size={20} className="text-[#2997ff]" />
          </div>
          <div className="flex-1">
            <p className="text-[17px] font-semibold">{me.verification === 'pending' ? 'Your verification is in review' : 'Get verified to message clients'}</p>
            <p className="text-[14px] text-[#a1a1a6]">You can browse requests now. Replying unlocks once our trust team approves you.</p>
          </div>
          <Button variant="secondary" className="bg-white" onClick={() => navigate('/verify')}>
            {me.verification === 'pending' ? 'View status' : 'Start verification'}
          </Button>
        </div>
      )}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 [scrollbar-width:none]">
          {['All', ...CATEGORIES].map((c) => (
            <Chip key={c} active={type === c} onClick={() => setType(c)}>
              {c}
            </Chip>
          ))}
        </div>
        {me?.role === 'client' && (
          <Segmented value={scope} onChange={setScope} options={[{ value: 'open', label: 'All open' }, { value: 'mine', label: 'My requests' }]} />
        )}
      </div>
      {list.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => (
            <RequestCard key={r.id} request={r} />
          ))}
        </div>
      ) : (
        <Empty
          icon={<Inbox size={24} />}
          title={scope === 'mine' ? 'You haven’t posted yet' : 'No open requests here'}
          body={scope === 'mine' ? 'Post your first request and verified planners will reach out.' : 'Check back soon or try another category.'}
          action={scope === 'mine' && <Button onClick={() => navigate('/requests/new')}>Post a request</Button>}
        />
      )}
    </Container>
  )
}

export function RequestDetail({ id }: { id: string }) {
  const { db, getUser, me, setRequestStatus } = useStore()
  const toast = useToast()
  const req = db.requests.find((r) => r.id === id)
  if (!req)
    return (
      <Container className="py-24">
        <Empty icon={<Inbox size={24} />} title="Request not found" body="It may have been removed." action={<Button onClick={() => navigate('/requests')}>All requests</Button>} />
      </Container>
    )
  const client = getUser(req.clientId)!
  const owner = me?.id === req.clientId
  const threads = db.threads.filter((t) => t.requestId === req.id).sort((a, b) => b.updatedAt - a.updatedAt)

  return (
    <Container className="max-w-[1040px]">
      <Link to="/requests" className="mt-6 inline-flex items-center gap-0.5 text-[15px] text-link hover:underline">
        <ChevronLeft size={17} /> Requests
      </Link>
      <div className="mt-6 grid gap-10 md:grid-cols-[1fr_320px]">
        <div className="animate-rise">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-mist px-2.5 py-1 text-[12px] font-medium">{req.type}</span>
            <span className={cx('rounded-full px-2.5 py-1 text-[12px] font-medium', req.status === 'open' ? 'bg-[#e3f5ea] text-success' : 'bg-mist text-graphite')}>
              {req.status === 'open' ? 'Open' : 'Closed'}
            </span>
            <span className="text-[13px] text-silver">Posted {timeAgo(req.createdAt)}</span>
          </div>
          <h1 className="mt-4 text-[36px] leading-[1.08] font-semibold tracking-[-0.03em] md:text-[48px]">{req.title}</h1>
          <div className="mt-6 flex items-center gap-3">
            <Avatar user={client} size={40} />
            <div>
              <p className="text-[15px] font-semibold">{owner ? 'You' : publicName(client.name)}</p>
              <p className="text-[13px] text-graphite">{client.location || 'Client'}</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Fact icon={<CalendarDays size={18} />} k="Date" v={eventDate(req.date)} />
            <Fact icon={<MapPin size={18} />} k="Location" v={req.location} />
            <Fact icon={<Users size={18} />} k="Guests" v={String(req.guests)} />
            <Fact icon={<Wallet size={18} />} k="Budget" v={req.budget} />
          </div>

          <h2 className="mt-10 text-[20px] font-semibold tracking-tight">What they’re looking for</h2>
          <p className="mt-3 text-[17px] leading-relaxed whitespace-pre-line text-[#424245]">{req.description}</p>
          {req.needs.length > 0 && (
            <>
              <h3 className="mt-8 text-[15px] font-semibold text-graphite">Help needed with</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {req.needs.map((n) => (
                  <Chip key={n}>
                    <Check size={13} /> {n}
                  </Chip>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="h-fit space-y-4 md:sticky md:top-20">
          {owner ? (
            <div className="rounded-3xl bg-mist p-6">
              <p className="text-[17px] font-semibold">Planner responses</p>
              <p className="mt-0.5 text-[13px] text-graphite">{threads.length ? `${threads.length} verified planners reached out.` : 'No responses yet. Planners are usually quick.'}</p>
              <div className="mt-4 space-y-2">
                {threads.map((t) => {
                  const p = getUser(t.plannerId)!
                  const last = db.messages.filter((m) => m.threadId === t.id).at(-1)
                  return (
                    <Link key={t.id} to={`/messages/${t.id}`} className="flex items-center gap-3 rounded-2xl bg-white p-3 transition hover:shadow-float">
                      <Avatar user={p} size={36} />
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1 text-[14px] font-semibold">
                          <span className="truncate">{p.business}</span> <Verified size={13} />
                        </p>
                        <p className="truncate text-[12px] text-graphite">{last?.text}</p>
                      </div>
                      <span className="text-[11px] text-silver">{last && clockTime(last.createdAt)}</span>
                    </Link>
                  )
                })}
              </div>
              <Button
                variant={req.status === 'open' ? 'secondary' : 'primary'}
                className={cx('mt-5 w-full', req.status === 'open' && 'bg-white')}
                onClick={() => {
                  setRequestStatus(req.id, req.status === 'open' ? 'closed' : 'open')
                  toast(req.status === 'open' ? 'Request closed' : 'Request reopened')
                }}
              >
                {req.status === 'open' ? 'Close request' : 'Reopen request'}
              </Button>
            </div>
          ) : me?.role === 'planner' ? (
            <div className="rounded-3xl bg-mist p-6">
              {me.verification === 'verified' ? (
                <>
                  <p className="text-[17px] font-semibold">Interested?</p>
                  <p className="mt-1 text-[14px] text-graphite">Introduce yourself to {firstName(client.name)} and share relevant work.</p>
                  {req.status === 'open' || threads.some((t) => t.plannerId === me.id) ? (
                    <ContactButton
                      other={client}
                      requestId={req.id}
                      className="mt-5 w-full"
                      size="lg"
                      draft={`Hi ${firstName(client.name)}, I read your request for “${req.title}” and would love to help. `}
                    />
                  ) : (
                    <p className="mt-5 text-[14px] font-medium text-graphite">This request is closed.</p>
                  )}
                </>
              ) : (
                <>
                  <Lock size={20} className="text-graphite" />
                  <p className="mt-3 text-[17px] font-semibold">Verify to reply</p>
                  <p className="mt-1 text-[14px] text-graphite">Only verified planners can message clients.</p>
                  <Button className="mt-5 w-full" onClick={() => navigate('/verify')}>
                    {me.verification === 'pending' ? 'View status' : 'Get verified'}
                  </Button>
                </>
              )}
            </div>
          ) : !me ? (
            <div className="rounded-3xl bg-mist p-6">
              <p className="text-[17px] font-semibold">Are you a planner?</p>
              <p className="mt-1 text-[14px] text-graphite">Join and get verified to reply to requests like this one.</p>
              <Button className="mt-5 w-full" onClick={() => navigate(`/signup?role=planner&next=${encodeURIComponent(`/request/${req.id}`)}`)}>
                Join as a planner
              </Button>
              <Link to={`/signup?role=client&next=/requests/new`} className="mt-3 flex items-center justify-center gap-1 text-[14px] text-link hover:underline">
                Planning your own event? <ArrowRight size={14} />
              </Link>
            </div>
          ) : null}
          <p className="px-2 text-[12px] leading-relaxed text-silver">Client contact details are never shared publicly. All conversations happen in Fête Messages.</p>
        </aside>
      </div>
    </Container>
  )
}

function Fact({ icon, k, v }: { icon: React.ReactNode; k: string; v: string }) {
  return (
    <div className="rounded-2xl bg-mist p-4">
      <span className="text-graphite">{icon}</span>
      <p className="mt-3 text-[12px] text-graphite">{k}</p>
      <p className="text-[15px] leading-snug font-semibold">{v}</p>
    </div>
  )
}

export function PostRequest() {
  const { me, postRequest } = useStore()
  const toast = useToast()
  const [f, setF] = useState({ title: '', type: 'Wedding', date: '', location: me?.location ?? '', guests: '', budget: BUDGETS[1], description: '', needs: [] as string[] })
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }))
  const valid = f.title.trim() && f.location.trim() && Number(f.guests) > 0 && f.description.trim().length >= 20

  if (me?.role !== 'client')
    return (
      <Container className="py-24">
        <Empty
          icon={<Lock size={24} />}
          title="Requests are for clients"
          body={me ? 'You’re signed in as a planner. Browse requests to find clients instead.' : 'Create a client account to post your event.'}
          action={<Button onClick={() => navigate(me ? '/requests' : '/signup?role=client&next=/requests/new')}>{me ? 'Browse requests' : 'Create account'}</Button>}
        />
      </Container>
    )

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    const r = postRequest({ ...f, guests: Number(f.guests), title: f.title.trim(), location: f.location.trim(), description: f.description.trim() })
    toast('Request posted. Planners have been notified.')
    navigate(`/request/${r.id}`)
  }

  return (
    <Container className="max-w-[760px]">
      <PageHeader eyebrow="New request" title="What are you planning?" sub="The more detail you share, the better planners can tailor their first message." />
      <form onSubmit={submit} className="space-y-8">
        <div>
          <label className="label">Event type</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Chip key={c} active={f.type === c} onClick={() => set('type', c)}>
                {c}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <label className="label" htmlFor="title">Give it a headline</label>
          <input id="title" className="field" placeholder="e.g. Autumn vineyard wedding for 120 guests" value={f.title} onChange={(e) => set('title', e.target.value)} />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="date">Date</label>
            <input id="date" type="date" className="field" value={f.date} onChange={(e) => set('date', e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="loc">Location</label>
            <input id="loc" className="field" placeholder="City, State" value={f.location} onChange={(e) => set('location', e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="guests">Guests</label>
            <input id="guests" type="number" min={1} className="field" placeholder="100" value={f.guests} onChange={(e) => set('guests', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Budget</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {BUDGETS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => set('budget', b)}
                className={cx('cursor-pointer rounded-xl border px-3 py-3 text-[14px] font-medium transition', f.budget === b ? 'border-azure bg-azure/5 text-azure ring-2 ring-azure/20' : 'border-hairline hover:border-silver')}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">What do you need help with?</label>
          <div className="flex flex-wrap gap-2">
            {NEEDS.map((n) => {
              const on = f.needs.includes(n)
              return (
                <Chip key={n} active={on} onClick={() => set('needs', on ? f.needs.filter((x) => x !== n) : [...f.needs, n])}>
                  {on && <Check size={13} />} {n}
                </Chip>
              )
            })}
          </div>
        </div>
        <div>
          <label className="label" htmlFor="desc">Describe your event</label>
          <textarea id="desc" rows={6} className="field resize-none leading-relaxed" placeholder="The mood, must-haves, venue ideas, anything planners should know…" value={f.description} onChange={(e) => set('description', e.target.value)} />
          <p className="mt-1.5 text-[12px] text-silver">{f.description.trim().length < 20 ? `At least 20 characters (${f.description.trim().length}/20)` : 'Looks good'}</p>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-black/[0.06] pt-6">
          <p className="flex items-center gap-1.5 text-[13px] text-graphite">
            <ShieldCheck size={15} /> Only verified planners can contact you.
          </p>
          <Button size="lg" type="submit" disabled={!valid}>
            Post request
          </Button>
        </div>
      </form>
    </Container>
  )
}

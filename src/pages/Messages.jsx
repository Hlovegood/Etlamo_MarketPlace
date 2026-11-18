import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUp, ChevronLeft, FileText, MessageCircle, Search } from 'lucide-react'
import { Link, navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { useI18n } from '../lib/i18n'
import { clockTime, cx, publicName } from '../lib/format'
import { Avatar, Button, Container, Empty, Verified } from '../components/ui'

export default function Messages({ threadId }) {
  const { db, me, getUser, markRead, sendMessage, typing } = useStore()
  const { t } = useI18n()
  const [q, setQ] = useState('')
  const [text, setText] = useState('')
  const endRef = useRef(null)

  const threads = useMemo(
    () => (me ? db.threads.filter((tItem) => tItem.clientId === me.id || tItem.plannerId === me.id).sort((a, b) => b.updatedAt - a.updatedAt) : []),
    [db.threads, me],
  )
  const active = threads.find((tItem) => tItem.id === threadId)
  const msgs = useMemo(() => db.messages.filter((m) => m.threadId === active?.id), [db.messages, active?.id])

  useEffect(() => {
    if (active) markRead(active.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id, msgs.length])
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [msgs.length, active?.id, typing[active?.id ?? '']])
  useEffect(() => setText(''), [threadId])

  if (!me)
    return (
      <Container className="py-24">
        <Empty icon={<MessageCircle size={24} />} title={t('messages_title', 'Messages')} body={t('no_conversations_yet', 'Your conversations with planners and clients live here.')} action={<Button onClick={() => navigate('/signin?next=/messages')}>{t('nav_signin', 'Sign in')}</Button>} />
      </Container>
    )

  const other = (tItem) => getUser(tItem.clientId === me.id ? tItem.plannerId : tItem.clientId)
  const label = (u) => (u.role === 'planner' ? u.business || u.name : publicName(u.name))
  const filtered = threads.filter((tItem) => !q || label(other(tItem)).toLowerCase().includes(q.toLowerCase()))

  const send = (e) => {
    e.preventDefault()
    if (!active || !text.trim()) return
    sendMessage(active.id, text.trim())
    setText('')
  }

  const peer = active && other(active)
  const req = active?.requestId ? db.requests.find((r) => r.id === active.requestId) : undefined
  const proj = active?.projectId ? db.projects.find((p) => p.id === active.projectId) : undefined

  return (
    <Container className="max-w-[1200px] py-6 md:py-8">
      <div className="flex h-[calc(100vh-8.5rem)] min-h-[520px] overflow-hidden rounded-[28px] border border-black/[0.07] dark:border-card-border bg-white dark:bg-card shadow-float">
        {/* List */}
        <aside className={cx('w-full shrink-0 flex-col border-r rtl:border-r-0 rtl:border-l border-black/[0.07] dark:border-card-border bg-[#fbfbfd] dark:bg-card/60 md:flex md:w-[340px]', active ? 'hidden' : 'flex')}>
          <div className="px-5 pt-5 pb-3">
            <h1 className="text-[28px] font-semibold tracking-tight text-ink">{t('messages_title', 'Messages')}</h1>
            <div className="relative mt-3">
              <Search size={14} className="absolute top-1/2 left-3 rtl:left-auto rtl:right-3 -translate-y-1/2 text-silver" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search_messages', 'Search')} className="h-9 w-full rounded-[10px] bg-[#e8e8ed]/70 dark:bg-card-border/60 text-ink pr-3 pl-8 rtl:pr-8 rtl:pl-3 text-[14px] placeholder:text-silver" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-3">
            {filtered.length === 0 && (
              <p className="px-4 py-10 text-center text-[14px] text-graphite">
                {threads.length ? t('no_conversations_yet', 'No matches.') : me.role === 'client' ? t('no_conversations_yet', 'No conversations yet. Post a request or message a planner.') : t('no_conversations_yet', 'No conversations yet. Reply to a request to start one.')}
              </p>
            )}
            {filtered.map((tItem) => {
              const o = other(tItem)
              const last = db.messages.filter((m) => m.threadId === tItem.id).at(-1)
              const unread = db.messages.some((m) => m.threadId === tItem.id && m.senderId !== me.id && m.createdAt > (tItem.lastRead[me.id] ?? 0))
              const sel = tItem.id === active?.id
              return (
                <Link key={tItem.id} to={`/messages/${tItem.id}`} className={cx('relative flex items-center gap-3 rounded-2xl px-3 py-3 transition', sel ? 'bg-azure text-white' : 'hover:bg-black/[0.04] dark:hover:bg-white/[0.04]')}>
                  {unread && !sel && <span className="absolute left-0.5 rtl:left-auto rtl:right-0.5 h-2.5 w-2.5 rounded-full bg-azure" />}
                  <Avatar user={o} size={44} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className={cx('truncate text-[15px]', unread ? 'font-semibold' : 'font-medium')}>{label(o)}</p>
                      <span className={cx('shrink-0 text-[12px]', sel ? 'text-white/75' : 'text-silver')}>{last && clockTime(last.createdAt)}</span>
                    </div>
                    <p className={cx('truncate text-[13px]', sel ? 'text-white/80' : unread ? 'text-ink' : 'text-graphite')}>
                      {typing[tItem.id] ? t('typing', 'Typing…') : last ? `${last.senderId === me.id ? 'You: ' : ''}${last.text}` : ''}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </aside>

        {/* Conversation */}
        <section className={cx('min-w-0 flex-1 flex-col', active ? 'flex' : 'hidden md:flex')}>
          {active && peer ? (
            <>
              <header className="flex items-center gap-3 border-b border-black/[0.07] dark:border-card-border bg-white/80 dark:bg-card/90 px-4 py-3 backdrop-blur-xl md:px-6">
                <Link to="/messages" className="-ml-1 rtl:-mr-1 rtl:ml-0 flex items-center text-link md:hidden" aria-label="Back">
                  <ChevronLeft size={24} className="rtl:rotate-180" />
                </Link>
                <Avatar user={peer} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 text-[15px] font-semibold text-ink">
                    <span className="truncate">{label(peer)}</span>
                    {peer.verification === 'verified' && <Verified size={14} />}
                  </p>
                  <p className="truncate text-[12px] text-graphite">{peer.role === 'planner' ? `${peer.name} · Planner` : `Client · ${peer.location}`}</p>
                </div>
                {peer.role === 'planner' && (
                  <Button size="sm" variant="secondary" onClick={() => navigate(`/planner/${peer.id}`)}>
                    {t('portfolio_btn', 'Portfolio')}
                  </Button>
                )}
              </header>

              <div className="flex-1 overflow-y-auto px-4 py-5 md:px-8">
                {(req || proj) && (
                  <Link
                    to={req ? `/request/${req.id}` : `/project/${proj.id}`}
                    className="mx-auto mb-6 flex max-w-sm items-center gap-3 rounded-2xl bg-mist dark:bg-surface dark:border dark:border-card-border p-3 transition hover:bg-[#ececf0] dark:hover:bg-card-border/50"
                  >
                    {proj ? (
                      <img src={proj.images[0]} alt="" className="h-11 w-11 rounded-xl object-cover" />
                    ) : (
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-card-border text-graphite">
                        <FileText size={18} />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-graphite">{req ? t('about_request', 'About request') : t('about_project', 'About project')}</p>
                      <p className="truncate text-[14px] font-semibold text-ink">{req?.title ?? proj?.title}</p>
                    </div>
                  </Link>
                )}
                <div className="space-y-1.5">
                  {msgs.map((m, i) => {
                    const mine = m.senderId === me.id
                    const prev = msgs[i - 1]
                    const gap = !prev || m.createdAt - prev.createdAt > 3600_000
                    const tail = !msgs[i + 1] || msgs[i + 1].senderId !== m.senderId
                    return (
                      <div key={m.id}>
                        {gap && <p className="py-3 text-center text-[11px] font-medium text-silver">{new Date(m.createdAt).toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' })}</p>}
                        <div className={cx('flex animate-pop', mine ? 'justify-end' : 'justify-start')}>
                          <p
                            className={cx(
                              'max-w-[78%] px-4 py-2 text-[15px] leading-snug whitespace-pre-wrap md:max-w-[62%]',
                              mine ? 'bg-azure text-white' : 'bg-[#e9e9eb] dark:bg-card-border/70 text-ink',
                              'rounded-[20px]',
                              tail && (mine ? 'rounded-br-md rtl:rounded-br-[20px] rtl:rounded-bl-md' : 'rounded-bl-md rtl:rounded-bl-[20px] rtl:rounded-br-md'),
                            )}
                          >
                            {m.text}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  {typing[active.id] && (
                    <div className="flex">
                      <div className="flex animate-pop items-center gap-1 rounded-[20px] rounded-bl-md bg-[#e9e9eb] dark:bg-card-border/70 px-4 py-3">
                        {[0, 1, 2].map((i) => (
                          <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-silver" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  )}
                  {msgs.length > 0 && msgs.at(-1).senderId === me.id && !typing[active.id] && <p className="pr-1 rtl:pr-0 rtl:pl-1 text-right rtl:text-left text-[11px] text-silver">{t('delivered', 'Delivered')}</p>}
                </div>
                <div ref={endRef} />
              </div>

              <form onSubmit={send} className="flex items-end gap-2 border-t border-black/[0.07] dark:border-card-border px-4 py-3 md:px-6">
                <textarea
                  rows={1}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) send(e)
                  }}
                  placeholder={t('type_message_placeholder', 'Message…')}
                  className="max-h-32 min-h-[38px] flex-1 resize-none rounded-[20px] border border-hairline dark:border-card-border dark:bg-surface px-4 py-2 text-[15px] leading-snug text-ink placeholder:text-silver focus:border-azure"
                />
                <button
                  type="submit"
                  disabled={!text.trim()}
                  aria-label="Send"
                  className="flex h-[38px] w-[38px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-azure text-white transition hover:bg-azure-deep disabled:cursor-default disabled:bg-hairline dark:disabled:bg-card-border"
                >
                  <ArrowUp size={18} strokeWidth={2.5} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mist dark:bg-card-border/60">
                <MessageCircle size={28} className="text-silver" />
              </div>
              <p className="mt-4 text-[17px] font-semibold text-ink">{t('select_conversation', 'Select a conversation')}</p>
              <p className="mt-1 max-w-xs text-[14px] text-graphite">
                {me.role === 'client' ? 'Planners who reply to your requests show up here.' : 'Clients you reach out to show up here.'}
              </p>
            </div>
          )}
        </section>
      </div>
    </Container>
  )
}
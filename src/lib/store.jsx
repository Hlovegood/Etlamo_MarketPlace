import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createSeed } from './seed'
import { firstName, uid } from './format'

const KEY = 'fete-db-v1'
const SESSION = 'fete-session-v1'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* fall through to seed */
  }
  return createSeed()
}

const AUTO_REPLIES = {
  planner: [
    'Thanks for the details! I have availability around that date. Would a quick call this week work for you?',
    'That sounds wonderful. I can put together a mood board and a rough budget breakdown. Any colours or venues you already love?',
    'Great question. Typically my clients book 9–12 months out, so you are right on time.',
  ],
  client: [
    'Thank you for reaching out! Your portfolio is beautiful. What does your process usually look like?',
    'That sounds great. Could you share a rough estimate for something like this?',
    'Love that idea. Are you free for a call on Thursday afternoon?',
  ],
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [db, setDb] = useState(load)
  const [meId, setMeId] = useState(() => localStorage.getItem(SESSION))
  const [typing, setTyping] = useState({})
  const dbRef = useRef(db)
  dbRef.current = db

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(db))
    } catch {
      /* storage full: keep working in memory */
    }
  }, [db])

  useEffect(() => {
    if (meId) localStorage.setItem(SESSION, meId)
    else localStorage.removeItem(SESSION)
  }, [meId])

  const me = useMemo(() => db.users.find((u) => u.id === meId) ?? null, [db.users, meId])
  const getUser = useCallback((id) => db.users.find((u) => u.id === id), [db.users])

  const patchUser = (id, patch) =>
    setDb((d) => ({ ...d, users: d.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) }))

  const scheduleAutoReply = (threadId, fromId) => {
    const sender = dbRef.current.users.find((u) => u.id === fromId)
    if (!sender?.demoPersona) return
    const pool = sender.role === 'planner' ? AUTO_REPLIES.planner : AUTO_REPLIES.client
    const count = dbRef.current.messages.filter((m) => m.threadId === threadId && m.senderId === fromId).length
    setTimeout(() => setTyping((t) => ({ ...t, [threadId]: true })), 900)
    setTimeout(() => {
      setTyping((t) => ({ ...t, [threadId]: false }))
      const at = Date.now()
      setDb((d) => ({
        ...d,
        messages: [...d.messages, { id: uid('m'), threadId, senderId: fromId, text: pool[count % pool.length], createdAt: at }],
        threads: d.threads.map((t) => (t.id === threadId ? { ...t, updatedAt: at } : t)),
      }))
    }, 3200)
  }

  const store = {
    db,
    me,
    typing,
    getUser,
    signUp: ({ role, name, email, password, business, location }) => {
      const e = email.trim().toLowerCase()
      if (db.users.some((u) => u.email === e)) return 'An account with this email already exists.'
      const user = {
        id: uid(role === 'planner' ? 'pl' : 'cl'),
        role,
        name: name.trim(),
        email: e,
        password,
        location: location?.trim() || '',
        createdAt: Date.now(),
        ...(role === 'planner' ? { business: business?.trim(), verification: 'none', specialties: [] } : {}),
      }
      setDb((d) => ({ ...d, users: [...d.users, user] }))
      setMeId(user.id)
      return user
    },
    signIn: (email, password) => {
      const user = db.users.find((u) => u.email === email.trim().toLowerCase())
      if (!user || user.password !== password) return 'That email and password don’t match.'
      setMeId(user.id)
      return user
    },
    signInAs: (id) => setMeId(id),
    signOut: () => setMeId(null),
    updateMe: (patch) => me && patchUser(me.id, patch),
    submitVerification: (app) => {
      if (!me) return
      patchUser(me.id, {
        verification: 'pending',
        application: { ...app, submittedAt: Date.now() },
        business: app.business,
        location: app.location,
        yearsExp: app.yearsExp,
        specialties: app.specialties,
        website: app.website,
        bio: app.bio,
      })
    },
    reviewVerification: (userId, approve, reason) => {
      const u = db.users.find((x) => x.id === userId)
      if (!u?.application) return
      patchUser(userId, {
        verification: approve ? 'verified' : 'rejected',
        application: { ...u.application, reviewedAt: Date.now(), rejectionReason: approve ? undefined : reason },
      })
    },
    addProject: (p) => {
      const project = {
        ...p,
        id: uid('p'),
        plannerId: me.id,
        likedBy: [],
        baseLikes: 0,
        views: 0,
        createdAt: Date.now(),
      }
      setDb((d) => ({ ...d, projects: [project, ...d.projects] }))
      return project
    },
    deleteProject: (id) => setDb((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) })),
    toggleLike: (projectId) => {
      if (!me) return
      setDb((d) => ({
        ...d,
        projects: d.projects.map((p) =>
          p.id !== projectId
            ? p
            : { ...p, likedBy: p.likedBy.includes(me.id) ? p.likedBy.filter((x) => x !== me.id) : [...p.likedBy, me.id] },
        ),
      }))
    },
    viewProject: (projectId) =>
      setDb((d) => ({ ...d, projects: d.projects.map((p) => (p.id === projectId ? { ...p, views: p.views + 1 } : p)) })),
    postRequest: (r) => {
      const req = { ...r, id: uid('r'), clientId: me.id, status: 'open', createdAt: Date.now() }
      setDb((d) => ({ ...d, requests: [req, ...d.requests] }))
      return req
    },
    setRequestStatus: (id, status) =>
      setDb((d) => ({ ...d, requests: d.requests.map((r) => (r.id === id ? { ...r, status } : r)) })),
    openThread: ({ otherId, requestId, projectId, text }) => {
      const clientId = me.role === 'client' ? me.id : otherId
      const plannerId = me.role === 'planner' ? me.id : otherId
      const at = Date.now()
      let thread = db.threads.find(
        (t) => t.clientId === clientId && t.plannerId === plannerId && (requestId ? t.requestId === requestId : true),
      )
      const threadId = thread?.id ?? uid('t')
      if (!thread) {
        thread = { id: threadId, clientId, plannerId, requestId, projectId, updatedAt: at, lastRead: { [me.id]: at } }
      }
      const t = thread
      setDb((d) => ({
        ...d,
        threads: [{ ...t, updatedAt: at, lastRead: { ...t.lastRead, [me.id]: at } }, ...d.threads.filter((x) => x.id !== threadId)],
        messages: [...d.messages, { id: uid('m'), threadId, senderId: me.id, text, createdAt: at }],
      }))
      scheduleAutoReply(threadId, otherId)
      return threadId
    },
    sendMessage: (threadId, text) => {
      const t = db.threads.find((x) => x.id === threadId)
      if (!t || !me) return
      const at = Date.now()
      setDb((d) => ({
        ...d,
        messages: [...d.messages, { id: uid('m'), threadId, senderId: me.id, text, createdAt: at }],
        threads: d.threads.map((x) => (x.id === threadId ? { ...x, updatedAt: at, lastRead: { ...x.lastRead, [me.id]: at } } : x)),
      }))
      scheduleAutoReply(threadId, me.id === t.clientId ? t.plannerId : t.clientId)
    },
    markRead: (threadId) => {
      if (!me) return
      setDb((d) => {
        const t = d.threads.find((x) => x.id === threadId)
        if (!t || (t.lastRead[me.id] ?? 0) >= t.updatedAt) return d
        return { ...d, threads: d.threads.map((x) => (x.id === threadId ? { ...x, lastRead: { ...x.lastRead, [me.id]: Date.now() } } : x)) }
      })
    },
    unreadCount: me
      ? db.threads.filter(
          (t) =>
            (t.clientId === me.id || t.plannerId === me.id) &&
            db.messages.some((m) => m.threadId === t.id && m.senderId !== me.id && m.createdAt > (t.lastRead[me.id] ?? 0)),
        ).length
      : 0,
    isPlannerVisible: (plannerId) => {
      const p = db.users.find((u) => u.id === plannerId)
      return p?.verification === 'verified' || plannerId === me?.id || me?.role === 'admin'
    },
    resetDemo: () => {
      setDb(createSeed())
      setMeId(null)
    },
  }

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore outside provider')
  return s
}

export function greeting(user) {
  const h = new Date().getHours()
  return `${h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'}, ${firstName(user.name)}`
}

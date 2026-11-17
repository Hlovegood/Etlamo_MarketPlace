import { useEffect } from 'react'
import { match, useRoute } from './lib/router'
import { StoreProvider } from './lib/store'
import { Footer, Nav, PersonaSwitcher } from './components/Shell'
import { ToastProvider } from './components/ui'
import Home from './pages/Home'
import { Explore, ProjectDetail } from './pages/Explore'
import { PlannerProfile, Planners } from './pages/Planners'
import { PostRequest, RequestBoard, RequestDetail } from './pages/Requests'
import Messages from './pages/Messages'
import { SignIn, SignUp } from './pages/Auth'
import { Admin, Verify } from './pages/Verify'
import Dashboard from './pages/Dashboard'
import NewProject from './pages/NewProject'

function Routes({ path, query }: { path: string; query: URLSearchParams }) {
  let p: Record<string, string> | null
  if (path === '/') return <Home />
  if (path === '/explore') return <Explore />
  if ((p = match('/project/:id', path))) return <ProjectDetail key={p.id} id={p.id} />
  if (path === '/planners') return <Planners />
  if ((p = match('/planner/:id', path))) return <PlannerProfile key={p.id} id={p.id} />
  if (path === '/requests') return <RequestBoard />
  if (path === '/requests/new') return <PostRequest />
  if ((p = match('/request/:id', path))) return <RequestDetail id={p.id} />
  if (path === '/messages') return <Messages />
  if ((p = match('/messages/:id', path))) return <Messages threadId={p.id} />
  if (path === '/signup') return <SignUp key={query.toString()} query={query} />
  if (path === '/signin') return <SignIn query={query} />
  if (path === '/verify') return <Verify />
  if (path === '/admin') return <Admin />
  if (path === '/dashboard') return <Dashboard />
  if (path === '/portfolio/new') return <NewProject />
  return <Home />
}

const TITLES: [string, string][] = [
  ['/explore', 'Explore'],
  ['/project', 'Project'],
  ['/planners', 'Planners'],
  ['/planner/', 'Planner'],
  ['/requests', 'Requests'],
  ['/request/', 'Request'],
  ['/messages', 'Messages'],
  ['/signup', 'Join'],
  ['/signin', 'Sign in'],
  ['/verify', 'Verification'],
  ['/admin', 'Review queue'],
  ['/dashboard', 'Dashboard'],
  ['/portfolio', 'New project'],
]

export default function App() {
  const { path, query } = useRoute()
  useEffect(() => {
    const t = TITLES.find(([k]) => path.startsWith(k))
    document.title = t ? `${t[1]} · Fête` : 'Fête · Verified wedding & event planners'
  }, [path])
  const bare = path.startsWith('/messages') || path === '/signup' || path === '/signin'
  return (
    <StoreProvider>
      <ToastProvider>
        <div className="flex min-h-screen flex-col">
          <Nav path={path} />
          <main className="flex-1">
            <Routes path={path} query={query} />
          </main>
          {!bare && <Footer />}
          <PersonaSwitcher />
        </div>
      </ToastProvider>
    </StoreProvider>
  )
}

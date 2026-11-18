import { useEffect } from 'react'
import { match, useRoute } from './lib/router'
import { StoreProvider } from './lib/store'
import { ThemeProvider } from './lib/theme'
import { I18nProvider, useI18n } from './lib/i18n'
import { Footer, Nav, PersonaSwitcher } from './components/Shell'
import { ToastProvider } from './components/ui'
import { Preloader } from './components/Preloader'
import { ErrorBoundary } from './components/ErrorBoundary'
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

const TITLES: [string, string, string][] = [
  ['/explore', 'Explore', 'استكشف'],
  ['/project', 'Project', 'تفاصيل الحفل'],
  ['/planners', 'Planners', 'المخططون'],
  ['/planner/', 'Planner', 'ملف المخطط'],
  ['/requests', 'Requests', 'طلبات الحفلات'],
  ['/request/', 'Request', 'تفاصيل الطلب'],
  ['/messages', 'Messages', 'الرسائل'],
  ['/signup', 'Join', 'انضم إلينا'],
  ['/signin', 'Sign in', 'تسجيل الدخول'],
  ['/verify', 'Verification', 'التوثيق والاعتماد'],
  ['/admin', 'Review queue', 'قائمة المراجعة'],
  ['/dashboard', 'Dashboard', 'لوحة التحكم'],
  ['/portfolio', 'New project', 'إضافة عمل'],
]

function AppContent() {
  const { path, query } = useRoute()
  const { lang, isRtl } = useI18n()

  useEffect(() => {
    const t = TITLES.find(([k]) => path.startsWith(k))
    const titleText = t ? (isRtl ? t[2] : t[1]) : (isRtl ? 'نخبة مخططي الحفلات والأعراس المعتمدين' : 'Verified Luxury Wedding & Event Planners')
    document.title = `${titleText} · ${isRtl ? 'إتلامو' : 'Etlamo'}`
  }, [path, isRtl])

  const bare = path.startsWith('/messages') || path === '/signup' || path === '/signin'

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink transition-colors duration-200">
      <ErrorBoundary fallback={null}>
        <Preloader />
      </ErrorBoundary>
      <Nav path={path} />
      <main className="flex-1">
        <ErrorBoundary>
          <Routes path={path} query={query} />
        </ErrorBoundary>
      </main>
      {!bare && <Footer />}
      <PersonaSwitcher />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <StoreProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </StoreProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}

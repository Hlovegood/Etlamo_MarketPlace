import { useEffect, useRef, useState, type AnchorHTMLAttributes } from 'react'

function current() {
  const raw = window.location.hash.slice(1) || '/'
  const [path, qs = ''] = raw.split('?')
  return { path: path || '/', query: new URLSearchParams(qs) }
}

export function useRoute() {
  const [route, setRoute] = useState(current)
  const prevPath = useRef(route.path)
  useEffect(() => {
    const onChange = () => {
      const next = current()
      // keep scroll position when switching between conversations
      if (!(prevPath.current.startsWith('/messages') && next.path.startsWith('/messages'))) window.scrollTo({ top: 0 })
      prevPath.current = next.path
      setRoute(next)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export function navigate(to: string) {
  window.location.hash = to
}

export function match(pattern: string, path: string): Record<string, string> | null {
  const a = pattern.split('/').filter(Boolean)
  const b = path.split('/').filter(Boolean)
  if (a.length !== b.length) return null
  const params: Record<string, string> = {}
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(':')) params[a[i].slice(1)] = decodeURIComponent(b[i])
    else if (a[i] !== b[i]) return null
  }
  return params
}

export function Link({ to, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...rest} />
}

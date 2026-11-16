export function timeAgo(ts: number) {
  const s = Math.max(1, Math.round((Date.now() - ts) / 1000))
  if (s < 60) return 'Just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.round(h / 24)
  if (d < 7) return `${d}d ago`
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function clockTime(ts: number) {
  const d = new Date(ts)
  const today = new Date()
  if (d.toDateString() === today.toDateString())
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  const diff = (today.getTime() - ts) / 86_400_000
  if (diff < 6) return d.toLocaleDateString('en-US', { weekday: 'short' })
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function eventDate(iso: string) {
  if (!iso) return 'Date flexible'
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function compact(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n)
}

export function firstName(name: string) {
  return name.split(' ')[0]
}

export function publicName(name: string) {
  const [f, l] = name.split(' ')
  return l ? `${f} ${l[0]}.` : f
}

export const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 9)}`

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ')
}

/** Downscale an uploaded image so it fits comfortably in localStorage. */
export function readImage(file: File, max = 1400): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const image = new Image()
      image.onerror = reject
      image.onload = () => {
        const scale = Math.min(1, max / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(image.width * scale)
        canvas.height = Math.round(image.height * scale)
        canvas.getContext('2d')!.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.78))
      }
      image.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

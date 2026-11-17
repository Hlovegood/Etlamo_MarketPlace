import { createContext, useContext, useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { BadgeCheck, CheckCircle2, ChevronLeft, ChevronRight, Star, X } from 'lucide-react'
import { cx } from '../lib/format'
import type { User } from '../lib/types'

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark' | 'danger' | 'outline'

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <button
      className={cx(
        'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full font-medium whitespace-nowrap transition-all duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:ring-4 focus-visible:ring-azure/25 focus-visible:outline-none',
        size === 'sm' && 'h-8 px-3.5 text-[13px]',
        size === 'md' && 'h-10 px-5 text-[15px]',
        size === 'lg' && 'h-12 px-7 text-[17px]',
        variant === 'primary' && 'bg-azure text-white hover:bg-azure-deep shadow-subtle',
        variant === 'secondary' && 'bg-mist text-ink hover:bg-[#e8e8ed]',
        variant === 'outline' && 'border border-hairline bg-white text-ink hover:bg-mist',
        variant === 'ghost' && 'text-link hover:bg-azure/8',
        variant === 'dark' && 'bg-ink text-white hover:bg-black shadow-subtle',
        variant === 'danger' && 'bg-[#fbeaea] text-[#c4271b] hover:bg-[#f7dcdc]',
        className,
      )}
      {...rest}
    />
  )
}

const AVATAR_TONES = [
  'bg-stone-700 text-stone-100',
  'bg-zinc-800 text-zinc-100',
  'bg-[#2c3e50] text-[#ecf0f1]',
  'bg-[#34495e] text-[#f4f6f7]',
  'bg-[#4a3b32] text-[#f7ede2]',
]

export function Avatar({ user, size = 36, className }: { user?: Pick<User, 'name' | 'avatar' | 'id'>; size?: number; className?: string }) {
  const name = user?.name ?? '?'
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
  const tone = AVATAR_TONES[(user?.id ?? '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_TONES.length]
  return user?.avatar ? (
    <img
      src={user.avatar}
      alt={name}
      style={{ width: size, height: size }}
      className={cx('shrink-0 rounded-full object-cover', className)}
    />
  ) : (
    <span
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={cx('inline-flex shrink-0 items-center justify-center rounded-full font-semibold', tone, className)}
    >
      {initials}
    </span>
  )
}

export function Verified({ size = 16, label = false }: { size?: number; label?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 text-azure" title="Verified planner">
      <BadgeCheck size={size} strokeWidth={2.2} className="fill-azure stroke-white" />
      {label && <span className="text-[13px] font-medium text-azure">Verified</span>}
    </span>
  )
}

export function RatingStars({ rating = 5, size = 14 }: { rating?: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.floor(rating) ? 'fill-[#ff9500] text-[#ff9500]' : 'text-silver/40'}
        />
      ))}
    </div>
  )
}

export function Chip({
  children,
  active,
  onClick,
  className,
}: {
  children: ReactNode
  active?: boolean
  onClick?: () => void
  className?: string
}) {
  const Tag = onClick ? 'button' : 'span'
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cx(
        'inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap transition-all duration-150',
        onClick && 'cursor-pointer active:scale-[0.96]',
        active ? 'bg-ink text-white shadow-subtle' : 'bg-mist text-ink hover:bg-[#e8e8ed]',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex rounded-xl bg-[#e8e8ed]/70 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cx(
            'cursor-pointer rounded-[9px] px-3.5 py-1.5 text-[13px] font-medium transition-all duration-150',
            value === o.value ? 'bg-white text-ink shadow-[0_1px_3px_rgb(0_0_0/0.12)]' : 'text-graphite hover:text-ink',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Modal({ open, onClose, children, width = 'max-w-lg' }: { open: boolean; onClose: () => void; children: ReactNode; width?: string }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 animate-fade bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className={cx('relative max-h-[92vh] w-full animate-pop overflow-y-auto rounded-t-3xl bg-white shadow-lift sm:rounded-3xl', width)}>
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-mist text-graphite transition hover:bg-[#e8e8ed]"
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  )
}

export function LightboxModal({
  images,
  index,
  open,
  onClose,
  onIndexChange,
  title,
}: {
  images: string[]
  index: number
  open: boolean
  onClose: () => void
  onIndexChange: (i: number) => void
  title?: string
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndexChange((index + 1) % images.length)
      if (e.key === 'ArrowLeft') onIndexChange((index - 1 + images.length) % images.length)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, index, images.length, onClose, onIndexChange])

  if (!open || !images.length) return null

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-2xl">
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex h-16 items-center justify-between px-6 text-white/90">
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-medium tracking-wide text-white/70">
            {index + 1} / {images.length}
          </span>
          {title && <span className="hidden text-[14px] font-medium text-white/90 sm:inline">· {title}</span>}
        </div>
        <button
          onClick={onClose}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
          aria-label="Close lightbox"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Image */}
      <div className="relative flex h-full max-h-[82vh] w-full max-w-6xl items-center justify-center px-12">
        <img
          key={images[index]}
          src={images[index]}
          alt=""
          className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl transition-all duration-300 animate-rise"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={() => onIndexChange((index - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-white/25 active:scale-95"
              aria-label="Previous photo"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => onIndexChange((index + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-white/25 active:scale-95"
              aria-label="Next photo"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Bottom thumbnails strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 z-20 flex max-w-xl gap-2 overflow-x-auto p-2 scrollbar-none">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => onIndexChange(i)}
              className={cx(
                'relative h-12 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg transition-all',
                i === index ? 'ring-2 ring-azure ring-offset-2 ring-offset-black scale-105 opacity-100' : 'opacity-50 hover:opacity-80',
              )}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const ToastCtx = createContext<(msg: string) => void>(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; msg: string } | null>(null)
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(t)
  }, [toast])
  return (
    <ToastCtx.Provider value={(msg) => setToast({ id: Date.now(), msg })}>
      {children}
      {toast && (
        <div key={toast.id} className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4">
          <div className="flex animate-pop items-center gap-2 rounded-full bg-ink/95 px-5 py-3 text-[14px] font-medium text-white shadow-lift backdrop-blur-xl">
            <CheckCircle2 size={17} className="text-[#30d158]" />
            {toast.msg}
          </div>
        </div>
      )}
    </ToastCtx.Provider>
  )
}

export function Empty({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-3xl bg-mist px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-graphite shadow-float">{icon}</div>
      <h3 className="text-[19px] font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 max-w-sm text-[15px] text-graphite">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function PageHeader({ eyebrow, title, sub, right }: { eyebrow?: string; title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="flex flex-col gap-5 pt-12 pb-8 sm:flex-row sm:items-end sm:justify-between md:pt-16">
      <div className="animate-rise">
        {eyebrow && <p className="mb-2 text-[15px] font-semibold text-amber">{eyebrow}</p>}
        <h1 className="text-[40px] leading-[1.05] font-semibold tracking-[-0.03em] md:text-[56px]">{title}</h1>
        {sub && <p className="mt-3 max-w-2xl text-[19px] leading-snug text-graphite">{sub}</p>}
      </div>
      {right}
    </div>
  )
}

export const Container = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cx('mx-auto w-full max-w-[1240px] px-5 md:px-8', className)}>{children}</div>
)

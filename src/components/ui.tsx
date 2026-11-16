import { createContext, useContext, useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { BadgeCheck, CheckCircle2, X } from 'lucide-react'
import { cx } from '../lib/format'
import type { User } from '../lib/types'

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark' | 'danger'

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <button
      className={cx(
        'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full font-medium whitespace-nowrap transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40',
        size === 'sm' && 'h-8 px-3.5 text-[13px]',
        size === 'md' && 'h-10 px-5 text-[15px]',
        size === 'lg' && 'h-12 px-7 text-[17px]',
        variant === 'primary' && 'bg-azure text-white hover:bg-azure-deep',
        variant === 'secondary' && 'bg-mist text-ink hover:bg-[#e8e8ed]',
        variant === 'ghost' && 'text-link hover:bg-azure/8',
        variant === 'dark' && 'bg-ink text-white hover:bg-black',
        variant === 'danger' && 'bg-[#fbeaea] text-[#c4271b] hover:bg-[#f7dcdc]',
        className,
      )}
      {...rest}
    />
  )
}

const GRADIENTS = [
  'from-[#ffb199] to-[#ff0844]',
  'from-[#a1c4fd] to-[#5b7cfa]',
  'from-[#84fab0] to-[#2fb380]',
  'from-[#f6d365] to-[#fda085]',
  'from-[#cfa8ff] to-[#7a5cff]',
]

export function Avatar({ user, size = 36, className }: { user?: Pick<User, 'name' | 'avatar' | 'id'>; size?: number; className?: string }) {
  const name = user?.name ?? '?'
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
  const g = GRADIENTS[(user?.id ?? '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENTS.length]
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
      className={cx('inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white', g, className)}
    >
      {initials}
    </span>
  )
}

export function Verified({ size = 16, label = false }: { size?: number; label?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 text-azure" title="Verified planner">
      <BadgeCheck size={size} strokeWidth={2.2} className="fill-azure stroke-white" />
      {label && <span className="text-[13px] font-medium">Verified</span>}
    </span>
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
        'inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition',
        onClick && 'cursor-pointer',
        active ? 'bg-ink text-white' : 'bg-mist text-ink hover:bg-[#e8e8ed]',
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
    <div className="inline-flex rounded-[10px] bg-[#e8e8ed]/70 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cx(
            'cursor-pointer rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition',
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
      <div className="absolute inset-0 animate-fade bg-black/35 backdrop-blur-sm" onClick={onClose} />
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
        <div key={toast.id} className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
          <div className="flex animate-pop items-center gap-2 rounded-full bg-ink/92 px-5 py-3 text-[14px] font-medium text-white shadow-lift backdrop-blur-xl">
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
  <div className={cx('mx-auto w-full max-w-[1200px] px-5 md:px-8', className)}>{children}</div>
)

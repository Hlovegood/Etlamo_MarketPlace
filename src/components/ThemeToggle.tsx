import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../lib/theme'
import { useI18n } from '../lib/i18n'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const { isRtl } = useI18n()
  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-hairline bg-card text-ink shadow-subtle transition-all duration-200 hover:bg-mist active:scale-95 ${className}`}
      title={isDark ? (isRtl ? 'التبديل إلى الوضع الفاتح' : 'Switch to Light Mode') : (isRtl ? 'التبديل إلى الوضع الداكن' : 'Switch to Dark Mode')}
      aria-label="Toggle theme"
    >
      <div className="relative h-4.5 w-4.5 overflow-hidden">
        <Sun
          size={18}
          className={`absolute inset-0 transition-transform duration-300 ease-out ${
            isDark ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100 text-amber'
          }`}
        />
        <Moon
          size={18}
          className={`absolute inset-0 transition-transform duration-300 ease-out ${
            isDark ? 'rotate-0 scale-100 opacity-100 text-azure' : 'rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
    </button>
  )
}

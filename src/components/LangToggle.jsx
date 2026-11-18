import { Languages } from 'lucide-react'
import { useI18n } from '../lib/i18n'

export function LangToggle({ className = '' }) {
  const { lang, toggleLang, isRtl } = useI18n()

  return (
    <button
      onClick={toggleLang}
      type="button"
      className={`flex h-9 items-center gap-1.5 rounded-full border border-hairline bg-card px-2.5 text-[13px] font-semibold text-ink shadow-subtle transition-all duration-200 hover:bg-mist active:scale-95 cursor-pointer ${className}`}
      title={isRtl ? 'Switch to English' : 'التحويل إلى العربية'}
      aria-label="Toggle language"
    >
      <Languages size={15} className="text-azure shrink-0" />
      <span>{lang === 'en' ? 'عربي' : 'EN'}</span>
    </button>
  )
}

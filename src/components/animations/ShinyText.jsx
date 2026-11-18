export function ShinyText({
  children,
  className = '',
  speed = 3,
}) {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(120deg, var(--ink) 0%, var(--ink) 40%, var(--azure) 50%, var(--ink) 60%, var(--ink) 100%)',
        backgroundSize: '200% 100%',
        animation: `shiny-shimmer ${speed}s ease-in-out infinite`,
      }}
    >
      <style>{`
        @keyframes shiny-shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
      {children}
    </span>
  )
}

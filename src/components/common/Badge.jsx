export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  glow = false,
  pulse = false,
  className = ''
}) {
  const variants = {
    default: 'bg-surface text-text-secondary border border-border',
    primary: 'bg-primary/20 text-primary border border-primary/30',
    success: 'bg-success/20 text-success border border-success/30',
    warning: 'bg-warning/20 text-warning border border-warning/30',
    error: 'bg-error/20 text-error border border-error/30',
    info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm'
  }

  const glowStyles = {
    default: '',
    primary: glow ? 'shadow-[0_0_10px_rgba(220,38,38,0.3)]' : '',
    success: glow ? 'shadow-[0_0_10px_rgba(22,163,74,0.3)]' : '',
    warning: glow ? 'shadow-[0_0_10px_rgba(202,138,4,0.3)]' : '',
    error: glow ? 'shadow-[0_0_10px_rgba(220,38,38,0.3)]' : '',
    info: glow ? 'shadow-[0_0_10px_rgba(59,130,246,0.3)]' : ''
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        transition-all duration-300
        ${variants[variant]}
        ${sizes[size]}
        ${glowStyles[variant]}
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            variant === 'success' ? 'bg-success' :
            variant === 'warning' ? 'bg-warning' :
            variant === 'error' ? 'bg-error' :
            variant === 'primary' ? 'bg-primary' :
            'bg-text-secondary'
          }`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${
            variant === 'success' ? 'bg-success' :
            variant === 'warning' ? 'bg-warning' :
            variant === 'error' ? 'bg-error' :
            variant === 'primary' ? 'bg-primary' :
            'bg-text-secondary'
          }`} />
        </span>
      )}
      {children}
    </span>
  )
}

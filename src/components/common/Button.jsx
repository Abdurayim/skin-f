import useSound from '../../hooks/useSound'

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  glow = false,
  onClick,
  className = ''
}) {
  const { play } = useSound()

  const handleClick = (e) => {
    if (!disabled && !loading) {
      play('click')
      onClick?.(e)
    }
  }

  const handleMouseEnter = () => {
    if (!disabled && !loading) {
      play('hover')
    }
  }

  const baseStyles = `
    relative inline-flex items-center justify-center font-semibold rounded-xl
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    active:scale-95 btn-glow overflow-hidden
  `

  const variants = {
    primary: `
      bg-primary hover:bg-primary-hover text-white font-semibold
      focus:ring-primary
      ${glow ? 'shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/50' : 'hover:shadow-lg hover:shadow-primary/25'}
    `,
    secondary: `
      bg-surface-light hover:bg-surface-hover text-text-primary
      border border-border hover:border-primary/50
      focus:ring-border
    `,
    danger: `
      bg-error hover:bg-red-700 text-white
      focus:ring-error
      hover:shadow-lg hover:shadow-error/25
    `,
    ghost: `
      bg-transparent hover:bg-surface text-text-primary
      focus:ring-border
    `,
    success: `
      bg-success hover:bg-green-700 text-white
      focus:ring-success
      hover:shadow-lg hover:shadow-success/25
    `,
    outline: `
      bg-transparent border-2 border-primary text-primary
      hover:bg-primary hover:text-white
      focus:ring-primary
      ${glow ? 'shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30' : ''}
    `
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-2.5 text-sm gap-2',
    lg: 'px-8 py-3.5 text-base gap-2',
    xl: 'px-10 py-4 text-lg gap-3'
  }

  return (
    <button
      type={type}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      disabled={disabled || loading}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      {/* Ripple effect overlay */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-white/20 rounded-full group-hover:w-full group-hover:h-full transition-all duration-500" />
        </span>
      </span>

      {/* Button content */}
      <span className={`relative z-10 flex items-center gap-2 ${loading ? 'opacity-0' : ''}`}>
        {children}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
    </button>
  )
}

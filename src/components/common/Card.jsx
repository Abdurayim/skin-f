import useSound from '../../hooks/useSound'

export default function Card({
  children,
  className = '',
  padding = 'md',
  hover = false,
  glow = false,
  glass = false,
  onClick
}) {
  const { play } = useSound()

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8'
  }

  const baseStyles = `
    rounded-2xl transition-all duration-300
    ${glass ? 'glass' : 'bg-surface border border-border'}
    ${glow ? 'glow-red-subtle' : ''}
  `

  const hoverStyles = hover ? `
    cursor-pointer card-hover
    hover:border-primary/30
  ` : ''

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${paddings[padding]} ${className}`}
      onClick={onClick}
      onMouseEnter={() => hover && play('hover')}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`border-b border-border/50 pb-4 sm:pb-5 mb-4 sm:mb-5 ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-xl sm:text-2xl font-bold text-text-primary ${className}`}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm sm:text-base text-text-secondary mt-1.5 ${className}`}>
      {children}
    </p>
  )
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`border-t border-border/50 pt-4 sm:pt-5 mt-4 sm:mt-5 ${className}`}>
      {children}
    </div>
  )
}

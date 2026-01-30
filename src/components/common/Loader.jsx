export default function Loader({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`relative ${sizes[size]}`}>
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
        {/* Inner glow */}
        <div className="absolute inset-2 rounded-full bg-primary/10 animate-pulse" />
      </div>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center glow-red animate-pulse">
          <span className="text-white font-bold text-4xl">S</span>
        </div>

        {/* Loading animation */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>

        <p className="text-text-secondary text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  )
}

export function InlineLoader({ text }) {
  return (
    <div className="flex items-center gap-3 text-text-secondary">
      <Loader size="sm" />
      {text && <span className="text-sm">{text}</span>}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-surface-hover" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-surface-hover rounded w-3/4" />
        <div className="h-3 bg-surface-hover rounded w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-surface-hover rounded w-20" />
          <div className="h-3 bg-surface-hover rounded w-16" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonLine({ width = 'full', height = '4' }) {
  const widths = {
    full: 'w-full',
    '3/4': 'w-3/4',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
    '1/4': 'w-1/4'
  }

  return (
    <div className={`${widths[width]} h-${height} bg-surface-hover rounded animate-pulse`} />
  )
}

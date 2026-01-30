import { useEffect, useCallback } from 'react'
import useSound from '../../hooks/useSound'

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true
}) {
  const { play } = useSound()

  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') {
      play('whoosh')
      onClose()
    }
  }, [onClose, play])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      play('pop')
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscape, play])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    'full': 'max-w-4xl'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in"
          onClick={() => {
            play('whoosh')
            onClose()
          }}
        />

        {/* Modal Panel */}
        <div
          className={`
            relative w-full ${sizes[size]}
            glass rounded-2xl shadow-2xl
            transform transition-all animate-scale-in
            border border-white/10
          `}
        >
          {/* Glow effect */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/20 to-transparent opacity-50 pointer-events-none" />

          {/* Header */}
          {(title || showClose) && (
            <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/10">
              {title && (
                <h3 className="text-lg sm:text-xl font-bold text-text-primary">
                  {title}
                </h3>
              )}
              {showClose && (
                <button
                  onClick={() => {
                    play('click')
                    onClose()
                  }}
                  className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="relative px-6 py-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

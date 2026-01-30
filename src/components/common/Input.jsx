import { forwardRef } from 'react'
import useSound from '../../hooks/useSound'

const Input = forwardRef(function Input({
  type = 'text',
  label,
  error,
  hint,
  disabled = false,
  required = false,
  icon,
  className = '',
  containerClassName = '',
  ...props
}, ref) {
  const { play } = useSound()

  const inputStyles = `
    w-full px-4 py-3 rounded-xl
    bg-surface-light border border-border
    text-text-primary placeholder-text-secondary/50
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-300
    ${icon ? 'pl-11' : ''}
    ${error ? 'border-error focus:ring-error/50 focus:border-error' : 'hover:border-border'}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
          {required && <span className="text-primary ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          required={required}
          className={inputStyles}
          onFocus={() => play('hover')}
          {...props}
        />
        {/* Focus glow effect */}
        <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 rounded-xl glow-red-subtle" />
        </div>
      </div>
      {hint && !error && (
        <p className="mt-2 text-sm text-text-secondary">{hint}</p>
      )}
      {error && (
        <p className="mt-2 text-sm text-error flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
})

export default Input

export function Textarea({
  label,
  error,
  hint,
  disabled = false,
  required = false,
  rows = 4,
  className = '',
  containerClassName = '',
  ...props
}) {
  const { play } = useSound()

  const textareaStyles = `
    w-full px-4 py-3 rounded-xl
    bg-surface-light border border-border
    text-text-primary placeholder-text-secondary/50
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-300 resize-none
    ${error ? 'border-error focus:ring-error/50 focus:border-error' : 'hover:border-border'}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
          {required && <span className="text-primary ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        disabled={disabled}
        required={required}
        className={textareaStyles}
        onFocus={() => play('hover')}
        {...props}
      />
      {hint && !error && (
        <p className="mt-2 text-sm text-text-secondary">{hint}</p>
      )}
      {error && (
        <p className="mt-2 text-sm text-error flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

export function Select({
  label,
  error,
  hint,
  disabled = false,
  required = false,
  options = [],
  className = '',
  containerClassName = '',
  ...props
}) {
  const { play } = useSound()

  const selectStyles = `
    w-full px-4 py-3 rounded-xl appearance-none cursor-pointer
    bg-surface-light border border-border
    text-text-primary
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-300
    ${error ? 'border-error focus:ring-error/50 focus:border-error' : 'hover:border-border'}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
          {required && <span className="text-primary ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          disabled={disabled}
          required={required}
          className={selectStyles}
          onFocus={() => play('hover')}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {hint && !error && (
        <p className="mt-2 text-sm text-text-secondary">{hint}</p>
      )}
      {error && (
        <p className="mt-2 text-sm text-error">{error}</p>
      )}
    </div>
  )
}

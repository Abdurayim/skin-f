import { useState, useRef, useEffect } from 'react'

export default function Dropdown({
  trigger,
  children,
  align = 'left',
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const alignments = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2'
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div
          className={`
            absolute z-50 mt-2 min-w-48
            bg-surface border border-border rounded-lg shadow-xl
            ${alignments[align]}
          `}
        >
          <div onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export function DropdownItem({
  children,
  onClick,
  icon,
  danger = false,
  disabled = false
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left
        transition-colors first:rounded-t-lg last:rounded-b-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        ${danger
          ? 'text-error hover:bg-error/10'
          : 'text-text-primary hover:bg-surface-hover'
        }
      `}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  )
}

export function DropdownDivider() {
  return <div className="border-t border-border my-1" />
}

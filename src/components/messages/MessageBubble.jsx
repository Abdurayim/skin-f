import { formatTime } from '../../utils/formatters'

export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 transition-all
          ${isOwn
            ? 'bg-primary text-white rounded-br-md glow-red-subtle'
            : 'bg-surface border border-border text-text-primary rounded-bl-md hover:border-primary/30'
          }
        `}
      >
        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
          {message.content}
        </p>
        <div className={`flex items-center justify-end gap-1.5 mt-1.5 ${isOwn ? 'text-white/60' : 'text-text-secondary'}`}>
          <span className="text-xs">
            {formatTime(message.createdAt)}
          </span>
          {isOwn && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {message.read ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              )}
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}

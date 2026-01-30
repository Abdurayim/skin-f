import { useLanguage } from '../../hooks/useLanguage'
import { formatDate } from '../../utils/formatters'
import useSound from '../../hooks/useSound'

export default function ConversationList({ conversations, selectedId, onSelect }) {
  const { t } = useLanguage()
  const { play } = useSound()

  if (conversations.length === 0) {
    return null
  }

  const handleSelect = (id) => {
    play('click')
    onSelect(id)
  }

  return (
    <div className="divide-y divide-border/50">
      {conversations.map((conversation, index) => (
        <button
          key={conversation.id}
          onClick={() => handleSelect(conversation.id)}
          className={`
            w-full p-4 text-left transition-all duration-300 relative group
            ${selectedId === conversation.id
              ? 'bg-primary/10 border-l-2 border-primary'
              : 'hover:bg-surface-hover border-l-2 border-transparent'
            }
            animate-fade-in
          `}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="relative">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300
                ${selectedId === conversation.id
                  ? 'bg-primary/20 ring-2 ring-primary/50'
                  : 'bg-primary/10'
                }
              `}>
                {conversation.other_user?.avatar ? (
                  <img
                    src={conversation.other_user.avatar}
                    alt={conversation.other_user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-primary font-bold text-lg">
                    {conversation.other_user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              {/* Online indicator (could be made dynamic) */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full ring-2 ring-surface" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className={`
                  font-semibold truncate transition-colors
                  ${selectedId === conversation.id ? 'text-primary' : 'text-text-primary'}
                `}>
                  {conversation.other_user?.name || t('common.user')}
                </h4>
                <span className="text-xs text-text-secondary flex-shrink-0">
                  {formatDate(conversation.last_message_at)}
                </span>
              </div>

              {/* Post reference */}
              {conversation.post && (
                <p className="text-xs text-primary/70 truncate mb-1 flex items-center gap-1">
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {conversation.post.title}
                </p>
              )}

              {/* Last message */}
              <p className={`
                text-sm truncate
                ${conversation.unread_count > 0 ? 'text-text-primary font-medium' : 'text-text-secondary'}
              `}>
                {conversation.last_message?.content || t('messages.noMessages')}
              </p>
            </div>

            {/* Unread badge */}
            {conversation.unread_count > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full glow-red-subtle animate-pulse">
                {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
              </span>
            )}
          </div>

          {/* Hover highlight */}
          <div className={`
            absolute inset-y-0 left-0 w-1 bg-primary transform transition-transform duration-300 origin-left
            ${selectedId === conversation.id ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}
          `} />
        </button>
      ))}
    </div>
  )
}

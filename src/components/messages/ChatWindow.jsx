import { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import Button from '../common/Button'
import Loader from '../common/Loader'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import useSound from '../../hooks/useSound'

export default function ChatWindow({
  conversation,
  messages,
  loading,
  onSend,
  onBack
}) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { play } = useSound()
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (conversation) {
      inputRef.current?.focus()
    }
  }, [conversation])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    play('pop')
    setSending(true)
    await onSend(newMessage.trim())
    setNewMessage('')
    setSending(false)
  }

  const handleBack = () => {
    play('whoosh')
    onBack()
  }

  if (!conversation) {
    return null
  }

  return (
    <div className="flex-1 flex flex-col bg-background animate-fade-in">
      {/* Header */}
      <div className="bg-surface/80 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={handleBack}
          className="md:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="relative">
          <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
            {conversation.other_user?.avatar ? (
              <img
                src={conversation.other_user.avatar}
                alt={conversation.other_user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-primary font-bold">
                {conversation.other_user?.name?.[0]?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full ring-2 ring-surface" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary truncate">
            {conversation.other_user?.name || t('common.user')}
          </h3>
          {conversation.post && (
            <p className="text-xs text-text-secondary truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {conversation.post.title}
            </p>
          )}
        </div>

        {/* Actions */}
        <button
          className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
          onClick={() => play('click')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader size="lg" />
            <p className="text-sm text-text-secondary mt-4">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-text-secondary text-center max-w-xs">
              {t('messages.startConversation')}
            </p>
          </div>
        ) : (
          <>
            {/* Date separator could go here */}
            {messages.map((message, index) => (
              <div
                key={message.id}
                className="animate-fade-in"
                style={{ animationDelay: `${Math.min(index, 10) * 30}ms` }}
              >
                <MessageBubble
                  message={message}
                  isOwn={message.sender_id === user?.uid}
                />
              </div>
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-border bg-surface/80 backdrop-blur-sm">
        <div className="flex gap-2 sm:gap-3 items-end">
          {/* Attachment button */}
          <button
            type="button"
            onClick={() => play('click')}
            className="p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          {/* Input field */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('messages.typePlaceholder')}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              onFocus={() => play('hover')}
            />
          </div>

          {/* Send button */}
          <Button
            type="submit"
            loading={sending}
            disabled={!newMessage.trim()}
            glow={!!newMessage.trim()}
            className="flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        </div>
      </form>
    </div>
  )
}

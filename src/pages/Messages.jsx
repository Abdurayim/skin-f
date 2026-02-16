import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import ConversationList from '../components/messages/ConversationList'
import ChatWindow from '../components/messages/ChatWindow'
import Loader from '../components/common/Loader'
import { useLanguage } from '../hooks/useLanguage'
import { useApi } from '../hooks/useApi'
import useSound from '../hooks/useSound'
import { ENDPOINTS } from '../config/api'

export default function Messages() {
  const { t } = useLanguage()
  const { get, post } = useApi()
  const { play } = useSound()
  const [searchParams, setSearchParams] = useSearchParams()

  const [conversations, setConversations] = useState([])
  const [selectedId, setSelectedId] = useState(searchParams.get('conversation') || null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)

  const fetchConversations = useCallback(async () => {
    setLoading(true)
    const { data } = await get(ENDPOINTS.CONVERSATIONS)
    if (data) {
      const convs = data.data?.conversations || data.conversations || data.data || data
      setConversations(Array.isArray(convs) ? convs : [])
    }
    setLoading(false)
  }, [])

  const fetchMessages = useCallback(async (conversationId) => {
    setMessagesLoading(true)
    const { data } = await get(ENDPOINTS.CONVERSATION_BY_ID(conversationId))
    if (data) {
      const msgs = data.data?.messages || data.messages || data.data || data
      setMessages(Array.isArray(msgs) ? msgs : [])
    }
    setMessagesLoading(false)
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  useEffect(() => {
    if (selectedId) {
      fetchMessages(selectedId)
      setSearchParams({ conversation: selectedId })
    } else {
      setMessages([])
      setSearchParams({})
    }
  }, [selectedId, fetchMessages, setSearchParams])

  const handleSelectConversation = (id) => {
    play('click')
    setSelectedId(id)
  }

  const handleBack = () => {
    play('whoosh')
    setSelectedId(null)
  }

  const selectedConversation = conversations.find(c => (c._id || c.id) === selectedId)

  const handleSendMessage = async (content) => {
    if (!selectedId || !selectedConversation) return

    play('pop')
    const recipientId = selectedConversation.otherParticipant?._id
    const { data } = await post(ENDPOINTS.SEND_MESSAGE, {
      recipientId,
      content
    })
    if (data) {
      play('success')
      const msg = data.data?.message || data.message || data.data || data
      setMessages(prev => [...prev, msg])
    }
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)] flex bg-background overflow-hidden">
        {/* Conversations Sidebar */}
        <div
          className={`
            w-full md:w-80 lg:w-96 bg-surface border-r border-border flex-shrink-0 flex flex-col
            ${selectedId ? 'hidden md:flex' : 'flex'}
            animate-fade-in
          `}
        >
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border bg-surface/80 backdrop-blur-sm">
            <h1 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full glow-red" />
              {t('nav.messages')}
            </h1>
            {conversations.length > 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-lg">
                {conversations.length}
              </span>
            )}
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader size="lg" />
                <p className="text-sm text-text-secondary mt-4">Loading conversations...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-20 h-20 rounded-2xl bg-surface-hover flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">No messages yet</h3>
                <p className="text-sm text-text-secondary text-center max-w-xs">
                  Start a conversation by contacting a seller from their listing page.
                </p>
              </div>
            ) : (
              <ConversationList
                conversations={conversations}
                selectedId={selectedId}
                onSelect={handleSelectConversation}
              />
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`
            flex-1 flex flex-col bg-background
            ${selectedId ? 'flex' : 'hidden md:flex'}
          `}
        >
          {selectedId ? (
            <ChatWindow
              conversation={selectedConversation}
              messages={messages}
              loading={messagesLoading}
              onSend={handleSendMessage}
              onBack={handleBack}
            />
          ) : (
            // Empty State for Desktop
            <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center px-4 animate-fade-in">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="relative w-24 h-24 rounded-2xl bg-surface border border-border flex items-center justify-center">
                  <svg className="w-12 h-12 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-2">
                Select a conversation
              </h2>
              <p className="text-text-secondary max-w-sm">
                Choose a conversation from the list to start messaging.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import PostCard from '../components/posts/PostCard'
import Button from '../components/common/Button'
import Loader, { SkeletonCard } from '../components/common/Loader'
import Modal from '../components/common/Modal'
import { useLanguage } from '../hooks/useLanguage'
import { useApi } from '../hooks/useApi'
import useSound from '../hooks/useSound'
import { ENDPOINTS } from '../config/api'

export default function MyPosts() {
  const { t } = useLanguage()
  const { get, del, loading } = useApi()
  const { play } = useSound()

  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('active')
  const [deleteModal, setDeleteModal] = useState({ open: false, postId: null })
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error: apiError } = await get(`${ENDPOINTS.MY_POSTS}?status=${activeTab}`)
      if (data) {
        // Backend returns: { data: { posts: [...] } } or { data: [...] }
        const posts = data.posts || data.data?.posts || data.data || []
        setPosts(posts)
      } else if (apiError) {
        console.error('Failed to fetch posts:', apiError)
        setPosts([])
      }
    }
    fetchPosts()
  }, [activeTab])

  const handleTabChange = (tabId) => {
    play('pop')
    setActiveTab(tabId)
  }

  const openDeleteModal = (postId) => {
    play('click')
    setDeleteModal({ open: true, postId })
  }

  const handleDelete = async () => {
    if (!deleteModal.postId) return

    setDeleting(true)
    const { error } = await del(ENDPOINTS.POST_BY_ID(deleteModal.postId))
    setDeleting(false)

    if (!error) {
      play('success')
      setPosts(posts.filter(p => p._id !== deleteModal.postId))
      setDeleteModal({ open: false, postId: null })
    } else {
      play('error')
    }
  }

  const tabs = [
    { id: 'active', label: t('post.status.active'), icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'sold', label: t('post.status.sold'), icon: 'M5 13l4 4L19 7' },
    { id: 'draft', label: t('post.status.draft'), icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' }
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="animate-fade-in-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-3">
              <span className="w-2 h-8 bg-primary rounded-full glow-red" />
              {t('nav.myPosts')}
            </h1>
            <p className="text-text-secondary mt-1">Manage your listings</p>
          </div>
          <Link to="/create-post" className="animate-fade-in-right">
            <Button glow size="lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('post.create')}
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 mb-6 p-1 bg-surface rounded-xl border border-border overflow-x-auto animate-fade-in">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap
                ${activeTab === tab.id
                  ? 'bg-primary text-white glow-red-subtle'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }
              `}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: 'Active', count: posts.filter(p => p.status === 'active').length, color: 'primary' },
            { label: 'Sold', count: posts.filter(p => p.status === 'sold').length, color: 'success' },
            { label: 'Drafts', count: posts.filter(p => p.status === 'draft').length, color: 'warning' }
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="bg-surface border border-border rounded-xl p-3 sm:p-4 text-center hover:border-primary/30 transition-all animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <p className={`text-2xl sm:text-3xl font-bold text-${stat.color}`}>{stat.count}</p>
              <p className="text-xs sm:text-sm text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 sm:py-24 animate-fade-in">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-24 h-24 mx-auto mb-6 rounded-2xl bg-surface border border-border flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {t('posts.noPostsFound')}
            </h3>
            <p className="text-text-secondary max-w-sm mx-auto mb-8">
              {activeTab === 'active'
                ? "You don't have any active listings yet. Start selling!"
                : activeTab === 'sold'
                  ? "You haven't sold anything yet."
                  : "No drafts saved."}
            </p>
            <Link to="/create-post">
              <Button glow size="lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('post.create')}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {posts.map((post, index) => (
              <div
                key={post._id}
                className="relative group animate-fade-in-up"
                style={{ animationDelay: `${(index % 8) * 50}ms` }}
              >
                <PostCard post={post} />

                {/* Action overlay */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <Link
                    to={`/posts/${post._id}/edit`}
                    onClick={() => play('click')}
                    className="p-2.5 bg-surface/90 backdrop-blur-sm rounded-xl border border-border text-text-secondary hover:text-primary hover:border-primary/50 transition-all duration-300 hover:scale-110"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => openDeleteModal(post._id)}
                    className="p-2.5 bg-surface/90 backdrop-blur-sm rounded-xl border border-border text-text-secondary hover:text-error hover:border-error/50 hover:bg-error/10 transition-all duration-300 hover:scale-110"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Status badge */}
                {post.status !== 'active' && (
                  <div className="absolute top-3 left-3">
                    <span className={`
                      px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm
                      ${post.status === 'sold' ? 'bg-success/90 text-white' : 'bg-warning/90 text-black'}
                    `}>
                      {post.status === 'sold' ? 'SOLD' : 'DRAFT'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, postId: null })}
        title="Delete Listing"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Are you sure?
          </h3>
          <p className="text-text-secondary mb-6">
            This action cannot be undone. The listing will be permanently deleted.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setDeleteModal({ open: false, postId: null })}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={handleDelete}
              loading={deleting}
              className="!bg-error hover:!bg-error/90"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}

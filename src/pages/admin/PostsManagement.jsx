import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Loader from '../../components/common/Loader'
import { useLanguage } from '../../hooks/useLanguage'
import { API_BASE_URL, ENDPOINTS } from '../../config/api'
import { formatPrice, formatDate } from '../../utils/formatters'

export default function PostsManagement() {
  const { t } = useLanguage()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [selectedPost, setSelectedPost] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [page])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_POSTS}?page=${page}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (response.ok) {
        setPosts(data.posts || data)
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (postId, action) => {
    setActionLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API_BASE_URL}/admin/posts/${postId}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        if (action === 'delete') {
          setPosts(posts.filter(p => p.id !== postId))
        } else {
          fetchPosts()
        }
        setSelectedPost(null)
      }
    } catch (err) {
      console.error(`Failed to ${action} post:`, err)
    } finally {
      setActionLoading(false)
    }
  }

  const statusVariants = {
    active: 'success',
    pending: 'warning',
    sold: 'default',
    removed: 'error'
  }

  const typeVariants = {
    skin: 'primary',
    account: 'warning',
    item: 'success'
  }

  return (
    <AdminLayout>
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('admin.post')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('admin.seller')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('admin.type')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('admin.price')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('admin.status')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('admin.date')}
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader size="md" />
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-text-secondary">
                    {t('admin.noPosts')}
                  </td>
                </tr>
              ) : (
                posts.map(post => (
                  <tr key={post.id} className="border-b border-border hover:bg-surface-hover">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-surface overflow-hidden flex-shrink-0">
                          {post.images?.[0] ? (
                            <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-secondary">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-text-primary font-medium truncate max-w-xs">
                            {post.title}
                          </p>
                          <p className="text-text-secondary text-sm">{post.game?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-text-primary">{post.user?.name || t('common.user')}</p>
                      <p className="text-text-secondary text-sm">{post.user?.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={typeVariants[post.type] || 'default'}>
                        {t(`post.types.${post.type}`)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-text-primary font-medium">
                      {formatPrice(post.price, post.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariants[post.status] || 'default'}>
                        {t(`post.status.${post.status}`)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {posts.length > 0 && (
          <div className="px-6 py-4 border-t border-border flex justify-between items-center">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary disabled:opacity-50"
            >
              {t('common.previous')}
            </button>
            <span className="text-text-secondary text-sm">
              {t('common.page')} {page}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={posts.length < 20}
              className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary disabled:opacity-50"
            >
              {t('common.next')}
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        title={t('admin.postActions')}
      >
        {selectedPost && (
          <div className="space-y-4">
            <div className="p-4 bg-surface-hover rounded-lg">
              <h4 className="font-medium text-text-primary mb-1">{selectedPost.title}</h4>
              <p className="text-text-secondary text-sm">{selectedPost.game?.name}</p>
              <p className="text-primary font-medium mt-2">
                {formatPrice(selectedPost.price, selectedPost.currency)}
              </p>
            </div>

            <div className="space-y-2">
              {selectedPost.status !== 'removed' && (
                <Button
                  variant="danger"
                  fullWidth
                  loading={actionLoading}
                  onClick={() => handleAction(selectedPost.id, 'remove')}
                >
                  {t('admin.removePost')}
                </Button>
              )}
              {selectedPost.status === 'removed' && (
                <Button
                  variant="success"
                  fullWidth
                  loading={actionLoading}
                  onClick={() => handleAction(selectedPost.id, 'restore')}
                >
                  {t('admin.restorePost')}
                </Button>
              )}
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setSelectedPost(null)}
              >
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  )
}

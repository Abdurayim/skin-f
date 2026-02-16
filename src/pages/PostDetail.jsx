import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import Modal from '../components/common/Modal'
import { PageLoader } from '../components/common/Loader'
import { useLanguage } from '../hooks/useLanguage'
import { useAuth } from '../hooks/useAuth'
import { useApi } from '../hooks/useApi'
import useSound from '../hooks/useSound'
import { ENDPOINTS } from '../config/api'
import { formatPrice, formatDate } from '../utils/formatters'
import { getImageUrl } from '../config/api'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { isAuthenticated, user } = useAuth()
  const { get, post: apiPost, loading } = useApi()
  const { play } = useSound()
  const [postData, setPostData] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const [contactLoading, setContactLoading] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await get(ENDPOINTS.POST_BY_ID(id))
      if (data) {
        setPostData(data.data?.post || data.data || data)
      }
    }
    fetchPost()
  }, [id])

  const handleContact = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/posts/${id}` } } })
      return
    }
    play('click')
    setContactLoading(true)
    const { data } = await apiPost(ENDPOINTS.CONVERSATION_START, {
      userId: postData.userId?._id || postData.userId || postData.user?._id,
      postId: id
    })
    setContactLoading(false)
    if (data) {
      play('success')
      const convId = data.data?._id || data._id
      navigate(`/messages?conversation=${convId}`)
    }
  }

  const handleImageSelect = (index) => {
    play('pop')
    setSelectedImage(index)
  }

  const openLightbox = () => {
    play('whoosh')
    setShowLightbox(true)
  }

  const navigateImage = (direction) => {
    if (!postData?.images?.length) return
    play('slide')
    const newIndex = direction === 'next'
      ? (selectedImage + 1) % postData.images.length
      : (selectedImage - 1 + postData.images.length) % postData.images.length
    setSelectedImage(newIndex)
  }

  if (loading && !postData) {
    return <PageLoader />
  }

  if (!postData) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="relative w-24 h-24 mx-auto rounded-2xl bg-surface border border-border flex items-center justify-center">
              <svg className="w-12 h-12 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            {t('posts.notFound')}
          </h1>
          <p className="text-text-secondary mb-6">{t('errors.listingNotFound')}</p>
          <Link to="/posts">
            <Button glow>{t('posts.backToList')}</Button>
          </Link>
        </div>
      </Layout>
    )
  }

  const typeVariants = {
    skin: 'primary',
    account: 'warning',
    item: 'success'
  }

  const isOwner = user?._id === (postData.userId?._id || postData.userId)

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 animate-fade-in">
          <Link to="/posts" className="text-text-secondary hover:text-primary transition-colors">
            {t('posts.title')}
          </Link>
          <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-text-primary truncate max-w-[200px]">{postData.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Image Gallery */}
          <div className="animate-fade-in-left">
            <div className="bg-surface border border-border rounded-2xl overflow-hidden relative group">
              {postData.images?.length > 0 ? (
                <>
                  {/* Main Image */}
                  <div
                    className="aspect-square sm:aspect-video relative cursor-zoom-in overflow-hidden"
                    onClick={openLightbox}
                  >
                    <img
                      src={getImageUrl(postData.images[selectedImage]?.originalPath || postData.images[selectedImage])}
                      alt={postData.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/50 backdrop-blur-sm rounded-full p-3">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {/* Image counter */}
                    {postData.images.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
                        {selectedImage + 1} / {postData.images.length}
                      </div>
                    )}
                  </div>
                  {/* Thumbnails */}
                  {postData.images?.length > 1 && (
                    <div className="p-3 sm:p-4 flex gap-2 overflow-x-auto scrollbar-hide">
                      {postData.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => handleImageSelect(index)}
                          className={`
                            w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300
                            ${selectedImage === index
                              ? 'border-primary glow-red-subtle scale-105'
                              : 'border-transparent hover:border-primary/50 opacity-60 hover:opacity-100'
                            }
                          `}
                        >
                          <img
                            src={getImageUrl(image?.thumbnailPath || image?.originalPath || image)}
                            alt={`${postData.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-square sm:aspect-video flex items-center justify-center bg-surface-hover">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto text-text-secondary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-text-secondary text-sm">No images</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-5 animate-fade-in-right">
            {/* Badges & Title */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant={typeVariants[postData.type] || 'default'} glow>
                  {t(`post.types.${postData.type}`)}
                </Badge>
                {(postData.game?.name || postData.gameId?.name) && (
                  <Badge variant="default">
                    {postData.game?.name || postData.gameId?.name}
                  </Badge>
                )}
                {postData.status === 'sold' && (
                  <Badge variant="error" pulse>SOLD</Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4 leading-tight">
                {postData.title}
              </h1>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl sm:text-4xl font-bold text-primary text-glow">
                  {formatPrice(postData.price, postData.currency)}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 hover:border-primary/30 transition-colors">
              <h2 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                {t('post.description')}
              </h2>
              <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">
                {postData.description || t('post.noDescription')}
              </p>
            </div>

            {/* Seller Card */}
            <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 hover:border-primary/30 transition-colors">
              <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {t('post.seller')}
              </h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden ring-2 ring-primary/30">
                    {postData.userId?.avatarUrl ? (
                      <img
                        src={postData.userId.avatarUrl}
                        alt={postData.userId.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-primary font-bold text-xl">
                        {postData.userId?.displayName?.[0]?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  {postData.userId?.kycStatus === 'verified' && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center ring-2 ring-surface">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text-primary flex items-center gap-2">
                    {postData.userId?.displayName || t('common.user')}
                    {postData.userId?.kycStatus === 'verified' && (
                      <span className="text-xs text-success">Verified</span>
                    )}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {t('profile.memberSince')} {formatDate(postData.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {isOwner ? (
                <>
                  <Link to={`/posts/${id}/edit`} className="flex-1">
                    <Button fullWidth variant="secondary" size="lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {t('common.edit')}
                    </Button>
                  </Link>
                  <Link to="/my-posts" className="flex-1">
                    <Button fullWidth variant="secondary" size="lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      My Listings
                    </Button>
                  </Link>
                </>
              ) : (
                <Button
                  fullWidth
                  size="lg"
                  glow
                  onClick={handleContact}
                  loading={contactLoading}
                  disabled={postData.status === 'sold'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {t('post.contactSeller')}
                </Button>
              )}
            </div>

            {/* Post meta */}
            <div className="flex items-center justify-center gap-4 text-sm text-text-secondary pt-2">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(postData.createdAt)}
              </span>
              <span className="w-1 h-1 rounded-full bg-text-secondary" />
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {postData.viewsCount || 0} views
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && postData.images?.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={() => {
            play('whoosh')
            setShowLightbox(false)
          }}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
            onClick={() => {
              play('click')
              setShowLightbox(false)
            }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation arrows */}
          {postData.images?.length > 1 && (
            <>
              <button
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage('prev')
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage('next')
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Main image */}
          <img
            src={getImageUrl(postData.images[selectedImage]?.originalPath || postData.images[selectedImage])}
            alt={postData.title}
            className="max-w-[90vw] max-h-[85vh] object-contain animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Image counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-white">
            {selectedImage + 1} / {postData.images.length}
          </div>

          {/* Thumbnail strip */}
          {postData.images?.length > 0 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto p-2">
              {postData.images.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  handleImageSelect(index)
                }}
                className={`
                  w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all
                  ${selectedImage === index
                    ? 'border-primary scale-110'
                    : 'border-transparent opacity-50 hover:opacity-100'
                  }
                `}
              >
                <img src={getImageUrl(image?.thumbnailPath || image?.originalPath || image)} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}

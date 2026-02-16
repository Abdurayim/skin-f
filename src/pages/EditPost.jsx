import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import PostForm from '../components/posts/PostForm'
import Alert from '../components/common/Alert'
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card'
import { PageLoader } from '../components/common/Loader'
import { useLanguage } from '../hooks/useLanguage'
import { useApi } from '../hooks/useApi'
import { ENDPOINTS } from '../config/api'
import { getResponseData } from '../utils/apiHelpers'

export default function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { get, put, loading, error } = useApi()

  const [postData, setPostData] = useState(null)
  const [fetchLoading, setFetchLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error: apiError } = await get(ENDPOINTS.POST_BY_ID(id))
      if (data) {
        // Backend may return { data: { post: {...} } } or { data: {...} }
        const post = data.data?.post || data.post || data.data || data
        setPostData({
          title: post.title,
          description: post.description,
          price: post.price,
          currency: post.currency,
          type: post.type,
          game_id: post.game_id,
          images: post.images?.map(url => ({ url, preview: url })) || []
        })
      }
      setFetchLoading(false)
    }
    fetchPost()
  }, [id, get])

  const handleSubmit = async (formData) => {
    try {
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('price', formData.price)
      submitData.append('currency', formData.currency)
      submitData.append('type', formData.type)
      submitData.append('game_id', formData.game_id)

      formData.images.forEach((image) => {
        if (image.file) {
          submitData.append('images', image.file)
        } else if (image.url) {
          submitData.append('existing_images', image.url)
        }
      })

      const { data, error: apiError } = await put(ENDPOINTS.POST_BY_ID(id), submitData)

      if (data && !apiError) {
        navigate(`/posts/${id}`)
      }
    } catch {
      // Update failed silently, error shown via Alert
    }
  }

  if (fetchLoading) {
    return <PageLoader />
  }

  if (!postData) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-text-primary">
            {t('posts.notFound')}
          </h1>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card padding="lg">
          <CardHeader>
            <CardTitle>{t('post.editTitle')}</CardTitle>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert type="error" message={error} className="mb-6" />
            )}
            <PostForm
              initialData={postData}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

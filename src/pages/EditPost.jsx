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

export default function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { get, put, loading, error } = useApi()

  const [postData, setPostData] = useState(null)
  const [fetchLoading, setFetchLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await get(ENDPOINTS.POST_BY_ID(id))
      if (data) {
        setPostData({
          title: data.title,
          description: data.description,
          price: data.price,
          currency: data.currency,
          type: data.type,
          game_id: data.game_id,
          images: data.images?.map(url => ({ url, preview: url })) || []
        })
      }
      setFetchLoading(false)
    }
    fetchPost()
  }, [id, get])

  const handleSubmit = async (formData) => {
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

    const { data } = await put(ENDPOINTS.POST_BY_ID(id), submitData)

    if (data) {
      navigate(`/posts/${id}`)
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

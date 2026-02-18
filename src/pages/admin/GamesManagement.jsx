import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Loader from '../../components/common/Loader'
import { useLanguage } from '../../hooks/useLanguage'
import { API_BASE_URL, ENDPOINTS } from '../../config/api'
import { adminFetch } from '../../utils/adminAuth'

export default function GamesManagement() {
  const { t } = useLanguage()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingGame, setEditingGame] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [form, setForm] = useState({ name: '', icon: '', genres: '', isActive: true })
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    setLoading(true)
    try {
      const response = await adminFetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_GAMES}`)
      const data = await response.json().catch(() => ({}))
      if (response.ok) {
        const list = data.data?.games || data.data || []
        setGames(Array.isArray(list) ? list : [])
      }
    } catch {
      // Games fetch failed silently
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreate = () => {
    setForm({ name: '', icon: '', genres: '', isActive: true })
    setFormError('')
    setShowCreateModal(true)
  }

  const handleOpenEdit = (game) => {
    setFormError('')
    setEditingGame(game)
    setForm({
      name: game.name || '',
      icon: game.icon || '',
      genres: Array.isArray(game.genres) ? game.genres.join(', ') : '',
      isActive: game.isActive !== false
    })
  }

  const handleCreate = async () => {
    if (!form.name.trim()) return
    setFormError('')
    setActionLoading(true)
    try {
      const body = {
        name: form.name.trim(),
        icon: form.icon.trim() || undefined,
        genres: form.genres.split(',').map(g => g.trim()).filter(Boolean),
        isActive: form.isActive
      }
      const response = await adminFetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_GAME_CREATE}`, {
        method: 'POST',
        body: JSON.stringify(body)
      })
      const data = await response.json().catch(() => ({}))
      if (response.ok) {
        setShowCreateModal(false)
        setSuccessMessage(`Game "${form.name.trim()}" created successfully!`)
        setTimeout(() => setSuccessMessage(''), 4000)
        fetchGames()
      } else {
        setFormError(data?.message || `Failed to create game (${response.status})`)
      }
    } catch (err) {
      setFormError(err.message || 'Network error. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingGame || !form.name.trim()) return
    const gameId = editingGame._id || editingGame.id
    setFormError('')
    setActionLoading(true)
    try {
      const body = {
        name: form.name.trim(),
        icon: form.icon.trim() || undefined,
        genres: form.genres.split(',').map(g => g.trim()).filter(Boolean),
        isActive: form.isActive
      }
      const response = await adminFetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_GAME_UPDATE(gameId)}`, {
        method: 'PUT',
        body: JSON.stringify(body)
      })
      const data = await response.json().catch(() => ({}))
      if (response.ok) {
        setEditingGame(null)
        setSuccessMessage(`Game "${form.name.trim()}" updated successfully!`)
        setTimeout(() => setSuccessMessage(''), 4000)
        fetchGames()
      } else {
        setFormError(data?.message || `Failed to update game (${response.status})`)
      }
    } catch (err) {
      setFormError(err.message || 'Network error. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const renderFormModal = (isEdit) => (
    <Modal
      isOpen={isEdit ? !!editingGame : showCreateModal}
      onClose={() => {
        setFormError('')
        isEdit ? setEditingGame(null) : setShowCreateModal(false)
      }}
      title={isEdit ? t('admin.editGame') : t('admin.createGame')}
    >
      <div className="space-y-4">
        {formError && (
          <div className="p-3 bg-error/10 border border-error/30 rounded-lg">
            <p className="text-sm text-error flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formError}
            </p>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            {t('admin.gameName')} *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Counter-Strike 2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            {t('admin.gameIcon')}
          </label>
          <input
            type="text"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="https://example.com/icon.png"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            {t('admin.gameGenres')}
          </label>
          <input
            type="text"
            value={form.genres}
            onChange={(e) => setForm({ ...form, genres: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="FPS, Shooter, Action"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-text-primary">
            {t('admin.gameActive')}
          </label>
          <button
            type="button"
            onClick={() => setForm({ ...form, isActive: !form.isActive })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isActive ? 'bg-primary' : 'bg-border'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => isEdit ? setEditingGame(null) : setShowCreateModal(false)}
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="primary"
            fullWidth
            loading={actionLoading}
            onClick={isEdit ? handleUpdate : handleCreate}
            disabled={!form.name.trim()}
          >
            {isEdit ? t('common.save') : t('admin.createGame')}
          </Button>
        </div>
      </div>
    </Modal>
  )

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">{t('admin.games')}</h2>
        <Button onClick={handleOpenCreate}>
          {t('admin.createGame')}
        </Button>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-success/10 border border-success/30 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm text-success font-medium">{successMessage}</p>
        </div>
      )}

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('admin.gameName')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('admin.gameIcon')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('admin.gameGenres')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('admin.postsCount')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('admin.status')}
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader size="md" />
                  </td>
                </tr>
              ) : games.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-secondary">
                    {t('admin.noGames')}
                  </td>
                </tr>
              ) : (
                games.map(game => (
                  <tr key={game._id || game.id} className="border-b border-border hover:bg-surface-hover">
                    <td className="px-6 py-4">
                      <p className="text-text-primary font-medium">{game.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      {game.icon ? (
                        <img src={game.icon} alt={game.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center text-text-secondary">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(game.genres || []).map((genre, i) => (
                          <Badge key={i} size="sm" variant="info">{genre}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {game.postsCount || 0}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={game.isActive !== false ? 'success' : 'error'}>
                        {game.isActive !== false ? t('admin.statusActive') : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleOpenEdit(game)}
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
      </div>

      {renderFormModal(false)}
      {renderFormModal(true)}
    </AdminLayout>
  )
}

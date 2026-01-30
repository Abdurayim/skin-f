import Badge from '../common/Badge'
import { useLanguage } from '../../hooks/useLanguage'
import { formatDate } from '../../utils/formatters'

export default function ProfileCard({ profile }) {
  const { t } = useLanguage()

  const kycStatusVariants = {
    pending: 'warning',
    verified: 'success',
    rejected: 'error',
    not_submitted: 'default'
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-white">
              {profile.name?.[0]?.toUpperCase() || 'U'}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-semibold text-text-primary">
              {profile.name || t('common.user')}
            </h2>
            <Badge variant={kycStatusVariants[profile.kycStatus || 'not_submitted']}>
              {t(`kyc.status.${profile.kycStatus || 'not_submitted'}`)}
            </Badge>
          </div>

          <p className="text-text-secondary mt-1">{profile.phone}</p>

          {profile.email && (
            <p className="text-text-secondary text-sm mt-1">{profile.email}</p>
          )}

          <p className="text-text-secondary text-sm mt-2">
            {t('profile.memberSince')} {formatDate(profile.createdAt)}
          </p>
        </div>
      </div>

      {profile.bio && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-text-secondary text-sm">{profile.bio}</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-text-primary">
            {profile.postsCount || 0}
          </p>
          <p className="text-sm text-text-secondary">{t('profile.posts')}</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-text-primary">
            {profile.salesCount || 0}
          </p>
          <p className="text-sm text-text-secondary">{t('profile.sales')}</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-text-primary">
            {profile.rating || '-'}
          </p>
          <p className="text-sm text-text-secondary">{t('profile.rating')}</p>
        </div>
      </div>
    </div>
  )
}

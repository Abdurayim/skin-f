import Badge from '../common/Badge'
import { useLanguage } from '../../hooks/useLanguage'

export default function KYCStatus({ status, rejectionReason }) {
  const { t } = useLanguage()

  const statusConfig = {
    none: {
      variant: 'default',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: t('kyc.notSubmitted'),
      description: t('kyc.notSubmittedDesc')
    },
    pending: {
      variant: 'warning',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t('kyc.pending'),
      description: t('kyc.pendingDesc')
    },
    approved: {
      variant: 'success',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t('kyc.approved'),
      description: t('kyc.approvedDesc')
    },
    rejected: {
      variant: 'error',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t('kyc.rejected'),
      description: rejectionReason || t('kyc.rejectedDesc')
    }
  }

  const config = statusConfig[status] || statusConfig.none

  return (
    <div className="bg-surface border border-border rounded-xl p-6 text-center">
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
        config.variant === 'success' ? 'bg-success/20 text-success' :
        config.variant === 'warning' ? 'bg-warning/20 text-warning' :
        config.variant === 'error' ? 'bg-error/20 text-error' :
        'bg-surface-hover text-text-secondary'
      }`}>
        {config.icon}
      </div>

      <div className="flex justify-center mb-2">
        <Badge variant={config.variant} size="lg">
          {t(`kyc.status.${status || 'none'}`)}
        </Badge>
      </div>

      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {config.title}
      </h3>

      <p className="text-text-secondary text-sm">
        {config.description}
      </p>
    </div>
  )
}

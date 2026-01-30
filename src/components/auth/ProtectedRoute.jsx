import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { PageLoader } from '../common/Loader'

export default function ProtectedRoute({ children, requireKYC = false }) {
  const { isAuthenticated, isKYCVerified, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <PageLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireKYC && !isKYCVerified) {
    return <Navigate to="/kyc" state={{ from: location }} replace />
  }

  return children
}

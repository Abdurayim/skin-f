import { Navigate, useLocation } from 'react-router-dom'

export default function AdminProtectedRoute({ children }) {
  const location = useLocation()
  const adminToken = localStorage.getItem('admin_token')

  if (!adminToken) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}

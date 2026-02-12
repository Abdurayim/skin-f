import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminProtectedRoute from './components/auth/AdminProtectedRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Posts from './pages/Posts'
import PostDetail from './pages/PostDetail'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import MyPosts from './pages/MyPosts'
import Profile from './pages/Profile'
import KYC from './pages/KYC'
import Messages from './pages/Messages'
import Subscription from './pages/Subscription'
import PaymentCallback from './pages/PaymentCallback'
import Demo from './pages/Demo'
import NotFound from './pages/NotFound'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import Users from './pages/admin/Users'
import KYCReview from './pages/admin/KYCReview'
import PostsManagement from './pages/admin/PostsManagement'
import GamesManagement from './pages/admin/GamesManagement'
import Subscriptions from './pages/admin/Subscriptions'
import Reports from './pages/admin/Reports'
import AuditLogs from './pages/admin/AuditLogs'

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/posts/:id" element={<PostDetail />} />

      {/* Protected Routes */}
      <Route
        path="/create-post"
        element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts/:id/edit"
        element={
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-posts"
        element={
          <ProtectedRoute>
            <MyPosts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/kyc"
        element={
          <ProtectedRoute>
            <KYC />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscription"
        element={
          <ProtectedRoute>
            <Subscription />
          </ProtectedRoute>
        }
      />
      <Route path="/payments/callback" element={<PaymentCallback />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <Dashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminProtectedRoute>
            <Users />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/kyc"
        element={
          <AdminProtectedRoute>
            <KYCReview />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/posts"
        element={
          <AdminProtectedRoute>
            <PostsManagement />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/games"
        element={
          <AdminProtectedRoute>
            <GamesManagement />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/subscriptions"
        element={
          <AdminProtectedRoute>
            <Subscriptions />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <AdminProtectedRoute>
            <Reports />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/logs"
        element={
          <AdminProtectedRoute>
            <AuditLogs />
          </AdminProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

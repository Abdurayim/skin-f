import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'

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
import NotFound from './pages/NotFound'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import Users from './pages/admin/Users'
import KYCReview from './pages/admin/KYCReview'
import PostsManagement from './pages/admin/PostsManagement'

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
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

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/users" element={<Users />} />
      <Route path="/admin/kyc" element={<KYCReview />} />
      <Route path="/admin/posts" element={<PostsManagement />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

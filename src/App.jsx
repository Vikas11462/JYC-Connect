import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './routes/ProtectedRoute'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import DashboardLayout from './components/dashboard/DashboardLayout'

import HomePage from './pages/public/HomePage'
import EventsPage from './pages/public/EventsPage'
import EventDetailPage from './pages/public/EventDetailPage'
import HubsPage from './pages/public/HubsPage'
import HubDetailPage from './pages/public/HubDetailPage'
import GalleryPage from './pages/public/GalleryPage'
import AboutPage from './pages/public/AboutPage'
import TeamPage from './pages/public/TeamPage'
import ContactPage from './pages/public/ContactPage'
import NotFoundPage from './pages/public/NotFoundPage'
import UnauthorizedPage from './pages/public/UnauthorizedPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'

import StudentDashboardPage from './pages/student/StudentDashboardPage'
import StudentEventsPage from './pages/student/StudentEventsPage'
import StudentAnnouncementsPage from './pages/student/StudentAnnouncementsPage'
import StudentProfilePage from './pages/student/StudentProfilePage'

import CoordinatorDashboardPage from './pages/coordinator/CoordinatorDashboardPage'
import CoordinatorEventsPage from './pages/coordinator/CoordinatorEventsPage'
import CoordinatorEventFormPage from './pages/coordinator/CoordinatorEventFormPage'
import CoordinatorRegistrationsPage from './pages/coordinator/CoordinatorRegistrationsPage'
import CoordinatorAttendancePage from './pages/coordinator/CoordinatorAttendancePage'
import CoordinatorAnnouncementsPage from './pages/coordinator/CoordinatorAnnouncementsPage'

import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminHubsPage from './pages/admin/AdminHubsPage'
import AdminEventsPage from './pages/admin/AdminEventsPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminAnnouncementsPage from './pages/admin/AdminAnnouncementsPage'
import AdminGalleryPage from './pages/admin/AdminGalleryPage'
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage'
import AdminTeamPage from './pages/admin/AdminTeamPage'

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main><Outlet /></main>
      <Footer />
    </>
  )
}

function ScrollToTop() {
  return null // routes remount at top by default for distinct pages
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ScrollToTop />
          <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/hubs" element={<HubsPage />} />
            <Route path="/hubs/:slug" element={<HubDetailPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Route>

          {/* Student */}
          <Route path="/dashboard" element={<ProtectedRoute roles={['STUDENT', 'COORDINATOR', 'ADMIN']}><DashboardLayout role="STUDENT" /></ProtectedRoute>}>
            <Route index element={<StudentDashboardPage />} />
            <Route path="my-events" element={<StudentEventsPage />} />
            <Route path="announcements" element={<StudentAnnouncementsPage />} />
            <Route path="profile" element={<StudentProfilePage />} />
          </Route>

          {/* Coordinator */}
          <Route path="/coordinator" element={<ProtectedRoute roles={['COORDINATOR', 'ADMIN']}><DashboardLayout role="COORDINATOR" /></ProtectedRoute>}>
            <Route path="dashboard" element={<CoordinatorDashboardPage />} />
            <Route path="events" element={<CoordinatorEventsPage />} />
            <Route path="events/new" element={<CoordinatorEventFormPage />} />
            <Route path="registrations" element={<CoordinatorRegistrationsPage />} />
            <Route path="attendance" element={<CoordinatorAttendancePage />} />
            <Route path="announcements" element={<CoordinatorAnnouncementsPage />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><DashboardLayout role="ADMIN" /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="hubs" element={<AdminHubsPage />} />
            <Route path="events" element={<AdminEventsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="announcements" element={<AdminAnnouncementsPage />} />
            <Route path="gallery" element={<AdminGalleryPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="team" element={<AdminTeamPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

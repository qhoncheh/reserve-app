import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore.js'
import { initData } from '../services/authService.js'
import { AppLayout } from '../layouts/AppLayout.jsx'

import { Home } from '../pages/public/Home/Home.jsx'
import { Services } from '../pages/public/Services/Services.jsx'
import { Providers } from '../pages/public/Providers/Providers.jsx'
import { ProviderDetail } from '../pages/public/ProviderDetail/ProviderDetail.jsx'
import { BookAppointment } from '../pages/public/BookAppointment/BookAppointment.jsx'
import { Auth } from '../pages/auth/Auth.jsx'
import { Profile } from '../pages/profile/Profile.jsx'
import { History } from '../pages/user/History/History.jsx'
import { UserAppointments } from '../pages/user/UserAppointments/UserAppointments.jsx'
import { AdminDashboard } from '../pages/admin/Dashboard/AdminDashboard.jsx'
import { AdminProviders } from '../pages/admin/Providers/AdminProviders.jsx'
import { AdminServices } from '../pages/admin/Services/AdminServices.jsx'
import { AdminAppointments } from '../pages/admin/Appointments/AdminAppointments.jsx'
import { ProviderDashboard } from '../pages/provider/ProviderDashboard/ProviderDashboard.jsx'
import { WorkingHours } from '../pages/provider/WorkingHours/WorkingHours.jsx'
import { ProviderAppointments } from '../pages/provider/ProviderAppointments/ProviderAppointments.jsx'

function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/" replace />
  return children
}

export function AppRouter() {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    initData()
    checkAuth()
  }, [])

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/providers/:id" element={<ProviderDetail />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/history" element={<History />} />

        <Route
          path="/admin"
          element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}
        />
        <Route
          path="/admin/providers"
          element={<ProtectedRoute role="admin"><AdminProviders /></ProtectedRoute>}
        />
        <Route
          path="/admin/services"
          element={<ProtectedRoute role="admin"><AdminServices /></ProtectedRoute>}
        />
        <Route
          path="/admin/appointments"
          element={<ProtectedRoute role="admin"><AdminAppointments /></ProtectedRoute>}
        />

        <Route
          path="/provider"
          element={<ProtectedRoute role="provider"><ProviderDashboard /></ProtectedRoute>}
        />
        <Route
          path="/provider/hours"
          element={<ProtectedRoute role="provider"><WorkingHours /></ProtectedRoute>}
        />
        <Route
          path="/provider/appointments"
          element={<ProtectedRoute role="provider"><ProviderAppointments /></ProtectedRoute>}
        />

        <Route
          path="/my-appointments"
          element={<ProtectedRoute><UserAppointments /></ProtectedRoute>}
        />
      </Route>
    </Routes>
  )
}

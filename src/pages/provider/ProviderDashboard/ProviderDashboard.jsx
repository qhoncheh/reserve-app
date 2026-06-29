import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores/authStore.js'
import { useProviderStore } from '../../../stores/providerStore.js'
import { useAppointmentStore } from '../../../stores/appointmentStore.js'
import { Card } from '../../../components/Card/Card.jsx'
import './ProviderDashboard.css'

export function ProviderDashboard() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { providers, loadProviders } = useProviderStore()
  const { appointments, loadAppointments } = useAppointmentStore()

  useEffect(() => {
    loadProviders()
    loadAppointments()
  }, [])

  if (!isAuthenticated || user?.role !== 'provider') {
    navigate('/login')
    return null
  }

  const provider = providers.find((p) => p.id === user.id)
  const providerAppointments = appointments.filter((a) => a.providerId === user.id)
  const pendingAppointments = providerAppointments.filter((a) => a.status === 'pending')
  const todayAppointments = providerAppointments.filter((a) => a.date === new Date().toISOString().split('T')[0])

  const statusLabels = {
    pending: 'در انتظار',
    confirmed: 'تأیید شده',
    completed: 'انجام شده',
    cancelled: 'لغو شده',
  }

  if (!provider) return null

  return (
    <div className="app-content">
      <div className="page-header">
        <h1 className="page-title">داشبورد</h1>
        <p className="page-subtitle">خوش آمدید، {provider.name}</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-icon">📅</span>
          <span className="admin-stat-value">{providerAppointments.length}</span>
          <span className="admin-stat-label">کل نوبت‌ها</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">⏳</span>
          <span className="admin-stat-value">{pendingAppointments.length}</span>
          <span className="admin-stat-label">در انتظار</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">✅</span>
          <span className="admin-stat-value">{todayAppointments.length}</span>
          <span className="admin-stat-label">نوبت امروز</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">⭐</span>
          <span className="admin-stat-value">{provider.rating}</span>
          <span className="admin-stat-label">امتیاز</span>
        </div>
      </div>

      <Card clickable onClick={() => navigate('/provider/appointments')}>
        <div className="flex-row">
          <span className="admin-action-icon">📅</span>
          <div>
            <h3>مشاهده نوبت‌ها</h3>
            <p className="admin-action-desc">{pendingAppointments.length} نوبت در انتظار تأیید</p>
          </div>
        </div>
      </Card>

      <Card clickable onClick={() => navigate('/provider/hours')}>
        <div className="flex-row">
          <span className="admin-action-icon">⏰</span>
          <div>
            <h3>ساعات کاری</h3>
            <p className="admin-action-desc">{provider.workingHours.start} - {provider.workingHours.end}</p>
          </div>
        </div>
      </Card>

      <h2 className="section-title mt-lg">نوبت‌های امروز</h2>
      {todayAppointments.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">نوبتی برای امروز ندارید</p>
        </div>
      ) : (
        todayAppointments.map((apt) => (
          <Card key={apt.id}>
            <div className="flex-between">
              <div>
                <h3 className="provider-apt-service">{apt.serviceName}</h3>
                <p className="provider-apt-user">کاربر: {apt.userName}</p>
                <p className="provider-apt-time">{apt.time}</p>
              </div>
              <span className={`badge ${apt.status === 'pending' ? 'badge-warning' : 'badge-primary'}`}>
                {statusLabels[apt.status]}
              </span>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}

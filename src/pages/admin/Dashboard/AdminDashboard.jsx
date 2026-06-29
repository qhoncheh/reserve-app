import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores/authStore.js'
import { useServiceStore } from '../../../stores/serviceStore.js'
import { useProviderStore } from '../../../stores/providerStore.js'
import { useAppointmentStore } from '../../../stores/appointmentStore.js'
import { Card } from '../../../components/Card/Card.jsx'
import './AdminDashboard.css'

export function AdminDashboard() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { services, loadServices } = useServiceStore()
  const { providers, loadProviders } = useProviderStore()
  const { appointments, loadAppointments } = useAppointmentStore()

  useEffect(() => {
    loadServices()
    loadProviders()
    loadAppointments()
  }, [])

  if (!isAuthenticated || user?.role !== 'admin') {
    navigate('/login')
    return null
  }

  const pendingCount = appointments.filter((a) => a.status === 'pending').length
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length
  const completedCount = appointments.filter((a) => a.status === 'completed').length

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const statusLabels = {
    pending: 'در انتظار',
    confirmed: 'تأیید شده',
    completed: 'انجام شده',
    cancelled: 'لغو شده',
  }

  return (
    <div className="app-content">
      <div className="page-header">
        <h1 className="page-title">داشبورد مدیریت</h1>
        <p className="page-subtitle">خوش آمدید، {user.name}</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-icon">📋</span>
          <span className="admin-stat-value">{services.length}</span>
          <span className="admin-stat-label">خدمات</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">👨‍🔧</span>
          <span className="admin-stat-value">{providers.length}</span>
          <span className="admin-stat-label">متخصصان</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">📅</span>
          <span className="admin-stat-value">{appointments.length}</span>
          <span className="admin-stat-label">نوبت‌ها</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">⏳</span>
          <span className="admin-stat-value">{pendingCount}</span>
          <span className="admin-stat-label">در انتظار</span>
        </div>
      </div>

      <div className="admin-quick-actions">
        <Card clickable onClick={() => navigate('/admin/providers')}>
          <div className="flex-row">
            <span className="admin-action-icon">👨‍🔧</span>
            <div>
              <h3>مدیریت متخصصان</h3>
              <p className="admin-action-desc">افزودن، ویرایش و حذف متخصصان</p>
            </div>
          </div>
        </Card>
        <Card clickable onClick={() => navigate('/admin/services')}>
          <div className="flex-row">
            <span className="admin-action-icon">📋</span>
            <div>
              <h3>مدیریت خدمات</h3>
              <p className="admin-action-desc">افزودن، ویرایش و حذف خدمات</p>
            </div>
          </div>
        </Card>
        <Card clickable onClick={() => navigate('/admin/appointments')}>
          <div className="flex-row">
            <span className="admin-action-icon">📅</span>
            <div>
              <h3>مدیریت نوبت‌ها</h3>
              <p className="admin-action-desc">مشاهده و تغییر وضعیت نوبت‌ها</p>
            </div>
          </div>
        </Card>
      </div>

      <h2 className="section-title">آخرین نوبت‌ها</h2>
      {recentAppointments.map((apt) => (
        <Card key={apt.id}>
          <div className="flex-between mb-sm">
            <span className="admin-apt-service">{apt.serviceName}</span>
            <span className={`badge badge-${apt.status === 'pending' ? 'warning' : apt.status === 'confirmed' ? 'primary' : apt.status === 'completed' ? 'primary' : 'danger'}`}>
              {statusLabels[apt.status]}
            </span>
          </div>
          <div className="admin-apt-details">
            <span>متخصص: {apt.providerName}</span>
            <span>کاربر: {apt.userName}</span>
            <span>{apt.date} - {apt.time}</span>
          </div>
        </Card>
      ))}

      {appointments.length === 0 && (
        <div className="empty-state">
          <p className="empty-state-text">هیچ نوبتی ثبت نشده است</p>
        </div>
      )}
    </div>
  )
}

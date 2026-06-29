import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores/authStore.js'
import { useAppointmentStore } from '../../../stores/appointmentStore.js'
import { useUiStore } from '../../../stores/uiStore.js'
import { Card } from '../../../components/Card/Card.jsx'
import { Button } from '../../../components/Button/Button.jsx'
import { Header } from '../../../components/Header/Header.jsx'
import './AdminAppointments.css'

export function AdminAppointments() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { appointments, loadAppointments, updateAppointmentStatus } = useAppointmentStore()
  const { showToast } = useUiStore()

  useEffect(() => {
    loadAppointments()
  }, [])

  if (!isAuthenticated || user?.role !== 'admin') return null

  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )

  const statusLabels = {
    pending: 'در انتظار تأیید',
    confirmed: 'تأیید شده',
    completed: 'انجام شده',
    cancelled: 'لغو شده',
  }

  const statusClass = {
    pending: 'badge-warning',
    confirmed: 'badge-primary',
    completed: 'badge-primary',
    cancelled: 'badge-danger',
  }

  const handleStatusChange = (id, newStatus) => {
    updateAppointmentStatus(id, newStatus)
    const msg = {
      confirmed: 'نوبت تأیید شد',
      completed: 'نوبت به اتمام رسید',
      cancelled: 'نوبت لغو شد',
    }
    showToast(msg[newStatus] || 'وضعیت تغییر کرد', 'success')
  }

  return (
    <div className="app-content">
      <Header title="مدیریت نوبت‌ها" onBack={() => navigate('/admin')} />

      {sortedAppointments.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">هیچ نوبتی ثبت نشده است</p>
        </div>
      ) : (
        sortedAppointments.map((apt) => (
          <Card key={apt.id}>
            <div className="flex-between mb-sm">
              <span className="admin-apt-title">{apt.serviceName}</span>
              <span className={`badge ${statusClass[apt.status]}`}>
                {statusLabels[apt.status]}
              </span>
            </div>
            <div className="admin-apt-grid">
              <div>
                <span className="admin-apt-label">متخصص</span>
                <p className="admin-apt-text">{apt.providerName}</p>
              </div>
              <div>
                <span className="admin-apt-label">کاربر</span>
                <p className="admin-apt-text">{apt.userName}</p>
              </div>
              <div>
                <span className="admin-apt-label">تاریخ و ساعت</span>
                <p className="admin-apt-text">{apt.date} - {apt.time}</p>
              </div>
            </div>
            {apt.notes && (
              <p className="admin-apt-notes">{apt.notes}</p>
            )}
            <div className="admin-apt-actions">
              {apt.status === 'pending' && (
                <>
                  <Button small onClick={() => handleStatusChange(apt.id, 'confirmed')}>
                    تأیید
                  </Button>
                  <Button small variant="outline" onClick={() => handleStatusChange(apt.id, 'cancelled')}>
                    لغو
                  </Button>
                </>
              )}
              {apt.status === 'confirmed' && (
                <Button small onClick={() => handleStatusChange(apt.id, 'completed')}>
                  اتمام نوبت
                </Button>
              )}
            </div>
          </Card>
        ))
      )}
    </div>
  )
}

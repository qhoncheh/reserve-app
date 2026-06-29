import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores/authStore.js'
import { useAppointmentStore } from '../../../stores/appointmentStore.js'
import { useUiStore } from '../../../stores/uiStore.js'
import { Card } from '../../../components/Card/Card.jsx'
import { Button } from '../../../components/Button/Button.jsx'
import { Header } from '../../../components/Header/Header.jsx'
import './UserAppointments.css'

export function UserAppointments() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { appointments, loadAppointments, cancelAppointment } = useAppointmentStore()
  const { showToast } = useUiStore()

  useEffect(() => {
    loadAppointments()
  }, [])

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  const userAppointments = appointments
    .filter((a) => a.userId === user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const activeAppointments = userAppointments.filter(
    (a) => a.status !== 'cancelled' && a.status !== 'completed'
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

  const handleCancel = (id) => {
    cancelAppointment(id)
    showToast('نوبت با موفقیت لغو شد', 'warning')
  }

  return (
    <div className="app-content">
      <Header title="نوبت‌های من" onBack={() => navigate('/profile')} />

      {activeAppointments.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">نوبت فعالی ندارید</p>
          <Button variant="outline" className="mt-md" onClick={() => navigate('/services')}>
            رزرو نوبت جدید
          </Button>
        </div>
      ) : (
        activeAppointments.map((apt) => (
          <Card key={apt.id}>
            <div className="flex-between mb-sm">
              <h3 className="user-apt-service">{apt.serviceName}</h3>
              <span className={`badge ${statusClass[apt.status]}`}>
                {statusLabels[apt.status]}
              </span>
            </div>
            <div className="user-apt-details">
              <p>متخصص: {apt.providerName}</p>
              <p>تاریخ: {apt.date}</p>
              <p>ساعت: {apt.time}</p>
            </div>
            {apt.status !== 'cancelled' && (
              <Button
                small
                variant="outline"
                className="mt-sm"
                onClick={() => handleCancel(apt.id)}
              >
                لغو نوبت
              </Button>
            )}
          </Card>
        ))
      )}
    </div>
  )
}

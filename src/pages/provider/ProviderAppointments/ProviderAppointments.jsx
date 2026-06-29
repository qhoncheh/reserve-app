import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores/authStore.js'
import { useAppointmentStore } from '../../../stores/appointmentStore.js'
import { useUiStore } from '../../../stores/uiStore.js'
import { Card } from '../../../components/Card/Card.jsx'
import { Button } from '../../../components/Button/Button.jsx'
import { Header } from '../../../components/Header/Header.jsx'
import './ProviderAppointments.css'

export function ProviderAppointments() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { appointments, loadAppointments, updateAppointmentStatus } = useAppointmentStore()
  const { showToast } = useUiStore()

  useEffect(() => {
    loadAppointments()
  }, [])

  if (!isAuthenticated || user?.role !== 'provider') {
    navigate('/login')
    return null
  }

  const providerAppointments = appointments
    .filter((a) => a.providerId === user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

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

  const handleConfirm = (id) => {
    updateAppointmentStatus(id, 'confirmed')
    showToast('نوبت تأیید شد', 'success')
  }

  const handleComplete = (id) => {
    updateAppointmentStatus(id, 'completed')
    showToast('نوبت به اتمام رسید', 'success')
  }

  const handleCancel = (id) => {
    updateAppointmentStatus(id, 'cancelled')
    showToast('نوبت لغو شد', 'warning')
  }

  return (
    <div className="app-content">
      <Header title="نوبت‌های من" onBack={() => navigate('/provider')} />

      {providerAppointments.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">هیچ نوبتی برای شما ثبت نشده است</p>
        </div>
      ) : (
        providerAppointments.map((apt) => (
          <Card key={apt.id}>
            <div className="flex-between mb-sm">
              <h3 className="prov-apt-service">{apt.serviceName}</h3>
              <span className={`badge ${statusClass[apt.status]}`}>
                {statusLabels[apt.status]}
              </span>
            </div>
            <div className="prov-apt-details">
              <p>کاربر: {apt.userName}</p>
              <p>تاریخ: {apt.date}</p>
              <p>ساعت: {apt.time}</p>
            </div>
            {apt.notes && (
              <p className="prov-apt-notes">{apt.notes}</p>
            )}
            <div className="prov-apt-actions">
              {apt.status === 'pending' && (
                <>
                  <Button small onClick={() => handleConfirm(apt.id)}>
                    تأیید نوبت
                  </Button>
                  <Button small variant="outline" onClick={() => handleCancel(apt.id)}>
                    لغو
                  </Button>
                </>
              )}
              {apt.status === 'confirmed' && (
                <>
                  <Button small onClick={() => handleComplete(apt.id)}>
                    اتمام نوبت
                  </Button>
                  <Button small variant="outline" onClick={() => handleCancel(apt.id)}>
                    لغو
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))
      )}
    </div>
  )
}

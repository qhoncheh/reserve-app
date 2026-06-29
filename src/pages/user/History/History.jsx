import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores/authStore.js'
import { useAppointmentStore } from '../../../stores/appointmentStore.js'
import { Card } from '../../../components/Card/Card.jsx'
import { Header } from '../../../components/Header/Header.jsx'
import './History.css'

export function History() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { appointments, loadAppointments } = useAppointmentStore()

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

  return (
    <div className="app-content">
      <Header title="تاریخچه نوبت‌ها" onBack={() => navigate('/profile')} />

      {userAppointments.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">هیچ نوبتی ثبت نشده است</p>
        </div>
      ) : (
        userAppointments.map((apt) => (
          <Card key={apt.id}>
            <div className="flex-between mb-sm">
              <h3 className="history-service">{apt.serviceName}</h3>
              <span className={`badge ${statusClass[apt.status]}`}>
                {statusLabels[apt.status]}
              </span>
            </div>
            <div className="history-details">
              <p>متخصص: {apt.providerName}</p>
              <p>تاریخ: {apt.date}</p>
              <p>ساعت: {apt.time}</p>
              {apt.notes && <p>توضیحات: {apt.notes}</p>}
            </div>
          </Card>
        ))
      )}
    </div>
  )
}

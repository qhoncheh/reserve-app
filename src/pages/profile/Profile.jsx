import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore.js'
import { useAppointmentStore } from '../../stores/appointmentStore.js'
import { useUiStore } from '../../stores/uiStore.js'
import { Card } from '../../components/Card/Card.jsx'
import { Button } from '../../components/Button/Button.jsx'
import './Profile.css'

export function Profile() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { appointments, loadAppointments, cancelAppointment } = useAppointmentStore()
  const { showToast } = useUiStore()

  useEffect(() => {
    if (isAuthenticated) loadAppointments()
  }, [isAuthenticated])

  const userAppointments = isAuthenticated
    ? appointments.filter((a) => a.userId === user.id)
    : []

  const activeAppointments = userAppointments.filter(
    (a) => a.status !== 'cancelled'
  )

  const handleCancel = (id) => {
    cancelAppointment(id)
    showToast('نوبت با موفقیت لغو شد', 'warning')
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

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

  if (!isAuthenticated) {
    return (
      <div className="app-content">
        <div className="page-header">
          <h1 className="page-title">پروفایل</h1>
        </div>
        <Card className="profile-cta-card">
          <p>برای مشاهده پروفایل وارد حساب خود شوید</p>
          <Button onClick={() => navigate('/login')} className="mt-md">
            ورود / ثبت نام
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="app-content">
      <div className="page-header">
        <h1 className="page-title">پروفایل</h1>
      </div>

      <Card>
        <div className="profile-header">
          <div className="avatar" style={{ width: 72, height: 72, fontSize: 28 }}>
            {user.name[0]}
          </div>
          <div>
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            <span className={`badge ${user.role === 'admin' ? 'badge-primary' : user.role === 'provider' ? 'badge-warning' : 'badge-primary'}`}>
              {user.role === 'admin' ? 'مدیر' : user.role === 'provider' ? 'متخصص' : 'کاربر'}
            </span>
          </div>
        </div>
      </Card>

      {user.role === 'user' && (
        <>
          <div className="section-header mt-lg">
            <h2 className="section-title">نوبت‌های فعال</h2>
          </div>

          {activeAppointments.length === 0 ? (
            <Card>
              <div className="empty-state">
                <p className="empty-state-text">نوبت فعالی ندارید</p>
                <Button
                  variant="outline"
                  className="mt-md"
                  onClick={() => navigate('/services')}
                >
                  رزرو نوبت جدید
                </Button>
              </div>
            </Card>
          ) : (
            activeAppointments.map((apt) => (
              <Card key={apt.id}>
                <div className="flex-between mb-sm">
                  <span className="profile-apt-service">{apt.serviceName}</span>
                  <span className={`badge ${statusClass[apt.status]}`}>
                    {statusLabels[apt.status]}
                  </span>
                </div>
                <p className="profile-apt-detail">
                  متخصص: {apt.providerName}
                </p>
                <p className="profile-apt-detail">
                  تاریخ: {apt.date} - ساعت: {apt.time}
                </p>
                {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                  <Button
                    variant="outline"
                    small
                    className="mt-sm"
                    onClick={() => handleCancel(apt.id)}
                  >
                    لغو نوبت
                  </Button>
                )}
              </Card>
            ))
          )}

          <div className="section-header mt-lg">
            <h2 className="section-title">تاریخچه نوبت‌ها</h2>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => navigate('/profile/history')}
            >
              مشاهده همه
            </button>
          </div>
        </>
      )}

      {user.role === 'admin' && (
        <Card>
          <h3 className="section-title">پنل مدیریت</h3>
          <div className="profile-admin-links">
            <button className="profile-admin-link" onClick={() => navigate('/admin')}>
              <span>📊</span> داشبورد
            </button>
            <button className="profile-admin-link" onClick={() => navigate('/admin/providers')}>
              <span>👨‍🔧</span> مدیریت متخصصان
            </button>
            <button className="profile-admin-link" onClick={() => navigate('/admin/services')}>
              <span>📋</span> مدیریت خدمات
            </button>
            <button className="profile-admin-link" onClick={() => navigate('/admin/appointments')}>
              <span>📅</span> مدیریت نوبت‌ها
            </button>
          </div>
        </Card>
      )}

      {user.role === 'provider' && (
        <Card>
          <h3 className="section-title">پنل متخصص</h3>
          <div className="profile-admin-links">
            <button className="profile-admin-link" onClick={() => navigate('/provider')}>
              <span>📊</span> داشبورد
            </button>
            <button className="profile-admin-link" onClick={() => navigate('/provider/appointments')}>
              <span>📅</span> نوبت‌ها
            </button>
            <button className="profile-admin-link" onClick={() => navigate('/provider/hours')}>
              <span>⏰</span> ساعات کاری
            </button>
          </div>
        </Card>
      )}

      <div className="mt-lg">
        <Button variant="outline" onClick={handleLogout}>
          خروج از حساب
        </Button>
      </div>
    </div>
  )
}

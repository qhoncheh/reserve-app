import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores/authStore.js'
import { useServiceStore } from '../../../stores/serviceStore.js'
import { useProviderStore } from '../../../stores/providerStore.js'
import { useAppointmentStore } from '../../../stores/appointmentStore.js'
import { Card } from '../../../components/Card/Card.jsx'
import { Button } from '../../../components/Button/Button.jsx'
import './Home.css'

export function Home() {
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

  const userAppointments = isAuthenticated
    ? appointments.filter((a) => a.userId === user.id)
    : []

  return (
    <div className="app-content">
      <div className="home-hero">
        <h1 className="home-hero-title">
          {isAuthenticated ? `خوش آمدی، ${user.name}` : 'نوبت‌دهی خدمات'}
        </h1>
        <p className="home-hero-subtitle">
          سریع و آسان از متخصصان مورد نظرت نوبت بگیر
        </p>
      </div>

      <div className="home-stats">
        <div className="home-stat-card">
          <span className="home-stat-number">{services.length}</span>
          <span className="home-stat-label">خدمات</span>
        </div>
        <div className="home-stat-card">
          <span className="home-stat-number">{providers.length}</span>
          <span className="home-stat-label">متخصص</span>
        </div>
        {isAuthenticated && (
          <div className="home-stat-card">
            <span className="home-stat-number">{userAppointments.length}</span>
            <span className="home-stat-label">نوبت‌ها</span>
          </div>
        )}
      </div>

      <div className="section-header">
        <h2 className="section-title">خدمات محبوب</h2>
        <button
          className="btn btn-sm btn-outline"
          onClick={() => navigate('/services')}
        >
          مشاهده همه
        </button>
      </div>

      <div className="home-services-scroll">
        {services.slice(0, 4).map((service) => (
          <Card
            key={service.id}
            clickable
            className="home-service-card"
            onClick={() => navigate(`/services`)}
          >
            <span className="home-service-icon">{service.icon}</span>
            <h3 className="home-service-name">{service.name}</h3>
            <p className="home-service-price">
              {service.price.toLocaleString()} تومان
            </p>
          </Card>
        ))}
      </div>

      <div className="section-header mt-lg">
        <h2 className="section-title">متخصصان برتر</h2>
        <button
          className="btn btn-sm btn-outline"
          onClick={() => navigate('/providers')}
        >
          مشاهده همه
        </button>
      </div>

      {providers.slice(0, 3).map((provider) => (
        <Card
          key={provider.id}
          clickable
          onClick={() => navigate(`/providers/${provider.id}`)}
        >
          <div className="flex-between">
            <div className="flex-row">
              <div className="avatar">{provider.name[0]}</div>
              <div>
                <h3 className="home-provider-name">{provider.name}</h3>
                <p className="home-provider-rating">
                  {'★'.repeat(Math.round(provider.rating))}
                  {'☆'.repeat(5 - Math.round(provider.rating))}
                  {' '}{provider.rating}
                </p>
              </div>
            </div>
            <span className="badge badge-primary">
              {provider.reviewCount} نظر
            </span>
          </div>
        </Card>
      ))}

      {!isAuthenticated && (
        <Card className="home-cta">
          <p className="home-cta-text">
            برای رزرو نوبت وارد حساب کاربری خود شوید
          </p>
          <Button onClick={() => navigate('/login')}>
            ورود / ثبت نام
          </Button>
        </Card>
      )}
    </div>
  )
}

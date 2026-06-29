import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProviderStore } from '../../../stores/providerStore.js'
import { useServiceStore } from '../../../stores/serviceStore.js'
import { Card } from '../../../components/Card/Card.jsx'
import { Button } from '../../../components/Button/Button.jsx'
import { Header } from '../../../components/Header/Header.jsx'
import './ProviderDetail.css'

export function ProviderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { providers, loadProviders } = useProviderStore()
  const { services, loadServices } = useServiceStore()

  useEffect(() => {
    loadProviders()
    loadServices()
  }, [])

  const provider = providers.find((p) => p.id === id)

  if (!provider) {
    return (
      <div className="app-content">
        <div className="empty-state">
          <p className="empty-state-text">متخصص یافت نشد</p>
          <Button onClick={() => navigate('/providers')} variant="outline" className="mt-md">
            بازگشت به لیست
          </Button>
        </div>
      </div>
    )
  }

  const dayNames = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه']

  return (
    <div className="app-content">
      <Header
        title=""
        onBack={() => navigate('/providers')}
      />

      <div className="provider-detail-header">
        <div className="avatar avatar-lg" style={{ width: 80, height: 80, fontSize: 36 }}>
          {provider.name[0]}
        </div>
        <h1 className="provider-detail-name">{provider.name}</h1>
        <p className="provider-detail-rating">
          {'★'.repeat(Math.round(provider.rating))}
          {'☆'.repeat(5 - Math.round(provider.rating))}
          {' '}{provider.rating} ({provider.reviewCount} نظر)
        </p>
      </div>

      <Card>
        <h3 className="section-title">درباره</h3>
        <p className="provider-detail-bio">{provider.bio}</p>
      </Card>

      <Card>
        <h3 className="section-title">خدمات</h3>
        <div className="provider-detail-services">
          {provider.serviceIds.map((sid) => {
            const svc = services.find((s) => s.id === sid)
            if (!svc) return null
            return (
              <div key={sid} className="provider-service-item">
                <div className="flex-row">
                  <span className="service-icon" style={{ fontSize: 24 }}>{svc.icon}</span>
                  <div>
                    <p className="provider-service-name">{svc.name}</p>
                    <p className="provider-service-price">{svc.price.toLocaleString()} تومان</p>
                  </div>
                </div>
                <span className="provider-service-duration">{svc.duration} دقیقه</span>
              </div>
            )
          })}
        </div>
      </Card>

      <Card>
        <h3 className="section-title">ساعات کاری</h3>
        <div className="provider-hours-grid">
          {dayNames.map((day, index) => {
            const isWorking = provider.workingDays.includes(index)
            return (
              <div key={index} className={`provider-hour-row ${isWorking ? '' : 'off'}`}>
                <span className="provider-hour-day">{day}</span>
                <span className="provider-hour-time">
                  {isWorking
                    ? `${provider.workingHours.start} - ${provider.workingHours.end}`
                    : 'تعطیل'
                  }
                </span>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="provider-detail-cta">
        <Button onClick={() => navigate(`/book?providerId=${provider.id}`)}>
          رزرو نوبت
        </Button>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useServiceStore } from '../../../stores/serviceStore.js'
import { useProviderStore } from '../../../stores/providerStore.js'
import { Card } from '../../../components/Card/Card.jsx'
import { Header } from '../../../components/Header/Header.jsx'
import './Services.css'

export function Services() {
  const navigate = useNavigate()
  const { services, loadServices } = useServiceStore()
  const { providers, loadProviders } = useProviderStore()
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadServices()
    loadProviders()
  }, [])

  const filtered = services.filter((s) =>
    s.name.includes(search) || s.description.includes(search)
  )

  const getProviderCount = (serviceId) => {
    return providers.filter((p) => p.serviceIds.includes(serviceId)).length
  }

  return (
    <div className="app-content">
      <div className="page-header">
        <h1 className="page-title">خدمات</h1>
        <p className="page-subtitle">یکی از خدمات مورد نیازت رو انتخاب کن</p>
      </div>

      <div className="search-box">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="search-input"
          type="text"
          placeholder="جستجوی خدمات..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="services-list">
        {filtered.map((service) => (
          <Card
            key={service.id}
            clickable
            onClick={() => navigate(`/book?serviceId=${service.id}`)}
          >
            <div className="flex-between">
              <div className="flex-row">
                <span className="service-icon">{service.icon}</span>
                <div>
                  <h3 className="service-name">{service.name}</h3>
                  <p className="service-desc">{service.description}</p>
                  <div className="flex-row" style={{ gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xs)' }}>
                    <span className="service-meta">{service.duration} دقیقه</span>
                    <span className="service-meta">{getProviderCount(service.id)} متخصص</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="service-footer">
              <span className="service-price">{service.price.toLocaleString()} تومان</span>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">
            <p className="empty-state-text">خدمتی یافت نشد</p>
          </div>
        )}
      </div>
    </div>
  )
}

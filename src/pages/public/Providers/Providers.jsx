import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProviderStore } from '../../../stores/providerStore.js'
import { useServiceStore } from '../../../stores/serviceStore.js'
import { Card } from '../../../components/Card/Card.jsx'
import './Providers.css'

export function Providers() {
  const navigate = useNavigate()
  const { providers, loadProviders } = useProviderStore()
  const { services, loadServices } = useServiceStore()
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadProviders()
    loadServices()
  }, [])

  const filtered = providers.filter((p) =>
    p.name.includes(search) || p.bio.includes(search)
  )

  const getServiceNames = (serviceIds) => {
    return serviceIds
      .map((id) => services.find((s) => s.id === id)?.name)
      .filter(Boolean)
      .join('، ')
  }

  return (
    <div className="app-content">
      <div className="page-header">
        <h1 className="page-title">متخصصان</h1>
        <p className="page-subtitle">بهترین متخصصان هر حوزه را پیدا کن</p>
      </div>

      <div className="search-box">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="search-input"
          type="text"
          placeholder="جستجوی متخصصان..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.map((provider) => (
        <Card
          key={provider.id}
          clickable
          onClick={() => navigate(`/providers/${provider.id}`)}
        >
          <div className="flex-between provider-card-header">
            <div className="flex-row">
              <div className="avatar avatar-lg">{provider.name[0]}</div>
              <div>
                <h3 className="provider-name">{provider.name}</h3>
                <p className="provider-rating">
                  {'★'.repeat(Math.round(provider.rating))}
                  {'☆'.repeat(5 - Math.round(provider.rating))}
                  {' '}{provider.rating} ({provider.reviewCount})
                </p>
              </div>
            </div>
          </div>
          <p className="provider-bio">{provider.bio}</p>
          <div className="provider-services">
            {provider.serviceIds.map((sid) => {
              const svc = services.find((s) => s.id === sid)
              return svc ? (
                <span key={sid} className="badge badge-primary">{svc.name}</span>
              ) : null
            })}
          </div>
        </Card>
      ))}

      {filtered.length === 0 && (
        <div className="empty-state">
          <p className="empty-state-text">متخصصی یافت نشد</p>
        </div>
      )}
    </div>
  )
}

import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore.js'
import './BottomNav.css'

const publicTabs = [
  { id: 'home', label: 'خانه', path: '/', icon: '🏠' },
  { id: 'services', label: 'خدمات', path: '/services', icon: '📋' },
  { id: 'providers', label: 'متخصصان', path: '/providers', icon: '👨‍🔧' },
  { id: 'profile', label: 'پروفایل', path: '/profile', icon: '👤' },
]

const adminTabs = [
  { id: 'admin-dashboard', label: 'داشبورد', path: '/admin', icon: '📊' },
  { id: 'admin-providers', label: 'متخصصان', path: '/admin/providers', icon: '👨‍🔧' },
  { id: 'admin-services', label: 'خدمات', path: '/admin/services', icon: '📋' },
  { id: 'profile', label: 'پروفایل', path: '/profile', icon: '👤' },
]

const providerTabs = [
  { id: 'provider-dashboard', label: 'داشبورد', path: '/provider', icon: '📊' },
  { id: 'provider-appointments', label: 'نوبت‌ها', path: '/provider/appointments', icon: '📅' },
  { id: 'provider-hours', label: 'ساعات کاری', path: '/provider/hours', icon: '⏰' },
  { id: 'profile', label: 'پروفایل', path: '/profile', icon: '👤' },
]

export function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)

  let tabs = publicTabs
  if (user?.role === 'admin') tabs = adminTabs
  else if (user?.role === 'provider') tabs = providerTabs

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`bottom-nav-item ${isActive(tab.path) ? 'active' : ''}`}
          onClick={() => navigate(tab.path)}
        >
          <span className="bottom-nav-icon">{tab.icon}</span>
          <span className="bottom-nav-label">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

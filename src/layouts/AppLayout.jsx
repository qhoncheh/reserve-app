import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav/BottomNav.jsx'
import { Toast } from '../components/Toast/Toast.jsx'

const noNavRoutes = ['/login', '/register']

export function AppLayout() {
  const location = useLocation()
  const hideNav = noNavRoutes.includes(location.pathname)

  return (
    <div className="app-container">
      <Outlet />
      <Toast />
      {!hideNav && <BottomNav />}
    </div>
  )
}

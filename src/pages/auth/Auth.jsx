import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore.js'
import { Card } from '../../components/Card/Card.jsx'
import { Button } from '../../components/Button/Button.jsx'
import { Input } from '../../components/Input/Input.jsx'
import './Auth.css'

export function Auth() {
  const navigate = useNavigate()
  const { login, register, isLoading, error, clearError, isAuthenticated } = useAuthStore()
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  })

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated])

  useEffect(() => {
    clearError()
  }, [isLogin])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isLogin) {
      const result = await login(form.email, form.password)
      if (result.success) navigate('/')
    } else {
      const result = await register(form)
      if (result.success) navigate('/')
    }
  }

  return (
    <div className="app-content-no-nav">
      <div className="auth-page">
        <div className="auth-logo">
          <span className="auth-logo-icon">📅</span>
          <h1 className="auth-logo-title">نوبت‌دهی خدمات</h1>
          <p className="auth-logo-subtitle">
            {isLogin ? 'وارد حساب خود شوید' : 'حساب کاربری بسازید'}
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <Input
                label="نام و نام خانوادگی"
                name="name"
                placeholder="مثال: علی رضایی"
                value={form.name}
                onChange={handleChange}
                required
              />
            )}

            <Input
              label="ایمیل"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />

            <Input
              label="رمز عبور"
              name="password"
              type="password"
              placeholder="حداقل ۶ کاراکتر"
              value={form.password}
              onChange={handleChange}
              required
            />

            {!isLogin && (
              <Input
                label="شماره موبایل"
                name="phone"
                type="tel"
                placeholder="09123456789"
                value={form.phone}
                onChange={handleChange}
              />
            )}

            {error && (
              <div className="auth-error">{error}</div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-md"
            >
              {isLoading
                ? 'لطفاً صبر کنید...'
                : isLogin
                  ? 'ورود'
                  : 'ثبت نام'
              }
            </Button>
          </form>

          <div className="auth-switch">
            <p>
              {isLogin ? 'حساب کاربری ندارید؟' : 'قبلاً ثبت نام کرده‌اید؟'}
            </p>
            <button
              className="auth-switch-link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'ثبت نام' : 'ورود'}
            </button>
          </div>
        </Card>

        <Button
          variant="outline"
          className="mt-md"
          onClick={() => navigate('/')}
        >
          بازگشت به صفحه اصلی
        </Button>
      </div>
    </div>
  )
}

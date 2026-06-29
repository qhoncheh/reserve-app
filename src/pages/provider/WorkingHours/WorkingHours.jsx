import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores/authStore.js'
import { useProviderStore } from '../../../stores/providerStore.js'
import { useUiStore } from '../../../stores/uiStore.js'
import { Card } from '../../../components/Card/Card.jsx'
import { Button } from '../../../components/Button/Button.jsx'
import { Input } from '../../../components/Input/Input.jsx'
import { Header } from '../../../components/Header/Header.jsx'
import './WorkingHours.css'

const dayNames = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه']

export function WorkingHours() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { providers, loadProviders, updateProvider } = useProviderStore()
  const { showToast } = useUiStore()

  const [workingDays, setWorkingDays] = useState([])
  const [startTime, setStartTime] = useState('08:00')
  const [endTime, setEndTime] = useState('17:00')

  useEffect(() => {
    loadProviders()
  }, [])

  useEffect(() => {
    const provider = providers.find((p) => p.id === user?.id)
    if (provider) {
      setWorkingDays(provider.workingDays || [])
      setStartTime(provider.workingHours?.start || '08:00')
      setEndTime(provider.workingHours?.end || '17:00')
    }
  }, [providers, user])

  if (!isAuthenticated || user?.role !== 'provider') {
    navigate('/login')
    return null
  }

  const toggleDay = (index) => {
    setWorkingDays((prev) =>
      prev.includes(index)
        ? prev.filter((d) => d !== index)
        : [...prev, index]
    )
  }

  const handleSave = () => {
    updateProvider(user.id, {
      workingDays,
      workingHours: { start: startTime, end: endTime },
    })
    showToast('ساعات کاری با موفقیت ذخیره شد', 'success')
  }

  return (
    <div className="app-content">
      <Header title="ساعات کاری" onBack={() => navigate('/provider')} />

      <Card>
        <h3 className="section-title">روزهای کاری</h3>
        <div className="working-days-grid">
          {dayNames.map((day, index) => (
            <button
              key={index}
              className={`working-day-btn ${workingDays.includes(index) ? 'active' : ''}`}
              onClick={() => toggleDay(index)}
            >
              {day}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="section-title">ساعت کاری</h3>
        <Input
          label="ساعت شروع"
          name="startTime"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <Input
          label="ساعت پایان"
          name="endTime"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </Card>

      <Button onClick={handleSave}>
        ذخیره تغییرات
      </Button>
    </div>
  )
}

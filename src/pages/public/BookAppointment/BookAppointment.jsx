import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../../stores/authStore.js'
import { useProviderStore } from '../../../stores/providerStore.js'
import { useServiceStore } from '../../../stores/serviceStore.js'
import { useAppointmentStore } from '../../../stores/appointmentStore.js'
import { useUiStore } from '../../../stores/uiStore.js'
import { Card } from '../../../components/Card/Card.jsx'
import { Button } from '../../../components/Button/Button.jsx'
import { Input } from '../../../components/Input/Input.jsx'
import { Header } from '../../../components/Header/Header.jsx'
import './BookAppointment.css'

export function BookAppointment() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated } = useAuthStore()
  const { providers, loadProviders } = useProviderStore()
  const { services, loadServices } = useServiceStore()
  const { bookAppointment } = useAppointmentStore()
  const { showToast } = useUiStore()
  const { user } = useAuthStore()

  const preselectedServiceId = searchParams.get('serviceId')
  const preselectedProviderId = searchParams.get('providerId')

  const [selectedServiceId, setSelectedServiceId] = useState(preselectedServiceId || '')
  const [selectedProviderId, setSelectedProviderId] = useState(preselectedProviderId || '')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [notes, setNotes] = useState('')
  const [step, setStep] = useState(1)

  useEffect(() => {
    loadServices()
    loadProviders()
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated])

  const filteredProviders = selectedServiceId
    ? providers.filter((p) => p.serviceIds.includes(selectedServiceId))
    : providers

  const selectedService = services.find((s) => s.id === selectedServiceId)
  const selectedProvider = providers.find((p) => p.id === selectedProviderId)

  const generateTimeSlots = () => {
    if (!selectedProvider) return []
    const slots = []
    const [startH, startM] = selectedProvider.workingHours.start.split(':').map(Number)
    const [endH, endM] = selectedProvider.workingHours.end.split(':').map(Number)
    let h = startH
    let m = startM
    while (h < endH || (h === endH && m < endM)) {
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      slots.push({ value: time, label: time })
      m += 30
      if (m >= 60) {
        h++
        m = 0
      }
    }
    return slots
  }

  const handleSubmit = () => {
    const appointment = {
      serviceId: selectedServiceId,
      providerId: selectedProviderId,
      userId: user.id,
      userName: user.name,
      serviceName: selectedService?.name || '',
      providerName: selectedProvider?.name || '',
      date: selectedDate,
      time: selectedTime,
      notes,
      status: 'pending',
    }
    bookAppointment(appointment)
    showToast('نوبت با موفقیت رزرو شد', 'success')
    navigate('/profile')
  }

  if (!isAuthenticated) return null

  return (
    <div className="app-content">
      <Header title="رزرو نوبت" onBack={() => navigate(-1)} />

      <div className="booking-steps">
        <div className={`booking-step ${step >= 1 ? 'active' : ''}`}>1</div>
        <div className="booking-step-line" />
        <div className={`booking-step ${step >= 2 ? 'active' : ''}`}>2</div>
        <div className="booking-step-line" />
        <div className={`booking-step ${step >= 3 ? 'active' : ''}`}>3</div>
      </div>

      {step === 1 && (
        <div>
          <h2 className="booking-title">انتخاب سرویس و متخصص</h2>

          <Input
            label="خدمت مورد نظر"
            name="serviceId"
            options={services.map((s) => ({ value: s.id, label: `${s.icon} ${s.name} - ${s.price.toLocaleString()} تومان` }))}
            value={selectedServiceId}
            onChange={(e) => {
              setSelectedServiceId(e.target.value)
              setSelectedProviderId('')
            }}
          />

          <Input
            label="متخصص"
            name="providerId"
            options={filteredProviders.map((p) => ({ value: p.id, label: `${p.name} (${p.rating}★)` }))}
            value={selectedProviderId}
            onChange={(e) => setSelectedProviderId(e.target.value)}
          />

          <Button
            disabled={!selectedServiceId || !selectedProviderId}
            onClick={() => setStep(2)}
            className="mt-lg"
          >
            ادامه
          </Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="booking-title">انتخاب تاریخ و ساعت</h2>

          <Input
            label="تاریخ"
            name="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <Input
            label="ساعت"
            name="time"
            options={generateTimeSlots()}
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          />

          <Button
            disabled={!selectedDate || !selectedTime}
            onClick={() => setStep(3)}
            className="mt-lg"
          >
            ادامه
          </Button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="booking-title">بررسی و تأیید</h2>

          <Card>
            <div className="booking-summary-row">
              <span className="booking-summary-label">خدمت</span>
              <span className="booking-summary-value">{selectedService?.name}</span>
            </div>
            <div className="booking-summary-row">
              <span className="booking-summary-label">متخصص</span>
              <span className="booking-summary-value">{selectedProvider?.name}</span>
            </div>
            <div className="booking-summary-row">
              <span className="booking-summary-label">تاریخ</span>
              <span className="booking-summary-value">{selectedDate}</span>
            </div>
            <div className="booking-summary-row">
              <span className="booking-summary-label">ساعت</span>
              <span className="booking-summary-value">{selectedTime}</span>
            </div>
            <div className="booking-summary-row">
              <span className="booking-summary-label">قیمت</span>
              <span className="booking-summary-value booking-price">
                {selectedService?.price.toLocaleString()} تومان
              </span>
            </div>
          </Card>

          <Input
            label="توضیحات (اختیاری)"
            name="notes"
            textarea
            placeholder="توضیحات اضافی..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Button onClick={handleSubmit} className="mt-lg">
            تأیید و رزرو نوبت
          </Button>
        </div>
      )}
    </div>
  )
}

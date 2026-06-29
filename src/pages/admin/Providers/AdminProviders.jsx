import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores/authStore.js'
import { useProviderStore } from '../../../stores/providerStore.js'
import { useServiceStore } from '../../../stores/serviceStore.js'
import { useUiStore } from '../../../stores/uiStore.js'
import { Card } from '../../../components/Card/Card.jsx'
import { Button } from '../../../components/Button/Button.jsx'
import { Input } from '../../../components/Input/Input.jsx'
import { Header } from '../../../components/Header/Header.jsx'
import { Modal } from '../../../components/Modal/Modal.jsx'
import './AdminProviders.css'

export function AdminProviders() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { providers, loadProviders, addProvider, updateProvider, deleteProvider } = useProviderStore()
  const { services, loadServices } = useServiceStore()
  const { showToast } = useUiStore()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingProvider, setEditingProvider] = useState(null)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    bio: '',
    password: '123456',
    serviceIds: [],
  })

  useEffect(() => {
    loadProviders()
    loadServices()
  }, [])

  const openAddModal = () => {
    setEditingProvider(null)
    setForm({ name: '', phone: '', email: '', bio: '', password: '123456', serviceIds: [] })
    setModalOpen(true)
  }

  const openEditModal = (provider) => {
    setEditingProvider(provider)
    setForm({
      name: provider.name,
      phone: provider.phone,
      email: provider.email,
      bio: provider.bio,
      password: provider.password || '123456',
      serviceIds: provider.serviceIds,
    })
    setModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingProvider) {
      updateProvider(editingProvider.id, {
        ...form,
        workingDays: editingProvider.workingDays,
        workingHours: editingProvider.workingHours,
      })
      showToast('متخصص با موفقیت ویرایش شد', 'success')
    } else {
      addProvider({
        ...form,
        workingDays: [0, 1, 2, 3, 4],
        workingHours: { start: '08:00', end: '17:00' },
      })
      showToast('متخصص با موفقیت اضافه شد', 'success')
    }
    setModalOpen(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('آیا از حذف این متخصص اطمینان دارید؟')) {
      deleteProvider(id)
      showToast('متخصص حذف شد', 'error')
    }
  }

  const toggleServiceId = (sid) => {
    setForm((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(sid)
        ? prev.serviceIds.filter((id) => id !== sid)
        : [...prev.serviceIds, sid],
    }))
  }

  if (!isAuthenticated || user?.role !== 'admin') return null

  return (
    <div className="app-content">
      <Header title="مدیریت متخصصان" onBack={() => navigate('/admin')} />

      <Button onClick={openAddModal} className="mb-lg">
        افزودن متخصص جدید
      </Button>

      {providers.map((provider) => (
        <Card key={provider.id}>
          <div className="flex-between mb-sm">
            <div className="flex-row">
              <div className="avatar">{provider.name[0]}</div>
              <div>
                <h3 className="admin-provider-name">{provider.name}</h3>
                <p className="admin-provider-phone">{provider.phone}</p>
              </div>
            </div>
            <div className="flex-row">
              <button className="btn-icon" onClick={() => openEditModal(provider)}>
                ✏️
              </button>
              <button className="btn-icon" onClick={() => handleDelete(provider.id)}>
                🗑️
              </button>
            </div>
          </div>
          <p className="admin-provider-bio">{provider.bio}</p>
          <p className="admin-provider-email">{provider.email}</p>
          <div className="admin-provider-services">
            {provider.serviceIds.map((sid) => {
              const svc = services.find((s) => s.id === sid)
              return svc ? (
                <span key={sid} className="badge badge-primary">{svc.name}</span>
              ) : null
            })}
          </div>
        </Card>
      ))}

      <Modal visible={modalOpen} onClose={() => setModalOpen(false)} title={editingProvider ? 'ویرایش متخصص' : 'افزودن متخصص'}>
        <form onSubmit={handleSubmit}>
          <Input label="نام" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="ایمیل" name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="شماره موبایل" name="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <Input label="رمز عبور" name="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Input label="بیوگرافی" name="bio" textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} required />

          <div className="input-group">
            <label className="input-label">خدمات</label>
            <div className="admin-service-checkboxes">
              {services.map((svc) => (
                <label key={svc.id} className="admin-service-checkbox">
                  <input
                    type="checkbox"
                    checked={form.serviceIds.includes(svc.id)}
                    onChange={() => toggleServiceId(svc.id)}
                  />
                  <span>{svc.icon} {svc.name}</span>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit">{editingProvider ? 'ویرایش' : 'افزودن'}</Button>
        </form>
      </Modal>
    </div>
  )
}

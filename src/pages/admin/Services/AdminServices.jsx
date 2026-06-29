import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores/authStore.js'
import { useServiceStore } from '../../../stores/serviceStore.js'
import { useUiStore } from '../../../stores/uiStore.js'
import { Card } from '../../../components/Card/Card.jsx'
import { Button } from '../../../components/Button/Button.jsx'
import { Input } from '../../../components/Input/Input.jsx'
import { Header } from '../../../components/Header/Header.jsx'
import { Modal } from '../../../components/Modal/Modal.jsx'
import './AdminServices.css'

export function AdminServices() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { services, loadServices, addService, updateService, deleteService } = useServiceStore()
  const { showToast } = useUiStore()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    icon: '🔧',
  })

  useEffect(() => {
    loadServices()
  }, [])

  const openAddModal = () => {
    setEditingService(null)
    setForm({ name: '', description: '', price: '', duration: '', icon: '🔧' })
    setModalOpen(true)
  }

  const openEditModal = (service) => {
    setEditingService(service)
    setForm({
      name: service.name,
      description: service.description,
      price: String(service.price),
      duration: String(service.duration),
      icon: service.icon,
    })
    setModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      duration: Number(form.duration),
      icon: form.icon,
    }
    if (editingService) {
      updateService(editingService.id, data)
      showToast('خدمت با موفقیت ویرایش شد', 'success')
    } else {
      addService(data)
      showToast('خدمت با موفقیت اضافه شد', 'success')
    }
    setModalOpen(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('آیا از حذف این خدمت اطمینان دارید؟')) {
      deleteService(id)
      showToast('خدمت حذف شد', 'error')
    }
  }

  if (!isAuthenticated || user?.role !== 'admin') return null

  return (
    <div className="app-content">
      <Header title="مدیریت خدمات" onBack={() => navigate('/admin')} />

      <Button onClick={openAddModal} className="mb-lg">
        افزودن خدمت جدید
      </Button>

      {services.map((service) => (
        <Card key={service.id}>
          <div className="flex-between">
            <div className="flex-row">
              <span className="admin-svc-icon">{service.icon}</span>
              <div>
                <h3 className="admin-svc-name">{service.name}</h3>
                <p className="admin-svc-desc">{service.description}</p>
                <div className="flex-row mt-sm" style={{ gap: 'var(--spacing-md)' }}>
                  <span className="admin-svc-meta">{service.price.toLocaleString()} تومان</span>
                  <span className="admin-svc-meta">{service.duration} دقیقه</span>
                </div>
              </div>
            </div>
            <div className="flex-row">
              <button className="btn-icon" onClick={() => openEditModal(service)}>✏️</button>
              <button className="btn-icon" onClick={() => handleDelete(service.id)}>🗑️</button>
            </div>
          </div>
        </Card>
      ))}

      <Modal visible={modalOpen} onClose={() => setModalOpen(false)} title={editingService ? 'ویرایش خدمت' : 'افزودن خدمت'}>
        <form onSubmit={handleSubmit}>
          <Input label="نام خدمت" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="توضیحات" name="description" textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <Input label="قیمت (تومان)" name="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <Input label="مدت زمان (دقیقه)" name="duration" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required />
          <Input label="آیکون" name="icon" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} required />
          <Button type="submit">{editingService ? 'ویرایش' : 'افزودن'}</Button>
        </form>
      </Modal>
    </div>
  )
}

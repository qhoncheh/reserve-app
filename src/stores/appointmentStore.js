import { create } from 'zustand'
import { storageService } from '../services/storageService.js'

const STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const useAppointmentStore = create((set, get) => ({
  appointments: [],
  STATUS,

  loadAppointments: () => {
    const appointments = storageService.getAppointments()
    set({ appointments })
  },

  bookAppointment: (appointmentData) => {
    const newAppointment = {
      id: 'a' + Date.now(),
      status: STATUS.PENDING,
      createdAt: new Date().toISOString(),
      ...appointmentData,
    }
    const appointments = [...get().appointments, newAppointment]
    storageService.setAppointments(appointments)
    set({ appointments })
    return newAppointment
  },

  updateAppointmentStatus: (id, status) => {
    const appointments = get().appointments.map((a) =>
      a.id === id ? { ...a, status } : a
    )
    storageService.setAppointments(appointments)
    set({ appointments })
  },

  cancelAppointment: (id) => {
    const appointments = get().appointments.map((a) =>
      a.id === id ? { ...a, status: STATUS.CANCELLED } : a
    )
    storageService.setAppointments(appointments)
    set({ appointments })
  },

  getAppointmentsByUser: (userId) => {
    return get().appointments.filter((a) => a.userId === userId)
  },

  getAppointmentsByProvider: (providerId) => {
    return get().appointments.filter((a) => a.providerId === providerId)
  },

  getAppointmentsByService: (serviceId) => {
    return get().appointments.filter((a) => a.serviceId === serviceId)
  },
}))

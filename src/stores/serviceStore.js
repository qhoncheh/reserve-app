import { create } from 'zustand'
import { storageService } from '../services/storageService.js'
import { initialServices } from '../data/initialData.js'

export const useServiceStore = create((set, get) => ({
  services: [],

  loadServices: () => {
    let services = storageService.getServices()
    if (!services.length) {
      storageService.setServices(initialServices)
      services = initialServices
    }
    set({ services })
  },

  addService: (serviceData) => {
    const newService = {
      id: 's' + Date.now(),
      ...serviceData,
    }
    const services = [...get().services, newService]
    storageService.setServices(services)
    set({ services })
    return newService
  },

  updateService: (id, serviceData) => {
    const services = get().services.map((s) =>
      s.id === id ? { ...s, ...serviceData } : s
    )
    storageService.setServices(services)
    set({ services })
  },

  deleteService: (id) => {
    const services = get().services.filter((s) => s.id !== id)
    storageService.setServices(services)
    set({ services })
  },

  getServiceById: (id) => {
    return get().services.find((s) => s.id === id)
  },
}))

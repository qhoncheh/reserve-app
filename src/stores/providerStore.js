import { create } from 'zustand'
import { storageService } from '../services/storageService.js'
import { initialProviders } from '../data/initialData.js'

export const useProviderStore = create((set, get) => ({
  providers: [],

  loadProviders: () => {
    let providers = storageService.getProviders()
    if (!providers.length) {
      storageService.setProviders(initialProviders)
      providers = initialProviders
    }
    set({ providers })
  },

  addProvider: (providerData) => {
    const newProvider = {
      id: 'p' + Date.now(),
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      ...providerData,
    }
    const providers = [...get().providers, newProvider]
    storageService.setProviders(providers)
    set({ providers })
    return newProvider
  },

  updateProvider: (id, providerData) => {
    const providers = get().providers.map((p) =>
      p.id === id ? { ...p, ...providerData } : p
    )
    storageService.setProviders(providers)
    set({ providers })
  },

  deleteProvider: (id) => {
    const providers = get().providers.filter((p) => p.id !== id)
    storageService.setProviders(providers)
    set({ providers })
  },

  getProviderById: (id) => {
    return get().providers.find((p) => p.id === id)
  },

  getProvidersByServiceId: (serviceId) => {
    return get().providers.filter((p) => p.serviceIds.includes(serviceId))
  },
}))

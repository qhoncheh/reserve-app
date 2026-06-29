import { create } from 'zustand'

export const useUiStore = create((set) => ({
  activeTab: 'home',
  isModalOpen: false,
  modalContent: null,
  toastMessage: null,
  toastType: 'success',

  setActiveTab: (tab) => set({ activeTab: tab }),

  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),

  showToast: (message, type = 'success') => {
    set({ toastMessage: message, toastType: type })
    setTimeout(() => {
      set({ toastMessage: null })
    }, 3000)
  },

  clearToast: () => set({ toastMessage: null }),
}))

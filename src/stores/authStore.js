import { create } from 'zustand'
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../services/authService.js'

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  checkAuth: () => {
    const user = getCurrentUser()
    set({ user, isAuthenticated: !!user })
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    const result = await loginUser(email, password)
    if (result.success) {
      set({ user: result.user, isAuthenticated: true, isLoading: false })
    } else {
      set({ error: result.error, isLoading: false })
    }
    return result
  },

  register: async (userData) => {
    set({ isLoading: true, error: null })
    const result = await registerUser(userData)
    if (result.success) {
      set({ user: result.user, isAuthenticated: true, isLoading: false })
    } else {
      set({ error: result.error, isLoading: false })
    }
    return result
  },

  logout: async () => {
    set({ isLoading: true })
    await logoutUser()
    set({ user: null, isAuthenticated: false, isLoading: false, error: null })
  },

  clearError: () => set({ error: null }),
}))

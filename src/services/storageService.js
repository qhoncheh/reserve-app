const KEYS = {
  USERS: 'reserve_users',
  SERVICES: 'reserve_services',
  PROVIDERS: 'reserve_providers',
  APPOINTMENTS: 'reserve_appointments',
  CURRENT_USER: 'reserve_current_user',
}

function getItem(key) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export const storageService = {
  getUsers: () => getItem(KEYS.USERS) || [],
  setUsers: (users) => setItem(KEYS.USERS, users),

  getServices: () => getItem(KEYS.SERVICES) || [],
  setServices: (services) => setItem(KEYS.SERVICES, services),

  getProviders: () => getItem(KEYS.PROVIDERS) || [],
  setProviders: (providers) => setItem(KEYS.PROVIDERS, providers),

  getAppointments: () => getItem(KEYS.APPOINTMENTS) || [],
  setAppointments: (appointments) => setItem(KEYS.APPOINTMENTS, appointments),

  getCurrentUser: () => getItem(KEYS.CURRENT_USER),
  setCurrentUser: (user) => setItem(KEYS.CURRENT_USER, user),
  removeCurrentUser: () => localStorage.removeItem(KEYS.CURRENT_USER),

  clearAll: () => {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key))
  },
}

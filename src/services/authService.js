import { storageService } from './storageService.js'
import { initialUsers } from '../data/initialData.js'

export function initData() {
  if (!storageService.getUsers().length) {
    storageService.setUsers(initialUsers)
  }
}

export function loginUser(email, password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = storageService.getUsers()
      const user = users.find(
        (u) => u.email === email && u.password === password
      )
      if (user) {
        const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone }
        storageService.setCurrentUser(safeUser)
        resolve({ success: true, user: safeUser })
      } else {
        resolve({ success: false, error: 'ایمیل یا رمز عبور اشتباه است' })
      }
    }, 300)
  })
}

export function registerUser(userData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = storageService.getUsers()
      const exists = users.find((u) => u.email === userData.email)
      if (exists) {
        resolve({ success: false, error: 'این ایمیل قبلاً ثبت شده است' })
        return
      }
      const newUser = {
        id: 'u' + Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'user',
        phone: userData.phone || '',
      }
      users.push(newUser)
      storageService.setUsers(users)
      const safeUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
      storageService.setCurrentUser(safeUser)
      resolve({ success: true, user: safeUser })
    }, 300)
  })
}

export function logoutUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      storageService.removeCurrentUser()
      resolve({ success: true })
    }, 200)
  })
}

export function getCurrentUser() {
  return storageService.getCurrentUser()
}

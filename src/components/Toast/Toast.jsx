import { useUiStore } from '../../stores/uiStore.js'
import './Toast.css'

export function Toast() {
  const { toastMessage, toastType } = useUiStore()

  if (!toastMessage) return null

  return (
    <div className={`toast toast-${toastType}`}>
      <span className="toast-icon">
        {toastType === 'success' ? '✓' : toastType === 'error' ? '✕' : '⚠'}
      </span>
      <span className="toast-message">{toastMessage}</span>
    </div>
  )
}

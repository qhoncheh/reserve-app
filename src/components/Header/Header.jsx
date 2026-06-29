import './Header.css'

export function Header({ title, onBack, rightAction }) {
  return (
    <div className="header">
      <div className="header-left">
        {onBack && (
          <button className="btn-icon" onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
      </div>
      <h1 className="header-title">{title}</h1>
      <div className="header-right">
        {rightAction}
      </div>
    </div>
  )
}

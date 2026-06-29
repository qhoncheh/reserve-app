import './Card.css'

export function Card({ children, className = '', onClick, clickable = false }) {
  const classNames = [
    'card',
    clickable ? 'card-clickable' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={classNames} onClick={onClick}>
      {children}
    </div>
  )
}

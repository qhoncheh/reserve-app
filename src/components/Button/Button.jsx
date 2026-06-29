import './Button.css'

export function Button({
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  small = false,
}) {
  const classNames = [
    'btn',
    `btn-${variant}`,
    small ? 'btn-sm' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
}

import './Input.css'

export function Input({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  textarea = false,
  options = null,
}) {
  const inputId = `input-${name}`

  return (
    <div className="input-group">
      {label && (
        <label className="input-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      {textarea ? (
        <textarea
          id={inputId}
          className="input"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          rows={4}
        />
      ) : options ? (
        <select
          id={inputId}
          className="input"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        >
          <option value="">انتخاب کنید</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={inputId}
          className="input"
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      )}
    </div>
  )
}

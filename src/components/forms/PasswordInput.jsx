import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordInput({ id, value, onChange, invalid, autoComplete = 'current-password', placeholder }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="input-wrap">
      <input
        id={id}
        className="input"
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        aria-invalid={invalid || undefined}
        autoComplete={autoComplete}
        placeholder={placeholder}
      />
      <button
        type="button"
        className="input-eye"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  )
}

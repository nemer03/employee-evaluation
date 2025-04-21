// src/pages/LoginPage.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'admin' && password === 'ghadamarket2025') {
      localStorage.setItem('loggedIn', 'true')
      navigate('/employees')
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white shadow-md p-6 rounded w-full max-w-sm text-right">
        <h2 className="text-xl font-bold mb-4">تسجيل الدخول للمدير</h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <label className="block mb-2">اسم المستخدم</label>
        <input
          type="text"
          className="w-full border p-2 mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="block mb-2">كلمة المرور</label>
        <input
          type="password"
          className="w-full border p-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          دخول
        </button>
      </form>
    </div>
  )
}

export default LoginPage

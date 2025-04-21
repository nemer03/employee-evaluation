// src/components/AddEmployeeForm.tsx
import React, { useState } from 'react'
import { addEmployee } from '../api/employees'

interface Props {
  onAdd: () => void
}

const AddEmployeeForm: React.FC<Props> = ({ onAdd }) => {
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (!name || !position) {
        alert('يرجى تعبئة جميع الحقول')
        return
      }
      await addEmployee(name, position, score)
      setName('')
      setPosition('')
      setScore(0)
      onAdd()
    } catch (error) {
      console.error('فشل في إضافة الموظف:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded border text-right">
      <h2 className="text-lg font-bold mb-2">إضافة موظف جديد</h2>
      <div className="mb-2">
        <label className="block mb-1">الاسم</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">المسمى الوظيفي</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">التقييم الابتدائي</label>
        <input
          type="number"
          className="border p-2 w-full"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        disabled={loading}
      >
        {loading ? 'جاري الإضافة...' : 'إضافة'}
      </button>
    </form>
  )
}

export default AddEmployeeForm

// src/components/EmployeeTable.tsx
import React, { useEffect, useState } from 'react'
import { Employee, getEmployees, deleteEmployee, updateEmployeeScore } from '../api/employees'

const EmployeeTable: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const data = await getEmployees()
      setEmployees(data)
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد أنك تريد حذف هذا الموظف؟')) return
    await deleteEmployee(id)
    fetchEmployees()
  }

  const handleScoreChange = async (id: string, newScore: number) => {
    await updateEmployeeScore(id, newScore)
    fetchEmployees()
  }

  if (loading) return <p>جاري تحميل البيانات...</p>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-right">
            <th className="py-2 px-4 border-b">الاسم</th>
            <th className="py-2 px-4 border-b">المسمى الوظيفي</th>
            <th className="py-2 px-4 border-b">التقييم</th>
            <th className="py-2 px-4 border-b">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id} className="text-right">
              <td className="py-2 px-4 border-b">{emp.name}</td>
              <td className="py-2 px-4 border-b">{emp.position}</td>
              <td className="py-2 px-4 border-b">
                <input
                  type="number"
                  className="border p-1 w-20 text-center"
                  value={emp.score}
                  onChange={(e) => handleScoreChange(emp.id, Number(e.target.value))}
                />
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(emp.id)}
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EmployeeTable

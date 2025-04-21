// src/api/employees.ts
import { supabase } from '../supabaseClient'

export interface Employee {
  id: string
  name: string
  position: string
  score: number
  created_at: string
}

// جلب كل الموظفين
export async function getEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as Employee[]
}

// إضافة موظف جديد
export async function addEmployee(name: string, position: string, score: number = 0): Promise<void> {
  const { error } = await supabase.from('employees').insert([
    { name, position, score }
  ])
  if (error) throw error
}

// حذف موظف
export async function deleteEmployee(id: string): Promise<void> {
  const { error } = await supabase.from('employees').delete().eq('id', id)
  if (error) throw error
}

// تحديث تقييم موظف
export async function updateEmployeeScore(id: string, score: number): Promise<void> {
  const { error } = await supabase.from('employees').update({ score }).eq('id', id)
  if (error) throw error
}

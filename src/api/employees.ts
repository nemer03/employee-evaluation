// src/api/employees.ts
import { supabase } from '../supabaseClient'

export interface Employee {
  id: string
  name: string
  position: string
  department: string
  avatarUrl?: string
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
export async function addEmployee(employee: Omit<Employee, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase.from('employees').insert([employee])
  if (error) throw error
}

// حذف موظف
export async function deleteEmployee(id: string): Promise<void> {
  const { error } = await supabase.from('employees').delete().eq('id', id)
  if (error) throw error
}

// تحديث موظف
export async function updateEmployee(employee: Employee): Promise<void> {
  const { id, ...fields } = employee
  const { error } = await supabase.from('employees').update(fields).eq('id', id)
  if (error) throw error
}

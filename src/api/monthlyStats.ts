// src/api/monthlyStats.ts
import { supabase } from '../supabaseClient'

export interface MonthlyStat {
  id?: string
  employee_id: string
  month: number
  year: number
  score: number
  is_top_performer?: boolean
}

// جلب التقييمات الشهرية لموظف معين أو للجميع
export async function getMonthlyStats(): Promise<MonthlyStat[]> {
  const { data, error } = await supabase
    .from('monthly_stats')
    .select('*')

  if (error) throw error
  return data as MonthlyStat[]
}

// إضافة أو تحديث تقييم شهري لموظف
export async function addOrUpdateMonthlyStat(stat: MonthlyStat): Promise<void> {
  const { data, error } = await supabase
    .from('monthly_stats')
    .upsert([stat], { onConflict: ['employee_id', 'month', 'year'] })

  if (error) throw error
}

// تعيين الموظف الأفضل لهذا الشهر
export async function setTopPerformer(employeeId: string, month: number, year: number): Promise<void> {
  // أزل العلامة من الجميع أولاً
  const { error: clearError } = await supabase
    .from('monthly_stats')
    .update({ is_top_performer: false })
    .eq('month', month)
    .eq('year', year)

  if (clearError) throw clearError

  // ضع العلامة على الموظف المحدد
  const { error: setError } = await supabase
    .from('monthly_stats')
    .update({ is_top_performer: true })
    .eq('employee_id', employeeId)
    .eq('month', month)
    .eq('year', year)

  if (setError) throw setError
}

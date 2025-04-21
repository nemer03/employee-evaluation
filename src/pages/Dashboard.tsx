import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';
import { ChevronRight, ChevronLeft, Users, CalendarDays } from 'lucide-react';
import MonthlyStatistics from '../components/dashboard/MonthlyStatistics';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import { 
  getEmployees, 
  getEvaluations, 
  getMonthlyStats 
} from '../utils/storage';
import { exportToPDF } from '../utils/evaluationUtils';
import { Employee, MonthlyStats, DailyEvaluation } from '../types';

const Dashboard: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [evaluations, setEvaluations] = useState<DailyEvaluation[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  
  useEffect(() => {
    // Load employees
    const loadedEmployees = getEmployees();
    setEmployees(loadedEmployees);
    
    // Load evaluations
    const loadedEvaluations = getEvaluations();
    setEvaluations(loadedEvaluations);
    
    // Load monthly stats
    const loadedStats = getMonthlyStats();
    setMonthlyStats(loadedStats);
  }, []);
  
  // Filter stats for current month
  const currentMonthStats = monthlyStats.filter(
    stat => stat.month === currentMonth.getMonth() && stat.year === currentMonth.getFullYear()
  );
  
  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };
  
  const handleExportPDF = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    // Filter evaluations for the current month
    const monthEvaluations = evaluations.filter(evaluation => {
      const evalDate = new Date(evaluation.date);
      return evalDate >= monthStart && evalDate <= monthEnd;
    });
    
    if (monthEvaluations.length > 0) {
      const monthName = format(currentMonth, 'MMMM-yyyy');
      exportToPDF(monthEvaluations, employees, monthName);
    } else {
      alert('لا توجد تقييمات لتصديرها لهذا الشهر');
    }
  };
  
  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployeeId(selectedEmployeeId === employeeId ? null : employeeId);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">لوحة المعلومات</h1>
        <p className="text-sm text-gray-600">
          عرض ملخص تقييمات الموظفين والإحصائيات الشهرية
        </p>
      </div>
      
      {/* Month selector */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow mb-6">
        <button
          onClick={handlePreviousMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
        
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <CalendarDays className="h-5 w-5 text-primary-600 mr-2" />
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      
      {/* Stats summary */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <MonthlyStatistics 
          employees={employees}
          stats={currentMonthStats}
          month={currentMonth}
          onExportPDF={handleExportPDF}
        />
      </div>
      
      {/* Performance breakdown */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Users className="h-5 w-5 text-primary-600 mr-2" />
            تحليل الأداء
          </h3>
          {selectedEmployeeId && (
            <button
              onClick={() => setSelectedEmployeeId(null)}
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              العودة للمقارنة العامة
            </button>
          )}
        </div>
        
        {/* Employee selector buttons */}
        {!selectedEmployeeId && employees.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 mb-6">
            {employees.map(employee => (
              <button
                key={employee.id}
                onClick={() => handleEmployeeSelect(employee.id)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md 
                  text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {employee.name}
              </button>
            ))}
          </div>
        )}
        
        {/* Performance chart */}
        <PerformanceChart 
          stats={currentMonthStats}
          employees={employees}
          selectedEmployeeId={selectedEmployeeId}
        />
      </div>
    </div>
  );
};

export default Dashboard;
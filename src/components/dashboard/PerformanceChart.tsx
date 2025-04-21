import React from 'react';
import { Employee, MonthlyStats } from '../../types';
import { defaultCriteria } from '../../utils/evaluationUtils';

interface PerformanceChartProps {
  stats: MonthlyStats[];
  employees: Employee[];
  selectedEmployeeId: string | null;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  stats,
  employees,
  selectedEmployeeId
}) => {
  // Filter stats based on selected employee or get all if none selected
  const filteredStats = selectedEmployeeId
    ? stats.filter(stat => stat.employeeId === selectedEmployeeId)
    : stats;
  
  // Nothing to display if no stats
  if (filteredStats.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 h-64 flex items-center justify-center">
        <p className="text-gray-500">لا توجد بيانات كافية لعرض الرسم البياني</p>
      </div>
    );
  }
  
  // For employee-specific view, show criteria breakdown
  if (selectedEmployeeId) {
    const employeeStat = filteredStats[0];
    const employee = employees.find(e => e.id === selectedEmployeeId);
    
    if (!employee || !employeeStat) {
      return null;
    }
    
    // Calculate the maximum score (usually 10) for proper scaling
    const maxScore = 10;
    
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          تحليل أداء {employee.name}
        </h3>
        
        <div className="space-y-4">
          {defaultCriteria.map(criterion => {
            const criteriaAvg = employeeStat.averageScores.find(
              s => s.criteriaId === criterion.id
            );
            
            const score = criteriaAvg ? criteriaAvg.average : 0;
            const percentage = (score / maxScore) * 100;
            
            // Determine color based on score
            let barColor = 'bg-red-500';
            if (score >= 8) barColor = 'bg-green-500';
            else if (score >= 6) barColor = 'bg-blue-500';
            else if (score >= 4) barColor = 'bg-yellow-500';
            
            return (
              <div key={criterion.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{criterion.name}</span>
                  <span className="text-sm font-medium text-gray-900">{score.toFixed(2)}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${barColor} transition-all duration-500 ease-in-out`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
          
          {/* Overall score */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold text-gray-900">المتوسط الإجمالي</span>
              <span className="text-sm font-bold text-gray-900">{employeeStat.totalAverage.toFixed(2)}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="h-4 rounded-full bg-primary-600 transition-all duration-500 ease-in-out"
                style={{ width: `${(employeeStat.totalAverage / maxScore) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // For overview, show comparison between employees
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        مقارنة أداء الموظفين
      </h3>
      
      <div className="space-y-4">
        {stats.map(stat => {
          const employee = employees.find(e => e.id === stat.employeeId);
          if (!employee) return null;
          
          const percentage = (stat.totalAverage / 10) * 100;
          
          // Determine color based on being top performer
          const barColor = stat.isTopPerformer ? 'bg-green-500' : 'bg-primary-600';
          
          return (
            <div key={stat.employeeId}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{employee.name}</span>
                <span className="text-sm font-medium text-gray-900">{stat.totalAverage.toFixed(2)}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${barColor} transition-all duration-500 ease-in-out`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceChart;
import React from 'react';
import { format } from 'date-fns';
import { Employee, MonthlyStats } from '../../types';
import { BarChart2, Star, Download } from 'lucide-react';
import { defaultCriteria } from '../../utils/evaluationUtils';

interface MonthlyStatisticsProps {
  employees: Employee[];
  stats: MonthlyStats[];
  month: Date;
  onExportPDF: () => void;
}

const MonthlyStatistics: React.FC<MonthlyStatisticsProps> = ({ 
  employees, 
  stats, 
  month,
  onExportPDF
}) => {
  const monthName = format(month, 'MMMM yyyy');
  
  // Get top performer
  const topPerformer = stats.find(s => s.isTopPerformer);
  const topPerformerEmployee = topPerformer ? 
    employees.find(e => e.id === topPerformer.employeeId) : null;
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:px-6">
        <div className="flex items-center">
          <BarChart2 className="h-6 w-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">
            إحصائيات شهر {monthName}
          </h3>
        </div>
        <button
          onClick={onExportPDF}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Download className="mr-1.5 -ml-0.5 h-4 w-4" />
          تصدير PDF
        </button>
      </div>
      
      {topPerformerEmployee && (
        <div className="px-4 py-3 sm:px-6 bg-yellow-50">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            <p className="text-sm font-medium text-gray-900">
              الموظف الأعلى تقييماً لهذا الشهر: <span className="font-bold">{topPerformerEmployee.name}</span>
              {topPerformer && (
                <span className="ml-2 text-sm text-gray-500">
                  (معدل: {topPerformer.totalAverage.toFixed(2)}/10)
                </span>
              )}
            </p>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الموظف
              </th>
              {defaultCriteria.map(criterion => (
                <th key={criterion.id} scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {criterion.name}
                </th>
              ))}
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                المتوسط
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                أيام التقييم
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stats.length > 0 ? (
              stats.map(stat => {
                const employee = employees.find(e => e.id === stat.employeeId);
                if (!employee) return null;
                
                return (
                  <tr key={stat.employeeId} className={stat.isTopPerformer ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {employee.name}
                          {stat.isTopPerformer && (
                            <Star className="h-4 w-4 text-yellow-500 ml-1" />
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {defaultCriteria.map(criterion => {
                      const criteriaAvg = stat.averageScores.find(
                        s => s.criteriaId === criterion.id
                      );
                      
                      return (
                        <td key={criterion.id} className="px-3 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900">
                            {criteriaAvg ? criteriaAvg.average.toFixed(2) : '-'}
                          </div>
                        </td>
                      );
                    })}
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${stat.isTopPerformer 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'}`
                      }>
                        {stat.totalAverage.toFixed(2)}/10
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {stat.daysEvaluated} {stat.daysEvaluated === 1 ? 'يوم' : 'أيام'}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="px-6 py-4 text-center text-sm text-gray-500">
                  لا توجد تقييمات لهذا الشهر
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyStatistics;
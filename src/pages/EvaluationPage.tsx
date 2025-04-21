import React, { useState, useEffect } from 'react';
import { format, subDays, addDays } from 'date-fns';
import { ChevronRight, ChevronLeft, Calendar, Check, AlertCircle } from 'lucide-react';
import EvaluationForm from '../components/evaluation/EvaluationForm';
import { 
  getEmployees, 
  getEvaluationsByDate, 
  addEvaluation 
} from '../utils/storage';
import { Employee, DailyEvaluation } from '../types';
import { toast } from 'react-toastify';

const EvaluationPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [evaluations, setEvaluations] = useState<DailyEvaluation[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  
  useEffect(() => {
    // Load employees
    const loadedEmployees = getEmployees();
    setEmployees(loadedEmployees);
    
    // If employees exist, select the first one by default
    if (loadedEmployees.length > 0 && !selectedEmployeeId) {
      setSelectedEmployeeId(loadedEmployees[0].id);
    }
    
    // Load evaluations for current date
    loadEvaluations(currentDate);
  }, [currentDate]);
  
  const loadEvaluations = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const loadedEvaluations = getEvaluationsByDate(formattedDate);
    setEvaluations(loadedEvaluations);
  };
  
  const handlePreviousDay = () => {
    setCurrentDate(prevDate => subDays(prevDate, 1));
  };
  
  const handleNextDay = () => {
    setCurrentDate(prevDate => addDays(prevDate, 1));
  };
  
  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
  };
  
  const handleSaveEvaluation = (evaluation: DailyEvaluation) => {
    addEvaluation(evaluation);
    toast.success('تم حفظ التقييم بنجاح');
    
    // Refresh evaluations
    loadEvaluations(currentDate);
  };
  
  // Get the existing evaluation for the selected employee on the current date
  const selectedEmployeeEvaluation = evaluations.find(
    evaluation => evaluation.employeeId === selectedEmployeeId
  );
  
  // Calculate how many employees have been evaluated today
  const evaluatedCount = evaluations.length;
  const pendingCount = employees.length - evaluatedCount;
  
  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">التقييم اليومي</h1>
          <p className="text-sm text-gray-600">
            تقييم أداء الموظفين اليومي بناءً على المعايير المحددة
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreviousDay}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="flex items-center bg-white px-4 py-2 rounded-md shadow">
            <Calendar className="h-5 w-5 text-primary-600 mr-2" />
            <span className="font-medium">{format(currentDate, 'yyyy/MM/dd')}</span>
          </div>
          
          <button
            onClick={handleNextDay}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Evaluation progress */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {evaluatedCount === employees.length ? (
              <Check className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
            )}
            <span className="text-sm font-medium">
              تم تقييم {evaluatedCount} من {employees.length} موظفين
            </span>
          </div>
          
          <div>
            {evaluatedCount === employees.length ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                تم تقييم جميع الموظفين
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                متبقي {pendingCount} موظفين
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Employee selection and evaluation form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium text-gray-900 mb-4">قائمة الموظفين</h3>
          
          {employees.length > 0 ? (
            <ul className="space-y-2">
              {employees.map(employee => {
                const isEvaluated = evaluations.some(e => e.employeeId === employee.id);
                
                return (
                  <li key={employee.id}>
                    <button
                      onClick={() => handleEmployeeSelect(employee.id)}
                      className={`w-full text-right px-3 py-2 rounded-md text-sm transition-colors duration-150 ease-in-out
                        ${selectedEmployeeId === employee.id
                          ? 'bg-primary-100 text-primary-800 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'}`
                      }
                    >
                      <div className="flex items-center justify-between">
                        <span>{employee.name}</span>
                        {isEvaluated && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              لا يوجد موظفين حالياً
            </p>
          )}
        </div>
        
        <div className="md:col-span-3">
          {selectedEmployee ? (
            <EvaluationForm
              employee={selectedEmployee}
              date={currentDate}
              existingEvaluation={selectedEmployeeEvaluation}
              onSave={handleSaveEvaluation}
            />
          ) : (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <p className="text-gray-500">
                الرجاء اختيار موظف من القائمة لبدء التقييم
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationPage;
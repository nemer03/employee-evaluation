import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Check, Save } from 'lucide-react';
import { Employee, DailyEvaluation } from '../../types';
import { createEmptyEvaluation } from '../../utils/evaluationUtils';

interface EvaluationFormProps {
  employee: Employee;
  date: Date;
  existingEvaluation?: DailyEvaluation;
  onSave: (evaluation: DailyEvaluation) => void;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({
  employee,
  date,
  existingEvaluation,
  onSave
}) => {
  const [evaluation, setEvaluation] = useState<DailyEvaluation>(() => {
    return existingEvaluation || createEmptyEvaluation(employee.id, date);
  });
  
  const [comment, setComment] = useState(evaluation.comment || '');
  const [isSaved, setIsSaved] = useState(!!existingEvaluation);
  
  useEffect(() => {
    if (existingEvaluation) {
      setEvaluation(existingEvaluation);
      setComment(existingEvaluation.comment || '');
      setIsSaved(true);
    } else {
      setEvaluation(createEmptyEvaluation(employee.id, date));
      setComment('');
      setIsSaved(false);
    }
  }, [employee.id, date, existingEvaluation]);
  
  const handleScoreChange = (criteriaId: number, score: number) => {
    setEvaluation(prev => {
      const updatedCriteria = prev.criteria.map(c => 
        c.id === criteriaId ? { ...c, score } : c
      );
      
      // Calculate the new total score
      const totalScore = updatedCriteria.reduce((sum, c) => sum + c.score, 0) / updatedCriteria.length;
      
      return {
        ...prev,
        criteria: updatedCriteria,
        totalScore
      };
    });
    
    setIsSaved(false);
  };
  
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    setIsSaved(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedEvaluation = {
      ...evaluation,
      comment,
      date: format(date, 'yyyy-MM-dd')
    };
    
    onSave(updatedEvaluation);
    setIsSaved(true);
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{employee.name}</h3>
          <p className="text-sm text-gray-500">{employee.position} - {employee.department}</p>
        </div>
        <div className="mt-2 sm:mt-0">
          <p className="text-sm text-gray-600">
            تاريخ التقييم: <span className="font-medium">{format(date, 'yyyy/MM/dd')}</span>
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                  المعيار
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                  الوصف
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                  الدرجة (من 10)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {evaluation.criteria.map((criterion) => (
                <tr key={criterion.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {criterion.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {criterion.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={criterion.score}
                        onChange={(e) => handleScoreChange(criterion.id, parseInt(e.target.value, 10))}
                        className="w-3/4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                      />
                      <span className="ml-3 text-lg font-bold text-primary-600 w-8 text-center">
                        {criterion.score}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <span className="font-bold">المجموع / المتوسط</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-lg font-bold text-primary-600">
                    {evaluation.totalScore.toFixed(2)}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-6">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            ملاحظات إضافية (اختياري)
          </label>
          <textarea
            id="comment"
            rows={3}
            value={comment}
            onChange={handleCommentChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="أضف ملاحظات أو تعليقات حول أداء الموظف..."
          />
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {isSaved ? (
              <>
                <Check className="mr-2 -ml-1 h-5 w-5" />
                تم الحفظ
              </>
            ) : (
              <>
                <Save className="mr-2 -ml-1 h-5 w-5" />
                حفظ التقييم
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EvaluationForm;
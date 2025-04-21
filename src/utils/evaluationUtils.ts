import { format } from 'date-fns';
import { Employee, DailyEvaluation, EvaluationCriteria } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Default evaluation criteria
export const defaultCriteria: EvaluationCriteria[] = [
  { id: 1, name: 'الالتزام بالمواعيد', description: 'الحضور والانصراف المنتظم', score: 10 },
  { id: 2, name: 'جودة العمل', description: 'دقة وجودة تنفيذ المهام', score: 10 },
  { id: 3, name: 'سرعة الإنجاز', description: 'إنجاز المهام في وقتها دون التأثير على الجودة', score: 10 },
  { id: 4, name: 'التعاون والعمل الجماعي', description: 'روح الفريق، المساعدة، والاحترام داخل بيئة العمل', score: 10 },
  { id: 5, name: 'المبادرة والابتكار', description: 'اقتراح حلول أو أفكار جديدة', score: 10 },
  { id: 6, name: 'تحمل المسؤولية', description: 'تحمل نتائج العمل ومواجهة التحديات', score: 10 },
  { id: 7, name: 'رضا العملاء / الزبائن', description: 'آراء العملاء أو ملاحظاتهم حول أداء الموظف', score: 10 },
  { id: 8, name: 'اللباس الأنيق', description: 'مظهر الموظف وحرصه على ارتداء ملابس لائقة ومهنية', score: 10 }
];

// Calculate total score for an evaluation
export const calculateTotalScore = (criteria: EvaluationCriteria[]): number => {
  return criteria.reduce((total, criterion) => total + criterion.score, 0) / criteria.length;
};

// Create a new empty evaluation for employee on specified date
export const createEmptyEvaluation = (employeeId: string, date: Date): DailyEvaluation => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  
  return {
    id: `${employeeId}-${formattedDate}`,
    employeeId,
    date: formattedDate,
    criteria: defaultCriteria.map(c => ({ ...c })),
    totalScore: 10,
    comment: ''
  };
};

// Export evaluations to PDF
export const exportToPDF = (
  evaluations: DailyEvaluation[],
  employees: Employee[],
  month: string
): void => {
  if (evaluations.length === 0) return;
  
  const doc = new jsPDF('landscape');
  
  // Title
  doc.setFontSize(18);
  doc.text(`Employee Evaluations for ${month}`, 14, 15);
  
  // For each employee
  employees.forEach((employee, index) => {
    const employeeEvals = evaluations.filter(e => e.employeeId === employee.id);
    
    if (employeeEvals.length === 0) return;
    
    // Add a new page for each employee except the first one
    if (index > 0) {
      doc.addPage();
    }
    
    // Employee info
    doc.setFontSize(14);
    doc.text(`Employee: ${employee.name}`, 14, 25);
    doc.text(`Position: ${employee.position}`, 14, 31);
    
    // Create table data
    const tableHeaders = [
      'Date',
      ...defaultCriteria.map(c => c.name),
      'Average'
    ];
    
    const tableData = employeeEvals.map(evaluation => [
      evaluation.date,
      ...evaluation.criteria.map(c => c.score.toString()),
      evaluation.totalScore.toFixed(2)
    ]);
    
    // Add table
    autoTable(doc, {
      startY: 35,
      head: [tableHeaders],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [0, 61, 166], textColor: 255 }
    });
    
    // Add average scores at the bottom
    const avgScores = defaultCriteria.map((_, i) => {
      const sum = employeeEvals.reduce((total, evaluation) => total + evaluation.criteria[i].score, 0);
      return (sum / employeeEvals.length).toFixed(2);
    });
    
    const overallAvg = employeeEvals.reduce((total, evaluation) => total + evaluation.totalScore, 0) / employeeEvals.length;
    
    const lastY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(10);
    doc.text('Monthly Averages:', 14, lastY);
    
    autoTable(doc, {
      startY: lastY + 2,
      head: [tableHeaders.slice(1)],
      body: [[...avgScores, overallAvg.toFixed(2)]],
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [0, 61, 166], textColor: 255 }
    });
  });
  
  // Save the PDF
  doc.save(`employee_evaluations_${month}.pdf`);
};
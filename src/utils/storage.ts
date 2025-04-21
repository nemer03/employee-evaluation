import { Employee, DailyEvaluation, MonthlyStats } from '../types';

// Local Storage Keys
const EMPLOYEES_KEY = 'evaluationSystem_employees';
const EVALUATIONS_KEY = 'evaluationSystem_evaluations';
const MONTHLY_STATS_KEY = 'evaluationSystem_monthlyStats';

// Employee Storage
export const getEmployees = (): Employee[] => {
  const storedEmployees = localStorage.getItem(EMPLOYEES_KEY);
  return storedEmployees ? JSON.parse(storedEmployees) : [];
};

export const saveEmployees = (employees: Employee[]): void => {
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
};

export const addEmployee = (employee: Employee): void => {
  const employees = getEmployees();
  employees.push(employee);
  saveEmployees(employees);
};

export const updateEmployee = (updatedEmployee: Employee): void => {
  const employees = getEmployees();
  const index = employees.findIndex(e => e.id === updatedEmployee.id);
  if (index !== -1) {
    employees[index] = updatedEmployee;
    saveEmployees(employees);
  }
};

export const removeEmployee = (employeeId: string): void => {
  const employees = getEmployees();
  const filteredEmployees = employees.filter(e => e.id !== employeeId);
  saveEmployees(filteredEmployees);
};

// Evaluation Storage
export const getEvaluations = (): DailyEvaluation[] => {
  const storedEvaluations = localStorage.getItem(EVALUATIONS_KEY);
  return storedEvaluations ? JSON.parse(storedEvaluations) : [];
};

export const saveEvaluations = (evaluations: DailyEvaluation[]): void => {
  localStorage.setItem(EVALUATIONS_KEY, JSON.stringify(evaluations));
};

export const addEvaluation = (evaluation: DailyEvaluation): void => {
  const evaluations = getEvaluations();
  
  // Check if evaluation for this employee and date already exists
  const existingIndex = evaluations.findIndex(
    e => e.employeeId === evaluation.employeeId && e.date === evaluation.date
  );
  
  if (existingIndex !== -1) {
    // Update existing evaluation
    evaluations[existingIndex] = evaluation;
  } else {
    // Add new evaluation
    evaluations.push(evaluation);
  }
  
  saveEvaluations(evaluations);
  updateMonthlyStats(evaluation);
};

export const getEmployeeEvaluations = (employeeId: string): DailyEvaluation[] => {
  const evaluations = getEvaluations();
  return evaluations.filter(e => e.employeeId === employeeId);
};

export const getEvaluationsByDate = (date: string): DailyEvaluation[] => {
  const evaluations = getEvaluations();
  return evaluations.filter(e => e.date === date);
};

// Monthly Stats Storage
export const getMonthlyStats = (): MonthlyStats[] => {
  const storedStats = localStorage.getItem(MONTHLY_STATS_KEY);
  return storedStats ? JSON.parse(storedStats) : [];
};

export const saveMonthlyStats = (stats: MonthlyStats[]): void => {
  localStorage.setItem(MONTHLY_STATS_KEY, JSON.stringify(stats));
};

export const updateMonthlyStats = (evaluation: DailyEvaluation): void => {
  const date = new Date(evaluation.date);
  const month = date.getMonth();
  const year = date.getFullYear();
  
  const allStats = getMonthlyStats();
  const existingStatIndex = allStats.findIndex(
    s => s.employeeId === evaluation.employeeId && s.month === month && s.year === year
  );
  
  // Get all evaluations for this employee in this month
  const allEvaluations = getEvaluations();
  const monthEvaluations = allEvaluations.filter(e => {
    const evalDate = new Date(e.date);
    return (
      e.employeeId === evaluation.employeeId &&
      evalDate.getMonth() === month &&
      evalDate.getFullYear() === year
    );
  });
  
  // Calculate average scores for each criteria
  const criteriaCount = evaluation.criteria.length;
  const averageScores = [];
  
  for (let i = 0; i < criteriaCount; i++) {
    const criteriaId = i + 1;
    const totalForCriteria = monthEvaluations.reduce((sum, evaluation) => {
      const criterion = evaluation.criteria.find(c => c.id === criteriaId);
      return sum + (criterion ? criterion.score : 0);
    }, 0);
    
    averageScores.push({
      criteriaId,
      average: totalForCriteria / monthEvaluations.length
    });
  }
  
  const totalAverage = monthEvaluations.reduce((sum, evaluation) => sum + evaluation.totalScore, 0) / 
                       (monthEvaluations.length * criteriaCount);
  
  const newStat: MonthlyStats = {
    employeeId: evaluation.employeeId,
    month,
    year,
    averageScores,
    totalAverage,
    daysEvaluated: monthEvaluations.length,
    isTopPerformer: false // Will be updated when recalculating top performers
  };
  
  if (existingStatIndex !== -1) {
    allStats[existingStatIndex] = newStat;
  } else {
    allStats.push(newStat);
  }
  
  // Recalculate top performers for this month
  recalculateTopPerformers(allStats, month, year);
  
  saveMonthlyStats(allStats);
};

const recalculateTopPerformers = (stats: MonthlyStats[], month: number, year: number): void => {
  // Get all stats for this month and year
  const monthStats = stats.filter(s => s.month === month && s.year === year);
  
  // Reset all top performers
  monthStats.forEach(stat => {
    stat.isTopPerformer = false;
  });
  
  // Find the highest score
  if (monthStats.length > 0) {
    let highestScore = 0;
    let topPerformerIndex = -1;
    
    monthStats.forEach((stat, index) => {
      if (stat.totalAverage > highestScore) {
        highestScore = stat.totalAverage;
        topPerformerIndex = index;
      }
    });
    
    if (topPerformerIndex !== -1) {
      monthStats[topPerformerIndex].isTopPerformer = true;
    }
  }
  
  // Update the original stats array
  monthStats.forEach(updatedStat => {
    const index = stats.findIndex(
      s => s.employeeId === updatedStat.employeeId && s.month === month && s.year === year
    );
    if (index !== -1) {
      stats[index] = updatedStat;
    }
  });
};

// Initialize with some default data if empty
export const initializeDefaultData = (): void => {
  const employees = getEmployees();
  
  if (employees.length === 0) {
    const defaultEmployees: Employee[] = [
      {
        id: '1',
        name: 'Ahmed Hassan',
        position: 'Software Developer',
        department: 'IT',
        photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
        isActive: true
      },
      {
        id: '2',
        name: 'Sara Ahmed',
        position: 'Marketing Specialist',
        department: 'Marketing',
        photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
        isActive: true
      },
      {
        id: '3',
        name: 'Mohammed Ali',
        position: 'Sales Manager',
        department: 'Sales',
        photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
        isActive: true
      }
    ];
    
    saveEmployees(defaultEmployees);
  }
};
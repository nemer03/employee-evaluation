export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  photo?: string;
  isActive: boolean;
}

export interface EvaluationCriteria {
  id: number;
  name: string;
  description: string;
  score: number;
}

export interface DailyEvaluation {
  id: string;
  employeeId: string;
  date: string;
  criteria: EvaluationCriteria[];
  totalScore: number;
  comment?: string;
}

export interface MonthlyStats {
  employeeId: string;
  month: number;
  year: number;
  averageScores: { criteriaId: number; average: number }[];
  totalAverage: number;
  daysEvaluated: number;
  isTopPerformer: boolean;
}
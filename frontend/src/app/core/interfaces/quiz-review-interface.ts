export interface EvaluationResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  review: ReviewItem[];
}

export interface ReviewItem {
  questionId: number;
  question: string;
  isCorrect: boolean;
  feedback: string;
  selectedAnswers: number[];
  correctAnswers: number[];
  wrongSelected: any[]; // Si el API devuelve objetos complejos aquí, define otra interfaz
  missingCorrect: any[];
}
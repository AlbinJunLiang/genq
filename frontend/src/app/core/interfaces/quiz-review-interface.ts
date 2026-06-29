import { Answer } from "./answer-interface";
import { QuestionType } from "./question-interface";

export interface EvaluationResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  review: ReviewItem[];
}

export interface ReviewItem {
  questionId: number;
  score: number;
  content: string;
  feedback: string;
  type: QuestionType;
  answers: Answer[]
}
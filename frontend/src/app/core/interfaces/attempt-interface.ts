import { EvaluationResult } from "./quiz-review-interface";

export interface QuizAttemptResponse {
    quizAttemptedContent: EvaluationResult;
    score: number | null ;
    id: number;
    uuid: string;
    durationSeconds: number;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED'; // Ajusta según tus estados reales
    finishedAt: string | Date | null;
    userId: number;
    quizId: number;
    createdAt: string | Date;
    quizTitle?: string
}
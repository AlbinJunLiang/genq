import { Pagination } from "./offset-pagination-interface";
import { Question, QuestionFromQuiz, QuestionResponse } from "./question-interface";
import { UserAnswer } from "./user-answer-interface";

export interface Quiz {
    uuid?: string;
    id?: number;
    title: string;
    description: string;
    visibility: 'PUBLIC' | 'PRIVATE' | 'INACTIVE' | 'ACCESS_ONLY_VIA_LINK';
    endAt: string | Date;
    durationSeconds: number;
    attemptsLimit: number;
    userId: number;
    createdAt?: string;
    questions?: Question[]
}

export interface QuizDetail {
    id: number;
    uuid: string;
    title: string;
    description: string;
    visibility: 'PUBLIC' | 'PRIVATE' | 'ACCESS_ONLY_VIA_LINK' | 'INACTIVE';
    endAt: string;
    durationSeconds: number;
    attemptsLimit: number;
    userId: number;
    createdAt: string;
    questions: QuestionFromQuiz[];
}

export interface QuizCreateResponse {
    message: string;
    quiz: Quiz;
}

export interface QuizListResponse {
    data: Quiz[];
    pagination: Pagination;
}

export interface QuizApiResponse {
  quiz: QuizDetail;
  attemptUuid: string;
}


export interface EvaluationRequest {
  quizId: number;
  attemptUuid: string;
  answers: UserAnswer[];
}
export type CreateQuizDto = Omit<Quiz, 'uuid' | 'id' | 'createdAt' | 'userId'>;

export type UpdateQuizDto = Partial<Omit<Quiz, 'uuid' | 'id' | 'created_at' | 'user_id'>>;
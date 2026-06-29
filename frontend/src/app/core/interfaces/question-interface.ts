import { Answer, AnswerResponse } from "./answer-interface";

export type QuestionType = 'UNIQUE' | 'MULTIPLE';
export type QuestionStatus = 'ACTIVE' | 'INACTIVE';

export interface Question {
    id: number;
    content: string;
    selected?: boolean;
    quizId: number;
    feedback?: string;
    type?: QuestionType;
    status?: QuestionStatus;
    answers?: AnswerResponse[]
}

export interface QuestionFromQuiz {
    id: number;
    content: string;
    type: 'MULTIPLE' | 'UNIQUE'; // Ajusta según tus valores de ENUM
    status: string;
    score?: number;
    quizId: number;
    answers: Answer[];
}

export interface CreateQuestionDto {
    content: string;
    type: QuestionType;
    quizId: number;
    feedback?: string;
    status?: QuestionStatus;
}

export interface UpdateQuestionDto {
    content: string;
    type: QuestionType;
    quizId: number;
    feedback?: string;
    status?: QuestionStatus;
}

export interface QuestionResponse {
    id: number;
    content: string;
    type: QuestionType;
    feedback: string;
    quizId: number;
    status: QuestionStatus;
}

export interface QuestionListResponse {
    questions: Question[],
}
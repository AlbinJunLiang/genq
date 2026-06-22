export interface Answer {
  id: number;
  content: string;
  isCorrect?: boolean;
  questionId: number;
  status: 'ACTIVE' | 'INACTIVE'; // O puedes usar un tipo global para status
}

export interface AnswerResponse {
  id: number;
  content: string;
  isCorrect: boolean;
  questionId: number;
  status: 'ACTIVE' | 'INACTIVE'; // O puedes usar un tipo global para status
}

export interface CreateAnswerDto {
  content: string;
  isCorrect: boolean;
  questionId: number;
  status: 'ACTIVE' | 'INACTIVE'; // O puedes usar un tipo global para status
}

export interface UpdateAnswerDto {
  content: string;
  isCorrect: boolean;
  status: 'ACTIVE' | 'INACTIVE'; // O puedes usar un tipo global para status
}
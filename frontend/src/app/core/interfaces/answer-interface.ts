export interface Answer {
  id: number;
  content: string;
  isCorrect?: boolean;
  questionId: number;
  status: 'ACTIVE' | 'INACTIVE';
  isSelected?: boolean;
}

export interface AnswerResponse {
  id: number;
  content: string;
  isCorrect: boolean;
  questionId: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface CreateAnswerDto {
  content: string;
  isCorrect: boolean;
  questionId: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateAnswerDto {
  content: string;
  isCorrect: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}
import { Quiz } from "../interfaces/quiz-interface";

export type CreateQuizDto = Omit<Quiz, 'uuid' | 'id' | 'createdAt' | 'userId'>;

export type UpdateQuizDto = Partial<Omit<Quiz, 'uuid' | 'id' | 'created_at' | 'user_id'>>;

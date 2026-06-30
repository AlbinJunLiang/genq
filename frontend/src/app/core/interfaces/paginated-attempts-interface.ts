import { QuizAttemptResponse } from "./attempt-interface";
import { Pagination } from "./offset-pagination-interface";

export interface PaginatedAttempts {
    attempts: QuizAttemptResponse[];
    pagination: Pagination;
}
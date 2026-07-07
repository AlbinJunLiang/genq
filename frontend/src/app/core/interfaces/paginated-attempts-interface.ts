import { LeaderboardAttempt, QuizAttemptResponse } from "./attempt-interface";
import { Pagination } from "./pagination-interface";

export interface PaginatedAttempts {
    attempts: QuizAttemptResponse[];
    pagination: Pagination;
}

export interface PaginatedLeaderboardAttempt {
    attempts: LeaderboardAttempt[];
    pagination: Pagination;
}
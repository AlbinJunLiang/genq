import { Pagination } from "./pagination-interface";
import { User } from "./user-interface";

export interface UserPaginationResponse {
    sucess: boolean;
    data: User[];
    pagination: Pagination;
}
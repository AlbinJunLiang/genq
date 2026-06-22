import { ModelConfig } from "./model-config-interface";
import { User } from "./user-interface";


export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;

}

export interface ModelPaginationResponse {
    sucess: boolean;
    data: ModelConfig[];
    pagination: Pagination;
}

export interface UserPaginationResponse {
    sucess: boolean;
    data: User[];
    pagination: Pagination;
}
import { ModelConfig } from "./model-config-interface";
import { Pagination } from "./pagination-interface";
import { User } from "./user-interface";


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
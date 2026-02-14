import { CreationOptional } from "sequelize";
export interface BlogFaqRequestBody {
    blog_id:number
    question: string;
    answer: string;
}

export interface StatusRequestBody {
    status: string;
}
export interface BlogFaqResponseBody {
    id: CreationOptional<number>;
    blog_id:number
    question: string;
    answer: string;
}
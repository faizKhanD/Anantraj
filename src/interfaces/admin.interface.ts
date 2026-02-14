import { CreationOptional } from "sequelize";
export interface Admin {
    id: CreationOptional<number>;
    name: string;
    email: string;
    phone_number: string;
    password: string;
}
export interface RegisterAdminRequestBody {
    name: string;
    email: string;
    phone_number: string;
    password: string;
}
export interface AdminResponse {
    id: number;
    email: string;
    name: string;
}

export interface AdminCreationResponse{
    name:string,
    email:string,
    password:string,
    phone_number:string
}

export interface LoginRequestBody {
    email: string;
    password: string;
}
export interface LoginSuccessResponse {
    id: number;
    token: string;
}




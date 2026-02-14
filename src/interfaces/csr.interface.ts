import { CreationOptional } from "sequelize";
export interface CSRRequestBody {
    title: string;
    description: string;
    file?: string|null;
    alt_txt?: string | null;
    status?: number;
}

export interface StatusRequestBody {
  status: string;
}
export interface CSRResponseBody {
    id: CreationOptional<number>;
    title: string;
    description: string;
    file: string;
    status: number
}


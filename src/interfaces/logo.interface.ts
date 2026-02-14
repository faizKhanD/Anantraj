import { CreationOptional } from "sequelize";


export interface logoRequestBody {
    is_type: number;
    label: string;
    image?: string|null;
    alt: string;
    status: number;
}

export interface StatusRequestBody {
    status: string;
}

export interface logoResponseBody {
    id: CreationOptional<number>;
    is_type: string;
    label: string;
    image: string;
    alt: string;
    status: number;
}
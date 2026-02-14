import { CreationOptional } from "sequelize";


export interface amenitiesLogoRequestBody {
    name: string;
    logo?: string|null;
    alt: string;
    status: number;
}

export interface StatusRequestBody {
    status: string;
}

export interface amenitiesLogoResponseBody {
    id: CreationOptional<number>;
    name: string;
    logo: string;
    alt: string;
    status: number;
}
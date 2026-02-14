import { CreationOptional } from "sequelize";


export interface BrandPillarRequestBody {
    title: string;
    short_description: string;
    status: number
}

export interface StatusRequestBody {
    status: string;
}

export interface BrandPillarResponseBody {
    id: CreationOptional<number>;
    title: string;
    short_description: string;
    status: number
}
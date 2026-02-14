import { CreationOptional } from "sequelize";


export interface EventGalleriesRequestBody {
    year: number;
    image?: string|null;
    alt: string;
    status: number;
}

export interface StatusRequestBody {
    status: string;
}

export interface EventGalleriesResponseBody {
    id: CreationOptional<number>;
    year: string;
    image: string;
    alt: string;
    status: number;
}
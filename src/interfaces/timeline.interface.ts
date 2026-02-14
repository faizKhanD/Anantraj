import { CreationOptional } from "sequelize";


export interface TimelineRequestBody {
    year: number;
    image?: string|null;
    alt: string;
    short_description: string;
    status: number
}

export interface StatusRequestBody {
    status: string;
}

export interface TimelineResponseBody {
    id: CreationOptional<number>;
    year: number;
    image: string;
    alt: string;
    short_description: string;
    status: number
}
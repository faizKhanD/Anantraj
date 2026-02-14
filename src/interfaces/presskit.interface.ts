import { CreationOptional } from "sequelize";


export interface PressKitRequestBody {
    title: string;
    image?: string|null;
    alt_text?: string;
}

export interface StatusRequestBody {
    status: string;
}

export interface PressKitResponseBody {
    id: CreationOptional<number>;    
    title: string;
    image: string;
    alt_text?: string;
}
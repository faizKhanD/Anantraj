import { CreationOptional } from "sequelize";


export interface NewsRequestBody {
    image?: string|null;
    logo?: string|null;
    alt: string;
    link: Text;
    short_description: string;
    date_at:string;
    status: number
}

export interface StatusRequestBody {
    status: string;
}

export interface NewsResponseBody {
    id: CreationOptional<number>;
    image: string;
    logo: string;
    alt: string;
    link: Text;
    short_description: string;
    date_at:string;
    status: number
}
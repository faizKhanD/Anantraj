import { CreationOptional } from "sequelize";


export interface TestimonialRequestBody {
    name: string;
    image?: string|null;
    alt: string;
    short_description: string;
    status: number;
    video_link: string;
    rating: number;
    seq: number;
}

export interface StatusRequestBody {
    status: string;
}

export interface TestimonialResponseBody {
    id: CreationOptional<number>;
    name: string;
    image: string;
    alt: string;
    short_description: string;
    status: number;
    video_link: string;
    rating: number;
    seq: number;
}
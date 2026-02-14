import { CreationOptional } from "sequelize";
export interface OurStoryAndManifatoRequestBody {
    type:string;
    image?: string|null;
    alt_text: string;
    status: number;
    sequence: number

}


export interface OurStoryAndManifatoResponseBody {
    id: CreationOptional<number>;
    type:string;
    image?: string|null;
    alt_text: string;
    status: number;
    sequence: number
}



export interface OurStoryAndManifatoUpdateRequestBody {
    image?: string|null;
    alt_text: string;
    status: number;
    sequence: number

}
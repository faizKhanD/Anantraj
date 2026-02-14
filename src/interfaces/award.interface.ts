import { CreationOptional } from "sequelize";
export interface AwardRequestBody {
    year: number;
    title: string;
    description: string;
    file?: string|null;
    alt_txt?: string | null;
    status?: number;
}

export interface StatusRequestBody {
  status: string;
}
export interface AwardResponseBody {
    id: CreationOptional<number>;
    year: number;
    title: string;
    description: string;
    file: string;
    status: number
}






export interface AwardGalleryRequestBody {
  award_id:number;
  image?: string|null;
  alt_text: string;
  status: number
}


export interface AwardGalleryResponseBody {
  id: CreationOptional<number>;
  award_id: number;
  image: string;
  alt_text: string;
  status: number
}
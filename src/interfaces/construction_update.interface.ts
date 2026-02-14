import { CreationOptional } from "sequelize";
export interface ConstructionUpdateRequestBody {
    platter_id: number;
    title: string;
   
    file?: string|null;
    status?: number;
    
}


export interface ConstructionUpdateResponseBody {
    id: CreationOptional<number>;
    platter_id: number;
    title: string;
    file: string;
    status: number
}







export interface ConstructionUpdateSubProjectRequestBody {
    construction_project_id: number;
    title: string;
   
    file?: string|null;
    status?: number;
    
}


export interface ConstructionUpdateSubProjectResponseBody {
    id: CreationOptional<number>;
    construction_project_id: number;
    title: string;
    file: string;
    status: number
}




export interface ConstructionUpdateProjectGalleryRequestBody {
construction_update_project_id:number
construction_update_sub_project_id?:number | null
month_year:string;
type:string
video_link?:string
image?:string;
alt?:string  
status?: number;
}

export interface ConstructionUpdateProjectGalleryResponseBody {
id:CreationOptional<number>
construction_update_project_id:number
construction_update_sub_project_id?:number | null
month_year:string;
type:string
video_link?:string
image?:string;
alt?:string  
status?: number;
}


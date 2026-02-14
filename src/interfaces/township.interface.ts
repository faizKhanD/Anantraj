export interface PlatterRequestBody {
  name: string;
  slug: string;
  heading:string;
  short_description: string;
  platter_overview: string;
  sub_heading: string;
  alt?: string;
  image?: string | null;
  mobile_image?: string | null;
  status: number;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  body_tags: string;
  seo_tags: string;
  seq:number;
  link:string;
}

export interface PlatterResponseBody {
  id: number;
  name: string;
  heading:string;
  slug: string;
  platter_overview: string;
  sub_heading: string;
  short_description: string;
  alt?: string;
  image?: string | null;
  mobile_image?: string | null;
  status: number;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  body_tags: string;
  seo_tags: string;
  seq:number;
  link:string;
}




export interface TownShipAmenitiesRequestBody {
  id?: number; 
  amenities_logo_id: number; 
  title?: string | null;  
  alt_text:string|null
  desktop_file?: string;
  mobile_file?: string;
  status?: "0" | "1";
  createdAt?: Date;
  updatedAt?: Date;
}







// Location interface
export interface LocationRequestBody {
  title: string;
  distance_time?: string | null;
  status?: number;
}

export interface LocationResponseBody {
  id: number;
  title: string;
  distance_time?: string | null;
  status?: number;
}
// end Location interface

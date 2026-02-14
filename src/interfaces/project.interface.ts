export interface ProjectRequestBody {
  name: string;
  short_description?: string;
  image?: string | null;
  logo?: string | null;
  address?: string;
  alt?: string;
  rera_no?: string;
  qr_logo?: string | null;
  platterId: number;
  typologyId: number;
  subTypologyId: number;
  projectStatusId: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  seo_tags?: string;
  body_tags?: string;
  status?: number;
  link: string;
}

export interface StatusRequestBody {
  status: number;
}

export interface ProjectResponseBody {
  id: number;
  name: string;
  slug: string;
  short_description?: string;
  image?: string | null;
  logo?: string | null;
  address?: string;
  alt?: string;
  rera_no?: string;
  platterId: number;
  qr_logo?: string | null;
  typologyId: number;
  subTypologyId: number;
  projectStatusId: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  seo_tags?: string;
  body_tags?: string;
  status: number;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}




// section interface 

export interface BannerRequestBody {
    project_id:number
    mobile_file: string
    desktop_file: string;
    alt_text?: string | null;
    status?: number;
}
export interface BannerResponseBody {
    id: number;
    project_id:number;
    mobile_file: string
    desktop_file: string;
    alt_text?: string | null;
    status?: number;
}
// end section interface 




// sections 
export interface ProjectSectionsRequestBody {
  id?: number; // CreationOptional
  project_id: number; // CreationOptional
  type: string;
  title?: string | null;  // JSONB object
  desktop_file?: string;
  mobile_file?: string;
  sequence: number;
  description?: string | null;
  link?: string | null;
  other?: Record<string, any> | null;  // JSONB object
  status?: "0" | "1";
  createdAt?: Date;
  updatedAt?: Date;
}


// end sections 



// amenities interface
export interface AmenitiesRequestBody {
  project_id:number
  logo_id:number
  title: string
  short_description: string;
  image: string;
  alt?: string | null;
  status?: number;
}

export interface AmenitiesResponseBody {
  id: number;
  project_id:number;
  logo_id:number;
  title: string;
  image: string;
  alt?: string | null;
  short_description: string
  status?: number;
}
// end amenities interface

// highlights interface
export interface HighlightsRequestBody {
  project_id:number
  title: string;
  imiage: string;
  alt?: string | null;
  status?: number;
}

export interface HighlightsResponseBody {
  id: number;
  project_id:number;
  title: string;
  image: string;
  alt?: string | null;
  status?: number;
}
// end highlights interface


// specifications interface
export interface SpecificationsRequestBody {
  project_id:number
  title: string;
  imiage: string;
  alt?: string | null;
  status?: number;
}

export interface SpecificationsResponseBody {
  id: number;
  project_id:number;
  title: string;
  image: string;
  alt?: string | null;
  status?: number;
}
// end Specificaitons interface


// floorplan interface
export interface FloorplanRequestBody {
  project_id: number;
  sub_typologie_id: number;
  title: string;
  image: string;
  alt?: string | null;
  type: "floorplan" | "masterplan"; // 👈 required field when creating
  status?: number;
}

export interface FloorplanResponseBody {
  id: number;
  project_id: number;
  sub_typologie_id: number;
  title: string;
  image: string;
  alt?: string | null;
  type: "floorplan" | "masterplan"; // 👈 always returned
  status?: number;
}
// end floorplan interface



// Location interface
export interface LocationRequestBody {
  project_id:number
  destination_id:number
  title: string;
  image: string;
  alt?: string | null;
  distance_time?: string | null;
  status?: number;
}

export interface LocationResponseBody {
  id: number;
  project_id:number;
  destination_id:number;
  title: string;
  image: string;
  alt?: string | null;
  distance_time?: string | null;
  status?: number;
}
// end Location interface


// galleries interface
export interface GalleriesRequestBody {
  project_id:number
  type: string;
  video_link: string | null;
  is_construction : number;
  image: string;
  year: string;
  alt?: string | null;
  status?: number;
}

export interface GalleriesResponseBody {
  id: number;
  project_id:number;
  type: string;
  video_link: string | null;
  is_construction : number;
  image: string;
  year: string;
  alt?: string | null;
  status?: number;
}
// end galleries interface
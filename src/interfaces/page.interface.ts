import { CreationOptional } from "sequelize";
export interface PageRequestBody {
  name: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  seo_tags: string;
  body_tags: string;
  description: string;
  status: string;
  banner?: string | null;
}

export interface StatusRequestBody {
  status: string;
}
export interface PageResponseBody {
  id: CreationOptional<number>;
  name: string;
  meta_title: string;
  meta_description: string;
  description: string;
  file?: string | null;
  meta_keywords: string;
  seo_tags: string;
  body_tags: string;
  status: string;
}

export interface OtherSectionsRequestBody {
  id?: number; // CreationOptional
  type:
    | "home_banner"
    | "Home_page_counter"
    | "home_page_overview"
    | "about_us_overview"
    | "vison_and_mission"
    | "contact_info"
    | "csr_overview"
    | "testimonial_overview"
    | "awards_overview"
    | "investor_overview"
    | "gallery_overview"
    | "township_overview" 
    | "team_categories_overview"
     // ENUM
  title?: string | null; // JSONB object
  alt_text: string | null;
  desktop_file?: string;
  mobile_file?: string;
  description?: string | null;
  link?: string | null;
  other?: Record<string, any> | null; // JSONB object
  status?: "0" | "1";
  createdAt?: Date;
  updatedAt?: Date;
}

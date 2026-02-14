import { CreationOptional } from "sequelize";
export interface BlogRequestBody {
    slug: string;
    title: string;
    short_description: string;
    image?: string|null;
    mobile_image?: string | null;
    alt?: string | null;
    long_description: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    seo_tags: string;
    status: number;
    date_at?: string | null;
}

export interface StatusRequestBody {
    status: string;
}
export interface BlogResponseBody {
    id: CreationOptional<number>;
    slug: string;
    title: string;
    short_description: string;
    image: string;
    mobile_image?: string | null;
    alt?: string | null;
    long_description: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    seo_tags: string;
    status: number;
    date_at?: string | null;
}
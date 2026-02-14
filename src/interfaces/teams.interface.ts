import { CreationOptional } from "sequelize";


export interface TeamRequestBody {
    is_team_board: number;
    name: string;
    designation: string;
    image?: string|null;
    alt: string;
    short_description: string;
    long_description: string;
    status: number;
    is_leadership: number;
    seq: number;
    home_seq: number;
    directorship?: Record<string, any> | null; // JSONB object
    din_number?: string;
}

export interface StatusRequestBody {
    status: string;
}

export interface TeamResponseBody {
    id: CreationOptional<number>;
    is_team_board: number;
    name: string;
    designation: string;
    image: string;
    alt: string;
    short_description: string;
    long_description: string;
    status: number;
    is_leadership: number;
    seq: number;
    home_seq: number;
    directorship?: Record<string, any> | null; // JSONB object
    din_number?: string;
}
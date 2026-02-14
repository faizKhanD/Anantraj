import { CreationOptional } from "sequelize";

export interface TypologyRequestBody {
  name: string;
  status?: number;
}

export interface TypologyResponseBody {
  id: CreationOptional<number>;
  name: string;
  status: number;
}
export interface SubTypologyRequestBody {
  name: string;
  status?: number;
}

export interface SubTypologyResponseBody {
  id: CreationOptional<number>;
  name: string;
  status: number;
}

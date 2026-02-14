import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: { id: number , security_agency_id?: number ,  company_id?: number, role: any};
}
export interface AuthenticatedCompanyUserRequest extends Request{
  user?: { id: number , security_agency_id?: number ,  company_id?: number, role: any , companyName : string, companyEmail: string};
}
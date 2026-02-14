 
export interface StatusRequestBody {
    status: string;
}

export interface FileObject {
  key: string;
  originalName: string;
  mimetype: string;
  size: number;
  url?: string;
}

export interface InvestorsRequestBody {
  parent_id?: number | null;
  year?: string | null;
  description?: string | null;
  link?: string | null;
  title: string;
  file: string;
  file_list: string[];
  other?: Record<string, any> | null;
  permissions?: string;
  files_to_replace?: string;  //for testing purpose
  seq?: boolean;
}

export interface InvestorsResponseBody {
  id?: number;
  parent_id?: number | null;
  year?: string | null;
  description?: string | null;
  link?: string | null;
  title: string;
  file: string; // signed URLs
  file_list: string[];
  other:  string[];
  permissions?: string;
  children?: any[];
}
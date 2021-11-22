import { ICompanyUserSectors } from "./company-user-sectors";
import { iProfile } from "./profile";


export interface Company {
    id: number;
    company_name: string;
    code: string;
    document: string;
    fantasy_name: string;
    thumb: [{ type: string; base64: string }];
    media: [
        {
          id: number;
          file_path: string;
          path_name: string;
          status?: boolean;
          created_at?: string;
          updated_at?: string;
          type: string;
          url: string;
        },
      ];
    email: string;
    status: boolean;
    created_at: string;
    updated_at: string;
    type_company_id: number;
    user_sectors: ICompanyUserSectors[];
    company_profiles: iProfile[];
}
export interface User {
  user: IUser;
  email: string;
  SSID: string;
  EMPSSID: string;
  SSTK: string;
  remember_me: boolean;
}

export interface IUser {
  id: number;
  name: string;
  last_name: string;
  email: string;
  cellphone: string;
  thumb: string;
  document: string;
  code: string;
  postal_code: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  city: string;
  state: string;
  country: string;
  status: boolean;
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
  profiles: Array<unknown>;
  companies: Array<unknown>;
  sectors: Array<unknown>;
}

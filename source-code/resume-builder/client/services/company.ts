import axios from './axios';
import { DefaultResponseData, EntryResponse, MediaType, ResponseData, StrapiQueryParams } from './interface';

export type Company = DefaultResponseData & {
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  description?: string;
  avatar?: ResponseData<EntryResponse<MediaType>>;
  banner?: ResponseData<EntryResponse<MediaType>>;
  website?: string;
  companySize?: string;
  recruitments: any;
};

export type GetCompaniesResponse = ResponseData<EntryResponse<Company>[]>;
export type GetCompanyResponse = ResponseData<EntryResponse<Company>>;

export const fetchCompanies = (params: Partial<StrapiQueryParams>) =>
  axios.get<GetCompaniesResponse>(`/cms/companies/`, { params }).then((res) => res.data);

export const fetchCompanyById = (companyId: number) =>
  axios.get<GetCompanyResponse>(`/cms/companies/${companyId}?populate=*`).then((res) => res.data);

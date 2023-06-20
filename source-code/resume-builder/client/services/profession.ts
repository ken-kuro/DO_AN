import axios from './axios';
import { DefaultResponseData, EntryResponse, ResponseData, StrapiQueryParams } from './interface';

export type Profession = DefaultResponseData & {
  name: string;
  description: string;
};

export type GetProfessionsResponse = ResponseData<EntryResponse<Profession>[]>;
export type GetListProfessionsResponse = ResponseData<EntryResponse<Profession>[]>;

export const fetchProfessions = async (params: StrapiQueryParams) => {
  const { data } = await axios.get<GetListProfessionsResponse>('/cms/professions', { params });
  return data;
};

export const fetchProfessionById = async (id: string) => {
  const { data } = await axios.get<Profession>(`/cms/professions/${id}`);
  return data;
};

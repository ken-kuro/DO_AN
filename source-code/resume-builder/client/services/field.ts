import axios from './axios';
import { DefaultResponseData, EntryResponse, ResponseData, StrapiQueryParams } from './interface';

export type Field = DefaultResponseData & {
  name: string;
  description: string;
};

export type GetFieldsResponse = ResponseData<EntryResponse<Field>[]>;
export type GetListFieldsResponse = ResponseData<EntryResponse<Field>[]>;

export const fetchFields = async (params: StrapiQueryParams) => {
  const { data } = await axios.get<GetListFieldsResponse>('/cms/fields', { params });
  return data;
};

export const fetchFieldById = async (id: string) => {
  const { data } = await axios.get<Field>(`/cms/fields/${id}`);
  return data;
};

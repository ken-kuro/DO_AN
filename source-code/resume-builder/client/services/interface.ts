export type Pagination = {
  page?: number;
  pageSize?: number;
  pageCount?: number;
  total?: number;
  start?: number;
  limit?: number;
  withCount?: boolean | string;
};

export type ResponseMeta = {
  pagination?: Pagination;
};

export type EntryResponse<T = Record<any, any>> = {
  attributes: T;
  id: T extends Record<any, any> ? number : never;
};

export type ResponseData<T> = {
  data?: T;
  meta?: ResponseMeta;
};

export type RequestMeta = {
  page?: number;
  limit?: number;
};

export type User = {
  firstname: string;
  lastname: string;
};

export type DefaultResponseData = {
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: EntryDataResponse<User>;
  updatedBy?: EntryDataResponse<User>;
  publishedAt?: Date;
  featuredAt?: Date;
};

export type StrapiQueryParams = {
  sort?: string[];
  filters?: Record<string, any>;
  populate?: string | Record<string, any>;
  fields?: string[];
  pagination?: Pagination;
  publicationState?: 'live' | 'preview';
  locale?: string | string[];
};

export type EntryDataResponse<T = Record<any, any>> = Omit<ResponseData<EntryResponse<T>>, 'meta'>;
export type EntriesDataResponse<T = Record<any, any>> = Omit<ResponseData<EntryResponse<T>[]>, 'meta'>;

export type MediaType = DefaultResponseData & {
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats?: unknown;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  providerMetadata?: unknown;
  related?: EntryDataResponse<unknown>;
  folder?: EntryDataResponse<
    {
      name: string;
      pathId: number;
      parent: EntryDataResponse<unknown>;
      children: EntryDataResponse<unknown>;
      files: MediaType;
    } & DefaultResponseData
  >;
  folderPath?: string;
};

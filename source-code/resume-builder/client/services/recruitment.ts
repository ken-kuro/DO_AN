import axios from './axios';
import { DefaultResponseData, EntryResponse, ResponseData, StrapiQueryParams } from './interface';

export type Recruitment = DefaultResponseData & {
  name: string;
  description?: string;
  title: string;
  salary: string;
  company?: any;
  workLocation: string;
  requirements: string;
  benefits: string;
  jobDeadline: Date;
  province: string;
  numberOfRecruitment: number;
  employeeLevel: string;
  jobType: string;
  experience: string;
  gender: string;
};

export type GetListRecruitmentsResponse = ResponseData<EntryResponse<Recruitment>[]>;
export type GetRecruitmentsResponse = ResponseData<EntryResponse<Recruitment>>;

export const fetchRecruitments = (params: Partial<StrapiQueryParams>) =>
  axios.get<GetListRecruitmentsResponse>(`/cms/recruitments`, { params }).then((res) => res.data);

export const fetchRecruitmentById = (recruitmentId: number) =>
  axios
    .get<GetRecruitmentsResponse>(`/cms/recruitments/${recruitmentId}`, {
      params: {
        populate: {
          company: {
            populate: {
              avatar: true,
              banner: true,
            },
          },
          profession: true,
          skills: true,
          candidates: {
            populate: {
              user: {
                fields: ['id'],
              },
            },
          },
        },
      },
    })
    .then((res) => res.data);

export const applyRecruitment = (recruitmentId: number, body: { resume: number }) =>
  axios.post(`/cms/recruitments/apply/${recruitmentId}`, body).then((res) => res.data);

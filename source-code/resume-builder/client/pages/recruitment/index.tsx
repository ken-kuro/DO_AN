import {
  Autocomplete,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  Pagination,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';
import RecruitmentItem from '@/components/shared/RecruitmentItem/RecruitmentItem';
import { RECRUITMENTS_QUERY } from '@/constants/index';
import { fetchFields } from '@/services/field';
import { fetchProfessions } from '@/services/profession';
import { fetchRecruitments } from '@/services/recruitment';

type FormData = {
  searchText: string;
  location: string;
  field: number;
  profession: number;
  experience: string;
  salary: string;
  jobType: string;
  employeeLevel: string;
  sort: string;
};

const defaultState: FormData = {
  searchText: '',
  location: 'default',
  field: 0,
  profession: 0,
  experience: 'Chưa có kinh nghiệm',
  salary: 'default',
  jobType: 'default',
  employeeLevel: 'default',
  sort: 'updatedAt',
};

const ControllerAutocomplete = ({ control, name, options, placeholder }: any) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { onChange, value, ref } = field;
        return (
          <Autocomplete
            value={value ? options.find((option: any) => value === option.id) ?? null : null}
            fullWidth
            options={options}
            onChange={(_, data: any) => {
              onChange(data ? data.id : null);
            }}
            getOptionLabel={(option: any) => option.label}
            size="small"
            renderInput={(params) => (
              <TextField {...params} placeholder={placeholder} sx={{ backgroundColor: '#fff' }} inputRef={ref} />
            )}
          />
        );
      }}
    />
  );
};

const ControllerTextField = ({ control, name, placeholder }: any) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <TextField size="small" placeholder={placeholder} autoFocus fullWidth {...field} />
    )}
  />
);

const ControllerRadio = ({ control, name }: any) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <RadioGroup row {...field}>
        <FormControlLabel value="updatedAt" control={<Radio />} label="Cập nhật gần nhất" />
        <FormControlLabel value="createdAt" control={<Radio />} label="Việc mới đăng" />
      </RadioGroup>
    )}
  />
);

const salaryOptions = [
  { label: 'Tất cả', id: 'default' },
  { label: 'Dưới 3 triệu', id: 'Dưới 3 triệu' },
  { label: '3 - 5 triệu', id: 'Từ 3 - 5 triệu' },
  { label: '5 - 7 triệu', id: 'Từ 5 - 7 triệu' },
  { label: '7 - 10 triệu', id: 'Từ 7 - 10 triệu' },
  { label: '10 - 12 triệu', id: 'Từ 10 - 12 triệu' },
  { label: '12 - 15 triệu', id: 'Từ 12 - 15 triệu' },
  { label: '15 - 20 triệu', id: 'Từ 15 - 20 triệu' },
  { label: '20 - 25 triệu', id: 'Từ 20 - 25 triệu' },
  { label: '25 - 30 triệu', id: 'Từ 25 - 30 triệu' },
  { label: 'Trên 30 triệu', id: 'Trên 30 triệu' },
  { label: 'Thoả thuận', id: 'Thoả thuận' },
];

const locationOptions = [
  { label: 'Tất cả địa điểm', id: 'default' },
  { label: 'Hà Nội', id: 'Hà Nội' },
  { label: 'Hồ Chí Minh', id: 'Hồ Chí Minh' },
];

const jobTypeOptions = [
  { label: 'Tất cả hình thức', id: 'default' },
  { label: 'Toàn thời gian', id: 'Toàn thời gian' },
  { label: 'Bán thời gian', id: 'Bán thời gian' },
  { label: 'Remote', id: 'Remote' },
];

const employeeLevelOptions = [
  { label: 'Tất cả cấp bậc', id: 'default' },
  { label: 'Thực tập sinh', id: 'Thực tập sinh' },
  { label: 'Nhân viên', id: 'Nhân viên' },
  { label: 'Trưởng nhóm', id: 'Trưởng nhóm' },
  { label: 'Trưởng/Phó phòng', id: 'Trưởng/Phó phòng' },
  { label: 'Quản lý/Giám sát', id: 'Quản lý/Giám sát' },
  { label: 'Trưởng chi nhánh', id: 'Trưởng chi nhánh' },
  { label: 'Phó giám đốc', id: 'Phó giám đốc' },
  { label: 'Giám đốc', id: 'Giám đốc' },
];

const experienceOptions = [
  { label: 'Chưa có kinh nghiệm', id: 'Chưa có kinh nghiệm' },
  { label: 'Dưới 1 năm', id: 'Dưới 1 năm' },
  { label: '1 năm', id: 'Một năm' },
  { label: '2 năm', id: 'Hai năm' },
  { label: '3 năm', id: 'Ba năm' },
  { label: '4 năm', id: 'Bốn năm' },
  { label: '5 năm', id: 'Năm năm' },
  { label: 'Trên 5 năm', id: 'Trên 5 năm' },
];

export const getServerSideProps: GetServerSideProps<any> = async ({ query, locale = 'vi' }) => {
  const params = {
    populate: '*',
    sort: ['name:asc'],
  };

  try {
    const { data: fields } = await fetchFields(params);
    const { data: professions } = await fetchProfessions(params);

    return {
      props: {
        fields,
        professions,
        ...(await serverSideTranslations(locale, ['common', 'modals', 'landing'])),
      },
    };
  } catch (err) {
    return {
      props: {
        fields: [],
        professions: [],
        ...(await serverSideTranslations(locale, ['common', 'modals', 'landing'])),
      },
    };
  }
};

const ListRecruitments: NextPage<any> = ({ fields, professions }) => {
  const [params, setParams] = useState<any>({
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
    filters: {},
    sort: `${defaultState.sort}:desc`,
    pagination: {
      start: 0,
      limit: 10,
    },
  });
  const { data: recruitments } = useQuery([RECRUITMENTS_QUERY, params], () => fetchRecruitments(params));

  const totalPage = Math.ceil(
    (recruitments?.meta?.pagination?.total as number) / (recruitments?.meta?.pagination?.limit as number)
  );

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: defaultState,
  });

  const onSubmit = async (data: FormData) => {
    const newParams = { ...params };

    if (data.searchText.trim() === defaultState.searchText) {
      delete newParams.filters.title;
    } else {
      Object.assign(newParams.filters, {
        title: {
          $containsi: data.searchText.trim(),
        },
      });
    }

    if (data.location === defaultState.location) {
      delete newParams.filters.province;
    } else {
      Object.assign(newParams.filters, {
        province: data.location,
      });
    }

    if (data.employeeLevel === defaultState.employeeLevel) {
      delete newParams.filters.employeeLevel;
    } else {
      Object.assign(newParams.filters, {
        employeeLevel: data.employeeLevel,
      });
    }

    if (data.jobType === defaultState.jobType) {
      delete newParams.filters.jobType;
    } else {
      Object.assign(newParams.filters, {
        jobType: data.jobType,
      });
    }

    if (data.profession === defaultState.profession) {
      delete newParams.filters.profession;
    } else {
      Object.assign(newParams.filters, {
        profession: data.profession,
      });
    }

    if (data.field === defaultState.field) {
      delete newParams.filters.company;
    } else {
      Object.assign(newParams.filters, {
        company: {
          fields: data.field,
        },
      });
    }

    if (data.experience === defaultState.experience) {
      delete newParams.filters.experience;
    } else {
      Object.assign(newParams.filters, {
        experience: data.experience,
      });
    }

    if (data.salary === defaultState.salary) {
      delete newParams.filters.salary;
    } else {
      Object.assign(newParams.filters, {
        salary: data.salary,
      });
    }

    if (data.sort) {
      Object.assign(newParams, {
        sort: `${data.sort}:desc`,
      });
    }

    setParams(newParams);
  };

  const handlePaginationChange = (e: any, value: number) => {
    const newParams = { ...params };
    newParams.pagination.start = (value - 1) * 10;
    setParams(newParams);
  };

  return (
    <Box>
      <Header />

      <Box sx={{ paddingY: '16px' }}>
        <Container>
          <Grid container spacing={2} justifyContent="space-between" alignItems="center">
            <Grid item md={4} xs={12}>
              <ControllerTextField
                name="searchText"
                control={control}
                placeholder="Tên công việc mà bạn muốn ứng tuyển"
              />
            </Grid>
            <Grid item md={2} xs={12}>
              <ControllerAutocomplete
                name="profession"
                control={control}
                placeholder="Ngành nghề"
                options={professions?.map((profession: any) => ({
                  label: profession.attributes.name,
                  id: profession.id,
                }))}
              />
            </Grid>
            <Grid item md={2} xs={12}>
              <ControllerAutocomplete
                name="field"
                control={control}
                placeholder="Lĩnh vực"
                options={fields?.map((field: any) => ({
                  label: field.attributes.name,
                  id: field.id,
                }))}
              />
            </Grid>
            <Grid item md={2} xs={12}>
              <ControllerAutocomplete
                name="location"
                control={control}
                placeholder="Địa điểm làm việc"
                options={locationOptions}
              />
            </Grid>
            <Grid item md={2} xs={12}>
              <Button
                size="large"
                sx={{
                  backgroundColor: '#00b14f',
                  width: '100%',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: '#009643',
                  },
                }}
                onClick={handleSubmit(onSubmit)}
              >
                Tìm kiếm
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          backgroundColor: '#f0f0f0',
          padding: '16px',
        }}
      >
        <Container>
          <Box sx={{ marginBottom: '16px' }}>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12}>
                <ControllerAutocomplete
                  name="jobType"
                  control={control}
                  placeholder="Hình thức làm việc"
                  options={jobTypeOptions}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <ControllerAutocomplete
                  name="employeeLevel"
                  control={control}
                  placeholder="Cấp bậc"
                  options={employeeLevelOptions}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <ControllerAutocomplete
                  name="experience"
                  control={control}
                  placeholder="Kinh nghiệm làm việc"
                  options={experienceOptions}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <ControllerAutocomplete
                  name="salary"
                  control={control}
                  placeholder="Mức lương"
                  options={salaryOptions}
                />
              </Grid>
            </Grid>
          </Box>

          <Box
            sx={{
              backgroundColor: '#fff',
              borderRadius: '3px',
              padding: '20px 0',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                borderBottom: '1px solid #eee',
                alignItems: 'center',
                padding: '0 16px 20px',
              }}
            >
              {recruitments?.data?.length ? (
                <>
                  Tìm thấy
                  <Box
                    component="span"
                    sx={{
                      color: '#00b14f',
                      fontWeight: 700,
                      marginX: '4px',
                    }}
                  >
                    {recruitments?.meta?.pagination?.total}
                  </Box>
                  công việc làm phù hợp với bạn
                </>
              ) : (
                'Không tìm thấy công việc phù hợp với bạn. Hãy thử một bộ tìm kiếm khác'
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                borderBottom: '1px solid #eee',
                padding: '5px 20px',
                alignItems: 'center',
              }}
            >
              <Box component="span" sx={{ color: '#6f7882', marginRight: '32px' }}>
                Ưu tiên hiển thị:
              </Box>

              <FormControl>
                <ControllerRadio name="sort" control={control} />
              </FormControl>
            </Box>

            <Box sx={{ padding: '16px 16px 0' }}>
              {recruitments?.data?.map((recruitment: any) => (
                <RecruitmentItem
                  recruitment={recruitment.attributes}
                  recruitmentId={recruitment.id}
                  key={recruitment.id}
                />
              ))}
            </Box>

            {recruitments?.data?.length !== 0 && totalPage > 1 && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 16px 0' }}>
                <Pagination
                  shape="rounded"
                  count={totalPage}
                  page={recruitments?.meta?.pagination?.page}
                  onChange={handlePaginationChange}
                />
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default ListRecruitments;

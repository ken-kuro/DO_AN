import { Box, Button, Container, Grid, Link, Pagination, TextField, Typography } from '@mui/material';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import Footer from '@/components/shared/Footer/Footer';
import Header from '@/components/shared/Header/Header';
import { COMPANIES_QUERY } from '@/constants/index';
import { Company, fetchCompanies } from '@/services/company';

export const getStaticProps: GetStaticProps = async ({ locale = 'vi' }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'modals', 'landing'])),
  },
});

const CompanyBox = ({ company, companyId }: { company: Company; companyId: number }) => {
  const router = useRouter();

  const handleNavigateCompanyDetail = () => {
    router.push(`/company/${companyId}`);
  };

  return (
    <Grid item md={4}>
      <Box
        sx={{
          borderRadius: '5px',
          background: '#fff 0 0 no-repeat padding-box',
          boxShadow: '-1px 1px 4px rgba(0,0,0,.051)',
          height: '450px',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            height: '180px',
            marginBottom: '16px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box onClick={() => handleNavigateCompanyDetail()} sx={{ cursor: 'pointer' }}>
            <Box sx={{ height: '150px' }}>
              <Box
                component="img"
                src={company.banner?.data?.attributes.url}
                alt={company.name}
                sx={{
                  height: '100%',
                  width: '100%',
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              background: '#fff',
              border: '1px solid #eee',
              borderRadius: '5px',
              bottom: '0',
              height: '64px',
              left: '16px',
              position: 'absolute',
              width: '64px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => handleNavigateCompanyDetail()}
          >
            <Box>
              <Box
                component="img"
                src={company.avatar?.data?.attributes.url}
                alt={company.name}
                sx={{
                  height: '100%',
                  width: '100%',
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            padding: '0 16px',
          }}
        >
          <Typography>
            <Link
              href={company.website}
              target="_blank"
              sx={{
                color: '#333',
                fontWeight: 700,
                textAlign: 'left',
                textDecoration: 'none',
                textTransform: 'uppercase',
              }}
            >
              {company.name}
            </Link>
          </Typography>
          <Box
            sx={{
              color: '#555',
              fontSize: '14px',
              letterSpacing: 0,
              paddingTop: '16px',
            }}
          >
            <Box
              component="p"
              sx={{
                textAlign: 'justify',
              }}
            >
              {company.description}
            </Box>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

interface FormData {
  searchText?: string;
}

const defaultState: FormData = {
  searchText: '',
};

const ListCompanies = () => {
  const [params, setParams] = useState<any>({
    populate: '*',
    filters: {},
    pagination: {
      start: 0,
      limit: 12,
    },
  });
  const { data: companies } = useQuery([COMPANIES_QUERY, params], () => fetchCompanies(params));

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: defaultState,
  });

  const onSubmit = (data: FormData) => {
    const newParams = { ...params };
    newParams.filters = {
      name: {
        $containsi: data.searchText,
      },
    };
    setParams(newParams);
  };

  const totalPage = Math.ceil(
    (companies?.meta?.pagination?.total as number) / (companies?.meta?.pagination?.limit as number)
  );

  const handlePaginationChange = (e: any, value: number) => {
    const newParams = { ...params };
    newParams.pagination.start = (value - 1) * 10;
    setParams(newParams);
  };

  return (
    <Box>
      <Header />

      <Box
        sx={{
          background:
            'transparent linear-gradient(6deg,#fff,#c4ffdd 100%,rgba(195,255,221,.702) 0) 0 0 no-repeat padding-box',
          marginBottom: 0,
          paddingTop: '24px',
        }}
      >
        <Container>
          <Grid container>
            <Grid item md={6}>
              <Box>
                <Typography
                  sx={{
                    color: '#00b14f',
                    fontSize: '24px',
                    paddingBottom: '12px',
                    textAlign: 'left',
                  }}
                >
                  Khám phá 100.000+ công ty nổi bật
                </Typography>
                <Typography
                  sx={{
                    color: '#333',
                    fontSize: '16px',
                    marginBottom: 0,
                  }}
                >
                  Tra cứu thông tin công ty và tìm kiếm nơi làm việc tốt nhất dành cho bạn
                </Typography>
              </Box>

              <Grid container spacing={1} alignItems="center" sx={{ marginY: '24px' }}>
                <Grid item md={8}>
                  <Controller
                    name="searchText"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        size="small"
                        autoFocus
                        sx={{
                          width: '100%',
                          backgroundColor: '#fff',
                        }}
                        placeholder="Nhập tên công ty"
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={3}>
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
            </Grid>

            <Grid item md={6} sx={{ justifyContent: 'right', display: { xs: 'none', md: 'flex' } }}>
              <Box component="img" src="/images/company-billBoard.svg" />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ padding: '24px 0', textAlign: 'center' }}>
        <Typography
          sx={{
            color: '#333',
            fontSize: '24px',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          Danh sách các công ty
        </Typography>
      </Box>

      <Container>
        <Grid container spacing={2} sx={{ paddingBottom: '16px' }}>
          {companies?.data?.map((company) => (
            <CompanyBox key={company.id} company={company.attributes} companyId={company.id} />
          ))}
        </Grid>

        {companies?.data?.length !== 0 && totalPage > 1 && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 16px' }}>
            <Pagination
              shape="rounded"
              count={totalPage}
              page={companies?.meta?.pagination?.page}
              onChange={handlePaginationChange}
            />
          </Box>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default ListCompanies;

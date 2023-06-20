import { People, Public, Work } from '@mui/icons-material';
import { Box, Container, Grid, Link } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useQuery } from 'react-query';

import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';
import { InfoTitle, InfoWithImage, InfoWrapper } from '@/components/shared/Info';
import RecruitmentItem from '@/components/shared/RecruitmentItem/RecruitmentItem';
import { COMPANY_RECRUITMENTS, FETCH_ONE_COMPANY_QUERY } from '@/constants/index';
import { fetchCompanyById } from '@/services/company';
import { fetchRecruitments } from '@/services/recruitment';

type CompanyDetailProps = {
  companyId: number;
};

export const getServerSideProps: GetServerSideProps<CompanyDetailProps> = async ({ query }) => {
  const { companyId } = query as any;

  return {
    props: {
      companyId: companyId,
      // TODO: fix this translations
      ...(await serverSideTranslations('vi', ['common', 'modals', 'landing'])),
    },
  };
};

const CompanyDetail: NextPage<CompanyDetailProps> = ({ companyId }) => {
  const params = {
    populate: {
      company: {
        populate: {
          avatar: true,
          banner: true,
        },
      },
      profession: true,
      skills: true,
    },
    filters: {
      company: companyId,
    },
  };
  const { data } = useQuery([FETCH_ONE_COMPANY_QUERY], () => fetchCompanyById(companyId));
  const { data: recruitments } = useQuery([COMPANY_RECRUITMENTS, params], () => fetchRecruitments(params));

  return (
    <Box>
      <Header />

      <Box
        sx={{
          backgroundColor: '#f0f0f0',
          padding: '16px',
        }}
      >
        <Container>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              borderRadius: '3px',
              backgroundColor: '#fff',
              marginY: '16px',
            }}
          >
            <Link sx={{ marginRight: '24px' }}>
              <Box
                sx={{
                  width: '110px',
                  height: '110px',
                  alignItems: 'center',
                  display: 'flex',
                  border: '2px solid #eee',
                  overflow: 'hidden',
                  borderRadius: '75px',
                  justifyContent: 'center',
                }}
              >
                <Box
                  component="img"
                  src={data?.data?.attributes.avatar?.data?.attributes.url}
                  sx={{
                    width: '75%',
                    objectFit: 'contain',
                    maxHeight: '100%',
                  }}
                />
              </Box>
            </Link>

            <Grid container justifyContent="space-between">
              <Grid
                item
                md={12}
                sx={{
                  marginBottom: '8px',
                  fontWeight: 700,
                  color: '#333',
                  fontSize: '18px',
                }}
              >
                {data?.data?.attributes.name}
              </Grid>
              <Grid container item md={12}>
                <Grid item md={4} sx={{ marginBottom: '8px' }}>
                  <Public sx={{ marginRight: '4px' }} /> {data?.data?.attributes.website}
                </Grid>
                <Grid item md={4}>
                  <People sx={{ marginRight: '4px' }} /> {data?.data?.attributes.companySize} nhân viên
                </Grid>
                <Grid item md={4}>
                  <Work sx={{ marginRight: '4px' }} /> {data?.data?.attributes.companySize} công việc
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <InfoWrapper>
            <InfoTitle content={`Thông tin ${data?.data?.attributes.name}`} />

            <Box>
              <InfoWithImage
                src="/images/icons/8.svg"
                title="Giới thiệu"
                info={data?.data?.attributes.description as string}
              />
              <InfoWithImage
                src="/images/icons/10.svg"
                title="Địa điểm"
                info={data?.data?.attributes.address as string}
              />
            </Box>
          </InfoWrapper>

          <InfoWrapper>
            <InfoTitle content="Tuyển dụng" />

            <Box>
              {recruitments?.data?.map((recruitment: any) => (
                <RecruitmentItem
                  recruitment={recruitment.attributes}
                  recruitmentId={recruitment.id}
                  key={recruitment.id}
                />
              ))}
            </Box>
          </InfoWrapper>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default CompanyDetail;

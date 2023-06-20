import { AccessTime, Favorite, FavoriteBorder, Send } from '@mui/icons-material';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useQuery } from 'react-query';

import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';
import { InfoTitle, InfoWithImage, InfoWrapper } from '@/components/shared/Info';
import RecruitmentItem from '@/components/shared/RecruitmentItem/RecruitmentItem';
import { FETCH_ONE_RECRUITMENT_QUERY, RELATED_RECRUITMENT_QUERY } from '@/constants/index';
import axios from '@/services/axios';
import { applyRecruitment, fetchRecruitmentById, fetchRecruitments } from '@/services/recruitment';
import { interestedRecruitment } from '@/services/user';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setModalState } from '@/store/modal/modalSlice';

type RecruitmentDetailProps = {
  recruitmentId: number;
};

export const getServerSideProps: GetServerSideProps<RecruitmentDetailProps> = async ({ query }) => {
  const { recruitmentId } = query as any;

  return {
    props: {
      recruitmentId: recruitmentId,
      ...(await serverSideTranslations('vi', ['common', 'modals', 'landing'])),
    },
  };
};

const RecruitmentDetail: NextPage<RecruitmentDetailProps> = ({ recruitmentId }) => {
  const router = useRouter();
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
      candidates: {
        populate: {
          user: {
            fields: ['id'],
          },
        },
      },
    },
    filters: {
      id: {
        $ne: recruitmentId,
      },
    },
  };
  const dispatch = useAppDispatch();
  const { data } = useQuery([FETCH_ONE_RECRUITMENT_QUERY], () => fetchRecruitmentById(recruitmentId));
  const { data: relatedRecruitments } = useQuery([RELATED_RECRUITMENT_QUERY, params], () => fetchRecruitments(params));
  const user = useAppSelector((state) => state.auth.currentUser);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  const handleLogin = () => dispatch(setModalState({ modal: 'auth.login', state: { open: true } }));

  const [isApplied, setIsApplied] = useState(
    user
      ? (data?.data?.attributes as any)?.candidates
          .map((candidate: any) => candidate?.user?.data?.id)
          .includes(user?.id)
      : false
  );

  const isInterested = user?.interested?.map((r: any) => r.id).includes(parseInt(recruitmentId as any));

  const getResumeId = async () => {
    const data = await axios.get('/resume').then((res) => res.data);

    if (!data) return 0;

    return data.map((resume: any) => resume.id)[0];
  };

  const handleApplyRecruitment = async () => {
    if (!isLoggedIn) {
      handleLogin();
      return;
    }

    if (user.activated) {
      const resumeId = await getResumeId();
      await applyRecruitment(parseInt(recruitmentId as any), {
        resume: resumeId,
      });
      setIsApplied(true);
      toast.success('Ứng tuyển thành công');
    } else {
      toast.error('Tài khoản chưa xác thực');
    }
  };

  const handleInterestedRecruitment = async () => {
    if (!isLoggedIn) {
      handleLogin();
      return;
    }

    if (user.activated) {
      await interestedRecruitment({
        recruitmentId: parseInt(recruitmentId as any),
      });
      if (!isInterested) {
        toast.success('Lưu công việc thành công');
      } else {
        toast.success('Bỏ lưu công việc thành công');
      }
    } else {
      toast.error('Tài khoản chưa xác thực');
    }
  };

  return (
    <Box>
      <Head>
        <title>Tuyển {data?.data?.attributes.title}</title>
      </Head>

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
            <Grid container alignItems="center" spacing={2}>
              <Grid
                item
                md={2}
                xs={12}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
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
                    src={data?.data?.attributes?.company.data.attributes.avatar?.data?.attributes.url}
                    sx={{
                      width: '75%',
                      objectFit: 'contain',
                      maxHeight: '100%',
                    }}
                  />
                </Box>
              </Grid>

              <Grid item md={7} xs={12}>
                <Box>
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: '22px',
                      lineHeight: '29px',
                      marginBottom: '16px',
                      color: '#00b14f',
                      fontWeight: 700,
                      textAlign: 'justify',
                    }}
                  >
                    {data?.data?.attributes.title}
                  </Typography>
                  <Box
                    sx={{
                      marginBottom: '8px',
                      fontWeight: 700,
                      color: '#333',
                      fontSize: '18px',
                      cursor: 'pointer',
                    }}
                    onClick={() => router.push(`/company/${data?.data?.attributes.company.data.id}`)}
                  >
                    {data?.data?.attributes?.company?.data?.attributes.name}
                  </Box>
                  <Box>
                    <AccessTime /> Hạn nộp hồ sơ: {data?.data?.attributes?.jobDeadline}
                  </Box>
                </Box>
              </Grid>

              <Grid item md={3} xs={12}>
                <Button
                  variant="contained"
                  startIcon={<Send />}
                  sx={{
                    marginBottom: '16px',
                    textTransform: 'uppercase',
                    width: '100%',
                    paddingX: '30px',
                    paddingY: '9px',
                    backgroundColor: '#00b14f',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#3ba769',
                    },
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                  onClick={handleApplyRecruitment}
                  disabled={isApplied}
                >
                  Ứng tuyển ngay
                </Button>

                <Button
                  variant="outlined"
                  startIcon={isInterested ? <Favorite /> : <FavoriteBorder />}
                  sx={{
                    textTransform: 'uppercase',
                    width: '100%',
                    paddingX: '30px',
                    paddingY: '9px',
                    fontWeight: 700,
                    fontSize: '14px',
                    color: '#3ba769',
                    borderColor: '#3ba769',
                    '&:hover': {
                      borderColor: '#3ba769',
                    },
                  }}
                  onClick={handleInterestedRecruitment}
                >
                  Lưu tin
                </Button>
              </Grid>
            </Grid>
          </Box>

          <InfoWrapper>
            <InfoTitle content="Chi tiết ứng dụng" />

            <Box
              sx={{
                backgroundColor: 'rgba(0,177,79,.051)',
                borderRadius: '3px',
                marginBottom: '8px',
                padding: '16px 16px 0',
              }}
            >
              <Box
                component="p"
                sx={{
                  textDecoration: 'underline',
                  color: '#333',
                  fontWeight: 700,
                  marginBottom: '16px',
                }}
              >
                Thông tin chung
              </Box>

              <Grid container>
                <Grid item md={6} xs={12}>
                  <InfoWithImage
                    src="/images/icons/1.svg"
                    title="Mức lương"
                    info={data?.data?.attributes.salary as string}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <InfoWithImage
                    src="/images/icons/2.svg"
                    title="Số lượng tuyển"
                    info={`${data?.data?.attributes.numberOfRecruitment} người`}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <InfoWithImage
                    src="/images/icons/3.svg"
                    title="Hình thức làm việc"
                    info={data?.data?.attributes.jobType as string}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <InfoWithImage
                    src="/images/icons/5.svg"
                    title="Cấp bậc"
                    info={data?.data?.attributes.employeeLevel as string}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <InfoWithImage
                    src="/images/icons/6.svg"
                    title="Giới tính"
                    info={data?.data?.attributes.gender as string}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <InfoWithImage
                    src="/images/icons/7.svg"
                    title="Kinh nghiệm"
                    info={data?.data?.attributes.experience as string}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box
              sx={{
                backgroundColor: 'rgba(0,177,79,.051)',
                borderRadius: '3px',
                marginBottom: '8px',
                padding: '16px',
              }}
            >
              <Box
                component="p"
                sx={{
                  textDecoration: 'underline',
                  color: '#333',
                  fontWeight: 700,
                  marginBottom: '16px',
                }}
              >
                Địa điểm làm việc
              </Box>

              <Box>
                <div dangerouslySetInnerHTML={{ __html: data?.data?.attributes.workLocation as string }} />
              </Box>
            </Box>

            <Box sx={{ marginY: '16px' }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: '18px',
                  fontWeight: 700,
                }}
              >
                Mô tả công việc
              </Typography>

              <Box>
                <div dangerouslySetInnerHTML={{ __html: data?.data?.attributes.description as string }} />
              </Box>
              <br />
              <Typography
                variant="h3"
                sx={{
                  fontSize: '18px',
                  fontWeight: 700,
                }}
              >
                Yêu cầu ứng viên
              </Typography>

              <Box>
                <div dangerouslySetInnerHTML={{ __html: data?.data?.attributes.requirements as string }} />
              </Box>
              <br />
              <Typography
                variant="h3"
                sx={{
                  fontSize: '18px',
                  fontWeight: 700,
                }}
              >
                Quyền lợi
              </Typography>

              <Box sx={{ marginBottom: '16px' }}>
                <div dangerouslySetInnerHTML={{ __html: data?.data?.attributes.benefits as string }} />
              </Box>
            </Box>
          </InfoWrapper>

          <InfoWrapper>
            <InfoTitle content={`Thông tin ${data?.data?.attributes?.company?.data?.attributes.name}`} />

            <Box>
              <InfoWithImage
                src="/images/icons/8.svg"
                title="Giới thiệu"
                info={data?.data?.attributes?.company?.data?.attributes.description}
              />
              <InfoWithImage
                src="/images/icons/9.svg"
                title="Quy mô"
                info={`${data?.data?.attributes?.company?.data?.attributes.companySize} nhân viên`}
              />
              <InfoWithImage
                src="/images/icons/10.svg"
                title="Địa điểm"
                info={data?.data?.attributes?.company?.data?.attributes.address}
              />
            </Box>
          </InfoWrapper>

          {(relatedRecruitments?.data?.length as any) > 0 && (
            <InfoWrapper>
              <InfoTitle content="Việc làm liên quan" />

              <Box>
                {relatedRecruitments?.data?.map((recruitment: any) => (
                  <RecruitmentItem
                    recruitment={recruitment.attributes}
                    recruitmentId={recruitment.id}
                    key={recruitment.id}
                  />
                ))}
              </Box>
            </InfoWrapper>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default RecruitmentDetail;

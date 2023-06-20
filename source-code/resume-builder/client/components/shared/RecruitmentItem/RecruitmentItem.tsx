import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import axios from '@/services/axios';
import { applyRecruitment, Recruitment } from '@/services/recruitment';
import { interestedRecruitment } from '@/services/user';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setModalState } from '@/store/modal/modalSlice';
import { getJobDayLeft } from '@/utils/getJobDayLeft';

interface RecruitmentItemProps {
  recruitment: Recruitment;
  recruitmentId: number;
}

const LabelContent = ({ content, onClick, sx }: any) => (
  <Box
    sx={{
      borderRadius: '3px',
      fontSize: '12px',
      padding: '4px 8px',
      marginRight: 1,
      ...sx,
    }}
    onClick={onClick}
  >
    {content}
  </Box>
);

const RecruitmentItem = ({ recruitment, recruitmentId }: RecruitmentItemProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.currentUser);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  const handleLogin = () => dispatch(setModalState({ modal: 'auth.login', state: { open: true } }));

  const [isApplied, setIsApplied] = useState(
    user
      ? (recruitment as any)?.candidates?.map((candidate: any) => candidate?.user?.data?.id).includes(user?.id)
      : false
  );

  const isInterested = user?.interested?.map((r: any) => r.id).includes(recruitmentId);

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
      await applyRecruitment(recruitmentId, {
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
        recruitmentId,
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
    <Box
      sx={{
        border: '1px solid #f4f4f4',
        borderRadius: '5px',
        margin: 'auto auto 16px',
        padding: '16px',
        '&:hover': {
          backgroundColor: '#f6f6f6',
        },
      }}
    >
      <Grid container spacing={2}>
        <Grid item md={2} xs={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#fff',
              border: '1px solid #e9eaec',
              borderRadius: '8px',
              width: '100px',
              height: '100px',
              padding: '8px',
              margin: '0 auto',
            }}
            onClick={() => router.push(`/company/${recruitment.company.data.id}`)}
          >
            <Box component="img" src={recruitment?.company?.data?.attributes?.avatar?.data?.attributes.url} alt="" />
          </Box>
        </Grid>

        <Grid container item md={10} xs={12}>
          <Grid
            container
            item
            md={12}
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Grid item md={10} xs={12}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#212f3f',
                  marginBottom: '6px',
                  marginRight: '24px',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
                onClick={() => router.push(`/recruitment/${recruitmentId}`)}
              >
                {recruitment.title}
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontSize: '14px',
                  fontWeight: 300,
                  color: '#212f3f',
                  marginBottom: '4px',
                  marginRight: '24px',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
                onClick={() => router.push(`/recruitment/${recruitmentId}`)}
              >
                {recruitment?.company?.data?.attributes?.name}
              </Typography>
            </Grid>

            <Grid item md={2} xs={12} sx={{ textAlign: 'right' }}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#00b14f',
                  marginBottom: '4px',
                }}
              >
                {recruitment.salary}
              </Typography>
            </Grid>
          </Grid>

          <Grid
            container
            item
            md={12}
            spacing={1}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'end',
            }}
          >
            <Grid
              item
              md={6}
              xs={12}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'start',
              }}
            >
              <LabelContent
                content={recruitment.province}
                sx={{
                  background: '#e9eaec',
                  marginRight: 1,
                  color: '#212f3f',
                }}
              />
              <LabelContent
                content={`Còn ${getJobDayLeft(recruitment.jobDeadline)} ngày ứng tuyển`}
                sx={{
                  background: '#e9eaec',
                  marginRight: 1,
                  color: '#212f3f',
                }}
              />
            </Grid>

            <Grid
              item
              md={6}
              xs={12}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end',
              }}
            >
              {!isApplied ? (
                <LabelContent
                  onClick={handleApplyRecruitment}
                  content="Ứng tuyển ngay"
                  sx={{
                    background: '#00b14f',
                    fontWeight: 600,
                    marginRight: 1,
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                />
              ) : (
                ''
              )}

              {isInterested ? (
                <LabelContent
                  onClick={handleInterestedRecruitment}
                  content={<Favorite fontSize="small" />}
                  sx={{
                    background: '#00b14f',
                    marginRight: 1,
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                />
              ) : (
                <LabelContent
                  onClick={handleInterestedRecruitment}
                  content={<FavoriteBorder fontSize="small" />}
                  sx={{
                    background: '#00b14f',
                    marginRight: 1,
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecruitmentItem;

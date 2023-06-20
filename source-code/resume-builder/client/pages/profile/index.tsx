import { Add } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ReactNode } from 'react';

import InterestedItem from '@/components/profile/InterestedItem';
import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';
import { InfoTitle, InfoWrapper, UserInfoBlock } from '@/components/shared/Info';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setModalState } from '@/store/modal/modalSlice';

export const getStaticProps: GetStaticProps = async ({ locale = 'vi' }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'modals', 'landing'])),
  },
});

const ProfileCard = ({
  title,
  subheader,
  onAddBtnClick,
  content,
}: {
  title: string;
  subheader: string;
  onAddBtnClick?: () => void;
  content?: string | ReactNode;
}) => (
  <Grid item md={12}>
    <Card>
      <CardHeader
        title={<Typography sx={{ color: '#333', fontWeight: 600, fontSize: '18px' }}>{title}</Typography>}
        subheader={<Typography sx={{ color: '#333', fontSize: '14px' }}>{subheader}</Typography>}
        action={
          <IconButton onClick={onAddBtnClick}>
            <Add />
          </IconButton>
        }
      />
      <CardContent>{content}</CardContent>
    </Card>
  </Grid>
);

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const user = useAppSelector((state) => state.auth.currentUser);

  const userGender = () => {
    switch (user.gender) {
      case 'Male':
        return 'Nam';
      case 'Female':
        return 'Nữ';
      case 'Other':
        return 'Khác';
      default:
        return '';
    }
  };

  if (!isLoggedIn) {
    router.push('/');
  }

  const handleConfirmUser = () =>
    dispatch(setModalState({ modal: 'auth.profile.confirm-user', state: { open: true } }));
  const handleUpdateProfile = () => dispatch(setModalState({ modal: 'auth.profile.update', state: { open: true } }));
  const handleUpdateAvatar = () => dispatch(setModalState({ modal: 'auth.profile.avatar', state: { open: true } }));

  return (
    <Box>
      <Header />

      <Box
        sx={{
          backgroundColor: '#f0f0f0',
          padding: '16px',
          minHeight: 'calc(100vh - 155px)',
        }}
      >
        <Container>
          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
              <Card>
                <CardContent
                  sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Avatar sx={{ marginBottom: '24px', width: '120px', height: '120px' }} src={user?.avatar?.url} />
                  <Button
                    size="large"
                    sx={{
                      marginBottom: '24px',
                      backgroundColor: '#00b14f',
                      '&:hover': {
                        backgroundColor: '#009643',
                      },
                    }}
                    onClick={handleUpdateAvatar}
                  >
                    Cập nhật ảnh đại diện
                  </Button>
                  <Typography sx={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                    {user?.fullName}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item md={8} xs={12}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <UserInfoBlock label="Họ và tên" text={user?.fullName ?? ''} />
                    <UserInfoBlock label="Giới tính" text={userGender()} />
                    <UserInfoBlock label="Email liên lạc" text={user?.email ?? ''} />
                    <UserInfoBlock label="Số điện thoại liên lạc" text={user?.phoneNumber ?? ''} />
                    <UserInfoBlock label="Địa chỉ hiện tại" text={user?.address ?? ''} />
                    <UserInfoBlock
                      label="Tình trạng xác thực"
                      text={user?.activated ? 'Đã xác thực' : 'Chưa xác thực'}
                      sx={user?.activated ? { color: 'green', fontWeight: '700' } : { color: 'red', fontWeight: '700' }}
                    />
                  </Grid>
                </CardContent>
                <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {!user?.activated && (
                    <Button
                      size="large"
                      sx={{
                        backgroundColor: '#00b14f',
                        '&:hover': {
                          backgroundColor: '#009643',
                        },
                      }}
                      onClick={handleConfirmUser}
                    >
                      Xác thực tài khoản
                    </Button>
                  )}
                  <Button
                    size="large"
                    sx={{
                      backgroundColor: '#00b14f',
                      '&:hover': {
                        backgroundColor: '#009643',
                      },
                    }}
                    onClick={handleUpdateProfile}
                  >
                    Cập nhật thông tin
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>

          <InfoWrapper>
            <InfoTitle content="Việc làm đã lưu" />

            <Box>
              {user?.interested?.map((recruitment: any) => (
                <InterestedItem recruitment={recruitment} recruitmentId={recruitment.id} key={recruitment.id} />
              ))}
            </Box>
          </InfoWrapper>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default UserProfile;

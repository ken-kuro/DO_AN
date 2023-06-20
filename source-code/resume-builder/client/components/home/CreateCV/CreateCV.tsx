import { Box, Container, Grid, Link, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setModalState } from '@/store/modal/modalSlice';

interface ICreateCVProps {}

const CreateCV = ({}: ICreateCVProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogin = () => dispatch(setModalState({ modal: 'auth.login', state: { open: true } }));
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  const onCVDashboardClick = () => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        paddingTop: '22px',
        paddingBottom: '30px',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <Box
              sx={{
                background: 'transparent linear-gradient(67deg,#e5fff1,#f5f2ff) 0 0 no-repeat padding-box',
                borderRadius: '10px',
                paddingLeft: '24px',
                minHeight: '262px',
                position: 'relative',
              }}
            >
              <Grid container>
                <Grid item md={8} xs={12}>
                  <Typography
                    variant="h2"
                    sx={{
                      color: '#00b14f',
                      fontSize: '20px',
                      fontWeight: 500,
                      padding: '22px 0 14px',
                    }}
                  >
                    Tạo CV Online ấn tượng
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      color: '#212f3f',
                      fontSize: '14px',
                      lineHeight: '20px',
                      margin: 0,
                      paddingBottom: '40px',
                      fontWeight: 300,
                    }}
                  >
                    MidCV hiện có 50+ mẫu CV chuyên nghiệp, độc đáo phù hợp với mọi ngành nghề
                  </Typography>
                  <Link
                    sx={{
                      backgroundColor: '#00b14f',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 500,
                      padding: '10px 20px',
                      textAlign: 'center',
                      border: '1px solid transparent',
                      borderRadius: '4px',
                      userSelect: 'none',
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={onCVDashboardClick}
                  >
                    Tạo CV ngay
                  </Link>
                </Grid>
              </Grid>
              <Box
                component="img"
                src="/images/mau_cv.png"
                className="absolute right-0 top-9 h-[234px] w-[275px]"
                display={{ xs: 'none' }}
              />
            </Box>
          </Grid>
          <Grid item md={6} xs={12}>
            <Box
              sx={{
                background: 'transparent linear-gradient(67deg,#e5fff1,#f5f2ff) 0 0 no-repeat padding-box',
                borderRadius: '10px',
                paddingLeft: '24px',
                minHeight: '262px',
                position: 'relative',
              }}
            >
              <Grid container>
                <Grid item md={8} xs={12}>
                  <Typography
                    variant="h2"
                    sx={{
                      color: '#00b14f',
                      fontSize: '20px',
                      fontWeight: 500,
                      padding: '22px 0 14px',
                    }}
                  >
                    Sử dụng CV sẵn có để tìm việc
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      color: '#212f3f',
                      fontSize: '14px',
                      lineHeight: '20px',
                      margin: 0,
                      paddingBottom: '40px',
                      fontWeight: 300,
                    }}
                  >
                    Cách đơn giản để bắt đầu tìm việc làm tại MidCV, Nhà tuyển dụng sẽ nhìn thấy CV bạn đã tải lên
                  </Typography>
                  <Link
                    sx={{
                      backgroundColor: '#00b14f',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 500,
                      padding: '10px 20px',
                      textAlign: 'center',
                      border: '1px solid transparent',
                      borderRadius: '4px',
                      userSelect: 'none',
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={onCVDashboardClick}
                  >
                    Upload CV ngay
                  </Link>
                </Grid>
              </Grid>
              <Box
                component="img"
                src="/images/upload-cv.png"
                className="absolute right-0 top-9 h-[234px] w-[275px]"
                display={{ xs: 'none' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CreateCV;

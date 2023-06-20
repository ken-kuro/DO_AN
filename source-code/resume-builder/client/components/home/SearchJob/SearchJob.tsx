import { Box, Container, Grid, Typography } from '@mui/material';

interface ISearchJobProps {}

const SearchJob = ({}: ISearchJobProps) => {
  return (
    <Box
      sx={{
        backgroundImage: 'url("images/linear_web.png")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
      }}
    >
      <Container maxWidth="lg">
        <Grid container>
          <Grid item md={7} xs={12}>
            <Box
              sx={{
                marginBottom: '32px',
                marginTop: '48px',
              }}
            >
              <Typography
                sx={{
                  color: '#009643',
                  fontSize: '28px',
                  fontWeight: 600,
                  lineHeight: '32px',
                  margin: '0 auto 6px',
                }}
              >
                Tìm việc làm nhanh và mới nhất trên toàn quốc.
              </Typography>
              <Typography
                sx={{
                  color: '#4d5965',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px',
                }}
              >
                Tiếp cận hàng nghìn tin tuyển dụng mỗi ngày từ hàng nghìn doanh nghiệp uy tín tại Việt Nam
              </Typography>
            </Box>
          </Grid>
          <Grid item md={5} display={{ xs: 'none', md: 'block' }}>
            <Box component="img" src="/images/image_topcv_2.png" className="h-[350px] w-[440px] object-contain" />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SearchJob;

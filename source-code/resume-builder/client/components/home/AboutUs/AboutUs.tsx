import { Box, Container, Grid, Typography } from '@mui/material';

interface IAboutUsProps {}

const AboutUs = ({}: IAboutUsProps) => {
  const staticData = [
    {
      label: '540.000+',
      subLabel: 'Nhà tuyển dụng uy tín',
    },
    {
      label: '200.000+',
      subLabel: 'Doanh nghiệp hàng đầu',
    },
    {
      label: '2.000.000+',
      subLabel: 'Việc làm đã được kết nối',
    },
    {
      label: '1.200.000+',
      subLabel: 'Lượt tải ứng dụng',
    },
  ];
  return (
    <Box
      sx={{
        background: 'transparent linear-gradient(288deg,#deffe2,#efffef) 0 0 no-repeat padding-box',
        paddingY: '40px',
      }}
    >
      <Container>
        <Typography
          variant="h2"
          sx={{
            color: '#00b14f',
            fontSize: '20px',
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          Con số ấn tượng
        </Typography>

        <Typography
          variant="h3"
          sx={{
            color: '#212f3f',
            fontSize: '14px',
            textAlign: 'center',
            lineHeight: '22px',
            marginBottom: '23px',
            marginTop: '18px',
          }}
        >
          MidCV là công ty công nghệ nhân sự (HR Tech) hàng đầu Việt Nam. Với năng lực lõi là công nghệ, đặc biệt là trí
          tuệ nhân tạo (AI), sứ mệnh của MidCV đặt ra cho mình là thay đổi thị trường tuyển dụng - nhân sự ngày một hiệu
          quả hơn. Bằng công nghệ, chúng tôi tạo ra nền tảng cho phép người lao động tạo CV, phát triển được các kỹ năng
          cá nhân, xây dựng hình ảnh chuyên nghiệp trong mắt nhà tuyển dụng và tiếp cận với các cơ hội việc làm phù hợp.
        </Typography>

        <Box
          sx={{
            background: 'hsla(0,0%,100%,.769) 0 0 no-repeat padding-box',
            borderRadius: '20px',
            padding: '25px 30px',
          }}
        >
          <Grid container spacing={1}>
            {staticData.map((item, index) => (
              <Grid item md={3} xs={12} key={index}>
                <Box
                  component="p"
                  sx={{
                    color: '#3d6089',
                    fontSize: '24px',
                    fontWeight: 600,
                    marginTop: 0,
                    marginBottom: 1,
                  }}
                >
                  {item.label}
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#555',
                    fontSize: '14px',
                    lineHeight: '22px',
                    fontWeight: 300,
                  }}
                >
                  {item.subLabel}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUs;

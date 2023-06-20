import { Box, Container, Grid, Typography } from '@mui/material';

interface IFooterProps {}

const Footer = ({}: IFooterProps) => {
  return (
    <Box
      sx={{
        borderTop: '1px solid #e9e4e4',
        color: '#000',
        paddingTop: '20px',
      }}
    >
      <Container>
        <Grid container>
          <Grid item md={7} xs={12}>
            <Typography
              variant="h4"
              sx={{
                color: '#212f3',
                fontSize: '24px',
                fontWeight: 600,
                marginBottom: '24px',
                marginTop: 0,
              }}
            >
              Công ty cổ phần MidCV Việt Nam
            </Typography>
          </Grid>
          <Grid item md={5} xs={12}>
            <Box
              component="p"
              sx={{
                color: '#4d5965',
                fontSize: '14px',
                fontWeight: 200,
                marginBottom: 0,
              }}
            >
              © 2022 - 2023 MidCV Vietnam JSC. All rights reserved.
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;

import { Box, Link, Typography } from '@mui/material';
import { useRouter } from 'next/router';

interface IHeaderProps {}

const Header = ({}: IHeaderProps) => {
  const router = useRouter();

  return (
    <Box
      sx={{
        padding: '12px 17px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontSize: '24px',
          fontWeight: 700,
        }}
      >
        Tin tuyển dụng, việc làm tốt nhất
      </Typography>

      <Link
        sx={{
          color: '#00b14f',
          fontSize: '14px',
          fontWeight: 400,
          textDecoration: 'none',
        }}
        onClick={() => router.push('/recruitment')}
      >
        Xem tất cả
      </Link>
    </Box>
  );
};

export default Header;

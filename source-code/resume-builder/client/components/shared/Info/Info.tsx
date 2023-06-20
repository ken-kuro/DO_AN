import { Box, Grid, Typography } from '@mui/material';
import { ReactNode } from 'react';

export const InfoWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        padding: '16px',
        borderRadius: '3px',
        backgroundColor: '#fff',
        marginY: '16px',
      }}
    >
      {children}
    </Box>
  );
};

export const InfoTitle = ({ content }: { content: string }) => {
  return (
    <Typography
      variant="h2"
      sx={{
        borderLeft: '7px solid #00b14f',
        color: '#333',
        fontSize: '22px',
        fontWeight: 700,
        margin: '0 0 16px',
        paddingLeft: '12px',
      }}
    >
      {content}
    </Typography>
  );
};

export const InfoWithImage = ({ src, title, info }: { src: string; title: string; info: string }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        marginBottom: '16px',
      }}
    >
      <Box
        component="img"
        src={src}
        sx={{
          height: '32px',
          marginRight: '16px',
          width: '32px',
        }}
      />

      <Box>
        <Box
          sx={{
            fontWeight: 700,
            fontSize: '14px',
          }}
        >
          {title}
        </Box>
        <Box
          sx={{
            fontSize: '14px',
          }}
        >
          {info}
        </Box>
      </Box>
    </Box>
  );
};

export const UserInfoBlock = ({ label, text, sx }: { label: string; text: string | ReactNode; sx?: any }) => (
  <>
    <Grid
      item
      md={6}
      sx={{
        fontWeight: 700,
        fontSize: '16px',
      }}
    >
      {label}
    </Grid>
    <Grid item md={6} sx={sx}>
      {text}
    </Grid>
  </>
);

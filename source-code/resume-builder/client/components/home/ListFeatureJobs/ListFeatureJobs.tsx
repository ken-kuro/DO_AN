import { Box, Container, Grid } from '@mui/material';
import { useQuery } from 'react-query';

import { RECRUITMENTS_QUERY } from '@/constants/index';
import { fetchRecruitments } from '@/services/recruitment';

import FeatureJobItem from './FeatureJobItem';
import Header from './Header';

interface IListFeatureJobsProps {}

const ListFeatureJobs = ({}: IListFeatureJobsProps) => {
  const params = {
    populate: {
      company: {
        populate: {
          avatar: true,
        },
      },
    },
    filters: {
      company: {
        id: {
          $notNull: true,
        },
      },
    },
  };
  const { data: recruitments } = useQuery([RECRUITMENTS_QUERY, params], () => fetchRecruitments(params));

  return (
    <Box
      sx={{
        background: 'transparent linear-gradient(179deg,#edfff5,#fff) 0 0 no-repeat padding-box',
        paddingTop: '40px',
      }}
    >
      <Container>
        <Box
          sx={{
            margin: '20px 0 50px',
            borderRadius: '3px',
            backgroundColor: '#fff',
          }}
        >
          <Header />

          <Box
            sx={{
              padding: '8px 20px',
            }}
          >
            <Grid container spacing={2}>
              {recruitments?.data?.map((recruitment) => (
                <Grid item md={4} xs={12} key={recruitment.id}>
                  <FeatureJobItem recruitment={recruitment?.attributes} recruitmentId={recruitment.id} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ListFeatureJobs;

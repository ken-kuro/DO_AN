import { BusinessCenter } from '@mui/icons-material';
import { Box, Container, Link, Typography } from '@mui/material';
import Slider from 'react-slick';

interface ITopProfessionsProps {
  topProfessions: any[];
}

const TopProfessionsItem = ({ data }: any) => {
  return (
    <Box
      sx={{
        marginX: '10px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          padding: '25px 30px',
          borderRadius: '5px',
          backgroundColor: '#e9f7ef',
          alignItems: 'center',
          maxHeight: '115px',
        }}
      >
        <Link>
          <Box
            sx={{
              width: '50px',
              height: '50px',
              border: '1px solid #e9eaec',
              background: '#00b14f',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
            }}
          >
            <BusinessCenter sx={{ color: '#fff' }} />
          </Box>
        </Link>

        <Box
          sx={{
            paddingLeft: '12px',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <Box
            sx={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: '20px',
                fontWeight: 500,
                color: '#212f3f',
                marginBottom: '8px',
                marginTop: 0,
                lineHeight: '26px',
                textTransform: 'capitalize',
              }}
            >
              {data.name}
            </Typography>
          </Box>
          <Box
            sx={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: '14px',
                color: '#555',
                textTransform: 'lowercase',
              }}
            >
              {data.count} việc làm
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const TopProfessions = ({ topProfessions }: ITopProfessionsProps) => {
  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        paddingBottom: '30px',
      }}
    >
      <Container>
        <Typography
          variant="h2"
          sx={{
            color: '#00b14f',
            fontSize: '20px',
            fontWeight: 500,
            marginBottom: '20px',
          }}
        >
          Top ngành nghề nổi bật
        </Typography>

        <Slider
          dots={false}
          infinite={true}
          speed={1000}
          slidesToScroll={3}
          slidesToShow={3}
          arrows={false}
          responsive={[
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 1,
              },
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ]}
        >
          {topProfessions?.map((data, index) => (
            <TopProfessionsItem key={index} data={data} />
          ))}
        </Slider>
      </Container>
    </Box>
  );
};

export default TopProfessions;

import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Box, Link } from '@mui/material';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

import { Recruitment } from '@/services/recruitment';
import { interestedRecruitment } from '@/services/user';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setModalState } from '@/store/modal/modalSlice';

interface IFeatureJobItemProps {
  recruitment: Recruitment;
  recruitmentId: number;
}

const FeatureJobItem = ({ recruitment, recruitmentId }: IFeatureJobItemProps) => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.currentUser);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const handleLogin = () => dispatch(setModalState({ modal: 'auth.login', state: { open: true } }));

  const isInterested = user?.interested?.map((r: any) => r.id).includes(recruitmentId);

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
        backgroundColor: '#fff',
        border: '1px solid #e9eaec',
        borderRadius: '5px',
        margin: '6px 0',
        padding: '14px 18px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <Link onClick={() => router.push(`/company/${recruitment.company.data.id}`)}>
          <Box
            sx={{
              border: '1px solid #e9eaec',
              borderRadius: '7px',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box component="img" src={recruitment.company.data.attributes.avatar?.data?.attributes.url} alt="" />
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
            <Link
              onClick={() => router.push(`/recruitment/${recruitmentId}`)}
              sx={{
                fontSize: '14px',
                textDecoration: 'none',
                fontWeight: 500,
                color: '#4a4a4a',
                marginBottom: '3px',
                textTransform: 'capitalize',
              }}
            >
              {recruitment.title}
            </Link>
          </Box>

          <Box
            sx={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            <Link
              onClick={() => router.push(`/company/${recruitment.company.data.id}`)}
              sx={{
                fontSize: '13px',
                textDecoration: 'none',
                fontWeight: 300,
                color: '#999',
                textTransform: 'uppercase',
              }}
            >
              {recruitment?.company?.data?.attributes?.name}
            </Link>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 1,
          marginBottom: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              background: '#e9eaec',
              borderRadius: '3px',
              color: '#212f3f',
              fontSize: '12px',
              padding: '4px 8px',
              fontWeight: 300,
              marginRight: 1,
            }}
          >
            {recruitment.salary}
          </Box>
          <Box
            sx={{
              background: '#e9eaec',
              borderRadius: '3px',
              color: '#212f3f',
              fontSize: '12px',
              padding: '4px 8px',
              fontWeight: 300,
            }}
          >
            {recruitment.province}
          </Box>
        </Box>
        {isInterested ? (
          <Favorite
            fontSize="small"
            onClick={handleInterestedRecruitment}
            sx={{ cursor: 'pointer', color: '#00b14f' }}
          />
        ) : (
          <FavoriteBorder fontSize="small" onClick={handleInterestedRecruitment} sx={{ cursor: 'pointer' }} />
        )}
      </Box>
    </Box>
  );
};

export default FeatureJobItem;

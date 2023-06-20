import { setCurrentUser, setUser } from '@/store/auth/authSlice';

import store from '../store';
import axios from './axios';

export const updateUserProfile = async (body: any) => {
  const response = await axios.put('/cms/user/me', body);

  if (response.status !== 200) {
    return;
  }

  await getUserProfile();

  store.dispatch(setUser(response.data));
};

export const getUserProfile = async () => {
  const user = await axios
    .get('/cms/users/me', {
      params: {
        populate: {
          avatar: true,
          interested: {
            populate: {
              company: {
                populate: {
                  avatar: true,
                },
              },
              candidates: {
                populate: {
                  user: {
                    fields: ['id'],
                  },
                },
              },
            },
          },
        },
      },
    })
    .then((res) => res.data);

  store.dispatch(setCurrentUser(user));
};

export const interestedRecruitment = async (body: { recruitmentId: number }) => {
  await axios.post('/cms/user/interested', body).then((res) => res.data);

  await getUserProfile();
};

import { User } from '@reactive-resume/schema';
import { AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

import { logout, setAccessToken, setCurrentUser, setUser } from '@/store/auth/authSlice';

import store from '../store';
import axios from './axios';

export type LoginParams = {
  identifier: string;
  password: string;
};

export type LoginWithGoogleParams = {
  credential: string;
};

export type RegisterParams = {
  email: string;
  username: string;
  password: string;
};

export type AuthDTO = {
  user: User;
  jwt: string;
};

export type ForgotPasswordParams = {
  email: string;
};

export type ResetPasswordParams = {
  resetToken: string;
  password: string;
};

export type UpdateProfileParams = {
  name: string;
};

export const login = async (loginParams: LoginParams) => {
  const {
    data: { user, jwt: accessToken },
  } = await axios.post<AuthDTO, AxiosResponse<AuthDTO>, LoginParams>('/cms/auth/local', loginParams);

  store.dispatch(setUser(user));
  store.dispatch(setAccessToken(accessToken));

  const { data } = await axios.get(
    '/cms/users/me?populate[avatar]=true&populate[interested][populate][company][populate][avatar]=true',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  store.dispatch(setCurrentUser(data));
};

export const register = async (registerParams: RegisterParams) => {
  const {
    data: { user, jwt: accessToken },
  } = await axios.post<AuthDTO, AxiosResponse<AuthDTO>, RegisterParams>('/cms/auth/local/register', registerParams);

  store.dispatch(setUser(user));
  store.dispatch(setAccessToken(accessToken));

  const { data } = await axios.get(
    '/cms/users/me?populate[avatar]=true&populate[interested][populate][company][populate][avatar]=true',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  store.dispatch(setCurrentUser(data));
};

export const forgotPassword = async (forgotPasswordParams: ForgotPasswordParams) => {
  await axios.post<void, AxiosResponse<void>, ForgotPasswordParams>('/cms/auth/forgot-password', forgotPasswordParams);

  toast.success('Please check your email for the password reset link.');
};

export const resetPassword = async (resetPasswordParams: ResetPasswordParams) => {
  await axios.post<void, AxiosResponse<void>, ResetPasswordParams>('/cms/auth/reset-password', resetPasswordParams);

  toast.success('Your password has been changed successfully, please login again.');
};

export const updateProfile = async (updateProfileParams: UpdateProfileParams) => {
  const { data: user } = await axios.patch<User, AxiosResponse<User>, UpdateProfileParams>(
    '/cms/auth/update-profile',
    updateProfileParams
  );

  store.dispatch(setUser(user));

  toast.success('Your profile has been successfully updated.');
};

export const deleteAccount = async () => {
  await axios.delete('/resume/all');
  await axios.delete('/auth');

  store.dispatch(logout());

  toast.success('Your account has been deleted, hope to see you again soon.');
};

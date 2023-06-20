import { Resume } from './resume';

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber?: string;
  fullName?: string;
  confirmed: boolean;
  avatar?: any;
  banner?: any;
  address?: string;
  dob?: string;
  placeOfResidence?: string;
  placeOfOrigin?: string;
  gender?: string;
};

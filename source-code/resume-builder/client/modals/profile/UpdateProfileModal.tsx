import { joiResolver } from '@hookform/resolvers/joi';
import { BadgeOutlined } from '@mui/icons-material';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import Joi from 'joi';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useIsMutating } from 'react-query';

import BaseModal from '@/components/shared/BaseModal';
import { updateUserProfile } from '@/services/user';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setModalState } from '@/store/modal/modalSlice';

type FormData = {
  gender?: string;
  address?: string;
  email?: string;
  phoneNumber?: string;
};

const schema = Joi.object({
  address: Joi.string(),
  email: Joi.string().email({ tlds: { allow: false } }),
  gender: Joi.string(),
  phoneNumber: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/),
});

const UpdateProfileModal = () => {
  const isMutating = useIsMutating();
  const isLoading = useMemo(() => isMutating > 0, [isMutating]);

  const dispatch = useAppDispatch();
  const { open: isOpen } = useAppSelector((state) => state.modal['auth.profile.update']);
  const user = useAppSelector((state) => state.auth.currentUser);

  const defaultState: FormData = {
    address: user?.address || '',
    email: user?.email || '',
    gender: user?.gender || '',
    phoneNumber: user?.phoneNumber || '',
  };

  const { reset, handleSubmit, control } = useForm({
    defaultValues: defaultState,
    resolver: joiResolver(schema),
  });

  const handleClose = () => {
    dispatch(setModalState({ modal: 'auth.profile.update', state: { open: false } }));
    reset();
  };

  const onSubmit = async (data: FormData) => {
    await updateUserProfile(data);

    handleClose();
  };

  return (
    <BaseModal
      icon={<BadgeOutlined />}
      isOpen={isOpen}
      heading="Cập nhật thông tin cá nhân"
      handleClose={handleClose}
      footerChildren={
        <div className="flex gap-4">
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            sx={{
              backgroundColor: '#00b14f',
              '&:hover': {
                backgroundColor: '#009643',
              },
            }}
          >
            Xác nhận
          </Button>
        </div>
      }
    >
      <TextField label="Họ và tên" disabled defaultValue={user?.fullName ?? ''} />
      <TextField label="Ngày tháng năm sinh" disabled defaultValue={user?.dob ?? ''} />

      <FormControl>
        <FormLabel>Giới tính</FormLabel>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <RadioGroup row {...field}>
              <FormControlLabel value="Male" control={<Radio />} label="Nam" />
              <FormControlLabel value="Female" control={<Radio />} label="Nữ" />
              <FormControlLabel value="Other" control={<Radio />} label="Khác" />
            </RadioGroup>
          )}
        />
      </FormControl>

      <Controller
        name="address"
        control={control}
        render={({ field }) => <TextField label="Địa chỉ hiện tại" {...field} />}
      />

      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            label="Email liên lạc"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            {...field}
          />
        )}
      />

      <Controller
        name="phoneNumber"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            label="Số điện thoại liên lạc"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            {...field}
          />
        )}
      />
    </BaseModal>
  );
};

export default UpdateProfileModal;

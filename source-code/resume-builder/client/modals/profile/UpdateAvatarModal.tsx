import { BadgeOutlined } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useIsMutating } from 'react-query';

import BaseModal from '@/components/shared/BaseModal';
import axios from '@/services/axios';
import { updateUserProfile } from '@/services/user';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setModalState } from '@/store/modal/modalSlice';

const UpdateAvatarModal = () => {
  const isMutating = useIsMutating();
  const isLoading = useMemo(() => isMutating > 0, [isMutating]);

  const dispatch = useAppDispatch();
  const { open: isOpen } = useAppSelector((state) => state.modal['auth.profile.avatar']);

  const { reset, handleSubmit, register } = useForm();

  const handleClose = () => {
    dispatch(setModalState({ modal: 'auth.profile.avatar', state: { open: false } }));
    reset();
  };

  const onSubmit = async (data: any) => {
    if (data.image.length > 0) {
      const formData = new FormData();
      formData.append('files', data.image[0]);
      const response = await axios.post('/cms/upload', formData);

      if (response.status !== 200) {
      }

      await updateUserProfile({
        avatar: response.data[0].id,
      });
    }

    handleClose();
  };

  return (
    <BaseModal
      icon={<BadgeOutlined />}
      isOpen={isOpen}
      heading="Cập nhật ảnh đại diện"
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
      <TextField
        size="small"
        fullWidth
        margin="normal"
        type="file"
        variant="outlined"
        {...register('image')}
        sx={{
          margin: 0,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              border: 'none',
            },
            '&:hover fieldset': {
              border: 'none',
            },
            '&.Mui-focused fieldset': {
              border: 'none',
            },
          },
        }}
      />
    </BaseModal>
  );
};

export default UpdateAvatarModal;

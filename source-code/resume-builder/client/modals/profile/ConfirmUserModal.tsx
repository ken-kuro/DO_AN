import { BadgeOutlined } from '@mui/icons-material';
import { Button, Grid, TextField } from '@mui/material';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIsMutating } from 'react-query';

import BaseModal from '@/components/shared/BaseModal';
import { UserInfoBlock } from '@/components/shared/Info';
import axios from '@/services/axios';
import { updateUserProfile } from '@/services/user';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setModalState } from '@/store/modal/modalSlice';

interface OCR {
  id: string;
  name: string;
  birth: string;
  home: string;
  add: string;
}

const ConfirmUserModal = () => {
  const isMutating = useIsMutating();
  const isLoading = useMemo(() => isMutating > 0, [isMutating]);

  const dispatch = useAppDispatch();
  const { open: isOpen } = useAppSelector((state) => state.modal['auth.profile.confirm-user']);

  const { reset, handleSubmit, register } = useForm();

  const handleClose = () => {
    dispatch(setModalState({ modal: 'auth.profile.confirm-user', state: { open: false } }));
    reset();
  };

  const [ocrResult, setOcrResult] = useState<OCR | null>(null);

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('file', data.image[0]);

    const response = await axios.post('/ocr/predict/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status !== 200) {
    }

    setOcrResult(response.data);
  };

  const onUserConfirm = async () => {
    if (ocrResult) {
      const { add, birth, home, id, name } = ocrResult;
      await updateUserProfile({
        identityCardNumber: id,
        fullName: name,
        dob: birth,
        placeOfOrigin: home,
        placeOfResidence: add,
        activated: true,
      });
    }

    setOcrResult(null);
    handleClose();
  };

  return (
    <BaseModal
      icon={<BadgeOutlined />}
      isOpen={isOpen}
      heading="Xác thực tài khoản"
      handleClose={handleClose}
      footerChildren={
        <div className="flex gap-4">
          <Button
            type="submit"
            onClick={onUserConfirm}
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

      <Button
        onClick={handleSubmit(onSubmit)}
        disabled={isLoading}
        sx={{
          backgroundColor: '#00b14f',
          '&:hover': {
            backgroundColor: '#009643',
          },
        }}
      >
        Trích xuất thông tin
      </Button>

      {ocrResult && (
        <Grid container spacing={1}>
          <UserInfoBlock label="Số CMND" text={ocrResult.id} />
          <UserInfoBlock label="Họ tên" text={ocrResult.name} />
          <UserInfoBlock label="Sinh ngày" text={ocrResult.birth} />
          <UserInfoBlock label="Nguyên quán" text={ocrResult.home} />
          <UserInfoBlock label="Nơi ĐKHK thường trú" text={ocrResult.add} />
        </Grid>
      )}
    </BaseModal>
  );
};

export default ConfirmUserModal;

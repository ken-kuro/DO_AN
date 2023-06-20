import { joiResolver } from '@hookform/resolvers/joi';
import { HowToReg } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';
import Joi from 'joi';
import { useTranslation } from 'next-i18next';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';

import BaseModal from '@/components/shared/BaseModal';
import { register as registerUser, RegisterParams } from '@/services/auth';
import { ServerError } from '@/services/axios';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setModalState } from '@/store/modal/modalSlice';

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const defaultState: FormData = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const schema = Joi.object({
  username: Joi.string()
    .lowercase()
    .min(3)
    .regex(/^[a-z0-9-]+$/, 'only lowercase characters, numbers and hyphens')
    .required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().min(6).required().valid(Joi.ref('password')),
});

const RegisterModal: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const { open: isOpen } = useAppSelector((state) => state.modal['auth.register']);

  const { reset, control, handleSubmit } = useForm<FormData>({
    defaultValues: defaultState,
    resolver: joiResolver(schema),
  });

  const { mutateAsync, isLoading } = useMutation<void, ServerError, RegisterParams>(registerUser);

  const handleClose = () => {
    dispatch(setModalState({ modal: 'auth.register', state: { open: false } }));
    reset();
  };

  const onSubmit = async ({ username, email, password }: FormData) => {
    await mutateAsync({ username, email, password });
    handleClose();
  };

  const handleLogin = () => {
    handleClose();
    dispatch(setModalState({ modal: 'auth.login', state: { open: true } }));
  };

  return (
    <BaseModal
      icon={<HowToReg />}
      isOpen={isOpen}
      heading="Tạo tài khoản mới"
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
            Đăng ký
          </Button>
        </div>
      }
    >
      <p>Vui lòng nhập thông tin cá nhân của bạn để tạo tài khoản.</p>

      <form className="grid gap-4 md:grid-cols-2">
        <Controller
          name="username"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              label="Tên đăng nhập"
              className="col-span-2"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              type="email"
              label="Địa chỉ Email"
              className="col-span-2"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              type="password"
              label="Mật khẩu"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              type="password"
              label="Xác nhận mật khẩu"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              {...field}
            />
          )}
        />
      </form>

      <p className="text-xs">
        Nếu bạn đã có tài khoản, bạn có thể <a onClick={handleLogin}>đăng nhập tại đây</a>.
      </p>
    </BaseModal>
  );
};

export default RegisterModal;

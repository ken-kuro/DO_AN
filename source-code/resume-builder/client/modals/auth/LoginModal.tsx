import { joiResolver } from '@hookform/resolvers/joi';
import { Login, Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import Joi from 'joi';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useIsMutating, useMutation } from 'react-query';

import BaseModal from '@/components/shared/BaseModal';
import { FLAG_DISABLE_SIGNUPS } from '@/constants/flags';
import { login, LoginParams } from '@/services/auth';
import { ServerError } from '@/services/axios';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setModalState } from '@/store/modal/modalSlice';

type FormData = {
  identifier: string;
  password: string;
};

const defaultState: FormData = {
  identifier: '',
  password: '',
};

const schema = Joi.object({
  identifier: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const LoginModal: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const isMutating = useIsMutating();
  const isLoading = useMemo(() => isMutating > 0, [isMutating]);

  const { open: isOpen } = useAppSelector((state) => state.modal['auth.login']);

  const { reset, control, handleSubmit } = useForm<FormData>({
    defaultValues: defaultState,
    resolver: joiResolver(schema),
  });

  const { mutateAsync: loginMutation } = useMutation<void, ServerError, LoginParams>(login);

  const handleClose = () => {
    dispatch(setModalState({ modal: 'auth.login', state: { open: false } }));
    reset();
  };

  const onSubmit = async ({ identifier, password }: FormData) => {
    await loginMutation({ identifier, password });

    handleClose();
  };

  const handleCreateAccount = () => {
    handleClose();
    dispatch(setModalState({ modal: 'auth.register', state: { open: true } }));
  };

  const handleRecoverAccount = () => {
    handleClose();
    dispatch(setModalState({ modal: 'auth.forgot', state: { open: true } }));
  };

  const PasswordVisibility = (): React.ReactElement => {
    const handleToggle = () => setShowPassword((showPassword) => !showPassword);

    return (
      <InputAdornment position="end">
        <IconButton edge="end" onClick={handleToggle}>
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    );
  };

  return (
    <BaseModal
      icon={<Login />}
      isOpen={isOpen}
      heading="Đăng nhập vào tài khoản của bạn"
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
            Đăng nhập
          </Button>
        </div>
      }
    >
      <form className="grid gap-4 xl:w-2/3">
        <Controller
          name="identifier"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              autoFocus
              label="Tên đăng nhập"
              error={!!fieldState.error}
              helperText={fieldState.error?.message || 'Bạn cũng có thể nhập địa chỉ email của mình'}
              {...field}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              type={showPassword ? 'text' : 'password'}
              label="Mật khẩu"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              InputProps={{ endAdornment: <PasswordVisibility /> }}
              {...field}
            />
          )}
        />
      </form>

      {!FLAG_DISABLE_SIGNUPS && (
        <p className="text-xs">
          Nếu chưa có tài khoản, bạn có thể <a onClick={handleCreateAccount}> tạo một tài khoản </a> ở đây.
        </p>
      )}

      {/* <p className="text-xs">
        <Trans t={t} i18nKey="modals.auth.login.recover-text">
          In case you have forgotten your password, you can
          <a onClick={handleRecoverAccount}> recover your account here.</a>
        </Trans>
      </p> */}
    </BaseModal>
  );
};

export default LoginModal;

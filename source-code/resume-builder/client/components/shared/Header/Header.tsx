import env from '@beam-australia/react-env';
import { Menu as MenuIcon } from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import { logout } from '@/store/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setModalState } from '@/store/modal/modalSlice';

import Logo from '../Logo';

interface IHeader {}

const Header = ({}: IHeader) => {
  const { t } = useTranslation();

  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogin = () => dispatch(setModalState({ modal: 'auth.login', state: { open: true } }));
  const handleRegister = () => dispatch(setModalState({ modal: 'auth.register', state: { open: true } }));

  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const loginUser = useAppSelector((state) => state.auth.currentUser);

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleAvatarClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAvatarMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prevState: boolean) => !prevState);
  };

  const handleOpenCVPage = () => {
    handleAvatarMenuClose();
    router.push('/dashboard');
  };

  const handleOpenProfilePage = () => {
    handleAvatarMenuClose();
    router.push('/profile');
  };

  const handleLogout = () => {
    handleAvatarMenuClose();
    dispatch(logout());
  };

  const pages = [
    { label: 'Việc làm', onClick: () => router.push('/recruitment') },
    { label: 'Công ty', onClick: () => router.push('/company') },
  ];
  const settings = isLoggedIn
    ? [
        { label: 'Quản lý CV', onClick: () => router.push('/dashboard') },
        { label: 'Hồ sơ cá nhân', onClick: () => router.push('/profile') },
        { label: 'Đăng xuất', onClick: () => handleLogout() },
      ]
    : [
        { label: 'Đăng nhập', onClick: () => handleLogin() },
        { label: 'Đăng ký', onClick: () => handleRegister() },
        { label: 'Đăng tuyển & tìm hồ sơ', onClick: () => window.open(env('CMS_URL'), '_blank') },
      ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Mid CV
      </Typography>
      <Divider sx={{ borderColor: '#f2f2f2' }} />
      <List>
        {[...pages, ...settings].map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={item.onClick}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: '#FFF',
          boxShadow: 'none',
          borderBottom: '1px solid #f2f2f2',
          height: '80px',
        }}
      >
        <Box sx={{ px: 4 }}>
          <Toolbar
            disableGutters
            sx={{
              height: '80px',
            }}
          >
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Logo />

              <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle}>
                <MenuIcon sx={{ color: '#000' }} />
              </IconButton>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Logo />
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
                color: '#000',
              }}
            >
              <Button
                key={'recruiment'}
                onClick={() => router.push('/recruitment')}
                sx={{
                  display: 'block',
                  my: 3,
                  mx: 1,
                  color: '#212f3f',
                  fontWeight: 700,
                  fontSize: '14px',
                  letterSpacing: '1px',
                  textTransform: 'none',
                  backgroundColor: '#fff',
                  '&:hover': {
                    backgroundColor: '#fff',
                    color: '#00b14f',
                  },
                }}
              >
                {t<string>('landing.actions.recruitment')}
              </Button>
              <Button
                key={'company'}
                onClick={() => router.push('/company')}
                sx={{
                  display: 'block',
                  my: 3,
                  mx: 1,
                  color: '#212f3f',
                  fontWeight: 700,
                  fontSize: '14px',
                  letterSpacing: '1px',
                  textTransform: 'none',
                  backgroundColor: '#fff',
                  '&:hover': {
                    backgroundColor: '#fff',
                    color: '#00b14f',
                  },
                }}
              >
                {t<string>('landing.actions.company')}
              </Button>
            </Box>

            {isLoggedIn ? (
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Avatar onClick={handleAvatarClick} src={loginUser?.avatar?.url} />

                <Menu anchorEl={anchorEl} open={open} onClose={handleAvatarMenuClose}>
                  <MenuItem onClick={handleOpenCVPage}>{t<string>('landing.actions.app')}</MenuItem>
                  <MenuItem onClick={handleOpenProfilePage}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>{t<string>('landing.actions.logout')}</MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ flexGrow: 0, display: { xs: 'none', sm: 'block' } }}>
                <Link
                  sx={{
                    border: '1px solid #00b14f',
                    color: '#00b14f',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 600,
                    lineHeight: '24px',
                    margin: '15px 6px',
                    padding: '12px 20px',
                    textDecoration: 'none',
                  }}
                  onClick={handleLogin}
                >
                  {t<string>('landing.actions.login')}
                </Link>
                <Link
                  sx={{
                    border: '1px solid #00b14f',
                    backgroundColor: '#00b14f',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 600,
                    lineHeight: '24px',
                    margin: '15px 6px',
                    padding: '12px 20px',
                    textDecoration: 'none',
                  }}
                  onClick={handleRegister}
                >
                  {t<string>('landing.actions.register')}
                </Link>
                <Link
                  sx={{
                    border: '1px solid #eee',
                    background: '#212f3f 0 0 no-repeat padding-box',
                    color: '#eee',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 600,
                    lineHeight: '24px',
                    margin: '15px 6px',
                    padding: '12px 20px',
                    textDecoration: 'none',
                  }}
                  onClick={() => {
                    window.open(env('CMS_URL'), '_blank');
                  }}
                >
                  Đăng tuyển & tìm hồ sơ
                </Link>
              </Box>
            )}
          </Toolbar>
        </Box>
      </AppBar>

      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          anchor="right"
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, backgroundColor: '#fff', color: '#000' },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Header;

'use client';

import { useState } from 'react';
import Login from '../components/login';
import Register from '../components/register';
import useIsDesktop from '@/modules/common/hooks/useIsDesktop';

export enum LOGIN_VIEW {
  SIGN_IN = 'sign-in',
  REGISTER = 'register',
}

type LoginTemplateProps = {
  onCloseDrawer?: () => void;
};

const LoginTemplate = ({ onCloseDrawer }: LoginTemplateProps) => {
  const [currentView, setCurrentView] = useState('sign-in');
  const isDesktop = useIsDesktop();

  return (
    <>
      {currentView === 'sign-in' ? (
        <Login
          setCurrentView={setCurrentView}
          onCloseDrawer={onCloseDrawer}
          isDesktop={isDesktop}
        />
      ) : (
        <Register
          setCurrentView={setCurrentView}
          onCloseDrawer={onCloseDrawer}
          isDesktop={isDesktop}
        />
      )}
    </>
  );
};

export default LoginTemplate;

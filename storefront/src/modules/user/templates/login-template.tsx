'use client';

import { useState } from 'react';
import Login from '../components/login';
import Register from '../components/register';

export enum LOGIN_VIEW {
  SIGN_IN = 'sign-in',
  REGISTER = 'register',
}

type LoginTemplateProps = {
  onCloseDrawer: () => void;
};

const LoginTemplate = ({ onCloseDrawer }: LoginTemplateProps) => {
  const [currentView, setCurrentView] = useState('sign-in');

  return (
    <>
      {currentView === 'sign-in' ? (
        <Login setCurrentView={setCurrentView} onCloseDrawer={onCloseDrawer} />
      ) : (
        <Register
          setCurrentView={setCurrentView}
          onCloseDrawer={onCloseDrawer}
        />
      )}
    </>
  );
};

export default LoginTemplate;

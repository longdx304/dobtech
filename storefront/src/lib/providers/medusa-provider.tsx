'use client';
import { MedusaProvider as Provider } from 'medusa-react';
import { PropsWithChildren } from 'react';
import { BACKEND_URL, queryClient } from '../constants';

export const MedusaProvider = ({ children }: PropsWithChildren) => {
  return (
    <Provider
      queryClientProviderProps={{
        client: queryClient,
      }}
      baseUrl={BACKEND_URL}
    >
      {children}
    </Provider>
  );
};

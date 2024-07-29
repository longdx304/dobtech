import React from 'react';
import { CreditCard } from 'lucide-react';
import { QueryClient } from '@tanstack/react-query';

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  stripe: {
    title: 'Credit card',
    icon: <CreditCard />,
  },
  'stripe-ideal': {
    title: 'iDeal',
    icon: <CreditCard />,
  },
  'stripe-bancontact': {
    title: 'Bancontact',
    icon: <CreditCard />,
  },
  paypal: {
    title: 'PayPal',
    icon: <CreditCard />,
  },
  manual: {
    title: 'Test payment',
    icon: <CreditCard />,
  },
  // Add more payment providers here
};

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  'krw',
  'jpy',
  'vnd',
  'clp',
  'pyg',
  'xaf',
  'xof',
  'bif',
  'djf',
  'gnf',
  'kmf',
  'mga',
  'rwf',
  'xpf',
  'htg',
  'vuv',
  'xag',
  'xdr',
  'xau',
];

export const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9000';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 90000,
      retry: 1,
    },
  },
});

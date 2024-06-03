import { cn } from '@/lib/utils';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import theme from 'theme';
import Favicon from '/public/images/Metadata/favicon.ico';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:8000';

const font = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CHAMDEP VN | Giày dép nam nữ trẻ em',
  description: 'Giày dép nam nữ trẻ em',
  metadataBase: new URL(BASE_URL),
  icons: [{ rel: 'icon', url: Favicon.src }],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang='en' data-mode='light'>
      <head>
        <link rel='shortcut icon' href='/favicon.ico' type='image/x-icon' />
      </head>

      <body className={cn(font.className, 'w-full')}>
        <AntdRegistry>
          <ConfigProvider theme={theme}>
            <main className='relative'>{props.children}</main>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}

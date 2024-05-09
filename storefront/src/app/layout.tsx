import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:8000';

const font = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang='en' data-mode='light'>
      <body className={cn(font.className, 'w-full')}>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  );
}

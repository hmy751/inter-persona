import { Noto_Sans_KR } from 'next/font/google';
import '@repo/ui/styles/globals.css';
import MSWProvider from '@/_components/layout/providers/MSWProvider';
import RootProviders from '@/_components/layout/providers/RootProviders';
import LayoutUI from '@/_components/layout/LayoutUI';

const noto_sans_kr = Noto_Sans_KR({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isUseMsw = process.env.NEXT_PUBLIC_USE_MSW;

  //
  return (
    <html lang="en">
      <body className={noto_sans_kr.className}>
        {!isUseMsw ? (
          <RootProviders>
            <LayoutUI>{children}</LayoutUI>
          </RootProviders>
        ) : (
          <MSWProvider>
            <RootProviders>
              <LayoutUI>{children}</LayoutUI>
            </RootProviders>
          </MSWProvider>
        )}
      </body>
    </html>
  );
}

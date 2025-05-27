import { Noto_Sans_KR } from 'next/font/google';
import Script from 'next/script';
import '@repo/ui/styles/globals.css';
import MSWProvider from '@/_components/layout/providers/MSWProvider';
import RootProviders from '@/_components/layout/providers/RootProviders';
import LayoutUI from '@/_components/layout/LayoutUI';
import Initialize from '@/_components/layout/Initialize';
import { Metadata } from 'next';

const noto_sans_kr = Noto_Sans_KR({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Inter Persona - AI 면접관과 함께하는 모의 면접 연습',
  description:
    'Inter Persona는 개발자들이 실제 면접처럼 연습하고, AI 면접관으로부터 피드백을 받아 이직 및 현업 면접 준비를 효율적으로 할 수 있도록 돕는 웹 애플리케이션입니다.',
  keywords: [
    '면접 연습',
    'AI 면접관',
    '개발자 면접',
    '모의 면접',
    'Inter Persona',
    '기술 면접',
    '취업 준비',
    '이직 준비',
  ],
  robots: 'index, follow',
  openGraph: {
    title: 'Inter Persona - AI 면접관과 함께하는 모의 면접 연습',
    description: 'AI 면접관과 실제처럼 면접을 연습하고 피드백을 받아보세요.',
    images: [
      {
        url: '/favicon.png',
        width: 1200,
        height: 630,
        alt: 'Inter Persona 로고',
      },
    ],
    url: 'https://inter-persona.com',
    type: 'website',
    siteName: 'Inter Persona',
    locale: 'ko_KR',
  },
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isUseMsw = process.env.NEXT_PUBLIC_USE_MSW;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY;
  const gtmId = process.env.NEXT_PUBLIC_GTM;

  return (
    <html lang="ko">
      <head>
        {clarityId && (
          <Script id="clarity-script" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            `}
          </Script>
        )}
        {gtmId && (
          <Script id="gtm-script" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        )}
      </head>
      <body className={noto_sans_kr.className}>
        {!isUseMsw ? (
          <RootProviders>
            <LayoutUI>{children}</LayoutUI>
            <Initialize />
          </RootProviders>
        ) : (
          <MSWProvider>
            <RootProviders>
              <LayoutUI>{children}</LayoutUI>
            </RootProviders>
          </MSWProvider>
        )}
        {gtmId && (
          <>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              ></iframe>
            </noscript>
          </>
        )}
      </body>
    </html>
  );
}

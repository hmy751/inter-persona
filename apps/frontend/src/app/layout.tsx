import { Noto_Sans_KR } from 'next/font/google';
import Script from 'next/script';
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
  const clarityId = process.env.NEXT_PUBLIC_CLARITY;
  const gtmId = process.env.NEXT_PUBLIC_GTM;
  const isProduction = process.env.NODE_ENV === 'production';

  //
  return (
    <html lang="en">
      <head>
        {isProduction && clarityId && (
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
        {isProduction && gtmId && (
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
          </RootProviders>
        ) : (
          <MSWProvider>
            <RootProviders>
              <LayoutUI>{children}</LayoutUI>
            </RootProviders>
          </MSWProvider>
        )}
        {isProduction && gtmId && (
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

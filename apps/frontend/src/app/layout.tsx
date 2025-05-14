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

  return (
    <html lang="en">
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
      </body>
    </html>
  );
}

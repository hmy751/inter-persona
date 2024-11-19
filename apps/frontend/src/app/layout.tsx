import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import MSWProvider from "@/app/_providers/MSWProvider";
import WithProviders from "./_providers/WithProviders";

const noto_sans_kr = Noto_Sans_KR({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isUseMsw = process.env.NEXT_PUBLIC_USE_MSW;

  return (
    <html lang="en">
      <body className={noto_sans_kr.className}>
        {!isUseMsw ? (
          <WithProviders>{children}</WithProviders>
        ) : (
          <MSWProvider>
            <WithProviders>{children}</WithProviders>
          </MSWProvider>
        )}
      </body>
    </html>
  );
}

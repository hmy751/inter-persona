import { Noto_Sans_KR } from "next/font/google";
import "@repo/ui/styles/globals.css";
import MSWProvider from "@/app/_providers/MSWProvider";
import LayoutWithProviders from "./_providers/LayoutWithProviders";

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
          <LayoutWithProviders>{children}</LayoutWithProviders>
        ) : (
          <MSWProvider>
            <LayoutWithProviders>{children}</LayoutWithProviders>
          </MSWProvider>
        )}
      </body>
    </html>
  );
}

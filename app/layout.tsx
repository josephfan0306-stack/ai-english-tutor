import type { Metadata } from "next";
import { Fraunces, Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/site";
import "./globals.css";

const notoSans = Noto_Sans_TC({ variable: "--font-noto-sans", subsets: ["latin"], weight: ["400", "500", "700"] });
const notoSerif = Noto_Serif_TC({ variable: "--font-noto-serif", subsets: ["latin"], weight: ["600", "700", "900"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: "墨學 Inkwell｜AI 英文家教",
  description: "國中英語 AI 家教：依翰林版單元產生講義、即時批改中翻英、記住你錯過的每個觀念。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-Hant" className={`${notoSans.variable} ${notoSerif.variable} ${fraunces.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}

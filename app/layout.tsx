import {
  GoogleAnalytics,
  GoogleTagManager,
  GoogleTagManagerNoScript,
  LinkedInInsight,
  MetaPixel,
  MicrosoftClarity,
  TikTokPixel,
  TwitterPixel,
} from "@/features/analytics";
import { DebugPanel } from "@/features/debug";
import { NextTopLoader } from "@/features/page/next-top-loader";
import { ServerToaster } from "@/features/server-sonner/server-toaster";
import { getServerUrl } from "@/lib/server-url";
import { cn } from "@/lib/utils";
import { SiteConfig } from "@/site-config";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist_Mono, Lato, Playfair_Display } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: SiteConfig.title,
  description: SiteConfig.description,
  metadataBase: new URL(getServerUrl()),
};

const CaptionFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-caption",
  weight: ["400", "500", "600", "700"],
});

const SansFont = Lato({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ["300", "400", "700", "900"],
});

const GeistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <html lang="en" className="dark h-full" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "bg-background h-full font-sans font-semibold antialiased",
          GeistMono.variable,
          SansFont.variable,
          CaptionFont.variable,
        )}
      >
        <NuqsAdapter>
          <Providers>
            <NextTopLoader delay={100} showSpinner={false} />
            <Suspense fallback={null}>
              {children}
              {modal}
            </Suspense>
            {process.env.NODE_ENV === "production" ? null : <DebugPanel />}
            <Suspense>
              <ServerToaster />
            </Suspense>
          </Providers>
        </NuqsAdapter>
        {/* Analytics & Tracking */}
        <GoogleTagManager />
        <GoogleTagManagerNoScript />
        <GoogleAnalytics />
        <MicrosoftClarity />
        <MetaPixel />
        <TikTokPixel />
        <TwitterPixel />
        <LinkedInInsight />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

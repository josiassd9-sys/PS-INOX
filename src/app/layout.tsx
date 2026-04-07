import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import { GlobalMenuTrigger } from '@/components/global-menu-trigger';
import { ThemeInitializer } from '@/components/theme-initializer';
import type { Viewport } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: 'PS INOX',
  description: 'Calculadora de preços para produtos de aço inoxidável',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  maximumScale: 1,
  userScalable: false,
  themeColor: '#123d66',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&family=Inter:wght@400;500;600;700&family=Silkscreen&family=Teko:wght@700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#3a3a3a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-body antialiased">
        <ThemeInitializer />
        <SidebarProvider>
          <GlobalMenuTrigger />
          {children}
        </SidebarProvider>
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}

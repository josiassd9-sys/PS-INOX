import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: 'PS INOX',
  description: 'Calculadora de preços para produtos de aço inoxidável',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Teko:wght@700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#3a3a3a" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-body antialiased">
        <div className="fixed top-2 left-2 z-50 print:hidden">
            <Button asChild variant="outline" size="icon" className="h-8 w-8 bg-background/50 backdrop-blur-sm">
                 <Link href="/">
                    <Home className="h-4 w-4" />
                    <span className="sr-only">Voltar ao início</span>
                </Link>
            </Button>
        </div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

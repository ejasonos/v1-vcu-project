import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'VCU-Software - Electric Vehicle Control Unit Monitor',
  description: 'Professional monitoring, configuration, and health prediction for EV Vehicle Control Units',
  generator: 'Favour Ejakpevweoghene Onosemuode',
  icons: {
    icon: [
      {
        url: '/icon.jpeg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon.jpeg',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/icon.jpeg',
  },
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#0B1120' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background text-foreground">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}

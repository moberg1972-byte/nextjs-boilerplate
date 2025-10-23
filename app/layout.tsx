// app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono, PT_Serif } from 'next/font/google'; // <-- add PT_Serif
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const ptSerif = PT_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-ptserif',           // used by .font-ptserif in globals.css
});

export const metadata: Metadata = {
  title: 'OracleOS',
  description: 'Internal lane review UI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${ptSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
